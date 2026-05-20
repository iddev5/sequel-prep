"use client";

import { ArrowBigUp, ArrowBigDown, Eye } from "lucide-react";

export default function VoteButtons({ postId, upvotes, downvotes }) {
  async function vote(value) {
    try {
      await fetch("/api/posts/vote", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ postId, value }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <p className="hover:bg-indigo-600 px-4 py-2 rounded-l-2xl">{upvotes - downvotes}</p>
      <button onClick={() => vote(1)} className="hover:bg-indigo-600 py-3 px-2" >
        <ArrowBigUp size={18} />
      </button>
      <button onClick={() => vote(-1)} className="hover:bg-indigo-600 py-3 pr-2 pl-2 rounded-r-2xl">
        <ArrowBigDown size={18} />
      </button>
    </>
  )
}
