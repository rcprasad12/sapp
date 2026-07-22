import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  const users = await prisma.user.findMany({
    where: {
      NOT: { id: currentUser?.id },
    },
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  });

  return NextResponse.json(users);
}


