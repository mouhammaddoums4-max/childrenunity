import "server-only";

import { prisma } from "@/lib/db";
import type { SessionUser } from "@/lib/auth";

/**
 * Lectures du tableau de bord.
 *
 * Un mentor ne voit que les enfants qui lui sont confiés : le filtre est
 * appliqué ici, au plus près de la requête, plutôt que dans l'affichage.
 * Une page qui oublierait de filtrer ne pourrait donc pas exposer des
 * dossiers qui ne regardent pas la personne connectée.
 */

function childScope(user: SessionUser) {
  if (user.role === "MENTOR") {
    return { mentorships: { some: { mentorId: user.id, endedAt: null } } };
  }
  return {};
}

export type DashboardData = {
  children: { active: number; pendingReview: number; openToSponsors: number };
  placements: { kind: string; trade: string | null; count: number }[];
  money: { confirmedThisMonthGnf: number; pendingCount: number; pendingGnf: number };
  members: { active: number; pending: number };
  recentReports: {
    id: string;
    childName: string;
    childReference: string;
    authorName: string;
    periodEnd: Date;
    summary: string;
  }[];
  pendingPayments: {
    id: string;
    reference: string;
    purpose: string;
    amountGnf: number;
    payerName: string | null;
    createdAt: Date;
  }[];
  awaitingReview: {
    id: string;
    reference: string;
    publicName: string;
    city: string;
    country: string;
    createdAt: Date;
  }[];
};

export async function getDashboard(user: SessionUser): Promise<DashboardData> {
  const scope = childScope(user);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const canSeeMoney = user.role === "ADMIN" || user.role === "COORDINATOR";

  const [
    active,
    pendingReview,
    openToSponsors,
    placementRows,
    confirmedThisMonth,
    pendingPaymentsAgg,
    membersActive,
    membersPending,
    recentReports,
    pendingPayments,
    awaitingReview,
  ] = await Promise.all([
    prisma.child.count({ where: { ...scope, status: "ACTIVE" } }),
    prisma.child.count({ where: { ...scope, status: "PENDING_REVIEW" } }),
    prisma.child.count({ where: { ...scope, openToSponsors: true } }),

    prisma.placement.groupBy({
      by: ["kind"],
      where: { status: "ACTIVE", child: scope },
      _count: { _all: true },
    }),

    canSeeMoney
      ? prisma.payment.aggregate({
          where: { status: "CONFIRMED", confirmedAt: { gte: startOfMonth } },
          _sum: { amountGnf: true },
        })
      : Promise.resolve({ _sum: { amountGnf: 0 } }),

    canSeeMoney
      ? prisma.payment.aggregate({
          where: { status: "PENDING" },
          _sum: { amountGnf: true },
          _count: { _all: true },
        })
      : Promise.resolve({ _sum: { amountGnf: 0 }, _count: { _all: 0 } }),

    canSeeMoney
      ? prisma.member.count({ where: { status: "ACTIVE" } })
      : Promise.resolve(0),
    canSeeMoney
      ? prisma.member.count({ where: { status: "PENDING" } })
      : Promise.resolve(0),

    prisma.progressReport.findMany({
      where: { child: scope },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        periodEnd: true,
        summary: true,
        child: { select: { publicName: true, reference: true } },
        author: { select: { fullName: true } },
      },
    }),

    canSeeMoney
      ? prisma.payment.findMany({
          where: { status: "PENDING" },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            reference: true,
            purpose: true,
            amountGnf: true,
            payerName: true,
            createdAt: true,
          },
        })
      : Promise.resolve([]),

    prisma.child.findMany({
      where: { ...scope, status: "PENDING_REVIEW" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        reference: true,
        publicName: true,
        city: true,
        country: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    children: { active, pendingReview, openToSponsors },
    placements: placementRows.map((row) => ({
      kind: row.kind,
      trade: null,
      count: row._count._all,
    })),
    money: {
      confirmedThisMonthGnf: confirmedThisMonth._sum.amountGnf ?? 0,
      pendingCount: pendingPaymentsAgg._count?._all ?? 0,
      pendingGnf: pendingPaymentsAgg._sum.amountGnf ?? 0,
    },
    members: { active: membersActive, pending: membersPending },
    recentReports: recentReports.map((report) => ({
      id: report.id,
      childName: report.child.publicName,
      childReference: report.child.reference,
      authorName: report.author.fullName,
      periodEnd: report.periodEnd,
      summary: report.summary,
    })),
    pendingPayments,
    awaitingReview,
  };
}

/** Libellés des orientations, tels qu'ils s'affichent dans les écrans. */
export const placementLabels: Record<string, string> = {
  SCHOOL: "École",
  VOCATIONAL: "Atelier de formation",
  QURANIC: "École coranique",
  LITERACY: "Alphabétisation",
  APPRENTICESHIP: "Apprentissage",
};

export const purposeLabels: Record<string, string> = {
  DONATION: "Don",
  SPONSORSHIP: "Parrainage",
  MEMBERSHIP_FEE: "Droit d'entrée",
  ANNUAL_DUES: "Cotisation",
};
