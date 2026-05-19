import Navbar from "@/components/navbar";
import Link from "next/link";
import { Play } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
  const problems = await prisma.problem.findMany({
    select: {
      id: true,
      title: true,
      difficulty: true,
      topics: true,
    }
  });

  function difficultyColor(d) {
    if (d >= 2000) return 'bg-red-700';
    else if (d >= 1000) return 'bg-yellow-600';
    return 'bg-green-700';
  }

  return <div className="bg-primary w-screen h-screen overflow-x-hidden">
    <Navbar />
    <div className="flex">
      <div className="w-[65%] h-screen bg-primary border-r border-[#30363D]">
        <div className="flex justify-between h-10 items-center px-4 border-b border-[#30363D] bg-[#181c22]">
          <div className="flex items-center gap-4">
            <p className="uppercase text-outline font-inter text-[11px] text-[#948ea1]">Problems</p>
          </div>
        </div>
        <div className="p-8 px-16">
        {
          problems.map(p =>
            <div key={p.id} className="text-white bg-secondary p-4 my-4 rounded-lg flex justify-between hover:scale-102 transition-all hover:border-1 border-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-indigo-400 mr-4">{p.id}</span>
                <div>
                  <p>{p.title}</p>
                  <div className="flex gap-2">
                    {
                      p.topics.map(topic =>
                        <div className="text-gray-600 text-sm hover:text-gray-500">
                          #{topic}
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className={`px-3 py-1 ${difficultyColor(Number(p.difficulty))} rounded-3xl`}>
                  {p.difficulty}
                </div>
                <Link href={`/editor/${p.id}`} className="bg-indigo-400 p-1 px-3 rounded-lg hover:bg-indigo-500 flex justify-center items-center gap-1">
                  Solve
                  <Play size={14} fill="white" />
                </Link>
              </div>
            </div>
          )
        }
        </div>
      </div>
      <div className="w-[35%] h-screen bg-primary">
        <div className="w-full h-screen bg-primary border-r border-[#30363D]">
          <div className="flex justify-between h-10 items-center px-4 border-b border-[#30363D] bg-[#181c22]">
            <div className="flex items-center gap-4">
              <p className="uppercase text-outline font-inter text-[11px] text-[#948ea1]">Profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}
