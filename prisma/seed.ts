import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Jeu de données de développement.
 *
 * Il sert à travailler sur l'administration sans attendre les dossiers
 * réels. **Ne jamais l'exécuter sur la base de production** : il écrit des
 * enfants et des paiements fictifs.
 *
 * Le premier compte administrateur est créé ici. En production, il se crée
 * une fois à la main, puis les autres comptes s'ajoutent depuis l'interface.
 */

try {
  process.loadEnvFile();
} catch {
  /* Variables déjà présentes dans l'environnement. */
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL manquante : impossible de peupler la base.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "mouhammaddoums4@gmail.com";

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "ADMIN", active: true },
    create: {
      email: ADMIN_EMAIL,
      fullName: "Mouhammad Doumbouya",
      role: "ADMIN",
      phone: "+224627843030",
    },
  });

  const mentors = await Promise.all(
    [
      { email: "mentor.aissatou@childrensunityfoundation.org", fullName: "Aïssatou Barry" },
      { email: "mentor.sekou@childrensunityfoundation.org", fullName: "Sékou Camara" },
      { email: "coord.mariama@childrensunityfoundation.org", fullName: "Mariama Diallo" },
    ].map((person, index) =>
      prisma.user.upsert({
        where: { email: person.email },
        update: {},
        create: {
          ...person,
          role: index === 2 ? "COORDINATOR" : "MENTOR",
        },
      }),
    ),
  );

  const children = [
    {
      reference: "CUF-2026-014",
      firstName: "Aminata",
      lastName: "Bah",
      publicName: "Aminata",
      dateOfBirth: new Date("2015-03-12"),
      gender: "FEMALE" as const,
      city: "Conakry",
      country: "Guinée",
      annualCostGnf: 3_200_000,
      status: "ACTIVE" as const,
      openToSponsors: true,
      placement: {
        kind: "SCHOOL" as const,
        institution: "École primaire de Kaloum",
        level: "CM2",
        annualCostGnf: 3_200_000,
      },
      publicStory:
        "Aminata est l'aînée de quatre enfants. Depuis que son père est tombé malade, sa mère fait vivre la famille seule.\n\nElle a rejoint le programme il y a deux ans et veut devenir sage-femme.",
      publicNeeds: ["Frais de scolarité", "Fournitures et manuels", "Transport"],
      publicGoals: ["Terminer le primaire avec mention", "Entrer au collège"],
    },
    {
      reference: "CUF-2026-027",
      firstName: "Sékou",
      lastName: "Touré",
      publicName: "Sékou",
      dateOfBirth: new Date("2012-07-04"),
      gender: "MALE" as const,
      city: "Kindia",
      country: "Guinée",
      annualCostGnf: 4_200_000,
      status: "ACTIVE" as const,
      openToSponsors: true,
      placement: {
        kind: "VOCATIONAL" as const,
        trade: "Mécanique",
        institution: "Atelier Camara, Kindia",
        level: "1re année",
        annualCostGnf: 4_200_000,
      },
      publicStory:
        "Sékou a quitté l'école pendant un an pour travailler au marché.\n\nIl répare déjà les téléphones du quartier et vise une formation en électronique.",
      publicNeeds: ["Frais d'atelier", "Outillage", "Suivi mensuel"],
      publicGoals: ["Obtenir son certificat", "Ouvrir son propre atelier"],
    },
    {
      reference: "CUF-2026-039",
      firstName: "Mariama",
      lastName: "Sylla",
      publicName: "Mariama",
      dateOfBirth: new Date("2017-11-20"),
      gender: "FEMALE" as const,
      city: "Labé",
      country: "Guinée",
      annualCostGnf: 2_800_000,
      status: "ACTIVE" as const,
      openToSponsors: true,
      placement: {
        kind: "QURANIC" as const,
        institution: "Foyer coranique de Labé",
        level: "2e année",
        annualCostGnf: 2_800_000,
      },
      publicStory:
        "Mariama vit chez sa grand-mère depuis trois ans.\n\nSa maîtresse la décrit comme la plus curieuse de sa classe.",
      publicNeeds: ["Frais de scolarité", "Repas de midi", "Visite médicale"],
      publicGoals: ["Présence régulière toute l'année", "Consolider la lecture"],
    },
    {
      reference: "CUF-2026-052",
      firstName: "Fatoumata",
      lastName: "Keïta",
      publicName: "Fatoumata",
      dateOfBirth: new Date("2011-01-09"),
      gender: "FEMALE" as const,
      city: "Bamako",
      country: "Mali",
      annualCostGnf: 3_600_000,
      status: "PENDING_REVIEW" as const,
      openToSponsors: false,
      placement: {
        kind: "VOCATIONAL" as const,
        trade: "Couture",
        institution: "Atelier Djénéba",
        level: "2e année",
        annualCostGnf: 3_600_000,
      },
      publicStory: null,
      publicNeeds: [],
      publicGoals: [],
    },
  ];

  for (const [index, child] of children.entries()) {
    const { placement, ...data } = child;
    const mentor = mentors[index % 2];

    const record = await prisma.child.upsert({
      where: { reference: child.reference },
      update: {},
      create: {
        ...data,
        photoConsent: "NOT_REQUESTED",
        createdById: mentor.id,
        guardians: {
          create: {
            fullName: `Tuteur de ${child.publicName}`,
            relationship: "Mère",
            phone: "+224620000000",
            primary: true,
          },
        },
        placements: {
          create: {
            ...placement,
            status: "ACTIVE",
            startedAt: new Date("2026-09-15"),
          },
        },
        mentorships: {
          create: { mentorId: mentor.id },
        },
      },
    });

    /* Un rapport récent par enfant validé, pour que le tableau de bord
       ne soit pas vide au premier lancement. */
    if (record.status === "ACTIVE") {
      const existing = await prisma.progressReport.count({
        where: { childId: record.id },
      });
      if (existing === 0) {
        await prisma.progressReport.create({
          data: {
            childId: record.id,
            authorId: mentor.id,
            period: "MONTHLY",
            periodEnd: new Date(),
            attendance: "Assidu, aucune absence signalée",
            results: "Progression régulière en lecture et en calcul",
            summary: `Le suivi de ${record.publicName} se déroule normalement ce mois-ci.`,
            visibleToSponsor: true,
          },
        });
      }
    }
  }

  /* Quelques versements, dont un en attente de rapprochement. */
  const aminata = await prisma.child.findUnique({
    where: { reference: "CUF-2026-014" },
  });

  const payments = [
    { reference: "CUF-D-A3F2K9", purpose: "DONATION" as const, amountGnf: 500_000, status: "CONFIRMED" as const },
    { reference: "CUF-P-LJPZTK", purpose: "SPONSORSHIP" as const, amountGnf: 2_100_000, status: "CONFIRMED" as const, childId: aminata?.id },
    { reference: "CUF-D-QW7R2M", purpose: "DONATION" as const, amountGnf: 250_000, status: "PENDING" as const },
    { reference: "CUF-M-8XKD3P", purpose: "ANNUAL_DUES" as const, amountGnf: 500_000, status: "PENDING" as const },
  ];

  for (const payment of payments) {
    await prisma.payment.upsert({
      where: { reference: payment.reference },
      update: {},
      create: {
        ...payment,
        channel: "ORANGE_MONEY",
        amount: payment.amountGnf,
        currency: "GNF",
        payerName: "Donateur de démonstration",
        payerEmail: "donateur@example.com",
        confirmedAt: payment.status === "CONFIRMED" ? new Date() : null,
        confirmedById: payment.status === "CONFIRMED" ? admin.id : null,
      },
    });
  }

  await prisma.member.upsert({
    where: { email: "membre@example.com" },
    update: {},
    create: {
      membershipNo: "CUF-M-0001",
      firstName: "Ousmane",
      lastName: "Baldé",
      email: "membre@example.com",
      phone: "+224621111111",
      country: "Guinée",
      city: "Conakry",
      profession: "Enseignant",
      status: "ACTIVE",
      joinedAt: new Date(),
    },
  });

  await prisma.project.upsert({
    where: { slug: "rentree-2026" },
    update: {},
    create: {
      slug: "rentree-2026",
      status: "PUBLISHED",
      titleFr: "Rentrée scolaire 2026",
      titleEn: "Back to school 2026",
      descriptionFr:
        "Distribution des kits scolaires dans les écoles partenaires de Conakry.",
      descriptionEn:
        "Handing out school kits in our partner schools across Conakry.",
      happenedAt: new Date("2026-09-15"),
      location: "Conakry, Guinée",
    },
  });

  const counts = {
    utilisateurs: await prisma.user.count(),
    enfants: await prisma.child.count(),
    placements: await prisma.placement.count(),
    rapports: await prisma.progressReport.count(),
    paiements: await prisma.payment.count(),
    projets: await prisma.project.count(),
  };
  console.log("Base peuplée :", counts);
  console.log(`Compte administrateur : ${ADMIN_EMAIL}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
