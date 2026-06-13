import Navbar from "@/components/navbar";
import ActionButton from "@/components/action-button";
import PostCard from "@/components/post-card";
import { prisma } from "@/lib/prisma";

export default async function Discuss() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
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
  });

  return <div className="bg-primary w-full h-screen text-white">
    <Navbar />
    <div className="w-full flex justify-center">

      <div className="w-[45vw] p-8">
        <div className="flex justify-end">
          <ActionButton href="/discuss/create" text="New"></ActionButton>
        </div>
        {
          posts.map((post, i) =>
            <PostCard key={i} post={post} link={true} />
          )
        }
      </div>
    </div>
  </div>
}
