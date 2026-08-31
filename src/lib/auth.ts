import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import { prisma } from "@/lib/db";
import type { Role } from "@/generated/prisma";

/**
 * Connexion à l'administration, par lien à usage unique.
 *
 * Aucun mot de passe n'est stocké, donc aucun ne peut fuir. L'utilisateur
 * demande un lien, le reçoit par courriel, clique, et une session s'ouvre.
 *
 * Ni le jeton du lien ni celui de la session ne sont conservés en clair :
 * la base ne garde que leur empreinte SHA-256. Quelqu'un qui obtiendrait
 * une copie des tables ne pourrait pas s'en servir pour se connecter.
 */

const SESSION_COOKIE = "cuf_session";
const SESSION_DAYS = 14;
const LOGIN_TOKEN_MINUTES = 15;

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function newToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Comparaison à durée constante, pour ne rien révéler par le temps de réponse. */
export function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

/** Empreinte d'adresse IP : sert à repérer un abus, jamais à identifier. */
export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT ?? "cuf";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
};

/* ------------------------------------------------------------------ */
/* Demande de lien                                                     */
/* ------------------------------------------------------------------ */

/**
 * Crée un lien de connexion pour une adresse connue.
 *
 * Renvoie `null` si l'adresse n'appartient à aucun compte actif — et
 * l'appelant répond alors la même chose que pour un succès, afin de ne
 * pas révéler qui possède un compte.
 */
export async function createLoginLink(
  email: string,
): Promise<{ user: SessionUser; token: string } | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { id: true, email: true, fullName: true, role: true, active: true },
  });

  if (!user || !user.active) return null;

  /* Les demandes précédentes sont invalidées : un seul lien vivant à la
     fois, pour qu'un ancien courriel ne rouvre pas l'accès. */
  await prisma.loginToken.deleteMany({
    where: { userId: user.id, usedAt: null },
  });

  const token = newToken();
  await prisma.loginToken.create({
    data: {
      tokenHash: hash(token),
      userId: user.id,
      expiresAt: new Date(Date.now() + LOGIN_TOKEN_MINUTES * 60_000),
    },
  });

  return {
    user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    token,
  };
}

/* ------------------------------------------------------------------ */
/* Ouverture de session                                                */
/* ------------------------------------------------------------------ */

/** Échange un jeton de lien contre une session. */
export async function consumeLoginToken(
  token: string,
  context: { userAgent?: string | null; ip?: string | null },
): Promise<SessionUser | null> {
  const record = await prisma.loginToken.findUnique({
    where: { tokenHash: hash(token) },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
      usedAt: true,
      user: {
        select: { id: true, email: true, fullName: true, role: true, active: true },
      },
    },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) return null;
  if (!record.user.active) return null;

  const sessionToken = newToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);

  await prisma.$transaction([
    prisma.loginToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    prisma.session.create({
      data: {
        tokenHash: hash(sessionToken),
        userId: record.userId,
        expiresAt,
        userAgent: context.userAgent?.slice(0, 255) ?? null,
        ipHash: hashIp(context.ip ?? null),
      },
    }),
  ]);

  const store = await cookies();
  store.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return {
    id: record.user.id,
    email: record.user.email,
    fullName: record.user.fullName,
    role: record.user.role,
  };
}

/* ------------------------------------------------------------------ */
/* Lecture de la session                                               */
/* ------------------------------------------------------------------ */

/**
 * Utilisateur connecté, ou `null`.
 *
 * `cache` mémorise le résultat le temps d'un rendu : la mise en page, le
 * tableau de bord et chaque composant peuvent l'appeler sans multiplier
 * les requêtes.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hash(token) },
    select: {
      expiresAt: true,
      user: {
        select: { id: true, email: true, fullName: true, role: true, active: true },
      },
    },
  });

  if (!session || session.expiresAt < new Date() || !session.user.active) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    fullName: session.user.fullName,
    role: session.user.role,
  };
});

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hash(token) } });
  }
  store.delete(SESSION_COOKIE);
}

/* ------------------------------------------------------------------ */
/* Droits                                                              */
/* ------------------------------------------------------------------ */

/**
 * Qui peut faire quoi.
 *
 * Un mentor ne voit que les enfants qui lui sont confiés et ne touche ni
 * aux montants, ni aux paiements, ni à la publication. Seul l'administrateur
 * ouvre un enfant au parrainage et fixe le coût annuel.
 */
export const permissions = {
  manageUsers: ["ADMIN"],
  manageMembers: ["ADMIN", "COORDINATOR"],
  reviewChildren: ["ADMIN", "COORDINATOR"],
  publishChildren: ["ADMIN"],
  setAmounts: ["ADMIN"],
  managePlacements: ["ADMIN", "COORDINATOR"],
  writeReports: ["ADMIN", "COORDINATOR", "MENTOR"],
  confirmPayments: ["ADMIN", "COORDINATOR"],
  manageGallery: ["ADMIN", "COORDINATOR"],
  viewAudit: ["ADMIN"],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof permissions;

export function can(role: Role, permission: Permission): boolean {
  return (permissions[permission] as readonly Role[]).includes(role);
}
