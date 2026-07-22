import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: {
      id: true,
      username: true,
      bio: true,
      avatar: true,
      createdAt: true,
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          likes: true,
          comments: true,
        },
      },
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let isFollowing = false;

  if (session?.user) {
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (currentUser) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: user.id,
          },
        },
      });
      isFollowing = !!follow;
    }
  }

  return NextResponse.json({ ...user, isFollowing });
}


