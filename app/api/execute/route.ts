import type { NextRequest } from 'next/server'
import { executeSqlite } from '@/lib/execute'

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sql, schema, query } = body as { sql: string; schema: string; query: string };

  const result = await executeSqlite(schema, query);

  return Response.json(result)
}
