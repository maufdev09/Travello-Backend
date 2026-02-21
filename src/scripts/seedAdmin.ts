import "dotenv/config";
import bcrypt from "bcryptjs";
import { UserRole } from "../generated/prisma/client/enums";
import { prisma } from "../app/shared/prisma";

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Super Admin";
  const contactNumber = process.env.ADMIN_CONTACT_NUMBER;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { admin: true },
  });

  if (existingUser) {
    if (existingUser.role !== UserRole.ADMIN) {
      throw new Error("Existing user is not ADMIN. Use a different ADMIN_EMAIL.");
    }

    if (!existingUser.admin) {
      await prisma.admin.create({
        data: {
          email,
          name,
          contactNumber,
        },
      });
      console.log(`Admin profile created for existing ADMIN user: ${email}`);
      return;
    }

    console.log(`Admin already exists: ${email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.ADMIN,
        needPasswordChange: true,
      },
    });

    await tx.admin.create({
      data: {
        email,
        name,
        contactNumber,
      },
    });
  });

  console.log(`Admin seeded successfully: ${email}`);
};

seedAdmin()
  .catch((error) => {
    console.error("Admin seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
