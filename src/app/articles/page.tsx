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
      <div className="font-mono text-base text-[#CAD3F5]">
        <p className="mb-6">
          <span className="text-[#ED8796]">jordangarcia@127.0.0.1</span>{" "}
          <span className="text-[#CAD3F5]">~/articles $</span>{" "}
          <span>ls -la</span>
        </p>
        <ul className="space-y-1">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/articles/${article.slug}`}
                className="group flex gap-4 hover:brightness-110"
              >
                <span className="text-[#656989]">-rw-r--r--</span>
                <span className="text-[#656989]">{article.date}</span>
                <span className="text-[#8bd5ca]">{article.readingTime} min</span>
                <span className="text-[#f2d5cf] group-hover:underline">
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
