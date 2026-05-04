import postgres from "postgres";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL is required");

  const sql = postgres(dbUrl, { max: 1 });

  await sql`
    CREATE TABLE IF NOT EXISTS _migrations (
      id         SERIAL      PRIMARY KEY,
      name       TEXT        NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  const applied = new Set(
    (await sql`SELECT name FROM _migrations`).map((r) => r.name as string)
  );

  const dir = join(process.cwd(), "migrations");
  const files = (await readdir(dir))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  let ran = 0;
  for (const file of files) {
    if (applied.has(file)) continue;
    console.log(`  → ${file}`);
    const body = await readFile(join(dir, file), "utf8");
    await sql.unsafe(body);
    await sql`INSERT INTO _migrations (name) VALUES (${file})`;
    ran++;
  }

  await sql.end();
  console.log(ran ? `Migrations complete (${ran} applied).` : "Already up to date.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
