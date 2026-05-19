import Navbar from "@/components/navbar";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
  })

  return <div className="bg-primary w-full h-screen text-white">
    <Navbar />
    <div className="w-full flex justify-center">
      <div className="w-[45vw] p-8">
      {
        posts.map(post =>
          <Link href={`/discuss/${post.id}`} className="mb-8 p-2 ">
            <div className="flex text-sm gap-3">
              <p className="text-indigo-600">{post.author.name}</p>
              <p className="text-gray-500">{formatTimeAgo(post.updatedAt)}</p>
            </div>
            <h1 className="text-2xl">{post.title}</h1>
            <p className="text-gray-300 border-b-2 pb-2 border-gray-600/50 ">{post.description}</p>
          </Link>
        )
      }
      </div>
    </div>
  </div>
}
