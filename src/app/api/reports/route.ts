import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getSession } from "@/lib/auth";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays } from 'date-fns';

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'daily'; // daily, weekly, monthly, yearly
        
        const now = new Date();
        let startDate = startOfDay(now);
        let endDate = endOfDay(now);

        if (type === 'weekly') {
            startDate = startOfWeek(now);
            endDate = endOfWeek(now);
        } else if (type === 'monthly') {
            startDate = startOfMonth(now);
            endDate = endOfMonth(now);
        } else if (type === 'yearly') {
            startDate = startOfYear(now);
            endDate = endOfYear(now);
        } else {
             // For daily, let's show last 7 days by default for trend chart
             startDate = subDays(now, 7);
        }

        const records = await prisma.bMIRecord.findMany({
            where: {
                user_id: session.userId,
                recorded_at: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: { recorded_at: 'asc' }
        });
    
        return NextResponse.json({ records, type, startDate, endDate }, { status: 200 });
      } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }
}
