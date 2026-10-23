'use client';
import { useState } from 'react';

const allowedCommands = ['Get-Date', 'Get-Location', 'Get-ChildItem', 'Get-Process'] as const;
export default function TerminalBridgePage() {
  const [mode, setMode] = useState<'terminal' | 'exec'>('exec');
  const [command, setCommand] = useState<string>(allowedCommands[0]);
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('Bridge not checked');

  async function send() {
    if (!token.trim() || !allowedCommands.includes(command as typeof allowedCommands[number])) {
      setStatus('Token and an allowed command are required');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:18765/exec', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'X-APEX-Token': token.trim()},
        body: JSON.stringify({command, mode}),
      });
      const result = await response.json();
      setStatus((result.ok ? 'Command dispatched' : 'Command failed: ' + (result.error || 'unknown')) +
        ' · ' + (result.correlation_id || 'no correlation ID'));
    } catch {
      setStatus('Bridge unavailable or this page origin is not configured on the bridge');
    }
  }

  return (
    <main style={{minHeight:'100vh',background:'#070b12',color:'#eaf2ff',padding:32,fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{maxWidth:900,margin:'0 auto'}}>
        <div style={{fontSize:12,letterSpacing:2,opacity:.65}}>APEX / GABBY</div>
        <h1>TERMINAL BRIDGE</h1>
        <p>Local safe mode. Only four read-only commands are accepted by the bridge.</p>
        <section style={{marginTop:28,padding:20,border:'1px solid #243246',borderRadius:16,background:'#0c1320'}}>
          <div style={{display:'flex',gap:10}}>
            <button onClick={() => setMode('terminal')}>TERMINAL</button>
            <button onClick={() => setMode('exec')}>EXEC / READ BACK</button>
          </div>
          <input value={token} onChange={e=>setToken(e.target.value)} placeholder="Local bridge token" type="password" autoComplete="off" style={{display:'block',width:'100%',marginTop:14,padding:13,boxSizing:'border-box'}} />
          <select aria-label="Allowed command" value={command} onChange={e=>setCommand(e.target.value)} style={{display:'block',width:'100%',marginTop:14,padding:13}}>
            {allowedCommands.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={send} style={{width:'100%',marginTop:14,padding:15}}>SEND ALLOWED COMMAND</button>
          <div role="status" style={{marginTop:12}}>{status}</div>
        </section>
      </div>
    </main>
  );
}