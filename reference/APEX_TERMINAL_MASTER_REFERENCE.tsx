/*
 * OWNER-SUPPLIED MASTER REFERENCE IMPLEMENTATION
 *
 * Purpose: preserve the exact React/TypeScript master component supplied by the
 * owner during the 2026-08-21 APEX Hub/Terminal shell reconciliation.
 *
 * IMPORTANT:
 * - This file is a reference artifact, not runtime verification.
 * - It is not permission to mark simulated status as VERIFIED.
 * - The canonical visual shell directive remains docs/APEX_HUB_EXACT_SHELL_DIRECTIVE.md.
 * - The local-first runtime contract remains docs/APEX_LOCAL_FIRST_AI_RUNTIME_CONTRACT.md.
 *
 * The supplied component establishes the requested architecture:
 *   Architect identity
 *   Provider contracts
 *   Character rig state
 *   Two-way Gabby conversation surface
 *   Local Terminal Vault / federated credential references
 *   Audit feed
 *   Audio DSP surface
 *   3D Creation Studio
 *   Connected Apps / Ecosystem drawer
 *   Build / Run / Test / Verify / Deploy / Publish command surface
 *
 * The runtime implementation must still replace demo-only behavior with real
 * APEX adapters, Gatekeeper authorization, model routing, readback, evidence,
 * and Truth Gate verification.
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";

export type TruthStatus =
  | "UNKNOWN"
  | "REQUIRES_CONFIGURATION"
  | "ADAPTER_MOUNTED"
  | "CONNECTED_NOT_VERIFIED"
  | "CONNECTED_VERIFIED"
  | "FAILED"
  | "REVOKED";

export interface ArchitectIdentity {
  principal: string;
  alias: string;
  role: string;
  patentRef: string;
  organization: string;
  securityClearance: string;
  status: "SOVEREIGN_AUTHENTICATED";
}

export interface VaultCredentialItem {
  id: string;
  vaultSpace: "TERMINAL_LOCAL" | "SOVEREIGN_REMOTE";
  provider: string;
  name: string;
  credentialRef: string;
  scopes: string[];
  status: TruthStatus;
  createdAt: string;
  lastVerifiedAt: string | null;
}

export interface ProviderContract {
  id: string;
  name: string;
  category: "AI" | "CLOUD" | "GITOPS" | "PAYMENTS" | "COMMERCE" | "STORAGE" | "AUDIO" | "MEDIA";
  status: TruthStatus;
  priority: "P0" | "P1" | "P2";
  purpose: string;
  contractFile: string;
  commitHash: string;
  icon: string;
  credentialRef: string | null;
  lastCheckedAt: string | null;
  evidenceRef: string | null;
  liveChecks: { name: string; status: "SUCCESS" | "FAILED" | "PENDING" }[];
}

export interface CharacterRig {
  id: string;
  name: string;
  prompt: string;
  version: number;
  selectedMaterial: string;
  meshType: "torus" | "cube" | "sphere" | "cylinder";
  skinVariant: string;
  fightingStyle: string;
  bodyProportions: { height: number; build: string };
  rigStatus: "BOUND" | "UNRIGGED";
  animationState: "IDLE" | "PATROL" | "COMBAT";
}

export interface ChatMessage {
  id: string;
  sender: "ARCHITECT" | "GABBY";
  text: string;
  timestamp: string;
  contextRef?: string;
  actionTaken?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  type: "VERIFIED" | "STARTED" | "FAILED" | "SECURITY_VIOLATION" | "GABBY_ACTION";
  action: string;
  message: string;
  evidenceRef?: string | null;
}

const ARCHITECT_SPEC: ArchitectIdentity = {
  principal: "RAHMANN MANZAR HERMAN",
  alias: "MAC TITAN",
  role: "CHIEF ARCHITECT / SOVEREIGN INVENTOR",
  patentRef: "US Patent 63/940,186 (QuantumSpeed™)",
  organization: "Adrian Holdings S.R.L. / APEX Life Global",
  securityClearance: "LEVEL_9_SOVEREIGN_AUTHORITY",
  status: "SOVEREIGN_AUTHENTICATED",
};

const ECOSYSTEM_PROVIDERS: ProviderContract[] = [
  {
    id: "stripe",
    name: "Stripe",
    category: "PAYMENTS",
    status: "CONNECTED_VERIFIED",
    priority: "P0",
    purpose: "Payments / Revenue",
    contractFile: "integrations/providers/stripe.yaml",
    commitHash: "db99007944d405113dfed0d48d65aca5a09c843e",
    icon: "S",
    credentialRef: "STRIPE_PRODUCTION",
    lastCheckedAt: "10:41 AM",
    evidenceRef: "EVID_STRIPE_LIVE_200",
    liveChecks: [
      { name: "Authenticated account observation", status: "SUCCESS" },
      { name: "API capability check", status: "SUCCESS" },
      { name: "Webhook endpoint delivery", status: "SUCCESS" },
      { name: "Checkout session verification", status: "SUCCESS" },
    ],
  },
  {
    id: "google_cloud",
    name: "Google Cloud / Vertex AI",
    category: "AI",
    status: "CONNECTED_NOT_VERIFIED",
    priority: "P0",
    purpose: "AI / Data / Cloud Infra",
    contractFile: "integrations/providers/google-cloud.yaml",
    commitHash: "c82dea93cba8a39532d84336ff6d8c02c6224362",
    icon: "☁",
    credentialRef: "GOOGLE_VERTEX_KEY",
    lastCheckedAt: "10:38 AM",
    evidenceRef: null,
    liveChecks: [
      { name: "Service Account Binding", status: "SUCCESS" },
      { name: "IAM Roles & Permissions", status: "PENDING" },
      { name: "Vertex Model Quota", status: "PENDING" },
    ],
  },
  {
    id: "github",
    name: "GitHub",
    category: "GITOPS",
    status: "CONNECTED_VERIFIED",
    priority: "P1",
    purpose: "Code / Repos / CI",
    contractFile: "integrations/providers/github.yaml",
    commitHash: "776ba012efc4091a",
    icon: "🐙",
    credentialRef: "GITHUB_PAT_CORE",
    lastCheckedAt: "10:40 AM",
    evidenceRef: "EVID_GITHUB_SHA_776BA0",
    liveChecks: [
      { name: "OAuth Token Validation", status: "SUCCESS" },
      { name: "Webhook Delivery Check", status: "SUCCESS" },
    ],
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "CLOUD",
    status: "CONNECTED_NOT_VERIFIED",
    priority: "P1",
    purpose: "Hosting / Frontend / AI Gateway",
    contractFile: "integrations/providers/vercel.yaml",
    commitHash: "32098ba4e881",
    icon: "▲",
    credentialRef: "VERCEL_TOKEN",
    lastCheckedAt: "10:39 AM",
    evidenceRef: null,
    liveChecks: [{ name: "Deployment Hook Health", status: "PENDING" }],
  },
  {
    id: "openai",
    name: "OpenAI / Codex",
    category: "AI",
    status: "CONNECTED_NOT_VERIFIED",
    priority: "P1",
    purpose: "Cognitive Models / Embeddings",
    contractFile: "integrations/providers/openai.yaml",
    commitHash: "44910ae821c",
    icon: "⚙",
    credentialRef: "OPENAI_PRIMARY",
    lastCheckedAt: "10:38 AM",
    evidenceRef: null,
    liveChecks: [{ name: "API Quota Probe", status: "PENDING" }],
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "STORAGE",
    status: "CONNECTED_VERIFIED",
    priority: "P2",
    purpose: "Data / Auth / Storage",
    contractFile: "integrations/providers/supabase.yaml",
    commitHash: "bb8912e5fa09",
    icon: "⚡",
    credentialRef: "SUPABASE_POOL",
    lastCheckedAt: "10:38 AM",
    evidenceRef: "EVID_PG_POOL_HEALTHY",
    liveChecks: [{ name: "PostgreSQL Connection Pool", status: "SUCCESS" }],
  },
];

export default function ApexTerminalMaster() {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<
    "DASHBOARD" | "PROJECTS" | "TOOLS" | "ENGINES" | "CONNECTIONS" | "VAULT" | "SKETCHPAD" | "MARKETPLACE" | "AUDIT" | "MEMORY" | "SETTINGS"
  >("DASHBOARD");

  const [studioSubTab, setStudioSubTab] = useState<"CREATE" | "CHARACTERS" | "WORLDS" | "ANIMATION" | "RENDER">("CHARACTERS");
  const [studioTool, setStudioTool] = useState<"SCULPT" | "MODEL" | "TEXTURE" | "RIG" | "ANIMATE" | "LIGHT" | "RENDER">("MODEL");
  const [isEcosystemDrawerOpen, setIsEcosystemDrawerOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string>("stripe");

  const [character, setCharacter] = useState<CharacterRig>({
    id: "CHR_TITAN_01",
    name: "MAC TITAN TACTICAL",
    prompt: "Architect-designed sovereign cyber operative with obsidian armor and gold emblem",
    version: 4,
    selectedMaterial: "Obsidian Titanium",
    meshType: "torus",
    skinVariant: "Standard Black Armor",
    fightingStyle: "Quantum Kinetic Strike",
    bodyProportions: { height: 1.88, build: "Athletic" },
    rigStatus: "BOUND",
    animationState: "IDLE",
  });

  const [chatInput, setChatInput] = useState("");
  const [conversation, setConversation] = useState<ChatMessage[]>([
    {
      id: "MSG_INIT",
      sender: "GABBY",
      text: `Greetings Architect. Sovereign control plane initialized. What are we building?`,
      timestamp: "9:40 PM",
    },
  ]);
  const [isGabbyThinking, setIsGabbyThinking] = useState(false);

  const [vaultCredentials, setVaultCredentials] = useState<VaultCredentialItem[]>([
    {
      id: "VC_01",
      vaultSpace: "TERMINAL_LOCAL",
      provider: "stripe",
      name: "Stripe Production Key",
      credentialRef: "STRIPE_PRODUCTION",
      scopes: ["charges:read", "transfers:write"],
      status: "CONNECTED_VERIFIED",
      createdAt: "2026-08-20",
      lastVerifiedAt: "10:41 AM",
    },
    {
      id: "VC_02",
      vaultSpace: "TERMINAL_LOCAL",
      provider: "google_cloud",
      name: "Vertex AI Sovereign Key",
      credentialRef: "GOOGLE_VERTEX_KEY",
      scopes: ["aiplatform.endpoints.predict"],
      status: "CONNECTED_NOT_VERIFIED",
      createdAt: "2026-08-21",
      lastVerifiedAt: null,
    },
    {
      id: "VC_03",
      vaultSpace: "SOVEREIGN_REMOTE",
      provider: "github",
      name: "GitHub GitOps Token",
      credentialRef: "GITHUB_PAT_CORE",
      scopes: ["repo", "workflow"],
      status: "CONNECTED_VERIFIED",
      createdAt: "2026-08-19",
      lastVerifiedAt: "10:40 AM",
    },
  ]);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([
    { id: "LOG_01", timestamp: "9:40:21 PM", type: "VERIFIED", action: "ARCHITECT_AUTH", message: "Principal Verified" },
    { id: "LOG_02", timestamp: "9:40:22 PM", type: "VERIFIED", action: "PATENT_BOUND", message: "Patent reference bound" },
    { id: "LOG_03", timestamp: "9:40:23 PM", type: "VERIFIED", action: "CHAR_LOADED", message: "Rig Mounted" },
    { id: "LOG_04", timestamp: "9:40:31 PM", type: "VERIFIED", action: "ANIMATION_APPLIED", message: "Animation Stream Bound" },
    { id: "LOG_05", timestamp: "9:40:45 PM", type: "VERIFIED", action: "FOLEY_RECORDED", message: "Foley DSP Track Active" },
    { id: "LOG_06", timestamp: "9:40:52 PM", type: "VERIFIED", action: "ADAK_GENERATED", message: "ADAK Dialogue Voice Clone Ready" },
    { id: "LOG_07", timestamp: "9:41:02 PM", type: "VERIFIED", action: "RENDER_STARTED", message: "Render Pipeline Initialized" },
    { id: "LOG_08", timestamp: "9:41:11 PM", type: "VERIFIED", action: "FRAME_VERIFIED", message: "Frame Bounds Checked" },
    { id: "LOG_09", timestamp: "9:41:12 PM", type: "VERIFIED", action: "TRUTH_GATE_OPEN", message: "Sovereign Clearance Confirmed" },
  ]);

  const addAuditLog = useCallback(
    (type: AuditEvent["type"], action: string, message: string, evidenceRef?: string | null) => {
      const entry: AuditEvent = {
        id: "LOG_" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        timestamp: new Date().toLocaleTimeString(),
        type,
        action,
        message,
        evidenceRef: evidenceRef || null,
      };
      setAuditLogs((prev) => [entry, ...prev.slice(0, 39)]);
    },
    []
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput;
    const userMsg: ChatMessage = {
      id: "MSG_" + Math.random().toString(36).substring(2, 8),
      sender: "ARCHITECT",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setConversation((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsGabbyThinking(true);
    addAuditLog("GABBY_ACTION", "ARCHITECT_COMMAND", `Architect Command: "${userText}"`);

    setTimeout(() => {
      const p = userText.toLowerCase();
      let reply = `Command acknowledged. Updating rig "${character.name}" (v${character.version}).`;
      let actionTag = "ARCHITECT_OVERRIDE_EXECUTED";

      if (p.includes("taller") || p.includes("height")) {
        const newHeight = Number((character.bodyProportions.height + 0.12).toFixed(2));
        setCharacter((prev) => ({ ...prev, bodyProportions: { ...prev.bodyProportions, height: newHeight }, version: prev.version + 1 }));
        reply = `Rig geometry updated to ${newHeight}m.`;
        actionTag = "RIG_HEIGHT_MUTATED";
      } else if (p.includes("skin") || p.includes("premium") || p.includes("gold")) {
        setCharacter((prev) => ({ ...prev, selectedMaterial: "Gold Alloy", skinVariant: "Sovereign Gold Edition", version: prev.version + 1 }));
        reply = `Assigned premium skin: Sovereign Gold Edition.`;
        actionTag = "MATERIAL_SKIN_APPLIED";
      } else if (p.includes("fighting style") || p.includes("combat") || p.includes("movement")) {
        setCharacter((prev) => ({ ...prev, fightingStyle: "Quantum Kinetic Strike", animationState: "COMBAT", version: prev.version + 1 }));
        reply = `Bound motion pipeline to Quantum Kinetic Strike.`;
        actionTag = "ANIMATION_STYLE_BOUND";
      } else if (p.includes("woman warrior") || p.includes("female") || p.includes("valkyrie")) {
        setCharacter({
          id: "CHR_VALKYRIE_02",
          name: "VALKYRIE PROTOCOL",
          prompt: userText,
          version: 1,
          selectedMaterial: "Standard Emerald",
          meshType: "torus",
          skinVariant: "Cybernetic Valkyrie Armor",
          fightingStyle: "Acrobatic Strike",
          bodyProportions: { height: 1.82, build: "Athletic" },
          rigStatus: "BOUND",
          animationState: "IDLE",
        });
        reply = `Constructed new character rig: VALKYRIE PROTOCOL.`;
        actionTag = "NEW_RIG_SYNTHESIZED";
      } else if (p.includes("verify") || p.includes("status")) {
        reply = `Status request received. Real verification must come from the APEX Comparator and evidence layer.`;
        actionTag = "SOVEREIGN_STATUS_PROBED";
      }

      const gabbyMsg: ChatMessage = {
        id: "MSG_" + Math.random().toString(36).substring(2, 8),
        sender: "GABBY",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionTaken: actionTag,
      };
      setConversation((prev) => [...prev, gabbyMsg]);
      setIsGabbyThinking(false);
      addAuditLog("GABBY_ACTION", actionTag, reply);
    }, 450);
  };

  const toggleAudioDSP = () => {
    if (isPlayingAudio) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      setIsPlayingAudio(false);
      addAuditLog("VERIFIED", "AUDIO_STOP", "Web Audio DSP oscillator stopped.");
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioContextRef.current) audioContextRef.current = new AudioCtx();
        const ctx = audioContextRef.current;
        if (ctx.state === "suspended") ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        setIsPlayingAudio(true);
        addAuditLog("STARTED", "AUDIO_START", "Foley track active: 110Hz carrier.");
      } catch (err) {
        addAuditLog("FAILED", "AUDIO_FAIL", "Failed to start AudioContext.", String(err));
      }
    }
  };

  const activeContract = useMemo(
    () => ECOSYSTEM_PROVIDERS.find((p) => p.id === selectedProviderId) || ECOSYSTEM_PROVIDERS[0],
    [selectedProviderId]
  );

  return (
    <div className="flex flex-col h-screen w-full bg-[#030609] text-zinc-300 font-mono select-none overflow-hidden text-xs relative">
      <header className="flex items-center justify-between px-4 py-2 bg-[#060a0f] border-b border-cyan-950/80 shrink-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 bg-cyan-400 rounded-sm shadow-[0_0_12px_#22d3ee] flex items-center justify-center font-black text-black text-[9px]">A</span>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-widest text-sm text-cyan-200 leading-tight">APEX TERMINAL</span>
              <span className="text-[8px] text-zinc-500 tracking-wider">SOVEREIGN ARCHITECT ENGINE</span>
            </div>
          </div>
        </div>
        <form onSubmit={handleSendMessage} className="flex-1 max-w-xl mx-6 flex items-center bg-zinc-950/90 border border-cyan-950/90 rounded-lg px-3 py-1.5">
          <span className="text-zinc-500 mr-2 text-xs">🔍</span>
          <input type="text" placeholder="ARCHITECT DISPATCH INSTRUCTION..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="w-full bg-transparent text-zinc-200 text-xs outline-none placeholder-zinc-600" />
          <span className="text-cyan-500/80 text-[10px] ml-2 tracking-widest">∿∿∿∿</span>
        </form>
        <div className="flex items-center gap-4">
          <span className="px-2.5 py-0.5 bg-emerald-950/80 border border-emerald-500 text-emerald-400 rounded text-[10px] font-bold">TRUTH: VERIFIED</span>
          <span className="text-zinc-400 text-[11px] font-bold">9:41 PM</span>
          <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
            <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500 flex items-center justify-center text-[10px] font-bold text-cyan-300">M</div>
            <div className="flex flex-col"><span className="text-[11px] font-bold text-zinc-200 leading-tight">THE ARCHITECT</span><span className="text-[8px] text-amber-400 leading-tight font-bold">MAC TITAN</span></div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className="w-56 bg-[#05080c] border-r border-cyan-950/70 flex flex-col p-3 gap-3 shrink-0 overflow-y-auto z-20">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-zinc-500 font-bold tracking-wider">WORKSPACE</span>
            {[
              { id: "DASHBOARD", label: "DASHBOARD", icon: "⬡" },
              { id: "PROJECTS", label: "PROJECTS", icon: "📁" },
              { id: "TOOLS", label: "TOOLS", icon: "⚒" },
              { id: "ENGINES", label: "ENGINES", icon: "⚙" },
              { id: "CONNECTIONS", label: "CONNECTIONS", icon: "⚡" },
              { id: "VAULT", label: "TERMINAL VAULT", icon: "🔒" },
              { id: "SKETCHPAD", label: "SKETCHPAD", icon: "✏️" },
              { id: "MARKETPLACE", label: "MARKETPLACE", icon: "🛒" },
              { id: "AUDIT", label: "AUDIT LOG", icon: "📋" },
              { id: "MEMORY", label: "MEMORY SLABS", icon: "🧠" },
              { id: "SETTINGS", label: "SETTINGS", icon: "⚙" },
            ].map((item) => (
              <button key={item.id} onClick={() => item.id === "CONNECTIONS" ? setIsEcosystemDrawerOpen(true) : setActiveWorkspaceTab(item.id as any)} className={`px-2.5 py-1.5 rounded text-left font-bold transition flex items-center gap-2 ${activeWorkspaceTab === item.id ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/50" : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"}`}>
                <span className="text-xs">{item.icon}</span><span className="text-[10px]">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1 pt-2 border-t border-zinc-800/80">
            <div className="flex justify-between items-center mb-1"><span className="text-[9px] text-zinc-500 font-bold tracking-wider">CONNECTED APPS</span><button onClick={() => setIsEcosystemDrawerOpen(true)} className="text-[8px] text-cyan-400 hover:underline font-bold">VIEW ALL</button></div>
            <div className="flex flex-col gap-1 text-[10px]">
              {ECOSYSTEM_PROVIDERS.slice(0, 7).map((app) => (
                <div key={app.id} onClick={() => { setSelectedProviderId(app.id); setIsEcosystemDrawerOpen(true); }} className="flex justify-between items-center p-1 hover:bg-zinc-900/60 rounded cursor-pointer transition">
                  <span className="text-zinc-300 flex items-center gap-1.5"><span className="text-zinc-500 text-xs">{app.icon}</span>{app.name}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${app.status === "CONNECTED_VERIFIED" ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto pt-2 border-t border-zinc-800/80 flex flex-col gap-1 text-[10px]"><span className="text-zinc-500 font-bold tracking-wider text-[8px]">SYSTEM STATUS</span><div className="flex justify-between"><span>CPU:</span><span className="text-emerald-400">23%</span></div><div className="flex justify-between"><span>GPU:</span><span className="text-emerald-400">41%</span></div><div className="flex justify-between"><span>RAM:</span><span className="text-cyan-400">62%</span></div><div className="flex justify-between"><span>NET:</span><span>12.4 Mb/s</span></div></div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden bg-[#020406]">
          {activeWorkspaceTab === "DASHBOARD" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-[#060a0f] border-b border-zinc-800/80 shrink-0"><div className="flex gap-4 text-[10px] font-bold"><span className="text-zinc-400 font-extrabold tracking-wider mr-2">3D CREATION STUDIO</span>{(["CREATE", "CHARACTERS", "WORLDS", "ANIMATION", "RENDER"] as const).map((tab) => <button key={tab} onClick={() => setStudioSubTab(tab)} className={studioSubTab === tab ? "text-cyan-300 border-b-2 border-cyan-400 pb-1" : "text-zinc-500"}>{tab}</button>)}</div><div className="text-[10px] text-zinc-400">Rig: <strong className="text-cyan-300">{character.name}</strong> (v{character.version})</div></div>
              <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="h-[380px] flex border-b border-zinc-800/80 shrink-0">
                  <div className="flex-1 relative bg-gradient-to-b from-[#04070a] to-[#010203] flex items-center justify-center border-r border-zinc-800/80"><MasterStudioCanvas rig={character}/><div className="absolute left-3 top-3 flex flex-col gap-1 bg-zinc-950/80 p-1 rounded-lg border border-zinc-800">{["🎯","📐","💎","🦴","💡","🎥"].map((t,idx)=><button key={idx} className="w-7 h-7">{t}</button>)}</div><div className="absolute bottom-3 flex items-center gap-2 bg-zinc-950/80 px-3 py-1.5 rounded-full border border-zinc-800">{["Obsidian Titanium","Standard Emerald","Cyan Plasma","Gold Alloy","Raw Wireframe"].map((mat)=><button key={mat} onClick={() => setCharacter((prev)=>({...prev,selectedMaterial:mat}))} className={`w-6 h-6 rounded-full border ${character.selectedMaterial===mat?"border-cyan-400 scale-110":"border-zinc-700"}`}/>)}</div></div>
                  <div className="w-72 bg-[#05080c] p-3 flex flex-col gap-2 shrink-0"><span className="text-[9px] font-bold text-zinc-400 tracking-wider">ORTHOGRAPHIC TURNAROUND</span><div className="grid grid-cols-3 gap-2 flex-1">{["FRONT","SIDE","BACK"].map((v)=><div key={v} className="bg-zinc-950 border border-zinc-800 rounded flex flex-col items-center justify-center p-1"><span className="text-[7px] text-cyan-400 font-bold mb-1">{v}</span><span className="text-xl text-zinc-600">👤</span></div>)}</div></div>
                </div>
                <div className="p-4 grid grid-cols-4 gap-4 bg-[#030508]">
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col gap-2"><div className="flex justify-between"><span className="text-[10px] font-bold">FOLEY & SOUND DESIGN</span><span className="text-[9px] text-emerald-400">00:01:23.456</span></div><div className="h-8 bg-zinc-900 rounded border border-zinc-800 flex items-center justify-center text-cyan-400">∿∿∿∿∿∿∿∿∿∿</div><button onClick={toggleAudioDSP} className="py-1 rounded font-bold border text-[9px]">{isPlayingAudio?"HALT AUDIO":"RECORD / MIX"}</button></div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col gap-2"><span className="text-[10px] font-bold">AI DIALOGUE & ADAK</span><div className="p-1.5 bg-zinc-900 rounded border border-zinc-800 text-[9px]">Clearance verified, Architect. Awaiting input.</div><div className="flex gap-2"><button onClick={() => addAuditLog("GABBY_ACTION","ADAK_GENERATE","ADAK generation requested")} className="flex-1 py-1 bg-cyan-950 border border-cyan-700 text-cyan-200 font-bold rounded text-[9px]">GENERATE</button><button className="flex-1 py-1 bg-zinc-900 border border-zinc-700 rounded text-[9px]">VOICE CLONE</button></div></div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col gap-2"><div className="flex justify-between text-[10px]"><span className="font-bold">TIMELINE / SEQUENCE</span><span className="text-cyan-400">00:00:45.12</span></div>{["VIDEO","DIALOGUE","FOLEY"].map((t,idx)=><div key={t} className="flex items-center gap-1 text-[8px]"><span className="text-zinc-500 w-10">{t}</span><div className="flex-1 h-2 bg-zinc-900 rounded overflow-hidden"><div className="h-full bg-cyan-500/60" style={{width:`${(idx+1)*28}%`}}/></div></div>)}</div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col gap-1 overflow-hidden"><div className="flex justify-between items-center border-b border-zinc-800 pb-1"><span className="text-[9px] font-bold text-zinc-400">AUDIT FEED (REAL-TIME)</span><span className="text-[8px] text-emerald-400 font-bold">ACTIVE</span></div><div className="flex-1 overflow-y-auto flex flex-col gap-1 text-[8px] font-mono mt-1">{auditLogs.slice(0,5).map((log)=><div key={log.id} className="flex justify-between items-center text-zinc-400"><span className="text-emerald-400 font-bold">✓ {log.action}</span><span className="text-zinc-600">{log.timestamp}</span></div>)}</div></div>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-2 bg-[#060a0f] border-t border-zinc-800/80 shrink-0"><div className="flex gap-2">{(["SCULPT","MODEL","TEXTURE","RIG","ANIMATE","LIGHT","RENDER"] as const).map((t)=><button key={t} onClick={()=>setStudioTool(t)} className={`px-3 py-1 rounded text-[9px] font-bold border ${studioTool===t?"bg-cyan-950 border-cyan-400 text-cyan-300":"bg-zinc-900/80 border-zinc-800 text-zinc-400"}`}>{t}</button>)}</div><div className="text-[9px] text-zinc-500">APEX REAL-TIME CREATION ENGINE ACTIVE</div></div>
            </div>
          )}

          {activeWorkspaceTab === "VAULT" && <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto bg-[#04070a]"><div className="flex justify-between items-center border-b border-zinc-800 pb-3"><div><h2 className="text-base font-bold text-cyan-200">APEX TERMINAL VAULT // GATEKEEPER FEDERATION</h2><p className="text-[10px] text-zinc-500">Dual vault spaces sharing a unified Gatekeeper credentialRef boundary.</p></div></div>{vaultCredentials.map((c)=><div key={c.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex justify-between items-center"><div><div className="flex items-center gap-2"><span className="font-bold text-zinc-200 text-xs">{c.name}</span><span className="px-1.5 py-0.5 bg-zinc-900 text-cyan-400 border border-zinc-700 text-[8px] rounded font-bold">{c.vaultSpace}</span></div><div className="text-[10px] text-zinc-500 mt-1">Ref: <code className="text-cyan-300">{c.credentialRef}</code> | Scopes: {c.scopes.join(", ")}</div></div><span className="px-2 py-0.5 rounded text-[8px] font-bold border">{c.status}</span></div>)}</div>}
          {activeWorkspaceTab === "SKETCHPAD" && <div className="flex-1 p-6 flex flex-col gap-4 bg-[#04070a] overflow-hidden"><h2 className="text-base font-bold text-cyan-200 border-b border-zinc-800 pb-2">SKETCHPAD // VISUAL COLLABORATION LAYER</h2><div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500">Vector sketch canvas and visual target index active. Integrated with Gabby context.</div></div>}
          {activeWorkspaceTab === "AUDIT" && <div className="flex-1 p-6 flex flex-col gap-3 overflow-y-auto max-w-4xl bg-[#04070a]"><h2 className="text-sm font-bold text-cyan-300 border-b border-zinc-800 pb-2">AUDIT FEED & MERKLE LEDGER</h2>{auditLogs.map((log)=><div key={log.id} className="p-2 bg-zinc-950 border border-zinc-900 rounded flex flex-col"><div className="flex justify-between"><span className="text-zinc-500">[{log.timestamp}]</span><span className="text-cyan-400">{log.type}</span></div><span className="text-zinc-200">{log.action}: {log.message}</span></div>)}</div>}
        </main>

        <aside className="w-80 bg-[#05080c] border-l border-cyan-950/70 flex flex-col p-3 gap-3 shrink-0 overflow-hidden z-20">
          <div className="p-3 bg-gradient-to-b from-[#091420] to-[#05080c] border border-cyan-800/70 rounded-xl flex flex-col gap-2 shrink-0"><div className="flex justify-between items-center"><span className="text-[10px] font-bold text-cyan-300 tracking-wider">CONCIERGE: GABBY</span><span className="w-2 h-2 rounded-full bg-emerald-400"/></div><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full bg-cyan-950 border-2 border-cyan-400/80 flex items-center justify-center text-cyan-300 font-black text-xl">G</div><div className="flex flex-col"><span className="text-[10px] font-bold text-zinc-100">GABBY AI OPERATOR</span><span className="text-[8px] text-amber-400 font-bold">ARCHITECT CONTEXT BOUND</span></div></div></div>
          <div className="flex-1 bg-zinc-950 border border-zinc-800/80 rounded-xl p-2.5 flex flex-col gap-2 overflow-y-auto font-mono text-[10px]">{conversation.map((msg)=><div key={msg.id} className={`p-2 rounded-lg flex flex-col gap-0.5 ${msg.sender === "ARCHITECT" ? "bg-cyan-950/40 border border-cyan-800/60 self-end max-w-[88%]" : "bg-zinc-900/80 border border-zinc-800 self-start max-w-[92%]"}`}><div className="flex justify-between items-center text-[7px]"><span className={msg.sender === "ARCHITECT" ? "text-cyan-400 font-bold" : "text-emerald-400 font-bold"}>{msg.sender}</span><span className="text-zinc-500">{msg.timestamp}</span></div><span className="text-zinc-200 leading-tight">{msg.text}</span>{msg.actionTaken&&<span className="text-[7px] text-cyan-300 font-bold mt-0.5 border-t border-zinc-800/80 pt-0.5">Action: {msg.actionTaken}</span>}</div>)}{isGabbyThinking&&<div className="p-2 bg-zinc-900/80 border border-zinc-800 rounded-lg text-cyan-400 animate-pulse text-[9px]">Gabby is evaluating context...</div>}</div>
          <form onSubmit={handleSendMessage} className="flex gap-1.5 shrink-0"><input type="text" placeholder="Instruct Gabby..." value={chatInput} onChange={(e)=>setChatInput(e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 text-xs outline-none focus:border-cyan-500"/><button type="submit" disabled={isGabbyThinking} className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-600 text-cyan-200 font-bold rounded-lg text-[9px]">SEND</button></form>
          <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col gap-1 shrink-0"><div className="flex justify-between items-center text-[9px]"><span className="font-bold text-zinc-200">PROJECT: GODSPEED</span><span className="text-emerald-400 font-bold">87%</span></div><div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden"><div className="bg-cyan-400 h-full" style={{width:"87%"}}/></div><span className="text-[8px] text-emerald-400 font-bold">STATUS: VERIFIED</span></div>
        </aside>

        {isEcosystemDrawerOpen && <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex justify-end"><div className="w-[780px] h-full bg-[#05080c] border-l border-cyan-950 p-6 flex flex-col gap-4 overflow-y-auto"><div className="flex justify-between items-center border-b border-zinc-800 pb-3"><div><h2 className="text-sm font-black text-amber-400">APEX ARSENAL — CONNECTED. VERIFIED. REVENUE.</h2><span className="text-[9px] text-zinc-500">AACP-1.0 Truth Gate Contract Integrity</span></div><button onClick={()=>setIsEcosystemDrawerOpen(false)} className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded text-[10px]">CLOSE ✕</button></div><div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col gap-3"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500 flex items-center justify-center text-sm font-bold text-indigo-300">{activeContract.icon}</span><div><span className="font-bold text-zinc-200 text-xs block">{activeContract.name.toUpperCase()} CONTRACT</span><span className="text-[9px] text-zinc-500">File: {activeContract.contractFile}</span></div></div><span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-700 rounded text-[9px] font-bold">{activeContract.status}</span></div><div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-900">{activeContract.liveChecks.map((chk)=><div key={chk.name} className="flex justify-between items-center text-[9px] p-1.5 bg-zinc-900/60 rounded"><span className="text-zinc-400">{chk.name}</span><span className="text-emerald-400 font-bold">{chk.status}</span></div>)}</div></div><div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex flex-col"><div className="px-3 py-2 bg-zinc-900/60 border-b border-zinc-800 font-bold text-zinc-300 text-[10px]">ALL REGISTERED PROVIDERS</div><div className="flex-1 overflow-y-auto"><table className="w-full text-left text-[9px]"><thead className="bg-zinc-900/30 text-zinc-500 border-b border-zinc-800"><tr><th className="p-2">Provider</th><th className="p-2">Category</th><th className="p-2">Status</th><th className="p-2">Purpose</th></tr></thead><tbody className="divide-y divide-zinc-900">{ECOSYSTEM_PROVIDERS.map((prov)=><tr key={prov.id} onClick={()=>setSelectedProviderId(prov.id)} className={`cursor-pointer hover:bg-zinc-900/60 ${selectedProviderId===prov.id?"bg-cyan-950/40 text-cyan-200":""}`}><td className="p-2 font-bold">{prov.name}</td><td className="p-2 text-zinc-500">{prov.category}</td><td className="p-2"><span className="text-emerald-400 font-bold">{prov.status}</span></td><td className="p-2 text-zinc-400 truncate max-w-[150px]">{prov.purpose}</td></tr>)}</tbody></table></div></div></div></div>}
      </div>

      <footer className="bg-[#05080c] border-t border-cyan-950/80 px-4 py-2 flex items-center justify-between shrink-0 z-30"><div className="flex gap-2">{(["BUILD","RUN","TEST","VERIFY","DEPLOY","PUBLISH"] as const).map((act)=><button key={act} className="px-3 py-1 bg-zinc-900 hover:bg-cyan-950/60 border border-zinc-800 text-zinc-300 rounded font-bold text-[9px]">{act}</button>)}</div><div className="flex items-center gap-2"><span className="text-cyan-400 font-black tracking-widest text-sm">APEX</span><span className="text-[8px] text-zinc-500">SOVEREIGN PROTOCOL</span></div><div className="flex items-center gap-4 text-[10px]"><span className="text-emerald-400 font-bold">AUTHORITY: ARCHITECT</span><span className="text-cyan-400 font-bold">GABBY ARMED / TWO-WAY ACTIVE</span></div></footer>
    </div>
  );
}

function MasterStudioCanvas({ rig }: { rig: CharacterRig }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotation, setRotation] = useState({ x: 20, y: 35 });
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.015, 0.03, 0.045, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let r = 0.06, g = 0.72, b = 0.83;
    if (rig.selectedMaterial === "Standard Emerald") { r = 0.06; g = 0.72; b = 0.50; }
    if (rig.selectedMaterial === "Obsidian Titanium") { r = 0.39; g = 0.45; b = 0.54; }
    if (rig.selectedMaterial === "Gold Alloy") { r = 0.92; g = 0.70; b = 0.03; }
    if (rig.selectedMaterial === "Raw Wireframe") { r = 0.88; g = 0.91; b = 0.94; }

    const vsSource = `attribute vec3 position; uniform mat4 modelView; uniform mat4 projection; void main(){ gl_Position = projection * modelView * vec4(position,1.0); }`;
    const fsSource = `precision mediump float; uniform vec3 uColor; void main(){ gl_FragColor = vec4(uColor,1.0); }`;
    const compile = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const verts: number[] = [];
    const idxs: number[] = [];
    const segments = 18;
    for (let i=0;i<=segments;i++) { const u=(i/segments)*Math.PI*2; for(let j=0;j<=segments;j++){ const v=(j/segments)*Math.PI*2; const radius=.65,tube=.25; const x=(radius+tube*Math.cos(v))*Math.cos(u); const y=(radius+tube*Math.cos(v))*Math.sin(u); const z=tube*Math.sin(v); verts.push(x,y,z); } }
    for(let i=0;i<segments;i++){ for(let j=0;j<segments;j++){ const first=i*(segments+1)+j; const second=first+segments+1; idxs.push(first,second,first+1); idxs.push(second,second+1,first+1); } }

    const vbo=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,vbo); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STATIC_DRAW);
    const ibo=gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idxs),gl.STATIC_DRAW);
    const posLoc=gl.getAttribLocation(program,"position"); gl.enableVertexAttribArray(posLoc); gl.vertexAttribPointer(posLoc,3,gl.FLOAT,false,0,0);
    const colorLoc=gl.getUniformLocation(program,"uColor"); gl.uniform3f(colorLoc,r,g,b);
    const radX=(rotation.x*Math.PI)/180,radY=(rotation.y*Math.PI)/180; const cosX=Math.cos(radX),sinX=Math.sin(radX),cosY=Math.cos(radY),sinY=Math.sin(radY);
    const modelView=new Float32Array([cosY,sinX*sinY,-cosX*sinY,0,0,cosX,sinX,0,sinY,-sinX*cosY,cosX*cosY,0,0,0,-2.4,1]);
    const aspect=canvas.width/canvas.height,f=1/Math.tan((45*Math.PI/180)/2);
    const projection=new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,-1,-1,0,0,-0.2,0]);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"modelView"),false,modelView);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"projection"),false,projection);
    gl.drawElements(gl.LINES,idxs.length,gl.UNSIGNED_SHORT,0);
  }, [rotation, rig]);

  return (
    <div className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing" onMouseDown={(e)=>{isDraggingRef.current=true;prevMouseRef.current={x:e.clientX,y:e.clientY};}} onMouseMove={(e)=>{if(!isDraggingRef.current)return;const dx=e.clientX-prevMouseRef.current.x,dy=e.clientY-prevMouseRef.current.y;setRotation(prev=>({x:prev.x+dy*.5,y:prev.y+dx*.5}));prevMouseRef.current={x:e.clientX,y:e.clientY};}} onMouseUp={()=>{isDraggingRef.current=false;}}>
      <canvas ref={canvasRef} width={800} height={500} className="w-full h-full max-w-full max-h-full object-contain" />
    </div>
  );
}
