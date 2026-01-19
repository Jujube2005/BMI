import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/db/prisma";

export async function GET() {
  try {
    const adminEmail = "admin@example.com";
    const username = "admin";
    const password = "password123";

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username },
    });

    if (existingAdmin) {
        // Ensure role is ADMIN
        if (existingAdmin.role !== 'ADMIN') {
            await prisma.user.update({
                where: { id: existingAdmin.id },
                data: { role: 'ADMIN' }
            });
            return NextResponse.json({ message: "Existing 'admin' user updated to ADMIN role" });
        }
        return NextResponse.json({ message: "Admin user already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email: adminEmail,
        password_hash,
        role: "ADMIN",
      },
    });

    return NextResponse.json({ message: "Admin user created: admin / password123" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Setup failed" }, { status: 500 });
  }
}
