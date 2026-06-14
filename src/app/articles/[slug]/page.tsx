import { getArticle, getAllArticles } from "@/lib/articles";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import rehypePrettyCode from "rehype-pretty-code";

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-8 mb-4 text-xl font-bold text-[#eed49f]" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-6 mb-3 text-lg font-semibold text-[#eed49f]" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-[#f2d5cf] underline hover:brightness-110" {...props} />
  ),
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    if ("data-language" in props) {
      return <code {...props}>{children}</code>;
    }
    return (
      <code
        className="rounded bg-[#2a2d3d] px-1.5 py-0.5 text-sm text-[#a6da95]"
        {...props}
      >
        {children}
      </code>
    );
  },
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-4 border-l-4 border-[#8bd5ca] pl-4 text-[#a5adcb] italic"
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

  const { meta, content } = article;

  return (
    <main className="px-8 py-8 pb-24 lg:w-3/5">
      <Link href="/articles" className="text-sm text-[#8bd5ca] hover:underline">
        ← articles
      </Link>
      <h1 className="mt-6 mb-2 text-2xl font-bold text-[#CAD3F5]">
        {meta.title}
      </h1>
      <p className="mb-8 text-sm text-[#656989]">
        {meta.date} · {meta.readingTime} min read
      </p>
      <div className="max-w-[65ch] text-[#CAD3F5]">
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
