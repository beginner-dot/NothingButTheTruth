import { DataAdapter } from "@/lib/db/adapter";
import { PostgresAdapter } from "@/lib/db/postgresAdapter";
import { SqliteAdapter } from "@/lib/db/sqliteAdapter";

export function getAdapter(): DataAdapter {
  if ((process.env.DATABASE_PROVIDER ?? "sqlite") === "postgres") {
    return new PostgresAdapter();
  }
  return new SqliteAdapter();
}
