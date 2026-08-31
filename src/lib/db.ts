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

/**
 * Sur une plateforme sans serveur, chaque requête peut réveiller sa propre
 * instance : dix visiteurs simultanés font dix pools, et un pool de dix
 * connexions chacun épuise PostgreSQL en quelques secondes. On garde donc
 * une seule connexion par instance, et on abandonne vite plutôt que de
 * laisser une requête attendre indéfiniment.
 *
 * Sur un serveur classique — Railway, une machine — l'instance est unique
 * et durable : un vrai pool y est au contraire souhaitable.
 */
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL n'est pas définie : ajoutez une base PostgreSQL au projet, " +
        "ou renseignez la variable dans .env pour le développement local.",
    );
  }

  const adapter = new PrismaPg({
    connectionString,
    max: isServerless ? 1 : 10,
    idleTimeoutMillis: isServerless ? 10_000 : 30_000,
    connectionTimeoutMillis: 10_000,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? (hasDatabase ? createClient() : (undefined as never));

/* En production sans serveur, chaque instance est jetable : la mettre en
   cache globalement ne sert à rien et masquerait une connexion morte. */
if (process.env.NODE_ENV !== "production" && hasDatabase) {
  globalForPrisma.prisma = prisma;
}
