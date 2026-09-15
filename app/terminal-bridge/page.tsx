'use client';

import { useState } from 'react';

export default function TerminalBridgePage() {
  const [mode, setMode] = useState<'terminal' | 'exec'>('terminal');
  const [command, setCommand] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('Bridge not checked');

  async function send() {
    if (!command.trim() || !token.trim()) {
      setStatus('Token and command are required');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:18765/exec', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'X-APEX-Token': token.trim()},
        body: JSON.stringify({command, mode}),
      });
      const result = await response.json();
      setStatus(result.ok ? 'Command dispatched' : 'Command failed: ' + (result.error || 'unknown'));
    } catch {
      setStatus('APEX Terminal Bridge is not running on this computer');
    }
  }

  return (
    <main style={{minHeight:'100vh',background:'#070b12',color:'#eaf2ff',padding:32,fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{maxWidth:900,margin:'0 auto'}}>
        <div style={{fontSize:12,letterSpacing:2,opacity:.65}}>APEX / GABBY</div>
        <h1>TERMINAL BRIDGE</h1>
        <p style={{opacity:.7}}>One function: route an explicit command from APEX to the local Windows terminal.</p>
        <section style={{marginTop:28,padding:20,border:'1px solid #243246',borderRadius:16,background:'#0c1320'}}>
          <div style={{display:'flex',gap:10}}>
            <button onClick={() => setMode('terminal')} style={{flex:1,padding:14,borderRadius:10,border:0,background:mode==='terminal'?'#18b981':'#172235',color:'#fff'}}>TERMINAL</button>
            <button onClick={() => setMode('exec')} style={{flex:1,padding:14,borderRadius:10,border:0,background:mode==='exec'?'#18b981':'#172235',color:'#fff'}}>EXEC / READ BACK</button>
          </div>
          <input value={token} onChange={e=>setToken(e.target.value)} placeholder="Local bridge token" type="password" style={{width:'100%',boxSizing:'border-box',marginTop:14,padding:13,borderRadius:10,border:'1px solid #243246',background:'#070b12',color:'#fff'}} />
          <textarea value={command} onChange={e=>setCommand(e.target.value)} placeholder="Paste the PowerShell command here" style={{width:'100%',boxSizing:'border-box',marginTop:14,minHeight:240,padding:14,borderRadius:10,border:'1px solid #243246',background:'#05080d',color:'#d7e7ff',fontFamily:'ui-monospace,Consolas,monospace'}} />
          <button onClick={send} style={{width:'100%',marginTop:14,padding:15,borderRadius:10,border:0,background:'#ffb000',color:'#101010',fontWeight:800}}>SEND DIRECTLY</button>
          <div style={{marginTop:12,fontFamily:'ui-monospace,monospace',opacity:.8}}>{status}</div>
        </section>
      </div>
    </main>
  );
}