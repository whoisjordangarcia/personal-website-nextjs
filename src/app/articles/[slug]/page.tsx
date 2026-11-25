import { getArticle, getAllArticles } from "@/lib/articles";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import rehypePrettyCode from "rehype-pretty-code";

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mt-8 mb-4 text-xl font-bold text-(--ctp-yellow)"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mt-6 mb-3 text-lg font-semibold text-(--ctp-yellow)"
      {...props}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-(--ctp-rosewater) underline hover:brightness-110"
      {...props}
    />
  ),
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    if (props.className?.includes("language-")) {
      return <code {...props}>{children}</code>;
    }
    return (
      <code
        className="rounded bg-(--ctp-surface0) px-1.5 py-0.5 text-sm text-(--ctp-green)"
        {...props}
      >
        {children}
      </code>
    );
  },
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-4 border-l-4 border-(--ctp-teal) pl-4 text-(--ctp-subtext0) italic"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-4 leading-relaxed" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 list-disc space-y-1 pl-6" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 list-decimal space-y-1 pl-6" {...props} />
  ),
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { meta } = await getArticle(slug);
    return {
      title: `${meta.title} — Jordan Garcia`,
      description: meta.description,
    };
  } catch {
    return { title: "Article Not Found — Jordan Garcia" };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let article;
  try {
    article = await getArticle(slug);
  } catch {
    notFound();
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!article) notFound();

  const { meta, content } = article;

  return (
    <main className="px-8 py-8 pb-24 lg:w-3/5">
      <nav className="text-sm text-(--ctp-overlay0)">
        <Link href="/" className="text-(--ctp-teal) hover:underline">
          ~
        </Link>
        {" / "}
        <Link href="/articles" className="text-(--ctp-teal) hover:underline">
          articles
        </Link>
      </nav>
      <h1 className="mt-6 mb-2 text-2xl font-bold text-(--ctp-text)">
        {meta.title}
      </h1>
      <p className="mb-8 text-sm text-(--ctp-overlay0)">
        {meta.date} · {meta.readingTime} min read
      </p>
      <div className="max-w-[65ch] text-(--ctp-text)">
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [rehypePrettyCode as any, { theme: "catppuccin-macchiato" }],
              ],
            },
          }}
        />
      </div>
    </main>
  );
}
