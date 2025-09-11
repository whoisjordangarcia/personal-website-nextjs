import React from "react";
import HomeTerminal from "./_components/terminal/HomeTerminal";

export default async function Home() {
  return (
    <main className="px-4 py-2 pb-16 lg:w-3/5">
      <HomeTerminal />
      <div className="fixed right-2 bottom-2 left-2 z-10 w-auto text-xs text-[#656989] lg:w-[800px]">
        Designed in{" "}
        <a
          href="https://figma.com"
          target="_blank"
          className="font-bold hover:underline"
        >
          Figma
        </a>{" "}
        and coded in{" "}
        <a
          href="https://neovim.io"
          target="_blank"
          className="font-bold hover:underline"
        >
          Neovim
        </a>
        . Built with{" "}
        <a
          href="https://nextjs.org"
          target="_blank"
          className="font-bold hover:underline"
        >
          Next.js
        </a>{" "}
        and{" "}
        <a
          href="https://tailwindcss.com"
          target="_blank"
          className="font-bold hover:underline"
        >
          Tailwind CSS
        </a>
        , deployed with{" "}
        <a
          href="https://vercel.com"
          target="_blank"
          className="font-bold hover:underline"
        >
          Vercel
        </a>
        . Styled using{" "}
        <a
          href="https://catppuccin.com"
          target="_blank"
          className="font-bold hover:underline"
        >
          Catppuccin
        </a>
        . Most of the text is set using{" "}
        <a
          href="https://www.jetbrains.com/lp/mono"
          target="_blank"
          className="font-bold hover:underline"
        >
          JetBrains Mono
        </a>{" "}
        typeset.
      </div>
    </main>
  );
}
