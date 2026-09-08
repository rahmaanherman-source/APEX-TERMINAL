'use client';

import { useMemo, useState } from 'react';
import { Activity, CheckCircle2, Eye, EyeOff, Hand, Lock, ShieldAlert, Sparkles, Zap } from 'lucide-react';
import { toGabbyOrbViewModel } from './lib/gabby-state-adapter';
import type { GodspeedRuntimeState, OrbMode } from './lib/gabby-types';

const modeMeta: Record<OrbMode, { label: string; color: string; description: string }> = {
  focus: { label: 'FOCUS', color: '#28A9FF', description: 'Planning and analysis' },
  learn: { label: 'LEARN', color: '#714CFF', description: 'Research and ingestion' },
  create: { label: 'CREATE', color: '#EE3CBD', description: 'Design and construction' },
  execute: { label: 'EXECUTE', color: '#FFB320', description: 'Approved work in progress' },
  protect: { label: 'PROTECT', color: '#FF3B4D', description: 'Verified risk or policy hold' },
  success: { label: 'SUCCESS', color: '#35D07F', description: 'Verified completion' },
  rest: { label: 'REST', color: '#3E4DCC', description: 'Idle and background monitoring' },
};

const contextExamples = [
  ['Research', 'source → key fact → image → conclusion'],
  ['Commerce', 'product → price → Shopify → import state'],
  ['Engineering', 'requirement → code → test → verification'],
  ['Golden World', 'character → quest → item → world state'],
  ['Background', 'job → progress → event → result'],
];

