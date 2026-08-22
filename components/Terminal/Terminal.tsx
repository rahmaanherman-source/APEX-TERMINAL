'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import TerminalInput from './TerminalInput';

type OperationalStatus = 'UNKNOWN' | 'CHECKING' | 'CONNECTED' | 'FAILED';
type GovernanceStatus = 'RESEARCHED' | 'CANDIDATE' | 'TESTED' | 'APPROVED' | 'VERIFIED' | 'REJECTED';

type TruthSnapshot = {
  operationalStatus: OperationalStatus;
  governanceStatus: GovernanceStatus;
  verificationId?: string;
  evidenceRef?: string;
};

type TerminalCommand = {
  id: string;
  command: string;
  output: string;
  timestamp: string;
};

const initialTruth: TruthSnapshot = {
  operationalStatus: 'UNKNOWN',
  governanceStatus: 'CANDIDATE',
};

export default function Terminal() {
  const [commands, setCommands] = useState<TerminalCommand[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [truth, setTruth] = useState<TruthSnapshot>(initialTruth);
  const [localModels, setLocalModels] = useState<string[]>([]);
  const [checking, setChecking] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const append = (command: string, output: string) => {
    setCommands((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        command,
        output,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const probeTruth = async () => {
    setChecking(true);
    setTruth((prev) => ({ ...prev, operationalStatus: 'CHECKING' }));
    try {
      const response = await fetch('/api/truth', { cache: 'no-store' });
      const data = await response.json();
      setTruth({
        operationalStatus: data.truth?.operationalStatus ?? 'UNKNOWN',
        governanceStatus: data.truth?.governanceStatus ?? 'CANDIDATE',
        verificationId: data.truth?.verificationId,
        evidenceRef: data.truth?.evidenceRef,
      });
      setLocalModels(data.localAI?.models ?? []);
      append('truth', `${data.truth?.operationalStatus ?? 'UNKNOWN'} / ${data.truth?.governanceStatus ?? 'CANDIDATE'} · ${data.truth?.verificationId ?? 'NO_VEO'} · ${data.truth?.evidenceRef ?? 'NO_EVIDENCE'}`);
    } catch {
      setTruth({ operationalStatus: 'FAILED', governanceStatus: 'CANDIDATE' });
      setLocalModels([]);
      append('truth', 'FAILED · Truth Gate endpoint unreachable. No simulated status emitted.');
    } finally {
      setChecking(false);
    }
  };

  const executeCommand = async (command: string) => {
    const normalized = command.trim();
    if (!normalized) return;
    setCurrentCommand('');

    if (normalized === 'truth' || normalized === 'verify') {
      await probeTruth();
      return;
    }

    if (normalized === 'local-ai') {
      setChecking(true);
      try {
        const response = await fetch('/api/local-ai', { cache: 'no-store' });
        const data = await response.json();
        setLocalModels(data.models ?? []);
        append(normalized, `${data.operationalStatus ?? 'UNKNOWN'} · ${data.models?.length ?? 0} model(s) observed · ${data.veo?.verificationId ?? 'NO_VEO'}`);
      } catch {
        append(normalized, 'FAILED · local AI boundary unavailable. No fallback response generated.');
      } finally {
        setChecking(false);
      }
      return;
    }

    if (normalized.startsWith('gabby ')) {
      const prompt = normalized.slice(6).trim();
      if (!prompt) return;
      try {
        const model = localModels[0];
        if (!model) {
          append(normalized, 'REQUIRES_LOCAL_DAEMON · No locally observed model is available.');
          return;
        }
        const response = await fetch('/api/local-ai', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ model, prompt }),
        });
        const data = await response.json();
        append(normalized, data.response ? `${data.response}\nVEO: ${data.veo?.verificationId ?? 'NO_VEO'}` : `FAILED · ${data.veo?.details ?? 'No local inference read-back.'}`);
      } catch {
        append(normalized, 'FAILED · local inference request failed. No simulated Gabby text emitted.');
      }
      return;
    }

    append(normalized, 'NOT_IMPLEMENTED · command has no verified executor yet.');
  };

  useEffect(() => {
    probeTruth();
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void executeCommand(currentCommand);
  };

  const truthLabel = checking ? 'TRUTH: PROBING...' : `TRUTH: ${truth.operationalStatus}`;
  const truthClass = truth.operationalStatus === 'CONNECTED'
    ? 'border-emerald-500/50 text-emerald-300 bg-emerald-950/30'
    : truth.operationalStatus === 'FAILED'
      ? 'border-red-500/50 text-red-300 bg-red-950/30'
      : 'border-amber-500/50 text-amber-300 bg-amber-950/30';

  return (
    <div className="flex-1 flex flex-col bg-[#161C2B] rounded-lg p-4 min-w-0">
      <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-3 mb-3">
        <div>
          <div className="text-white font-bold tracking-widest text-sm">APEX TERMINAL</div>
          <div className="text-[10px] text-slate-500">LOCAL-FIRST CONTROL PLANE</div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold">
          <span className={`px-2 py-1 rounded-full border ${truthClass}`}>{truthLabel}</span>
          <span className="px-2 py-1 rounded-full border border-slate-700 text-slate-400">
            GOV: {truth.governanceStatus}
          </span>
          <button
            type="button"
            onClick={() => void probeTruth()}
            disabled={checking}
            className="px-2 py-1 rounded border border-cyan-800 text-cyan-300 disabled:opacity-50"
          >
            {checking ? 'PROBING' : 'RE-PROBE'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-[10px]">
        <div className="rounded border border-slate-800 bg-black/20 p-2">
          <div className="text-slate-500">LOCAL MODELS</div>
          <div className="text-cyan-300 truncate">{localModels.length ? localModels.join(', ') : 'UNKNOWN'}</div>
        </div>
        <div className="rounded border border-slate-800 bg-black/20 p-2">
          <div className="text-slate-500">VEO</div>
          <div className="text-slate-300 truncate">{truth.verificationId ?? 'NO VERIFIED EVIDENCE'}</div>
        </div>
      </div>

      <div ref={terminalRef} className="flex-1 overflow-y-auto mb-4 font-mono">
        {commands.length === 0 && (
          <div className="text-slate-500 text-xs">Type <span className="text-cyan-300">truth</span>, <span className="text-cyan-300">local-ai</span>, or <span className="text-cyan-300">gabby &lt;instruction&gt;</span>.</div>
        )}
        {commands.map((cmd) => (
          <div key={cmd.id} className="mb-3">
            <div className="text-[#D4AF37]">
              <span>architect@apex-terminal:</span>
              <span className="text-white ml-2">{cmd.command}</span>
              <span className="text-slate-600 ml-2">{cmd.timestamp}</span>
            </div>
            <pre className="text-gray-400 whitespace-pre-wrap text-xs">{cmd.output}</pre>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <TerminalInput
          currentCommand={currentCommand}
          setCurrentCommand={setCurrentCommand}
          executeCommand={(command) => { void executeCommand(command); }}
        />
      </form>
    </div>
  );
}
