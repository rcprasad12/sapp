import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      username: true,
      avatar: true,
      bio: true,
    },
    take: 10,
  });

  return NextResponse.json(users);
}

