import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: user.id,
        postId: id,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: user.id,
          postId: id,
        },
      },
    });
    return NextResponse.json({ liked: false });
  }

  await prisma.like.create({
    data: {
      userId: user.id,
      postId: id,
    },
  });

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (post && post.authorId !== user.id) {
    await prisma.notification.create({
      data: {
        type: `like:${user.username}`,
        userId: post.authorId,
      },
    });
  }

  return NextResponse.json({ liked: true });
}

