import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: "postgresql://postgres:1199@localhost:5432/prisma-medistore-app?schema=public",
  },
});