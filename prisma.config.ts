import { defineConfig } from "prisma/config";

/**
 * Configuration lue par la ligne de commande Prisma (migrations, studio).
 *
 * L'URL de connexion vit ici, et non dans `schema.prisma` : depuis
 * Prisma 7, le schéma ne porte plus de secret. En exécution, le client
 * reçoit la même URL par un adaptateur, voir `src/lib/db.ts`.
 *
 * `DATABASE_URL` est fournie par Railway dès qu'une base PostgreSQL est
 * ajoutée au projet ; en local, elle se place dans `.env`.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
