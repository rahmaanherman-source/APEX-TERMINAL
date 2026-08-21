'use client';

import { useMemo, useState } from 'react';
import {
  Activity, Box, Brain, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  CircleDot, Code2, Cpu, Database, FileText, GitBranch, Grid3X3, Layers,
  LockKeyhole, MemoryStick, MonitorCog, Play, Plus, Search, Settings,
  ShieldCheck, Sparkles, TerminalSquare, TestTube2, UploadCloud, Users,
  Wrench, X, Zap, Palette, BarChart3, ExternalLink
} from 'lucide-react';
import { connectedApps, hubModules } from './connected-apps';
import type { AuditEvent, ConnectedApp, HubAction, HubDestination, TruthState } from './hub-types';

const iconMap: Record<string, React.ElementType> = {
  vercel: Zap, figma: Palette, canva: Grid3X3, openai: Brain, codex: Code2,
  replit: TerminalSquare, 'hugging-face': Users, lovable: Sparkles, jotform: FileText,
  linear: GitBranch, notion: FileText, ramp: BarChart3, posthog: Activity,
  supabase: Database, descript: MonitorCog, sharepoint: Layers, outlook: CalendarIcon,
};
function CalendarIcon(props: {size?: number}) { return <span style={{fontSize: props.size ?? 16}}>◫</span>; }

const initialAudit: AuditEvent[] = [
  { id: 'boot', time: 'NOW', message: 'APEX Hub shell loaded', state: 'OBSERVED' },
  { id: 'registry', time: 'NOW', message: 'Provider registry available', state: 'OBSERVED' },
  { id: 'truth', time: 'NOW', message: 'Truth Gate policy loaded', state: 'OBSERVED' },
];

function statusLabel(status: TruthState) {
  return status.replaceAll('_', ' ');
}

function StatusDot({ status }: { status: TruthState }) {
  const good = status === 'VERIFIED' || status === 'CONNECTED';
  const warn = status === 'UNKNOWN' || status === 'REQUIRES_CONFIGURATION' || status === 'CONNECTED_NOT_VERIFIED';
  return <span className={`hub-status-dot ${good ? 'good' : warn ? 'warn' : 'bad'}`} title={statusLabel(status)} />;
}

function ConnectedAppsPanel({ onOpen }: { onOpen: (app: ConnectedApp) => void }) {
  return (
    <section className="hub-panel connected-panel">
      <div className="hub-panel-head"><div><span className="eyebrow">CONNECTED APPS</span><strong>APEX INTEGRATION HUB</strong></div><span className="panel-count">{connectedApps.length}</span></div>
      <div className="connected-list">
        {connectedApps.map(app => {
          const Icon = iconMap[app.iconKey] ?? Box;
          return <button className="connected-row" key={app.id} onClick={() => onOpen(app)}>
            <span className="provider-icon"><Icon size={15}/></span><span className="provider-name">{app.name}</span>
            <span className="provider-cap">{app.capabilitySummary}</span><StatusDot status={app.status}/><span className="provider-status">{statusLabel(app.status)}</span>
          </button>;
        })}
      </div>
    </section>
  );
}

function WorkspaceCard({ destination, onNavigate }: { destination: HubDestination; onNavigate: (d: HubDestination) => void }) {
  const titles: Record<HubDestination, [string,string]> = {
    DASHBOARD: ['APEX CONTROL CENTER','Unified workspace, evidence, and execution state.'], PROJECTS: ['PROJECTS','Projects remain inside the APEX shell.'], TOOLS: ['TOOLS','Launch registered tools without leaving the Hub.'], ENGINES: ['ENGINES','APEX Engine, Render, Physics, Audio, AI, and World Builder.'], CONNECTIONS: ['CONNECTIONS','Provider connections and capability truth.'], MARKETPLACE: ['MARKETPLACE','Approved capabilities and reusable assets.'], AUDIT_LOG: ['AUDIT LOG','Evidence-backed system activity.'], MEMORY_SLABS: ['MEMORY SLABS','Durable APEX memory and archive boundaries.'], SETTINGS: ['SETTINGS','Runtime configuration and policy surfaces.'], CHARACTER_STUDIO: ['3D CREATION STUDIO','Opening the canonical Character Studio workspace.'], TERMINAL: ['LOCAL TERMINAL','First-class local command surface.'], VAULT: ['OMNI VAULT','Local credential boundary; raw keys never render here.'],
  };
  const [title, subtitle] = titles[destination];
  return <div className="workspace-empty"><div className="workspace-icon"><MonitorCog size={30}/></div><div className="workspace-title">{title}</div><p>{subtitle}</p><div className="workspace-actions">
    {destination === 'CHARACTER_STUDIO' && <button className="hub-primary" onClick={() => onNavigate('CHARACTER_STUDIO')}><Box size={15}/> OPEN CHARACTER STUDIO</button>}
    {destination === 'TERMINAL' && <button className="hub-primary" onClick={() => onNavigate('TERMINAL')}><TerminalSquare size={15}/> OPEN LOCAL TERMINAL</button>}
    {destination === 'VAULT' && <button className="hub-primary"><LockKeyhole size={15}/> OPEN LOCAL VAULT</button>}
    {destination !== 'CHARACTER_STUDIO' && destination !== 'TERMINAL' && destination !== 'VAULT' && <button className="hub-primary"><Sparkles size={15}/> OPEN MODULE</button>}
  </div></div>;
}

