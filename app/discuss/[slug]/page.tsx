import Navbar from "@/components/navbar";
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
    select: {
      id: true,
      title: true,
      description: true,
    },
    where: {
      id: postId
    }
  });

  return <div className="bg-primary w-full h-screen">
    <Navbar />
    <div className="flex w-full justify-center">
      <div className="w-[45vw] p-8">
        <h1 className="text-white text-2xl">{post?.title}</h1>
        <p className="text-white">{post?.description}</p>
      </div>
    </div>
  </div>
}
