import { formatTimeAgo } from "@/lib/time";
import VoteButtons from "@/components/vote-buttons";
import Link from "next/link";
import { Eye } from "lucide-react";

export default function PostCard({ post, link }) {
  const titleAndDesc = <>
    <h1 className="text-2xl">{post.title}</h1>
    <p className="text-gray-300">{post.description}</p>
  </>

  return (
    <div key={post.id} className="mb-8 p-2 ">
      <div className="border-b-2 pb-2 border-gray-600/50">
        <div className="flex text-sm gap-3">
          <p className="text-indigo-600">{post.author.name}</p>
          <p className="text-gray-500">{formatTimeAgo(post.updatedAt)}</p>
        </div>
        {link &&
          <Link href={`/discuss/${post.id}`}>
            {titleAndDesc}
          </Link>
        }
        {
          !link && <>
            {titleAndDesc}
          </>
        }

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
  );
}
