import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/db/prisma";
import { randomUUID } from "crypto";

const forgotSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json({ message: "If that email exists, we sent you a link." }, { status: 200 });
    }

    const token = randomUUID();
    // 1 hour expiry
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token: token,
        reset_token_expiry: expiry,
      },
    });

    // MOCK EMAIL SENDING
    console.log("---------------------------------------------------");
    console.log(`[MOCK EMAIL] Password reset for ${user.username} (${user.email})`);
    console.log(`Link: http://localhost:3000/reset-password?token=${token}`);
    console.log("---------------------------------------------------");

    return NextResponse.json({ message: "If that email exists, we sent you a link.", mockToken: token }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