export default function ApexHubShell() {
  const [destination, setDestination] = useState<HubDestination>('DASHBOARD');
  const [leftOpen, setLeftOpen] = useState(true);
  const [gabbyOpen, setGabbyOpen] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ConnectedApp | null>(null);
  const [command, setCommand] = useState('');
  const [audit, setAudit] = useState(initialAudit);
  const [vaultState, setVaultState] = useState<TruthState>('UNKNOWN');

  const systemMetrics = useMemo(() => ({ cpu: 'OBSERVED', gpu: 'OBSERVED', memory: 'LOCAL', net: 'LOCAL' }), []);

  const navigate = (next: HubDestination) => {
    if (next === 'CHARACTER_STUDIO') { window.location.href = '/character-studio'; return; }
    setDestination(next); setSelectedApp(null);
  };

  const runAction = (action: HubAction) => {
    const state: TruthState = action === 'VERIFY' ? 'OBSERVED' : 'OBSERVED';
    setAudit(prev => [{ id: crypto.randomUUID(), time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'}), message: `${action} action requested from Hub`, state }, ...prev].slice(0, 10));
  };

  const sendCommand = () => {
    const value = command.trim(); if (!value) return;
    setAudit(prev => [{ id: crypto.randomUUID(), time: 'NOW', message: `Local command requested: ${value}`, state: 'OBSERVED' }, ...prev].slice(0, 10));
    setCommand(''); setDestination('TERMINAL');
  };

  return <main className="apexHub">
    <header className="hub-topbar">
      <div className="hub-brand"><span className="hub-mark">A</span><div><strong>APEX TERMINAL</strong><small>REAL-TIME ENGINE</small></div></div>
      <div className="hub-command"><Search size={16}/><input value={command} onChange={e=>setCommand(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendCommand()} placeholder="GABBY, WHAT ARE WE BUILDING?"/><Sparkles size={15}/></div>
      <div className="hub-truth"><CircleDot size={11}/> {vaultState === 'UNKNOWN' ? 'TRUTH: OBSERVED' : `VAULT: ${statusLabel(vaultState)}`}</div><span className="hub-clock">LOCAL</span><div className="hub-owner"><strong>GODSPEED</strong><small>OWNER</small></div><ChevronDown size={16}/>
    </header>

    <div className="hub-body">
      <aside className={`hub-left ${leftOpen?'':'closed'}`}>
        <button className="hub-collapse" onClick={()=>setLeftOpen(!leftOpen)}>{leftOpen?<ChevronLeft/>:<ChevronRight/>}</button>
        {leftOpen && <><div className="hub-section-label">WORKSPACE</div>{hubModules.map(m=><button key={m.id} className={`hub-nav ${destination===m.destination?'active':''}`} onClick={()=>navigate(m.destination)}><Layers size={15}/>{m.label}</button>)}<div className="hub-section-label">SYSTEM</div><button className={`hub-nav ${destination==='TERMINAL'?'active':''}`} onClick={()=>navigate('TERMINAL')}><TerminalSquare size={15}/>TERMINAL</button><button className={`hub-nav ${destination==='VAULT'?'active':''}`} onClick={()=>navigate('VAULT')}><LockKeyhole size={15}/>OMNI VAULT</button><button className="hub-nav" onClick={()=>navigate('CHARACTER_STUDIO')}><Box size={15}/>CHARACTER STUDIO</button></>}
      </aside>

      <section className="hub-center">
        <div className="hub-center-head"><div><strong>{destination === 'DASHBOARD' ? 'APEX HUB' : destination.replaceAll('_',' ')}</strong><small>CANONICAL WORKSPACE · LOCAL-FIRST</small></div><div className="hub-project">PROJECT: <b>GODSPEED</b><span className="hub-observed">OBSERVED</span></div></div>
        <div className="hub-center-grid">
          <div className="hub-main-column">
            {destination === 'DASHBOARD' ? <>
              <ConnectedAppsPanel onOpen={app=>setSelectedApp(app)}/>
              <div className="hub-lower-grid">
                <section className="hub-panel telemetry"><div className="hub-panel-head"><div><span className="eyebrow">SYSTEM STATUS</span><strong>LOCAL RUNTIME</strong></div><Activity size={16}/></div><div className="metric-grid">{Object.entries(systemMetrics).map(([k,v])=><div key={k}><span>{k.toUpperCase()}</span><b>{v}</b><i/></div>)}</div></section>
                <section className="hub-panel engines"><div className="hub-panel-head"><div><span className="eyebrow">ENGINES</span><strong>APEX EXECUTION LAYER</strong></div><Cpu size={16}/></div><div className="engine-grid">{[['APEX ENGINE',Activity],['APEX RENDER',MonitorCog],['PHYSICS',Box],['AUDIO ENGINE',Activity],['AI GENERATION',Sparkles],['WORLD BUILDER',Grid3X3]].map(([name,I])=>{const Icon=I as React.ElementType;return <button key={name as string} onClick={()=>setDestination('ENGINES')}><Icon size={17}/><span>{name as string}<small>MODULE</small></span></button>})}</div></section>
              </div>
            </> : destination === 'CONNECTIONS' ? <ConnectedAppsPanel onOpen={app=>setSelectedApp(app)}/> : <WorkspaceCard destination={destination} onNavigate={navigate}/>} 
          </div>

          <aside className={`hub-right ${gabbyOpen?'':'closed'}`}>
            <button className="hub-right-toggle" onClick={()=>setGabbyOpen(!gabbyOpen)}>{gabbyOpen?<X size={15}/>:<Sparkles size={15}/>}</button>
            {gabbyOpen && <>
              <div className="gabby-head"><span>CONCIERGE: GABBY</span><Brain size={28}/></div><div className="gabby-avatar"><Brain size={42}/></div><p>Workspace context is loaded.</p><p className="muted">What are we building?</p><div className="gabby-buttons"><button onClick={()=>setDestination('PROJECTS')}><Plus size={13}/> NEW PROJECT</button><button onClick={()=>setDestination('PROJECTS')}><ExternalLink size={13}/> OPEN PROJECT</button></div>
              <div className="project-status"><small>PROJECT: GODSPEED</small><strong>OBSERVED</strong><div className="status-bar"><i/></div><span>Evidence required for VERIFIED</span></div>
              <div className="gabby-actions"><button onClick={()=>setDestination('CHARACTER_STUDIO')}><Box size={14}/> CHARACTER STUDIO</button><button onClick={()=>setDestination('TERMINAL')}><TerminalSquare size={14}/> LOCAL TERMINAL</button><button onClick={()=>setDestination('VAULT')}><LockKeyhole size={14}/> OMNI VAULT</button></div>
              <div className="gabby-input"><label>ASK GABBY</label><input placeholder="Describe the next operation..."/><button onClick={()=>setAudit(prev=>[{id:crypto.randomUUID(),time:'NOW',message:'Gabby request queued for execution',state:'OBSERVED'},...prev])}><Sparkles size={14}/> QUEUE</button></div>
            </>}
          </aside>
        </div>

        <div className="hub-audit-grid">
          <section className="hub-panel command-panel"><div className="hub-panel-head"><div><span className="eyebrow">COMMAND CENTER</span><strong>BUILD → RUN → TEST → VERIFY → DEPLOY → PUBLISH</strong></div><Wrench size={16}/></div><div className="command-actions">{(['BUILD','RUN','TEST','VERIFY','DEPLOY','PUBLISH'] as HubAction[]).map(a=><button key={a} onClick={()=>runAction(a)}><span>{a}</span></button>)}</div></section>
          <section className="hub-panel audit-panel"><div className="hub-panel-head"><div><span className="eyebrow">AUDIT FEED</span><strong>REAL-TIME EVIDENCE</strong></div><ShieldCheck size={16}/></div>{audit.slice(0,6).map(e=><div className="audit-row" key={e.id}><CheckCircle2 size={12}/><span>{e.time}</span><b>{e.message}</b><em>{statusLabel(e.state)}</em></div>)}</section>
        </div>
      </section>
    </div>

    {selectedApp && <div className="hub-modal-backdrop" onClick={()=>setSelectedApp(null)}><section className="hub-modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={()=>setSelectedApp(null)}><X size={17}/></button><div className="modal-icon"><Box size={24}/></div><h2>{selectedApp.name}</h2><p>{selectedApp.capabilitySummary} capability target.</p><div className="modal-status"><StatusDot status={selectedApp.status}/><strong>{statusLabel(selectedApp.status)}</strong></div><p className="muted">This provider is registered in the APEX integration matrix. Registration does not imply connection or verification.</p><button className="hub-primary" onClick={()=>{setSelectedApp(null);setDestination('CONNECTIONS')}}>OPEN CONNECTION SURFACE</button></section></div>}

    <footer className="hub-footer"><div className="footer-ops">{(['BUILD','RUN','TEST','VERIFY','DEPLOY','PUBLISH'] as HubAction[]).map(a=><button key={a} onClick={()=>runAction(a)}>{a}</button>)}</div><div className="footer-logo"><b>APEX</b><small>REAL-TIME ENGINE</small></div><div className="footer-truth"><ShieldCheck size={16}/> TRUTH: OBSERVED</div><div className="footer-gabby"><Sparkles size={15}/> GABBY READY</div></footer>
  </main>;
}
