import fs from "fs";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import path from "path";

const contentPath = "src/content";

const readFile = (filePath: string) => fs.readFileSync(filePath, "utf-8");

const parseFrontmatter = (frontmatter: Record<string, unknown>) =>
  JSON.parse(JSON.stringify(frontmatter));

export const getListPage = (filePath: string) => {
  const pageDataPath = path.join(contentPath, filePath);
  if (!fs.existsSync(pageDataPath)) notFound();
  const { content, data: frontmatter } = matter(readFile(pageDataPath));
  return { frontmatter: parseFrontmatter(frontmatter), content };
};

export const getSinglePage = (folder: string) => {
  const folderPath = path.join(contentPath, folder);
  if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) notFound();
  return fs
    .readdirSync(folderPath)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      const { content, data: frontmatter } = matter(readFile(path.join(folderPath, file)));
      return { slug: file.replace(/\.md$/, ""), frontmatter: parseFrontmatter(frontmatter), content };
    });
};
