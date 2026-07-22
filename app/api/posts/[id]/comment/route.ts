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

  const body = await req.json();
  const content: string = body.content;

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      authorId: user.id,
      postId: id,
    },
  });

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (post && post.authorId !== user.id) {
    await prisma.notification.create({
      data: {
        type: `comment:${user.username}`,
        userId: post.authorId,
      },
    });
  }

  return NextResponse.json(comment, { status: 201 });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const comments = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: "asc" },
    include: {
      author: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return NextResponse.json(comments);
}

