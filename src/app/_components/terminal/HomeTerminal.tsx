"use client";

import React from "react";
import TerminalLine from "./TerminalLine";

const Prompt = ({ children }: { children?: React.ReactNode }) => (
  <span className="text-[#ED8796]">
    jordangarcia@127.0.0.1 <span className="text-[#CAD3F5]">~ $ </span>
    {children}
  </span>
);

const TerminalOutput: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="output py-4 text-[#CAD3F5]">{children}</div>;

const Neofetch = () => {
  const [uptime, setUptime] = React.useState("0 mins");

  React.useEffect(() => {
    // Uptime: minutes since midnight local time
    const updateUptime = () => {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      if (hours > 0) {
        setUptime(`${hours} hours, ${remainingMins} mins`);
      } else {
        setUptime(`${remainingMins} mins`);
      }
    };
    updateUptime();
    const interval = setInterval(updateUptime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden sm:flex gap-4 sm:gap-8 mb-6 ascii-fade">
      <pre className="text-[#7DC4E4] text-base leading-tight hidden sm:block">
        {`      /\\
     /  \\
    /\\   \\
   /      \\
  /   ,,   \\
 /   |  |  -\\
/_-''    ''-_\\`}
      </pre>
      <div className="text-base space-y-1">
        <p><span className="text-[#ED8796]">jordangarcia</span><span className="text-[#CAD3F5]">@</span><span className="text-[#A6DA95]">127.0.0.1</span></p>
        <p className="text-[#656989]">-------------------</p>
        <p><span className="text-[#ED8796]">os:</span> <span className="text-[#CAD3F5]">Arch Linux x86_64</span></p>
        <p><span className="text-[#ED8796]">uptime:</span> <span className="text-[#CAD3F5]">{uptime}</span></p>
        <p><span className="text-[#ED8796]">packages:</span> <span className="text-[#CAD3F5]">595 (npm)</span></p>
        <p><span className="text-[#ED8796]">shell:</span> <span className="text-[#CAD3F5]">zsh + tmux</span></p>
        <p><span className="text-[#ED8796]">editor:</span> <span className="text-[#CAD3F5]">neovim</span></p>
      </div>
    </div>
  );
};

export default function HomeTerminal() {
  const [showFirstOutput, setShowFirstOutput] = React.useState(false);
  const [showSecondCommand, setShowSecondCommand] = React.useState(false);
  const [showSecondOutput, setShowSecondOutput] = React.useState(false);

  // After first output, start second command shortly after
  React.useEffect(() => {
    if (showFirstOutput && !showSecondCommand) {
      const t = setTimeout(() => setShowSecondCommand(true), 300);
      return () => clearTimeout(t);
    }
  }, [showFirstOutput, showSecondCommand]);

  return (
    <>
      <Neofetch />
      <TerminalLine
        className="text-base text-[#CAD3F5]"
        prompt={<Prompt />}
        promptLabel="jordangarcia@127.0.0.1 ~ $ "
        command="me -h"
        startDelayMs={200}
        minSpeedMs={22}
        maxSpeedMs={60}
        pauseOnChars=",.;: "
        pauseMs={120}
        showCursorWhenDone={false}
        onDone={() => setShowFirstOutput(true)}
      />

      {showFirstOutput && (
        <TerminalOutput>
          <p className="py-2">
            Aussie based in Miami. Currently a Senior Software
            Engineer at{" "}
            <a
              href="https://www.nestgenomics.com/"
              target="_blank"
              className="text-[#f2d5cf] hover:underline"
            >
              @nest
            </a>
            . I build distributed systems with TypeScript and Python, and obsess
            over my terminal setup. Yes, I'm a vim guy (archbtw).
          </p>
          <p className="py-2">
            Off-screen, I'm hunting for the best coffee and food joints.
          </p>
        </TerminalOutput>
      )}

      {showSecondCommand && (
        <TerminalLine
          className="text-base text-[#CAD3F5]"
          prompt={<Prompt />}
          promptLabel="jordangarcia@127.0.0.1 ~ $ "
          command="bat more-info.md"
          startDelayMs={200}
          minSpeedMs={22}
          maxSpeedMs={60}
          pauseOnChars=",.;: "
          pauseMs={120}
          onDone={() => setShowSecondOutput(true)}
        />
      )}

      {showSecondOutput && (
        <TerminalOutput>
          <p>
            -- [
            <a
              href="mailto:hello@jordangarcia.me"
              target="_blank"
              className="text-[#f2d5cf] hover:underline"
            >
              email me
            </a>
            ](mailto:hello@jordangarcia.me)
          </p>
          <p>
            -- [
            <a
              href="https://linkedin.com/in/whoisjordangarcia"
              target="_blank"
              className="text-[#f2d5cf] hover:underline"
            >
              linkedin
            </a>
            ](https://linkedin.com/in/whoisjordangarcia)
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
              href="https://instagram.com/whoisjordangarcia"
              target="_blank"
              className="text-[#f2d5cf] hover:underline"
            >
              instagram
            </a>
            ](https://instagram.com/whoisjordangarcia)
          </p>

          <div className="mt-6 text-xs text-[#656989]">
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
        </TerminalOutput>
      )}

    </>
  );
}
