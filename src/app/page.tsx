import React from "react";
import { getAllArticles } from "@/lib/articles";
import AgentTerminal from "./_components/agent/AgentTerminal";
import HomeVariant from "./_components/HomeVariant";
import HomeTerminal from "./_components/terminal/HomeTerminal";
import TmuxStatusBar from "./_components/tmux/TmuxStatusBar";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ ui?: string | string[] }>;
}) {
  const { ui } = await searchParams;
  const articles = (await getAllArticles())
    .slice(0, 3)
    .map(({ title, slug, date }) => ({ title, slug, date }));

  return (
    <main className="px-8 py-8 pb-40 lg:w-3/5">
      <h1 className="sr-only">Jordan Garcia — Senior Software Engineer</h1>
      <HomeVariant
        initial={ui === "tmux" ? "tmux" : "agent"}
        tmux={
          <>
            <HomeTerminal />
            <TmuxStatusBar />
          </>
        }
        agent={<AgentTerminal articles={articles} />}
      />
    </main>
  );
}
