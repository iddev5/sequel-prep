import type { NextRequest } from 'next/server'
import { executeSqlite } from '@/lib/execute'

function normalizeResult(rows: Record<string, any>[]) {
  return rows.map(row => {
    const normalized: Record<string, any> = {};

    for (const [key, value] of Object.entries(row)) {
      normalized[key.toLowerCase()] = normalizeValue(value);
    }

    return normalized;
  });
}

function normalizeValue(value: any) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (
    typeof value === "string" &&
    !isNaN(Number(value))
  ) {
    return Number(value);
  }

  return value;
}

function compareResults(
  a: Record<string, any>[],
  b: Record<string, any>[]
) {
  const na = normalizeResult(a);
  const nb = normalizeResult(b);

  return JSON.stringify(na) === JSON.stringify(nb);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sql, problemId, query } = body as { sql: string; problemId: number; query: string };

  const problem = await prisma.problem.findUnique({
    select: {
      id: true,
      schemaData: true,
      correctQuery: true,
    },
    where: {
      id: Number(problemId),
    },
  });

  const result = await executeSqlite(problem.schemaData, query);
  const actualResult = await executeSqlite(problem.schemaData, problem.correctQuery);

  const response = {
    result,
    correct: compareResults(result.rows, actualResult.rows),
  };

  console.log(result, actualResult);

  return Response.json(response);
}
