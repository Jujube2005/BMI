import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/db/prisma";
import { getSession } from "@/lib/auth";

const bmiSchema = z.object({
  weight: z.number().min(1, "Weight must be greater than 0"),
  height: z.number().min(1, "Height must be greater than 0"),
});

function calculateBMI(weight: number, heightCm: number) {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { weight, height } = bmiSchema.parse(body);

    const bmi = calculateBMI(weight, height);

    const record = await prisma.bMIRecord.create({
      data: {
        user_id: session.userId,
        weight,
        height,
        bmi,
      },
    });

    return NextResponse.json({ message: "Recorded successfully", record }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const records = await prisma.bMIRecord.findMany({
            where: { user_id: session.userId },
            orderBy: { recorded_at: 'desc' }
        });
    
        return NextResponse.json({ records }, { status: 200 });
      } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }
}
