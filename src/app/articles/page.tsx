import { getAllArticles } from "@/lib/articles";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles — Jordan Garcia",
  description:
    "Writing on tooling, iOS development, AI, and the craft of building software.",
};

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <main className="px-8 py-8 pb-24 lg:w-3/5">
      <div className="font-mono text-base text-(--ctp-text)">
        <Link href="/" className="text-sm text-(--ctp-teal) hover:underline">
          ← ~
        </Link>
        <p className="mt-6 mb-6">
          <span className="text-(--ctp-red)">jordangarcia@127.0.0.1</span>{" "}
          <span className="text-(--ctp-text)">~/articles $</span>{" "}
          <span>ls -la</span>
        </p>
        <ul className="space-y-1">
          <li>
            <Link
              href="/"
              className="group flex flex-wrap gap-x-4 hover:brightness-110"
            >
              <span className="hidden text-(--ctp-overlay0) sm:inline">
                drwxr-xr-x
              </span>
              <span className="text-(--ctp-blue) group-hover:underline">
                ..
              </span>
            </Link>
          </li>
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/articles/${article.slug}`}
                className="group flex flex-wrap gap-x-4 hover:brightness-110"
              >
                <span className="hidden text-(--ctp-overlay0) sm:inline">
                  -rw-r--r--
                </span>
                <span className="text-(--ctp-overlay0)">{article.date}</span>
                <span className="text-(--ctp-teal)">
                  {article.readingTime} min
                </span>
                <span className="text-(--ctp-rosewater) group-hover:underline">
                  {article.slug}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
