'use client';
import { useState, useRef, useEffect } from 'react';
import TerminalInput from './TerminalInput';
import TerminalHeader from './TerminalHeader';

export default function Terminal() {
  const [commands, setCommands] = useState<TerminalCommand[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  const executeCommand = (command: string) => {
    const newCommand: TerminalCommand = {
      id: crypto.randomUUID(),
      command,
      output: `Executing: ${command}`,
      timestamp: new Date(),
    };
    setCommands((prev) => [...prev, newCommand]);
    setCurrentCommand('');
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  return (
    <div className="flex-1 flex flex-col bg-[#161C2B] rounded-lg p-4">
      <TerminalHeader />
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto mb-4"
      >
        {commands.map((cmd) => (
          <div key={cmd.id} className="mb-2">
            <div className="text-[#D4AF37]">
              <span>user@apex-terminal:</span>
              <span className="text-white ml-2">{cmd.command}</span>
            </div>
            <div className="text-gray-400">{cmd.output}</div>
          </div>
        ))}
      </div>
      <TerminalInput
        currentCommand={currentCommand}
        setCurrentCommand={setCurrentCommand}
        executeCommand={executeCommand}
      />
    </div>
  );
}