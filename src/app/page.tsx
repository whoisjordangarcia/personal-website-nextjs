import React from "react";
import HomeTerminal from "./_components/terminal/HomeTerminal";
import TmuxStatusBar from "./_components/tmux/TmuxStatusBar";

export default async function Home() {
  return (
    <main className="px-8 py-8 pb-24 lg:w-3/5">
      <h1 className="sr-only">Jordan Garcia — Software Engineer</h1>
      <HomeTerminal />
      <TmuxStatusBar />
    </main>
  );
}
