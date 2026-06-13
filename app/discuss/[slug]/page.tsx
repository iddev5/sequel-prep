import Navbar from "@/components/navbar";
import PostCard from "@/components/post-card";
import ActionButton from "@/components/action-button";
import { prisma } from "@/lib/prisma";

export default async function Post({ params }: any) {
  const { slug } = await params;
  const postId = slug;

  await prisma.post.update({
    where: { id: postId },
    data: {
      views: { increment: 1 },
    }
  });

  const post = await prisma.post.findUnique({
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    where: {
      id: postId
    }
  });

  return <div className="bg-primary w-full h-screen">
    <Navbar />
    <div className="flex w-full justify-center">
      <div className="w-[45vw] p-8">
        <div className="flex justify-start pb-4">
          <ActionButton href="/discuss" text="Back" />
        </div>
        <PostCard post={post} />
      </div>
    </div>
  </div>
}
