import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const targetUsername: string = body.username;

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  const targetUser = await prisma.user.findUnique({
    where: { username: targetUsername },
  });

  if (!currentUser || !targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (currentUser.id === targetUser.id) {
    return NextResponse.json(
      { error: "Cannot follow yourself" },
      { status: 400 }
    );
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUser.id,
        followingId: targetUser.id,
      },
    },
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: targetUser.id,
        },
      },
    });
    return NextResponse.json({ following: false });
  }

  await prisma.follow.create({
    data: {
      followerId: currentUser.id,
      followingId: targetUser.id,
    },
  });

  await prisma.notification.create({
    data: {
      type: `follow:${currentUser.username}`,
      userId: targetUser.id,
    },
  });

  return NextResponse.json({ following: true });
}

