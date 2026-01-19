import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'ADMIN') {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
    
        const userCount = await prisma.user.count();
        const recordCount = await prisma.bMIRecord.count();
        
        // Get recent users
        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { created_at: 'desc' },
            select: { id: true, username: true, email: true, created_at: true, role: true }
        });

        return NextResponse.json({ 
            userCount, 
            recordCount,
            recentUsers
        }, { status: 200 });
      } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }
}
