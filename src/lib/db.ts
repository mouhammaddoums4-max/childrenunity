import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

/**
 * Client de base de données, partagé par tout le serveur.
 *
 * En développement, Next.js recharge les modules à chaque modification :
 * sans cette mise en cache sur `globalThis`, chaque rechargement ouvrirait
 * un nouveau pool de connexions et la base finirait par les refuser.
 *
 * `DATABASE_URL` est fournie par Railway dès qu'une base PostgreSQL est
 * ajoutée au projet. Tant qu'elle est absente, `hasDatabase` vaut `false`
 * et le site retombe sur son contenu de démonstration au lieu de planter.
 */
const connectionString = process.env.DATABASE_URL;

export const hasDatabase = Boolean(connectionString);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL n'est pas définie : ajoutez une base PostgreSQL au projet Railway, " +
        "ou renseignez la variable dans .env pour le développement local.",
    );
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? (hasDatabase ? createClient() : (undefined as never));

if (process.env.NODE_ENV !== "production" && hasDatabase) {
  globalForPrisma.prisma = prisma;
}