export default function GabbyPage() {
  const [runtime, setRuntime] = useState<GodspeedRuntimeState>({ currentActivity: 'idle', riskScore: 0, confidenceScore: 98, activeActionId: null, verificationState: 'not_required', policyHoldActive: false });
  const [fieldVisible, setFieldVisible] = useState(true);
  const [motion, setMotion] = useState<'full' | 'none'>('full');
  const [fieldDensity, setFieldDensity] = useState<'minimal' | 'standard' | 'immersive'>('standard');
  const [voiceTone, setVoiceTone] = useState<'direct' | 'warm' | 'technical'>('direct');
  const [selectedContext, setSelectedContext] = useState(0);
  const view = useMemo(() => toGabbyOrbViewModel(runtime), [runtime]);
  const meta = modeMeta[view.mode];

  const simulate = (next: Partial<GodspeedRuntimeState>) => setRuntime((prev) => ({ ...prev, ...next }));

  const selectMode = (mode: OrbMode) => {
    const next: Partial<GodspeedRuntimeState> = {
      currentActivity: mode === 'rest' ? 'idle' : mode === 'learn' ? 'listening' : mode === 'execute' ? 'executing' : mode === 'success' ? 'verified' : mode === 'protect' ? 'blocked' : 'processing',
      activeActionId: mode === 'execute' ? 'ACT-DEMO-01' : null,
      verificationState: mode === 'success' ? 'verified' : mode === 'execute' ? 'pending' : 'not_required',
      riskScore: mode === 'protect' ? 90 : 0,
      policyHoldActive: mode === 'protect',
    };
    simulate(next);
  };

  return <main className="min-h-screen bg-[#03060c] text-slate-200 font-mono p-4 md:p-6">
    <div className="mx-auto max-w-[1500px] space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-950/70 pb-4">
        <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/50 bg-cyan-950/40 text-cyan-300 text-xl">G</div><div><h1 className="text-sm font-black tracking-widest text-white">GABBY ORB INTELLIGENCE WORKSPACE</h1><p className="text-[10px] text-slate-500">APEX-TERMINAL · canonical state-driven presentation layer</p></div></div>
        <div className="flex items-center gap-2 text-[9px]"><span className="rounded-full border border-emerald-500/40 bg-emerald-950/30 px-3 py-1 text-emerald-300">GODSPEED STATE SOURCE</span><span className="rounded-full border border-cyan-500/30 bg-cyan-950/20 px-3 py-1 text-cyan-300">NO FAKE GREEN</span></div>
      </header>

      <section className="grid min-h-[760px] grid-cols-1 gap-4 xl:grid-cols-[310px_minmax(0,1fr)_320px]">
        <aside className="rounded-2xl border border-cyan-950/70 bg-[#060912] p-4 space-y-4">
          <div><div className="mb-2 flex items-center gap-2 text-[10px] font-bold text-slate-400"><Activity size={14} className="text-cyan-400"/> RUNTIME STATE</div><div className="space-y-2">
            {(['idle','processing','listening','executing','verified','blocked'] as const).map((activity) => <button key={activity} onClick={() => simulate(activity === 'executing' ? { currentActivity: activity, activeActionId: 'ACT-DEMO-01', verificationState: 'pending', riskScore: 10, policyHoldActive: false } : activity === 'verified' ? { currentActivity: activity, activeActionId: 'ACT-DEMO-01', verificationState: 'verified', riskScore: 0, policyHoldActive: false } : activity === 'blocked' ? { currentActivity: activity, activeActionId: null, verificationState: 'failed', riskScore: 90, policyHoldActive: true } : { currentActivity: activity, activeActionId: null, verificationState: 'not_required', riskScore: 0, policyHoldActive: false })} className={`w-full rounded-lg border px-3 py-2 text-left text-[9px] uppercase ${runtime.currentActivity === activity ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200' : 'border-white/5 bg-black/20 text-slate-500'}`}>{activity.replace('_',' ')}</button>)}
          </div></div>
          <div className="rounded-xl border border-white/5 bg-black/30 p-3 text-[9px] space-y-2"><div className="flex justify-between"><span>MODE</span><b style={{color: meta.color}}>{meta.label}</b></div><div className="flex justify-between"><span>HALO</span><b>{view.halo}</b></div><div className="flex justify-between"><span>RISK</span><b>{view.riskLevel}</b></div><div className="flex justify-between"><span>CONFIDENCE</span><b>{view.confidence}</b></div><div className="flex justify-between"><span>ACTION ID</span><b className="text-amber-300">{view.approvedActionId ?? 'NONE'}</b></div><div className="flex justify-between"><span>VERIFICATION</span><b>{view.verificationState}</b></div></div>
          <div className="border-t border-white/5 pt-3 space-y-2"><div className="text-[9px] font-bold text-slate-500">ACCESSIBILITY</div><label className="flex items-center justify-between text-[9px]"><span>Intelligence field</span><button onClick={() => setFieldVisible(!fieldVisible)} className="text-cyan-300">{fieldVisible ? <Eye size={15}/> : <EyeOff size={15}/>}</button></label><label className="flex items-center justify-between text-[9px]"><span>No-motion</span><input type="checkbox" checked={motion === 'none'} onChange={(e) => setMotion(e.target.checked ? 'none' : 'full')}/></label></div>
        </aside>

        <section className="relative overflow-hidden rounded-2xl border border-cyan-950/70 bg-[#060912] p-4">
          <div className="flex items-center justify-between"><div><div className="text-[10px] font-bold text-white">LIVE ORB PREVIEW</div><div className="text-[9px] text-slate-500">{view.accessibleStatus}</div></div><div className="text-[9px] text-slate-500">INTENSITY {view.intensity}% · MOTION {motion.toUpperCase()}</div></div>
          <div className="relative flex min-h-[540px] items-center justify-center overflow-hidden">
            <div className="absolute h-[360px] w-[360px] rounded-full blur-3xl" style={{background: `${meta.color}18`}}/>
            {fieldVisible && view.mode !== 'rest' && <div className={`absolute inset-10 flex items-center justify-center ${fieldDensity === 'immersive' ? 'scale-110' : fieldDensity === 'minimal' ? 'scale-75 opacity-60' : ''}`}><div className="h-[320px] w-[320px] rounded-full border border-dashed opacity-30" style={{borderColor: meta.color}}/><div className="absolute h-[250px] w-[250px] rotate-45 border opacity-25" style={{borderColor: meta.color}}/><div className="absolute grid h-[180px] w-[180px] place-items-center rounded-full border border-white/10 text-[9px] text-slate-500 text-center p-4"><span className={motion === 'full' ? 'animate-pulse' : ''}>{contextExamples[selectedContext][1]}</span></div></div>}
            {view.halo !== 'none' && <div className={`absolute rounded-full border ${view.halo === 'protective' ? 'h-[330px] w-[330px]' : view.halo === 'double' ? 'h-[300px] w-[300px]' : 'h-[270px] w-[270px]'}`} style={{borderColor: meta.color, boxShadow: `0 0 40px ${meta.color}44`}}/>}
            <div className="relative grid h-[210px] w-[210px] place-items-center rounded-full border border-white/20" style={{background: `radial-gradient(circle at 35% 30%, ${meta.color}, #07111d 68%, #02040a)`, boxShadow: `0 0 80px ${meta.color}55`}}>
              <div className="absolute inset-6 rounded-full border opacity-30" style={{borderColor: meta.color}}/>
              <div className="text-center"><div className="text-4xl font-black text-white drop-shadow-lg">G</div><div className="mt-1 text-[8px] tracking-[.35em]" style={{color: meta.color}}>{meta.label}</div></div>
              {view.mode === 'execute' && <Zap className="absolute -right-2 top-1/3" style={{color: meta.color}}/>}
              {view.mode === 'protect' && <ShieldAlert className="absolute -right-2 top-1/3 text-red-300"/>}
              {view.mode === 'success' && <CheckCircle2 className="absolute -right-2 top-1/3 text-emerald-300"/>}
            </div>
            {view.mode !== 'rest' && <button onClick={() => setSelectedContext((selectedContext + 1) % contextExamples.length)} className="absolute bottom-8 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-[9px] text-slate-400 hover:text-white">FIELD: {contextExamples[selectedContext][0]} · cycle preview</button>}
          </div>
          <div role="status" aria-live="polite" className="rounded-xl border border-cyan-950/70 bg-black/50 p-3 text-center text-[9px] text-slate-300">{view.accessibleStatus}</div>
        </section>

        <aside className="rounded-2xl border border-cyan-950/70 bg-[#060912] p-4 space-y-4">
          <div><div className="mb-3 text-[10px] font-bold text-slate-400">MODE PALETTE</div><div className="grid grid-cols-2 gap-2">{(Object.keys(modeMeta) as OrbMode[]).map((mode) => <button key={mode} onClick={() => selectMode(mode)} className="rounded-lg border border-white/5 bg-black/20 p-2 text-left"><div className="h-2 w-2 rounded-full" style={{background: modeMeta[mode].color}}/><div className="mt-1 text-[9px] font-bold">{modeMeta[mode].label}</div><div className="text-[7px] text-slate-600">{modeMeta[mode].description}</div></button>)}</div></div>
          <div className="border-t border-white/5 pt-4"><div className="mb-2 text-[10px] font-bold text-slate-400">CUSTOMER PROFILE</div><label className="mb-2 block text-[9px] text-slate-500">Field density<select value={fieldDensity} onChange={(e) => setFieldDensity(e.target.value as typeof fieldDensity)} className="mt-1 w-full rounded border border-white/10 bg-black/40 p-2 text-slate-300"><option value="minimal">Minimal</option><option value="standard">Standard</option><option value="immersive">Immersive</option></select></label><label className="block text-[9px] text-slate-500">Voice tone<select value={voiceTone} onChange={(e) => setVoiceTone(e.target.value as typeof voiceTone)} className="mt-1 w-full rounded border border-white/10 bg-black/40 p-2 text-slate-300"><option value="direct">Direct</option><option value="warm">Warm</option><option value="technical">Technical</option></select></label></div>
          <div className="border-t border-white/5 pt-4 text-[9px] text-slate-500"><div className="flex items-center gap-2 text-emerald-300"><Lock size={13}/> GOVERNANCE LOCKED</div><p className="mt-2">Customers can customize presentation preferences. They cannot rename modes, redefine truth states, bypass approval, or turn a decorative hand into an autonomous action.</p></div>
          <div className="border-t border-white/5 pt-4"><div className="mb-2 text-[10px] font-bold text-slate-400">FUNCTIONAL EMBODIMENT</div><div className="rounded-lg border border-white/5 bg-black/20 p-3 text-[8px] text-slate-500"><Hand size={16} className="mb-2 text-slate-600"/>Decorative hands are disabled. A hand may appear only when a real target/action is supplied: grab, point, pull-preview, timeline, workflow, approval, background task, or Golden World interaction.</div></div>
          <div className="border-t border-white/5 pt-4"><div className="mb-2 text-[10px] font-bold text-slate-400">VOICE PROFILE</div><p className="text-[8px] text-slate-500">Current: {voiceTone}. Voice is a presentation preference and cannot change governance semantics.</p></div>
        </aside>
      </section>
    </div>
  </main>;
}
