import React from "react";

interface Props {
  children: React.ReactNode;
  typeme?: boolean;
}

const TerminalInput = (props: Props) => (
  <h1 className={`text-[#ED8796] ${props.typeme ? "typeme" : ""}`}>
    jordangarcia@127.0.0.1{" "}
    <span className="text-[#CAD3F5]">~ $ {props.children}</span>
  </h1>
);
const TerminalOutput = (props: Props) => (
  <div className="py-4 text-[#CAD3F5]">{props.children}</div>
);

export default async function Home() {
  return (
    <main className="px-4 py-2 lg:w-2/5">
    <TerminalInput typeme>me -h</TerminalInput>
      <div className="output">
        <TerminalOutput>
          <p className="py-2">
            I’m an Aussie "aw-see" (\ä-s\) currently residing in Miami,
            specializing in building things mostly in Typescript and Python. Currently,
            working at @labcorp as an software engineer.
          </p>
          <p className="py-2">
            These days, my main focus is on building distributed systems and
            continuously optimizing my terminal.
          </p>
          <p className="py-2">
            When I’m not coding, you can usually find me at the beach.
          </p>
        </TerminalOutput>
        <TerminalInput>bat more-info.md</TerminalInput>
        <TerminalOutput>
          <p>
            -- [
            <a
              href="mailto:arickho@gmail.com"
              target="_blank"
              className="text-[#f2d5cf] hover:underline"
            >
              email me
            </a>
            ](mailto:arickho@gmail.com)
          </p>
          <p>
            -- [
            <a
              href="https://linkedin.com/in/arickhogarcia"
              target="_blank"
              className="text-[#f2d5cf] hover:underline"
            >
              linkedin
            </a>
            ](https://linkedin.com/in/arickhogarcia)
          </p>
          <p>
            -- [
            <a
              href="https://github.com/whoisjordangarcia"
              target="_blank"
              className="text-[#f2d5cf] hover:underline"
            >
              github
            </a>
            ](https://github.com/whoisjordangarcia)
          </p>
          <p>
            -- [
            <a
              href="https://x.com/whoismrgarcia"
              target="_blank"
              className="text-[#f2d5cf] hover:underline"
            >
              twitter
            </a>
            ](https://x.com/whoismrgarcia)
          </p>
          <p>
            -- [
            <a
              href="https://instagram.com/whoisjordangarcia"
              target="_blank"
              className="text-[#f2d5cf] hover:underline"
            >
              instagram
            </a>
            ](https://instagram.com/whoisjordangarcia)
          </p>
          <p>
            -- [
            <a
              href="https://v3.jordangarcia.me"
              target="_blank"
              className="text-[#f2d5cf] hover:underline"
            >
              past website
            </a>
            ](https://v3.jordangarcia.me)
          </p>
        </TerminalOutput>
      </div>
      <div className="text-xs text-[#656989] lg:absolute lg:bottom-2 lg:left-2 lg:w-[800px]">
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
