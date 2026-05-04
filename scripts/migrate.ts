import { Client, neonConfig } from "@neondatabase/serverless";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import ws from "ws";

// WebSocket needed for the Client transport in Node.js (not required in Edge Runtime)
neonConfig.webSocketConstructor = ws;

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL is required");

  const client = new Client(dbUrl);
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id         SERIAL      PRIMARY KEY,
      name       TEXT        NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const { rows } = await client.query<{ name: string }>(
    "SELECT name FROM _migrations"
  );
  const applied = new Set(rows.map((r) => r.name));

  const dir = join(process.cwd(), "migrations");
  const files = (await readdir(dir))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  let ran = 0;
  for (const file of files) {
    if (applied.has(file)) continue;
    console.log(`  → ${file}`);
    const body = await readFile(join(dir, file), "utf8");
    await client.query(body);
    await client.query("INSERT INTO _migrations (name) VALUES ($1)", [file]);
    ran++;
  }

  await client.end();
  console.log(
    ran ? `Migrations complete (${ran} applied).` : "Already up to date."
  );
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
