import Database, { SqliteError } from "better-sqlite3";

export async function executeSqlite(schema: string, query: string) {
  const db = new Database(":memory:");
  const startTime = Date.now();

  try {
    if (schema.length > 50_000)
      throw new Error("Schema too large (max 50,000 characters)");

    if (query.length > 5_000)
      throw new Error("Query too large (max 5,000 characters)");

    db.pragma("trusted_schema = OFF");
    db.pragma("foreign_keys = ON");
    (db as any).loadExtension = null;

    const runSchema = db.transaction(() =>
      db.exec(schema)
    );

    runSchema();

    const stmt = db.prepare(query);
    const rows = stmt.all().slice(0, 500);
    const columns = rows.length > 0 ? Object.keys(rows[0] as object) : [];

    return {
      columns,
      rows,
      time: Date.now() - startTime,
    }
  } catch (err) {
    return {
      columns: [],
      rows: [],
      error: (err as Error).message,
      time: Date.now() - startTime,
    };
  } finally {
    db.close();
  }
}
