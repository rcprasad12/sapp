import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(req: NextRequest) {
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
  const bio: string = body.bio;
  const avatar: string = body.avatar;

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      bio: bio || user.bio,
      avatar: avatar || user.avatar,
    },
  });

  return NextResponse.json(updatedUser);
}


