import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || "Admin";

async function main() {
  if (!email || !password) {
    console.error("Please set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists:", existing.email);
    return;
  }

  await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role: "ADMIN",
    },
  });

  console.log("Admin created:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
