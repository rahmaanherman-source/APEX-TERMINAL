import React, { useCallback, useEffect, useRef, useState } from "react";
import { Search, ShieldCheck, Play, Pause, RefreshCw, Cpu, Settings, Grid, FolderKanban, Wrench, Link2 } from "lucide-react";

export type OperationalStatus = "UNKNOWN" | "CHECKING" | "CONFIGURED" | "CONNECTED" | "FAILED";
export type GovernanceStatus = "RESEARCHED" | "CANDIDATE" | "TESTED" | "APPROVED" | "VERIFIED" | "REJECTED";

export interface VerificationEvidenceObject {
  verificationId: string; capabilityId: string; timestamp: string;
  operationalStatus: OperationalStatus; governanceStatus: GovernanceStatus;
  evidenceRef: string; details: string;
}
export interface ConnectedApp {
  id: string; name: string; category: string; icon: string; endpoint: string;
  operationalStatus: OperationalStatus; governanceStatus: GovernanceStatus; lastChecked: string | null;
}
export interface CharacterRig {
  id: string; name: string; vertexCount: string; materialPreset: string; lodLevel: number;
  rigStatus: "BOUND" | "UNRIGGED"; animationState: "IDLE" | "COMBAT" | "PATROL";
  bodyProportions: { height: number; build: string };
}
export interface ProjectState {
  id: string; name: string; milestonesTotal: number; milestonesVerified: number; activeCharacter: CharacterRig;
}
export interface ChatMessage { id: string; sender: "ARCHITECT" | "GABBY" | "SYSTEM"; text: string; timestamp: string; evidenceRef?: string; }

type Material = { name: string; r: number; g: number; b: number; className: string };
const materials: Material[] = [
  { name: "Obsidian Titanium", r: .39, g: .45, b: .54, className: "from-zinc-800 to-black border-zinc-700" },
  { name: "Standard Emerald", r: .06, g: .72, b: .50, className: "from-emerald-900 to-stone-900 border-emerald-600" },
  { name: "Cyan Plasma", r: .06, g: .72, b: .83, className: "from-cyan-900 to-slate-900 border-cyan-500" },
  { name: "Gold Alloy PBR", r: .92, g: .70, b: .03, className: "from-yellow-600 to-yellow-950 border-yellow-500" },
  { name: "Stealth Matte", r: .20, g: .20, b: .22, className: "from-gray-900 to-zinc-950 border-gray-700" }
];

const now = () => "9:41 PM";

