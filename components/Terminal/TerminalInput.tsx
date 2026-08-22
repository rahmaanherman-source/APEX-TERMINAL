'use client';

import { KeyboardEvent } from 'react';

type Props = {
  currentCommand: string;
  setCurrentCommand: (value: string) => void;
  executeCommand: (command: string) => void;
};

export default function TerminalInput({ currentCommand, setCurrentCommand, executeCommand }: Props) {
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      executeCommand(currentCommand);
    }
  };

  return (
    <div className="flex items-center gap-2 border-t border-slate-800 pt-3">
      <span className="text-cyan-400 font-mono text-xs">&gt;</span>
      <input
        aria-label="APEX Terminal command"
        value={currentCommand}
        onChange={(event) => setCurrentCommand(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="truth | local-ai | gabby &lt;instruction&gt;"
        className="flex-1 bg-transparent outline-none text-slate-100 placeholder:text-slate-600 font-mono text-xs"
        autoComplete="off"
      />
      <button
        type="button"
        onClick={() => executeCommand(currentCommand)}
        className="px-3 py-1 rounded border border-cyan-800 bg-cyan-950/30 text-cyan-300 text-[10px] font-bold"
      >
        EXECUTE
      </button>
    </div>
  );
}
