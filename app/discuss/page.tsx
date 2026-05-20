import Navbar from "@/components/navbar";
import ActionButton from "@/components/action-button";
import VoteButtons from "@/components/vote-buttons";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye } from "lucide-react";

import { formatTimeAgo } from "@/lib/time";

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
          posts.map(post =>
            <div key={post.id} className="mb-8 p-2 ">
              <div className="border-b-2 pb-2 border-gray-600/50">
                <div className="flex text-sm gap-3">
                  <p className="text-indigo-600">{post.author.name}</p>
                  <p className="text-gray-500">{formatTimeAgo(post.updatedAt)}</p>
                </div>
                <Link href={`/discuss/${post.id}`}>
                  <h1 className="text-2xl">{post.title}</h1>
                  <p className="text-gray-300">{post.description}</p>
                </Link>
                <div className="flex items-center gap-8">
                  <div className="flex items-center bg-secondary w-min rounded-2xl my-1">
                    <VoteButtons postId={post.id} upvotes={post.upvotes} downvotes={post.downvotes} />
                  </div>
                  <div className="bg-secondary flex items-center rounded-2xl hover:bg-indigo-600 w-min px-4 py-2 h-min gap-2">
                    {post.views}
                    <Eye size={18} />
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  </div>
}
