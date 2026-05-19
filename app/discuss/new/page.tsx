"use client"

import Navbar from "@/components/navbar";
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewPostPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")

  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setLoading(true)

      const parsedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)

      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,
          description,
          tags: parsedTags,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to create post")
      }

      const post = await res.json()

      router.push(`/discuss/${post.id}`)
    } catch (error) {
      console.error(error)
      alert("Failed to create post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-primary w-full h-screen">
      <Navbar />
      <div className="flex justify-center p-8">
        <div className="w-2xl text-white">
          <h1 className="text-3xl font-bold mb-6">
            Create New Post
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block mb-2 font-medium">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-white/50 rounded-lg p-3"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-white/50 rounded-lg p-3 min-h-[200px]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Tags
              </label>

              <input
                type="text"
                placeholder="graphs, dp, help"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border border-white/50 rounded-lg p-3"
              />

              <p className="text-sm text-gray-500 mt-1">
                Separate tags using commas
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
