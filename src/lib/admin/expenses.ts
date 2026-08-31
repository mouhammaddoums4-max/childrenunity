import "server-only";

import { prisma } from "@/lib/db";
import type { ExpenseCategory, ExpenseStatus } from "@/generated/prisma";

/**
 * Dépenses des activités de la fondation.
 *
 * Les totaux se calculent toujours en francs guinéens (`amountGnf`) : une
 * dépense réglée en euros garde la trace de ce qui est sorti de la caisse
 * dans `amount`/`currency`, mais ne fausse jamais les cumuls.
 *
 * Seules les dépenses approuvées ou réglées comptent dans les totaux : une
 * saisie encore en attente de validation n'est pas de l'argent engagé.
 */

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  SCHOOL_FEES: "Frais de scolarité",
  SUPPLIES: "Fournitures",
  MEALS: "Cantine et repas",
  HEALTH: "Santé",
  TRANSPORT: "Transport",
  TRAINING: "Formation et ateliers",
  EQUIPMENT: "Équipement",
  EVENT: "Événements",
  ALLOWANCES: "Indemnités",
  RENT: "Loyers et charges",
  ADMIN: "Fonctionnement",
  OTHER: "Divers",
};

export const expenseStatusLabels: Record<ExpenseStatus, string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "À valider",
  APPROVED: "Validée",
  PAID: "Réglée",
  REJECTED: "Refusée",
};

/** Statuts qui représentent de l'argent réellement engagé. */
const COMMITTED: ExpenseStatus[] = ["APPROVED", "PAID"];

export type ExpenseRow = {
  id: string;
  reference: string;
  label: string;
  category: ExpenseCategory;
  status: ExpenseStatus;
  amountGnf: number;
  spentAt: Date;
  supplier: string | null;
  projectTitle: string | null;
  childName: string | null;
  createdByName: string | null;
};

export type ExpenseSummary = {
  committedThisMonthGnf: number;
  committedThisYearGnf: number;
  awaitingApproval: number;
  awaitingApprovalGnf: number;
  byCategory: { category: ExpenseCategory; amountGnf: number }[];
};

function startOfMonth(): Date {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfYear(): Date {
  const date = new Date();
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function getExpenseSummary(): Promise<ExpenseSummary> {
  const [month, year, awaiting, categories] = await Promise.all([
    prisma.expense.aggregate({
      where: { status: { in: COMMITTED }, spentAt: { gte: startOfMonth() } },
      _sum: { amountGnf: true },
    }),
    prisma.expense.aggregate({
      where: { status: { in: COMMITTED }, spentAt: { gte: startOfYear() } },
      _sum: { amountGnf: true },
    }),
    prisma.expense.aggregate({
      where: { status: "SUBMITTED" },
      _sum: { amountGnf: true },
      _count: { _all: true },
    }),
    prisma.expense.groupBy({
      by: ["category"],
      where: { status: { in: COMMITTED }, spentAt: { gte: startOfYear() } },
      _sum: { amountGnf: true },
    }),
  ]);

  return {
    committedThisMonthGnf: month._sum.amountGnf ?? 0,
    committedThisYearGnf: year._sum.amountGnf ?? 0,
    awaitingApproval: awaiting._count._all,
    awaitingApprovalGnf: awaiting._sum.amountGnf ?? 0,
    byCategory: categories
      .map((row) => ({
        category: row.category,
        amountGnf: row._sum.amountGnf ?? 0,
      }))
      .sort((a, b) => b.amountGnf - a.amountGnf),
  };
}

export async function getExpenses(filter?: {
  status?: ExpenseStatus;
  category?: ExpenseCategory;
}): Promise<ExpenseRow[]> {
  const rows = await prisma.expense.findMany({
    where: {
      ...(filter?.status ? { status: filter.status } : {}),
      ...(filter?.category ? { category: filter.category } : {}),
    },
    orderBy: { spentAt: "desc" },
    take: 100,
    select: {
      id: true,
      reference: true,
      label: true,
      category: true,
      status: true,
      amountGnf: true,
      spentAt: true,
      supplier: true,
      project: { select: { titleFr: true } },
      child: { select: { publicName: true } },
      createdBy: { select: { fullName: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    reference: row.reference,
    label: row.label,
    category: row.category,
    status: row.status,
    amountGnf: row.amountGnf,
    spentAt: row.spentAt,
    supplier: row.supplier,
    projectTitle: row.project?.titleFr ?? null,
    childName: row.child?.publicName ?? null,
    createdByName: row.createdBy?.fullName ?? null,
  }));
}

/**
 * Recettes confirmées, pour situer les dépenses en face.
 *
 * Un solde n'a de sens qu'entre grandeurs comparables : on ne compte donc
 * que les versements confirmés, jamais ceux simplement annoncés.
 */
export async function getBalance(): Promise<{
  receivedThisYearGnf: number;
  spentThisYearGnf: number;
}> {
  const [received, spent] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: "CONFIRMED", confirmedAt: { gte: startOfYear() } },
      _sum: { amountGnf: true },
    }),
    prisma.expense.aggregate({
      where: { status: { in: COMMITTED }, spentAt: { gte: startOfYear() } },
      _sum: { amountGnf: true },
    }),
  ]);

  return {
    receivedThisYearGnf: received._sum.amountGnf ?? 0,
    spentThisYearGnf: spent._sum.amountGnf ?? 0,
  };
}

/** Référence lisible, ex. « DEP-2026-0031 ». */
export async function nextExpenseReference(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.expense.count({
    where: { reference: { startsWith: `DEP-${year}-` } },
  });
  return `DEP-${year}-${String(count + 1).padStart(4, "0")}`;
}
