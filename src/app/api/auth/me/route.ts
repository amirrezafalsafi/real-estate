import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getCurrentUser();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      avatar: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user });
}
