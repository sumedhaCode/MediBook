import prisma from "./src/config/prisma";
import bcrypt from "bcrypt";

async function createAdmin() {
  const hashed = await bcrypt.hash("admin123", 10);

  const existing = await prisma.user.findUnique({
    where: { email: "admin@medibook.com" },
  });

  if (existing) {
    console.log("⚠️ Admin already exists");
    return;
  }

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@medibook.com",
      password: hashed,
      role: "admin",
    },
  });

  console.log("✅ Admin created successfully");
}

createAdmin();