import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { postId, value } = await req.json();

    if (![1, -1].includes(value)) {
      return NextResponse.json(
        { error: "Invalid vote value" },
        { status: 400 }
      );
    }

    const existing = await prisma.postVote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        }
      }
    });

    if (!existing) {
      await prisma.postVote.create({
        data: {
          userId,
          postId,
          value,
        }
      });

      await prisma.post.update({
        where: {
          id: postId,
        },
        data: (value === 1) ? {
          upvotes: { increment: 1 },
        } : {
          downvotes: { increment: 1 },
        }
      })
    } else if (existing.value === value) {
      await prisma.postVote.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          }
        }
      });

      await prisma.post.update({
        where: {
          id: postId,
        },
        data: (value === 1) ? {
          upvotes: { decrement: 1 },
        } : {
          downvotes: { decrement: 1 },
        }
      });
    } else {
      await prisma.postVote.update({
        where: {
          userId_postId: {
            userId,
            postId,
          }
        },
        data: {
          value
        }
      });

      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          upvotes: (value === 1) ? { increment: 1 } : { decrement: 1 },
          downvotes: (value === 1) ? { decrement: 1 } : { increment: 1 },
        }
      });
    }

    return NextResponse.json({
      success: true,
    })
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
