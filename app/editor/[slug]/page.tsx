"use client";
import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { Play, History, Clock, Download } from "lucide-react";

import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";

import Navbar from "@/components/navbar";

import { formatTimeAgo } from "@/lib/time";

// export default function Editor() {
export default function Editor() {
  const p = useParams();
  const problemId = p.slug;

  const [problem, setProblem] = useState(null);

  useEffect(() => {
    async function fetchProblem() {
      if (problemId == null)
        return;
      const res = await fetch(`/api/problems/${problemId}`);
      const data = await res.json();
      setProblem(data);
    }
    fetchProblem();
  }, [problemId]);

  const [runRequest, setRunRequest] = useState(false);
  const [query, setQuery] = useState("--- enter your query");

  const [result, setResult] = useState(null);

  const [history, setHistory] = useState([]);

  const onQueryHistory = (e: any) => {
    const query_idx = e.target.value;
    setQuery(history[query_idx].query);
  }

  const onQueryChange = useCallback((val, viewUpdate) => {
    setQuery(val);
  }, []);

  const runQuery = async () => {
    try {
      setRunRequest(true);

      console.log(problem)

      const res = await fetch('/api/execute_problem', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: 'sqlite', problemId: problemId, query: query })
      });

      const data = await res.json();
      // {
      //   const last = history[0] ?? { schema: '', query: '' };
      //   const entry = {
      //     schema: schema === last.schema ? null : schema,
      //     query: query === last.query ? null : query,
      //     timestamp: new Date()
      //   };
      //
      //   const entries = [...history, entry];
      //   setHistory(entries.toSorted((a, b) => b.timestamp - a.timestamp));
      // }

      if (data.error !== undefined)
        console.error(data.error);
      setResult(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setRunRequest(false);
    }
  }

  const downloadResult = () => {
    const header = result.columns.join(",");
    const body = result.rows.map(row =>
      result.columns.map(col =>
        `"${String(row[col]).replace(/"/g, '""')}"`
      ).join(",")
    );

    const content = [header, ...body].join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    const date = new Date().toISOString();
    link.download = `sequel-prep-${date}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <Navbar />
      <div className="flex w-full border-b border-[#30363D]">

        <div className="w-[50%] border-r border-[#30363D]" >

          <div className="flex justify-between h-10 items-center px-4 border-b border-[#30363D] bg-[#181c22]">
            <div className="flex items-center gap-4">
              <p className="uppercase text-outline font-inter text-[11px] text-[#948ea1]">
                Problem Statement
              </p>
            </div>

            <div>
              {/* <p className="flex items-center gap-1 text-[#948ea1] text-[12px]">
                <History size={12} />
                Browse History
              </p> */}
              {/* <select id="history" name="history" onChange={onSchemaHistory}>
                {
                  history !== [] && history.map((h, idx) =>
                    h.schema !== null &&
                      <option key={idx} value={idx}>
                          Schema #{idx+1} - {formatTimeAgo(h.timestamp)}
                      </option>
                  )
                }
              </select> */}
            </div>
          </div>
            <div className="w-full h-[55vh] bg-primary text-gray-300">
              {problem && <div className="px-8 py-4">
                <p className="text-2xl">{problem.title}</p>
                <p>{problem.description}</p>
              </div>}
            </div>
        </div>
        <div className="w-[50%] relative">
          <div className="flex justify-between h-10 items-center px-4 border-b border-[#30363D] bg-[#181c22]">
            <p className="uppercase text-outline font-inter text-[11px] text-[#948ea1]">Sql query</p>
            {/* <p className="flex items-center gap-1  text-[#948ea1] text-[12px]">
              <History size={12} />
              Browse History
            </p> */}

            {/* <select id="history" name="history" onChange={onQueryHistory}>
              {
                history !== [] && history.map((h, idx) =>
                  h.query !== null &&
                    <option key={idx} value={idx}>
                      Query #{idx+1} - {formatTimeAgo(h.timestamp)}
                    </option>
                )
              }
            </select> */}
          </div>
          <CodeMirror value={query} theme={tokyoNight}  height="55vh" extensions={[sql()]} onChange={onQueryChange} />
          {!runRequest && <button onClick={runQuery} className="flex items-center gap-2 absolute bottom-6 right-6 uppercase px-6 py-3 bg-[#7C4DFF] text-white rounded shadow-2xl hover:scale-[1.02] active:scale-95 transition-all font-bold">
            <Play size={16} fill="white" />
            Run Query
          </button>}
        </div>
      </div>
      <div className="w-full h-[35vh] overflow-auto bg-primary z-[10]">
        <div className="h-10 flex items-center justify-between px-4 border-b border-[#30363D] bg-[#181c22]">
          <div className="flex gap-4">
            <p className="uppercase text-outline font-inter text-[11px] text-[#948ea1]">Results</p>
            {result && result.error === undefined && <>
              {
                result.correct && <p className='font-inter text-[12px] uppercase text-green-500'>Test case passed</p>
              }
              {
                !result.correct && <p className='font-inter text-[12px] uppercase text-red-400'>Test case failed</p>
              }
              {/* <p className="font-inter text-[11px] text-[#948ea1]">{result.result.rows.length} rows returned</p>
              <p className="font-inter text-[11px] text-[#948ea1]">Executed in {result.result.time / 1000} seconds</p> */}
            </>}
          </div>
          {/* {result && result.error === undefined && <button onClick={downloadResult} className="hover:scale-105 hover:bg-white/10 p-1 rounded-lg">
            <Download size={18} className="text-[#948ea1]" />
          </button>} */}
        </div>
        {
          runRequest &&
            <div className="w-full pt-16 flex items-center justify-center flex-col gap-4">
              <Clock className="text-[#948ea1]" size={72} />
              <p className="text-3xl text-[#948ea1]">Execution in progress...</p>
            </div>
        }
        {!runRequest && result && result.error !== undefined &&
          <p className="text-red-400 p-2">{result.error}</p>
        }
        {!runRequest && result && result.error === undefined &&
          <table className="w-full text-left font-inter text-[13px]">
            <thead>
              <tr>
                {result.result.columns.map(col => (
                  <th key={col} className="bg-[#262a31] text-left text-sm sticky top-0 p-3 border-b border-[#30363D] border-r border-[#21262D] text-[#cac3d8] text-[11px]">
                    {col.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262D]">
              {result.result.rows.map((row, i) => (
                <tr key={i} className="bg-[#10141a] hover:bg-[#161B22] transition-colors">
                  {result.result.columns.map(col => (
                    <td key={col}
                      className={`p-3 border-r border-[#21262D]
                          ${
                            typeof row[col] === "number" ? "text-indigo-400"
                            : "text-gray-600"
                          }

                          ${
                            row[col] === null ? "italic" : "not-italic"
                          }
                        `}
                      >
                      {row[col] === null ? "NULL" : String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}
