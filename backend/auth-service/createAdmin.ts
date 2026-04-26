import prisma from "./src/config/prisma";
import bcrypt from "bcrypt";

async function createAdmin() {
  const email = "admin@medibook.com";
  const password = "admin123";

  try {
    // 🔍 Check if already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log("✅ Admin already exists");
      return;
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧑‍💼 Create admin
    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("🚀 Admin created:", admin.email);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    process.exit();
  }
}

createAdmin();