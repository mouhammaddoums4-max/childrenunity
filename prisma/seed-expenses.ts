import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Dépenses de démonstration, pour travailler sur l'écran des finances.
 *
 * **Ne jamais exécuter sur la base de production** : ces lignes sont
 * fictives et fausseraient les comptes de la fondation.
 */

try {
  process.loadEnvFile();
} catch {
  /* Variables déjà présentes dans l'environnement. */
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL manquante.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const rows = [
  { label: "Frais de scolarité — rentrée", category: "SCHOOL_FEES", amountGnf: 4_800_000, status: "PAID", supplier: "École primaire de Kaloum" },
  { label: "Kits scolaires (120 élèves)", category: "SUPPLIES", amountGnf: 2_400_000, status: "PAID", supplier: "Librairie Diallo" },
  { label: "Cantine — septembre", category: "MEALS", amountGnf: 1_950_000, status: "APPROVED", supplier: "Comité de parents" },
  { label: "Visites médicales annuelles", category: "HEALTH", amountGnf: 850_000, status: "APPROVED", supplier: "Centre de santé Kaloum" },
  { label: "Outillage atelier mécanique", category: "EQUIPMENT", amountGnf: 1_600_000, status: "SUBMITTED", supplier: "Quincaillerie Camara" },
  { label: "Indemnités mentors — septembre", category: "ALLOWANCES", amountGnf: 1_200_000, status: "SUBMITTED", supplier: null },
  { label: "Transport équipe terrain", category: "TRANSPORT", amountGnf: 420_000, status: "PAID", supplier: null },
] as const;

async function main() {
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  const project = await prisma.project.findFirst();

  for (const [index, row] of rows.entries()) {
    const reference = `DEP-2026-${String(index + 1).padStart(4, "0")}`;
    const settled = row.status === "APPROVED" || row.status === "PAID";

    await prisma.expense.upsert({
      where: { reference },
      update: {},
      create: {
        reference,
        label: row.label,
        category: row.category,
        status: row.status,
        amount: row.amountGnf,
        amountGnf: row.amountGnf,
        currency: "GNF",
        spentAt: new Date(2026, 7, 5 + index),
        channel: "ORANGE_MONEY",
        supplier: row.supplier,
        projectId: index < 2 ? (project?.id ?? null) : null,
        createdById: admin?.id ?? null,
        approvedById: settled ? (admin?.id ?? null) : null,
        approvedAt: settled ? new Date() : null,
        paidAt: row.status === "PAID" ? new Date() : null,
      },
    });
  }

  console.log("dépenses enregistrées :", await prisma.expense.count());
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
