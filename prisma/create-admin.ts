import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Crée ou promeut un compte administrateur.
 *
 * Contrairement à `seed.ts`, ce script n'écrit **aucune donnée fictive** :
 * il peut donc être exécuté sur la base de production. Il sert à ouvrir le
 * tout premier accès, après quoi les comptes suivants se créent depuis
 * l'interface.
 *
 *   npm run db:admin -- "adresse@exemple.org" "Nom Complet"
 */

try {
  process.loadEnvFile();
} catch {
  /* Variables déjà présentes dans l'environnement. */
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL manquante.");
}

const [email, fullName] = process.argv.slice(2);

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
  throw new Error(
    'Usage : npm run db:admin -- "adresse@exemple.org" "Nom Complet"',
  );
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { role: "ADMIN", active: true },
    create: {
      email: email.toLowerCase(),
      fullName: fullName ?? email,
      role: "ADMIN",
    },
    select: { email: true, fullName: true, role: true },
  });

  console.log("Compte administrateur prêt :", user);
  console.log(
    "Connectez-vous sur /admin/login : un lien vous sera envoyé à cette adresse.",
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
