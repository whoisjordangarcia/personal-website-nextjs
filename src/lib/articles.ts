import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

export type ArticleMeta = {
  title: string;
  slug: string;
  date: string;
  description: string;
  readingTime: number;
};

export type Article = {
  meta: ArticleMeta;
  content: string;
};

const DEFAULT_DIR = join(process.cwd(), "src/content/articles");

export async function getAllArticles(
  dir = DEFAULT_DIR,
): Promise<ArticleMeta[]> {
  const files = await readdir(dir);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

  const articles = await Promise.all(
    mdxFiles.map(async (filename) => {
      const raw = await readFile(join(dir, filename), "utf-8");
      const { data } = matter(raw);
      return {
        title: data.title as string,
        slug: data.slug as string,
        date: data.date as string,
        description: data.description as string,
        readingTime: data.readingTime as number,
      };
    }),
  );

  return articles.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getArticle(
  slug: string,
  dir = DEFAULT_DIR,
): Promise<Article> {
  const raw = await readFile(join(dir, `${slug}.mdx`), "utf-8");
  const { data, content } = matter(raw);
  return {
    meta: {
      title: data.title as string,
      slug: data.slug as string,
      date: data.date as string,
      description: data.description as string,
      readingTime: data.readingTime as number,
    },
    content,
  };
}
