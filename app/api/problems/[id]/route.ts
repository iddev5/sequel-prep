import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: Props
) {
  const { id } = await params;

  const problem = await prisma.problem.findUnique({
    select: {
      id: true,
      title: true,
      description: true,
    },
    where: {
      id: Number(id),
    },
  });

  if (!problem) {
    return NextResponse.json(
      { error: "Problem not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(problem);
}
