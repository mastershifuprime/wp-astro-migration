import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export function getPage(name: string): { data: Record<string, string>; body: string } {
  const file = path.join(contentDir, "pages", `${name}.md`);
  const { data, content } = matter(fs.readFileSync(file, "utf-8"));
  return { data: data as Record<string, string>, body: content };
}
