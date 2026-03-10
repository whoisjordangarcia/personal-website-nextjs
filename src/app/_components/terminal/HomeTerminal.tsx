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

export default function HomeTerminal() {
  const [showFirstOutput, setShowFirstOutput] = React.useState(false);
  const [showSecondCommand, setShowSecondCommand] = React.useState(false);
  const [showSecondOutput, setShowSecondOutput] = React.useState(false);

  React.useEffect(() => {
    if (showFirstOutput && !showSecondCommand) {
      const t = setTimeout(() => setShowSecondCommand(true), 300);
      return () => clearTimeout(t);
    }
  }, [showFirstOutput, showSecondCommand]);

  return (
    <>
      <TerminalLine
        className="text-base text-[#CAD3F5]"
        prompt={<Prompt />}
        promptLabel="jordangarcia@127.0.0.1 ~ $ "
        command="whoami"
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
            Aussie in Miami, building at{" "}
            <a
              href="https://www.nestgenomics.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f2d5cf] hover:underline"
            >
              @nestgenomics
            </a>
            . TypeScript, Python, Bash. Full-stack systems.
          </p>
          <p className="py-2">
            I care about type safety, good tooling, TUIs, and UI that
            doesn&#39;t make you think.
          </p>
          <p className="py-2 text-[#a5adcb]">
            Off-screen: long runs, hybrid workouts, and chasing good coffee.
          </p>
        </TerminalOutput>
      )}

      {showSecondCommand && (
        <TerminalLine
          className="text-base text-[#CAD3F5]"
          prompt={<Prompt />}
          promptLabel="jordangarcia@127.0.0.1 ~ $ "
          command="cat links.md"
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
          <div className="space-y-1">
            <p>
              <span className="text-[#8bd5ca]">email:</span>{"     "}
              <a
                href="mailto:hello@jordangarcia.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f2d5cf] hover:underline"
              >
                hello@jordangarcia.me
              </a>
            </p>
            <p>
              <span className="text-[#8bd5ca]">github:</span>{"    "}
              <a
                href="https://github.com/whoisjordangarcia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f2d5cf] hover:underline"
              >
                whoisjordangarcia
              </a>
            </p>
            <p>
              <span className="text-[#8bd5ca]">linkedin:</span>{"  "}
              <a
                href="https://linkedin.com/in/whoisjordangarcia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f2d5cf] hover:underline"
              >
                whoisjordangarcia
              </a>
            </p>
            <p>
              <span className="text-[#8bd5ca]">x:</span>{"         "}
              <a
                href="https://x.com/jordandotbuilds"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f2d5cf] hover:underline"
              >
                jordandotbuilds
              </a>
            </p>
            <p>
              <span className="text-[#8bd5ca]">instagram:</span>{" "}
              <a
                href="https://instagram.com/whoisjordangarcia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f2d5cf] hover:underline"
              >
                whoisjordangarcia
              </a>
            </p>
          </div>

          <div className="mt-8 text-xs text-[#656989]">
            Coded in{" "}
            <a
              href="https://neovim.io"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
            >
              Neovim
            </a>
            . Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
            >
              Next.js
            </a>{" "}
            and{" "}
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
            >
              Tailwind CSS
            </a>
            , deployed with{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
            >
              Vercel
            </a>
            . Styled using{" "}
            <a
              href="https://catppuccin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
            >
              Catppuccin
            </a>
            {" "}and{" "}
            <a
              href="https://github.com/ahatem/IoskeleyMono"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
            >
              Ioskeley Mono
            </a>
            .
          </div>
        </TerminalOutput>
      )}
    </>
  );
}