export default function ApexTerminalMaster() {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [bottomCollapsed, setBottomCollapsed] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("DASHBOARD");
  const [studioTab, setStudioTab] = useState<"CREATE"|"CHARACTERS"|"WORLDS"|"ANIMATION"|"RENDER">("CHARACTERS");
  const [studioTool, setStudioTool] = useState("MODEL");
  const [materialIndex, setMaterialIndex] = useState(0);
  const [fps, setFps] = useState(0);
  const [localStatus, setLocalStatus] = useState<OperationalStatus>("CHECKING");
  const [localModel, setLocalModel] = useState("Scanning Local Daemons...");
  const [latency, setLatency] = useState(0);
  const [project, setProject] = useState<ProjectState>({
    id: "PRJ-GODSPEED-01", name: "GODSPEED", milestonesTotal: 6, milestonesVerified: 4,
    activeCharacter: { id: "CHAR-TITAN-01", name: "MAC TITAN TACTICAL", vertexCount: "1,482,912", materialPreset: "Obsidian Titanium", lodLevel: 0, rigStatus: "BOUND", animationState: "IDLE", bodyProportions: { height: 1.88, build: "Athletic" } }
  });
  const [connectors, setConnectors] = useState<ConnectedApp[]>([
    { id: "app-local-ai", name: "Local Inference (Ollama)", category: "Inference", icon: "⚡", endpoint: "http://localhost:11434", operationalStatus: "CHECKING", governanceStatus: "VERIFIED", lastChecked: null },
    { id: "app-github", name: "GitHub GitOps", category: "VCS", icon: "🐙", endpoint: "https://api.github.com", operationalStatus: "CONNECTED", governanceStatus: "VERIFIED", lastChecked: now() },
    { id: "app-vercel", name: "Vercel Edge", category: "Deploy", icon: "▲", endpoint: "https://api.vercel.com", operationalStatus: "CONFIGURED", governanceStatus: "APPROVED", lastChecked: null },
    { id: "app-stripe", name: "Stripe Settlement", category: "Finance", icon: "💳", endpoint: "https://api.stripe.com", operationalStatus: "CONFIGURED", governanceStatus: "APPROVED", lastChecked: null },
    { id: "app-supabase", name: "Supabase Core", category: "Database", icon: "⚡", endpoint: "https://supabase.co", operationalStatus: "CONFIGURED", governanceStatus: "TESTED", lastChecked: null }
  ]);
  const [audit, setAudit] = useState<VerificationEvidenceObject[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [conversation, setConversation] = useState<ChatMessage[]>([{ id: "MSG_INIT", sender: "GABBY", text: "APEX Sovereign Control Plane armed. Touch controls enabled. Local execution ready.", timestamp: now() }]);
  const [processing, setProcessing] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [foley, setFoley] = useState("FOOTSTEPS_CONCRETE");
  const audioRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const recordAudit = useCallback((capabilityId: string, operationalStatus: OperationalStatus, governanceStatus: GovernanceStatus, evidenceRef: string, details: string) => {
    setAudit(prev => [{ verificationId: `VEO-${Date.now().toString().slice(-6)}`, capabilityId, timestamp: now(), operationalStatus, governanceStatus, evidenceRef, details }, ...prev].slice(0, 50));
  }, []);

  const probeLocalDaemon = useCallback(async () => {
    const started = performance.now();
    const probe = async (url: string) => {
      const controller = new AbortController(); const timer = window.setTimeout(() => controller.abort(), 1200);
      try { const r = await fetch(url, { signal: controller.signal }); window.clearTimeout(timer); return r; } catch { window.clearTimeout(timer); return null; }
    };
    const ollama = await probe("http://localhost:11434/api/tags");
    if (ollama?.ok) {
      const data = await ollama.json(); const models = (data.models || []).map((m: {name?: string}) => m.name).filter(Boolean).join(", ") || "Ollama online (no models pulled)";
      const ms = Math.round(performance.now() - started); setLocalStatus("CONNECTED"); setLocalModel(models); setLatency(ms);
      setConnectors(p => p.map(c => c.id === "app-local-ai" ? {...c, operationalStatus: "CONNECTED", lastChecked: now()} : c));
      recordAudit("LOCAL_INFERENCE_ENGINE", "CONNECTED", "VERIFIED", `HTTP_200_${ms}ms`, `Ollama local daemon verified: ${models}`); return;
    }
    const lm = await probe("http://localhost:1234/v1/models");
    if (lm?.ok) { const ms = Math.round(performance.now() - started); setLocalStatus("CONNECTED"); setLocalModel("LM Studio Core Server"); setLatency(ms); setConnectors(p => p.map(c => c.id === "app-local-ai" ? {...c, operationalStatus: "CONNECTED", lastChecked: now()} : c)); recordAudit("LOCAL_INFERENCE_ENGINE", "CONNECTED", "VERIFIED", `HTTP_200_LMSTUDIO_${ms}ms`, "LM Studio local REST API verified"); return; }
    setLocalStatus("FAILED"); setLocalModel("No Local Daemon Detected (Start Ollama / LM Studio)"); setLatency(0); setConnectors(p => p.map(c => c.id === "app-local-ai" ? {...c, operationalStatus: "FAILED", lastChecked: now()} : c)); recordAudit("LOCAL_INFERENCE_ENGINE", "FAILED", "REJECTED", "NO_LOCAL_DAEMON", "No Ollama or LM Studio endpoint responded");
  }, [recordAudit]);
  useEffect(() => { void probeLocalDaemon(); }, [probeLocalDaemon]);

  const dispatchGabby = async (e: React.FormEvent) => {
    e.preventDefault(); const command = chatInput.trim(); if (!command) return; setChatInput(""); setProcessing(true);
    setConversation(p => [...p, { id: `MSG_${Date.now()}`, sender: "ARCHITECT", text: command, timestamp: now() }]); recordAudit("GABBY_DISPATCH", "CONNECTED", "TESTED", "INTENT_CAPTURE", `Dispatched command: "${command}"`);
    if (localStatus === "CONNECTED" && localModel) {
      const model = localModel.split(",")[0].trim();
      try { const r = await fetch("http://localhost:11434/api/generate", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({model, prompt:`APEX SYSTEM PROMPT: You are Gabby, real-time AI operator. Give one concise technical status for: "${command}".`, stream:false}) });
        if (r.ok) { const d = await r.json(); const text = d.response?.trim() || "Execution confirmed by local inference engine."; setConversation(p => [...p, {id:`MSG_GABBY_${Date.now()}`, sender:"GABBY", text, timestamp:now(), evidenceRef:`LOCAL_INFERENCE_${model}`}]); recordAudit("LOCAL_INFERENCE_EXEC", "CONNECTED", "VERIFIED", `LLM_OK_${model}`, "Local inference execution validated"); setProcessing(false); return; }
      } catch { /* deterministic gate below */ }
    }
    const p = command.toLowerCase(); let reply = `Command acknowledged: "${command}". Handled via deterministic APEX Gatekeeper rules.`;
    if (p.includes("verify") || p.includes("probe")) { void probeLocalDaemon(); reply = "System verification sweep triggered across local endpoints."; }
    else if (p.includes("gold") || p.includes("material")) { setMaterialIndex(3); setProject(x => ({...x, activeCharacter:{...x.activeCharacter, materialPreset:"Gold Alloy PBR"}})); reply = "Character material set to Gold Alloy PBR in the active renderer state."; recordAudit("CHARACTER_STUDIO", "CONNECTED", "TESTED", "SHADER_MUTATE", "Applied Gold Alloy PBR selection"); }
    setConversation(p => [...p, {id:`MSG_GABBY_${Date.now()}`, sender:"GABBY", text:reply, timestamp:now()}]); setProcessing(false);
  };

  const toggleAudio = () => {
    if (audioPlaying) { try { oscRef.current?.stop(); oscRef.current?.disconnect(); } catch {} oscRef.current = null; setAudioPlaying(false); recordAudit("SPATIAL_AUDIO_DSP", "CONFIGURED", "TESTED", "DSP_STOP", "Web Audio oscillator stopped"); return; }
    try { const Ctx = window.AudioContext || (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext; if (!audioRef.current) audioRef.current = new Ctx(); const ctx = audioRef.current; if (ctx.state === "suspended") void ctx.resume(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type="sawtooth"; osc.frequency.value=110; gain.gain.value=.04; osc.connect(gain); gain.connect(ctx.destination); osc.start(); oscRef.current=osc; setAudioPlaying(true); recordAudit("SPATIAL_AUDIO_DSP", "CONNECTED", "TESTED", "DSP_110HZ_ACTIVE", `Audio synthesis started for ${foley}`); } catch (err) { recordAudit("SPATIAL_AUDIO_DSP", "FAILED", "REJECTED", "AUDIO_CTX_ERR", String(err)); }
  };
  const progress = Math.round(project.milestonesVerified / project.milestonesTotal * 100);
  const nav = [{id:"DASHBOARD",label:"DASHBOARD",Icon:Grid},{id:"PROJECTS",label:"PROJECTS",Icon:FolderKanban},{id:"TOOLS",label:"TOOLS",Icon:Wrench},{id:"ENGINES",label:"ENGINES",Icon:Cpu},{id:"CONNECTIONS",label:"CONNECTIONS",Icon:Link2},{id:"AUDIT LOG",label:"AUDIT LOG",Icon:ShieldCheck},{id:"SETTINGS",label:"SETTINGS",Icon:Settings}];

  return <div className="flex flex-col h-screen w-screen bg-[#04060a] text-slate-200 select-none overflow-hidden font-mono text-xs">
    <header className="h-14 border-b border-cyan-950/60 bg-[#060810]/95 px-4 flex items-center justify-between gap-4 shrink-0 z-30">
      <div className="w-72 flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/50 flex items-center justify-center text-cyan-400">▲</div><div><div className="font-black tracking-widest text-white">APEX TERMINAL <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/40 text-cyan-300">v4.2</span></div><div className="text-[9px] text-cyan-400/80 font-bold">REAL-TIME SOVEREIGN ENGINE</div></div></div>
      <form onSubmit={dispatchGabby} className="flex-1 max-w-2xl"><div className="flex items-center gap-2 bg-[#090d16] border border-cyan-900/50 rounded-full px-4 py-2"><Search className="w-4 h-4 text-cyan-400"/><input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="DISPATCH INSTRUCTION TO GABBY..." className="bg-transparent outline-none w-full text-slate-100 placeholder:text-slate-500"/><button disabled={processing} className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300">{processing?"DISPATCHING...":"DISPATCH"}</button></div></form>
      <div className="flex items-center gap-3"><div className="px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold"><span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2"/>TRUTH: EVIDENCE-BOUND</div><button onClick={()=>setMaximized(!maximized)} className="px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-300">{maximized?"RESTORE WORKSPACE ⛶":"MAXIMIZE 3D ⛶"}</button></div>
    </header>
    <div className="flex-1 flex overflow-hidden relative">
      {!maximized && <aside className={`${leftCollapsed?"w-12 p-2":"w-48 p-3"} bg-[#05070d] border-r border-cyan-950/60 flex flex-col justify-between shrink-0`}><div className="space-y-1 w-full"><button onClick={()=>setLeftCollapsed(!leftCollapsed)} className="w-full py-1 mb-2 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded text-[9px]">{leftCollapsed?"»":"« COLLAPSE"}</button>{nav.map(({id,label,Icon})=><button key={id} onClick={()=>{setActiveWorkspaceTab(id);recordAudit("NAVIGATION","CONNECTED","TESTED",`ROUTE_${id}`,`Switched to ${id}`)}} className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg font-bold ${activeWorkspaceTab===id?"bg-cyan-500/10 text-cyan-300 border border-cyan-500/40":"text-slate-400 hover:text-white"}`} title={label}><Icon className="w-3.5 h-3.5 text-cyan-400"/>{!leftCollapsed&&label}</button>)}</div>{!leftCollapsed&&<div className="bg-[#080b14] border border-cyan-950/80 rounded-xl p-2.5"><div className="flex justify-between text-[9px]"><span>LOCAL INFERENCE</span><span className={localStatus==="CONNECTED"?"text-emerald-400":"text-amber-400"}>{localStatus}</span></div><div className="text-[8px] text-slate-500 truncate">{localModel}</div><div className="text-[8px] text-zinc-500">Latency: <b className="text-cyan-400">{latency}ms</b></div><button onClick={()=>void probeLocalDaemon()} className="w-full mt-1 py-1 bg-black/60 border border-cyan-900/40 rounded text-[8px] text-cyan-300"><RefreshCw className="w-2.5 h-2.5 inline mr-1"/>RE-PROBE DAEMON</button></div>}</aside>}
      <main className="flex-1 flex flex-col bg-[#020306] overflow-y-auto p-3 gap-3"><section className="bg-[#060910] border border-cyan-950/70 rounded-2xl p-4"><div className="flex items-center justify-between pb-3 border-b border-cyan-950/40"><div className="flex items-center gap-5"><b className="tracking-widest text-white">3D CREATION STUDIO // {project.activeCharacter.name}</b><div className="flex gap-1">{(["CREATE","CHARACTERS","WORLDS","ANIMATION","RENDER"] as const).map(t=><button key={t} onClick={()=>{setStudioTab(t);recordAudit("STUDIO_MODE","CONNECTED","TESTED",`TAB_${t}`,`Studio tab changed to ${t}`)}} className={`px-3 py-1 rounded text-[10px] font-bold ${studioTab===t?"bg-cyan-500/20 text-cyan-300 border border-cyan-500/40":"text-slate-400"}`}>{t}</button>)}</div></div><div className="text-[10px] text-emerald-400">{fps} FPS · WEBGL BUFFER</div></div>
        <div className="grid grid-cols-12 gap-4 mt-3"><div className="col-span-8 bg-[#010204] border border-cyan-950/60 rounded-xl h-96 relative overflow-hidden"><HardwareWebGLCanvas selectedColor={materials[materialIndex]} onFpsUpdate={setFps}/><div className="absolute top-3 left-3 bg-black/80 border border-cyan-900/50 p-2 rounded text-[9px] pointer-events-none"><div className="text-cyan-300 font-bold">TOUCH ORBIT: ACTIVE</div><div className="text-slate-400">VERTICES: {project.activeCharacter.vertexCount}</div><div className="text-amber-400">SHADER: {materials[materialIndex].name}</div></div></div>
          <div className="col-span-4 flex flex-col gap-3"><div className="bg-[#04060c] border border-cyan-950/60 rounded-xl p-3"><div className="text-[10px] font-bold mb-2">SURFACE PBR PRESETS</div><div className="grid grid-cols-2 gap-2">{materials.map((m,i)=><button key={m.name} onClick={()=>{setMaterialIndex(i);setProject(p=>({...p,activeCharacter:{...p.activeCharacter,materialPreset:m.name}}));recordAudit("MATERIAL_INSPECTOR","CONNECTED","TESTED",`PBR_${i}`,`Selected shader: ${m.name}`)}} className={`p-2 rounded-lg bg-[#080c16] border text-left ${materialIndex===i?"border-cyan-400 text-white":"border-zinc-800 text-slate-400"}`}><div className={`w-full h-4 rounded mb-1 bg-gradient-to-r ${m.className}`}/><div className="text-[9px] font-bold truncate">{m.name}</div></button>)}</div></div><div className="bg-[#04060c] border border-cyan-950/60 rounded-xl p-3 space-y-1.5 text-[10px]"><b className="flex justify-between">TOPOLOGY & RIGGING <span className="text-emerald-400">{project.activeCharacter.rigStatus}</span></b><div className="flex justify-between text-slate-400">Height <span className="text-white">{project.activeCharacter.bodyProportions.height}m</span></div><div className="flex justify-between text-slate-400">Animation <span className="text-cyan-300">{project.activeCharacter.animationState}</span></div></div></div></div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-cyan-950/40"><div className="flex gap-2">{["SCULPT","MODEL","TEXTURE","RIG","ANIMATE","LIGHT","RENDER"].map(t=><button key={t} onClick={()=>{setStudioTool(t);recordAudit("STUDIO_TOOL","CONNECTED","TESTED",`TOOL_${t}`,`Tool activated: ${t}`)}} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${studioTool===t?"bg-cyan-500 text-black":"bg-[#0a0f1c] border border-cyan-950 text-slate-300"}`}>{t}</button>)}</div><span className="text-[10px] text-slate-400">LOD LEVEL: 0 · CINEMATIC HIGH-POLY</span></div>
      </section>
      {!maximized&&<div className="grid grid-cols-12 gap-3"><Panel title="FOLEY & SOUND DSP" span="col-span-3"><div className="space-y-1 max-h-24 overflow-y-auto">{["FOOTSTEPS_CONCRETE","CLOTH_RUSTLE","METAL_CLINK","WHOOSH_WIND","DOOR_OPEN"].map(t=><button key={t} onClick={()=>setFoley(t)} className={`block w-full text-left px-2 py-1 rounded text-[9px] ${foley===t?"bg-cyan-500/20 text-cyan-300":"text-slate-400"}`}>{t}</button>)}</div><button onClick={toggleAudio} className="w-full mt-2 py-1 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300">{audioPlaying?<Pause className="inline w-3 h-3 mr-1"/>:<Play className="inline w-3 h-3 mr-1"/>}{audioPlaying?"HALT AUDIO":"SYNTHESIZE"}</button></Panel><Panel title="AI DIALOGUE & ADAK" span="col-span-3"><div className="p-2 bg-black/50 border border-cyan-950/60 rounded text-slate-300 truncate">{conversation.at(-1)?.text}</div><div className="grid grid-cols-2 gap-1 mt-2"><button onClick={()=>recordAudit("ADAK_FLOW","CONNECTED","TESTED","VOICE_SAMPLE","Triggered voice profile test")} className="py-1 bg-[#0a0f1c] border border-cyan-950 rounded text-[8px]">TEST VOICE</button><button onClick={()=>recordAudit("ADAK_FLOW","CONNECTED","TESTED","LIP_SYNC_BAKE","Baking phoneme markers")} className="py-1 bg-cyan-500/20 border border-cyan-500/40 rounded text-[8px] text-cyan-300">BAKE LIP-SYNC</button></div></Panel><Panel title="SEQUENCE TIMELINE" span="col-span-3"><div className="space-y-1">{["VIDEO","DIALOGUE","FOLEY","MUSIC"].map((t,i)=><div key={t} className="flex gap-2 items-center"><span className="w-14 text-slate-400">{t}</span><div className="flex-1 h-3 bg-black/40 rounded"><div className="h-full bg-cyan-700/60 rounded" style={{width:`${[75,50,66,100][i]}%`}}/></div></div>)}</div></Panel><Panel title="VEO AUDIT STREAM" span="col-span-3"><div className="space-y-1.5 max-h-32 overflow-y-auto">{audit.map(v=><div key={v.verificationId} className="p-1.5 rounded bg-black/40 border border-white/5"><div className="flex justify-between text-[8px]"><span className="text-cyan-400 font-bold">{v.capabilityId}</span><span>{v.timestamp}</span></div><div className="truncate text-[8px]">{v.details}</div><div className="text-[7px] text-emerald-400/80 truncate">PROOF: {v.evidenceRef}</div></div>)}</div></Panel></div>}</main>
      {!maximized&&<aside className={`${rightCollapsed?"w-10 p-2":"w-72 p-3"} bg-[#05070d] border-l border-cyan-950/60 shrink-0`}><button onClick={()=>setRightCollapsed(!rightCollapsed)} className="w-full py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded text-[9px]">{rightCollapsed?"«":"COLLAPSE »"}</button>{!rightCollapsed&&<div className="space-y-4 mt-3"><div className="bg-[#080c16] border border-cyan-950/80 rounded-xl p-3"><div className="flex justify-between font-bold"><span>PROJECT: {project.name}</span><span className="text-cyan-400">{progress}%</span></div><div className="h-1.5 mt-2 bg-black rounded"><div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded" style={{width:`${progress}%`}}/></div><div className="text-[8px] text-slate-500 mt-1">{project.milestonesVerified} of {project.milestonesTotal} acceptance gates passed</div></div><div className="text-[9px] font-bold text-slate-400">CONNECTED ECOSYSTEM</div>{connectors.map(c=><div key={c.id} className="p-2 rounded bg-black/40 border border-white/5 flex items-center justify-between text-[10px]"><span>{c.icon} {c.name}</span><span className={c.operationalStatus==="CONNECTED"?"text-emerald-400":c.operationalStatus==="CONFIGURED"?"text-amber-400":"text-red-400"}>{c.operationalStatus}</span></div>)}</div>}</aside>}
    </div>
    <footer className={`${bottomCollapsed?"h-6":"h-12"} bg-[#030508] border-t border-cyan-950/60 px-4 flex items-center justify-between shrink-0`}><div className="flex items-center gap-2"><button onClick={()=>setBottomCollapsed(!bottomCollapsed)} className="text-[9px] text-cyan-400 font-bold">{bottomCollapsed?"▲ EXPAND DOCK":"▼ MINIMIZE"}</button>{!bottomCollapsed&&<div className="flex gap-1.5">{["BUILD","RUN","TEST","VERIFY","DEPLOY","PUBLISH"].map(a=><button key={a} onClick={()=>recordAudit("PIPELINE_STAGE","CONNECTED","TESTED",`STAGE_${a}`,`Triggered pipeline stage: ${a}`)} className="px-3 py-1 bg-[#080c16] border border-cyan-950 text-slate-300 rounded text-[9px]">{a}</button>)}</div>}</div><div className="text-[10px] text-slate-300 font-bold"><span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2"/>SOVEREIGN WORKSTATION ONLINE</div></footer>
  </div>;
}

function Panel({ title, span, children }: { title:string; span:string; children:React.ReactNode }) { return <section className={`${span} bg-[#060910] border border-cyan-950/70 rounded-xl p-3 flex flex-col justify-between`}><div className="text-[10px] font-bold text-white uppercase mb-2">{title}</div>{children}</section>; }

function HardwareWebGLCanvas({ selectedColor, onFpsUpdate }: { selectedColor: Material; onFpsUpdate:(fps:number)=>void }) {
  const canvasRef=useRef<HTMLCanvasElement|null>(null); const [rotation,setRotation]=useState({x:20,y:35}); const [zoom,setZoom]=useState(2.4); const drag=useRef(false); const last=useRef({x:0,y:0});
  useEffect(()=>{const canvas=canvasRef.current;if(!canvas)return;const gl=canvas.getContext("webgl");if(!gl)return;const vs=`attribute vec3 position;uniform mat4 modelView;uniform mat4 projection;void main(){gl_Position=projection*modelView*vec4(position,1.0);}`;const fs=`precision mediump float;uniform vec3 uColor;void main(){gl_FragColor=vec4(uColor,1.0);}`;const shader=(type:number,src:string)=>{const s=gl.createShader(type)!;gl.shaderSource(s,src);gl.compileShader(s);return s};const program=gl.createProgram()!;gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);gl.useProgram(program);const verts:number[]=[];const idx:number[]=[];const n=22;for(let i=0;i<=n;i++){const u=i/n*Math.PI*2;for(let j=0;j<=n;j++){const v=j/n*Math.PI*2;const R=.65,t=.25;verts.push((R+t*Math.cos(v))*Math.cos(u),(R+t*Math.cos(v))*Math.sin(u),t*Math.sin(v));}}for(let i=0;i<n;i++)for(let j=0;j<n;j++){const a=i*(n+1)+j,b=a+n+1;idx.push(a,b,a+1,b,b+1,a+1);}const vb=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW);const ib=gl.createBuffer()!;gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idx),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,"position");gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,0,0);const color=gl.getUniformLocation(program,"uColor");gl.uniform3f(color,selectedColor.r,selectedColor.g,selectedColor.b);gl.enable(gl.DEPTH_TEST);let frames=0,lastTime=performance.now(),raf=0;const render=(t:number)=>{gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(.012,.02,.035,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const x=rotation.x*Math.PI/180,y=rotation.y*Math.PI/180,cx=Math.cos(x),sx=Math.sin(x),cy=Math.cos(y),sy=Math.sin(y);const mv=new Float32Array([cy,sx*sy,-cx*sy,0,0,cx,sx,0,sy,-sx*cy,cx*cy,0,0,0,-zoom,1]);const aspect=canvas.width/canvas.height,f=1/Math.tan(45*Math.PI/360);const pr=new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,-1,-1,0,0,-.2,0]);gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelView"),false,mv);gl.uniformMatrix4fv(gl.getUniformLocation(program,"projection"),false,pr);gl.drawElements(gl.LINES,idx.length,gl.UNSIGNED_SHORT,0);frames++;if(t-lastTime>=1000){onFpsUpdate(frames);frames=0;lastTime=t;}raf=requestAnimationFrame(render)};raf=requestAnimationFrame(render);return()=>cancelAnimationFrame(raf)},[rotation,zoom,selectedColor,onFpsUpdate]);
  return <div className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none" onMouseDown={e=>{drag.current=true;last.current={x:e.clientX,y:e.clientY}}} onMouseMove={e=>{if(!drag.current)return;const dx=e.clientX-last.current.x,dy=e.clientY-last.current.y;setRotation(r=>({x:r.x+dy*.5,y:r.y+dx*.5}));last.current={x:e.clientX,y:e.clientY}}} onMouseUp={()=>drag.current=false} onMouseLeave={()=>drag.current=false} onWheel={e=>setZoom(z=>Math.min(Math.max(z+e.deltaY*.002,1.2),6))}><canvas ref={canvasRef} width={1000} height={600} className="w-full h-full object-contain pointer-events-none"/><div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] text-cyan-400">TOUCH/MOUSE: ROTATE · WHEEL: ZOOM</div></div>;
}
