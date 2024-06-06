import React from 'react'

interface Props {
  children: React.ReactNode
}

const TerminalInput = (props: Props) => <h1 className='text-[#ED8796]'>jordangarcia@127.0.0.1 <span className='text-[#CAD3F5]'>~ $ {props.children}</span></h1>
const TerminalOutput = (props: Props) => <div className='py-4 text-[#CAD3F5]'>{props.children}</div>

export default async function Home() {
  const asci = ` _                _      _   _                               _     _ 
| |              | |    | | | |                             | |   | | 
| |__   __ _  ___| | __ | |_| |__   ___  __      _____  _ __| | __| |
| '_ \\ / _| |/ __| |/ / | __| '_ \\ / _ \\ \\ \\ /\\ / / _ \\| '__| |/ _| |
| | | | (_| | (__|   <  | |_| | | |  __/  \\ V  V / (_) | |  | | (_| | 
|_| |_|\\__,_|\\___|_|\\_\\  \\__|_| |_|\\___|   \\_/\\_/ \\___/|_|  |_|\\__,_| 

`
  return (
    <main className='py-2 px-4 lg:w-2/5'>
      <pre className="text-xl text-white w-[500px]">
        <code>{asci}</code>
      </pre>
      <TerminalInput>me -h</TerminalInput>
      <TerminalOutput>
        <p className='py-2'>I’m an Aussie "aw-see" (\ä-s\) currently residing in Miami, specializing in building things mostly in Typescript. Currently, I’m working at @invitae as an software engineering lead.</p>
        <p className='py-2'>These days, my main focus is on building distributed systems and continuously optimizing my terminal.</p>
        <p className='py-2'>When I’m not coding, you can usually find me at the beach with my wife and dog.</p>
      </TerminalOutput>
      <TerminalInput>glow more-info.md</TerminalInput>
      <TerminalOutput>
        <p>-- [view my resume](https://jordangarcia.me/resume.pdf)</p>
        <p>-- [email me](mailto:arickho@gmail.com)</p>
        <p>-- [linkedin](https://linkedin.com/arickhogarcia)</p>
        <p>-- [github](https://github.com/whoisjordangarcia)</p>
        <p>-- [twitter](https://x.com/whoisjordangarcia)</p>
        <p>-- [instagram](https://instagram.com/whoisjordangarcia)</p>
        <p>-- [past website](https://v3.jordangarcia.me)</p>
      </TerminalOutput>
      <div className="lg:absolute lg:bottom-2 lg:left-2 lg:w-[800px] text-xs text-[#656989]">Designed in <a href="" className="font-bold">Figma</a> and coded in <a href="" className="font-bold">Neovim</a>. Built with <a href="" className="font-bold">Next.js</a> and <a href="" className="font-bold">Tailwind CSS</a> deployed with <a href="" className="font-bold">Vercel</a>. Styled using <a href="" className="font-bold">Catpuccin</a>. Most of the text is set using <a href="" className="font-bold">JetBrains Mono</a> typeset.</div>
    </main>
  );
}

