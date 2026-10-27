'use client';

import { useState } from 'react';
import {
  Activity, Box, Brain, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleDot, Eye, GitBranch, Image as ImageIcon, Layers, Lightbulb,
  Maximize2, Menu, Mic, Move3d, Play, Plus, Radio, Scissors, Search,
  Settings, ShieldCheck, SlidersHorizontal, Sparkles, Sun, Wand2, X
} from 'lucide-react';
import './character-studio.css';

const tools = [Move3d, Scissors, Wand2, Box, Maximize2, SlidersHorizontal, GitBranch, Sun, Eye];
const tabs = ['CREATE', 'CHARACTERS', 'WORLDS', 'ANIMATION', 'RENDER'];

export default function CharacterStudioPage() {
  const [activeTab, setActiveTab] = useState('CHARACTERS');
  const [gabbyOpen, setGabbyOpen] = useState(true);
  const [leftOpen, setLeftOpen] = useState(true);
  const [prompt, setPrompt] = useState('Create a Golden World character with a grounded heroic silhouette, detailed clothing, expressive face, and game-ready proportions.');
  const [status, setStatus] = useState('READY');
  const [generated, setGenerated] = useState(false);

  const runGenerate = () => {
    setStatus('GENERATING');
    setTimeout(() => { setGenerated(true); setStatus('GENERATED'); }, 650);
  };

  return (
    <main className="apexStudio">
      <header className="topbar">
        <button className="iconBtn" aria-label="Open workspace menu"><Menu size={20}/></button>
        <div className="brandMark">▲</div>
        <div className="brand"><b>APEX TERMINAL</b><span>REAL-TIME ENGINE</span></div>
        <div className="command"><Search size={17}/><span>GABBY, WHAT ARE WE BUILDING?</span><Mic size={15}/></div>
        <div className="truth"><CircleDot size={12}/> VERIFIED</div>
        <span className="clock">9:41 PM</span>
        <div className="owner">GODSPEED <small>OWNER</small></div>
        <ChevronDown size={18}/>
      </header>

      <section className="shell">
        <aside className={leftOpen ? 'leftRail' : 'leftRail collapsed'}>
          <button className="railToggle" onClick={() => setLeftOpen(!leftOpen)} aria-label="Collapse navigation">{leftOpen ? <ChevronLeft/> : <ChevronRight/>}</button>
          {leftOpen && <>
            <div className="railTitle">WORKSPACE</div>
            {['DASHBOARD','PROJECTS','TOOLS','ENGINES','CONNECTIONS','MARKETPLACE','AUDIT LOG','MEMORY SLABS','SETTINGS'].map((x,i)=><button key={x} className={x==='TOOLS'?'nav active':'nav'}><Layers size={16}/>{x}</button>)}
          </>}
        </aside>

        <section className="studio">
          <div className="studioHead"><div><b>3D CREATION STUDIO</b><span>NANITE &nbsp; LUMEN &nbsp; 60FPS</span></div><div className="project">PROJECT: GODSPEED <em><CircleDot size={10}/> VERIFIED</em></div></div>
          <nav className="tabs">{tabs.map(t=><button key={t} onClick={()=>setActiveTab(t)} className={activeTab===t?'tab on':'tab'}>{t}</button>)}</nav>

          <div className="workarea">
            <div className="toolrail">{tools.map((T,i)=><button key={i} className={i===0?'tool on':'tool'} title={`Tool ${i+1}`}><T size={17}/></button>)}</div>
            <div className="characterCanvas">
              <div className="canvasLabel">CHARACTER: <b>MAC_ELHERMAN</b> <span>// {status}</span></div>
              <div className="heroPreview">
                <div className="heroGlow"/>
                <div className="heroSilhouette" aria-label="Character preview"><div className="head"/><div className="torso"/><div className="arm a"/><div className="arm b"/><div className="leg a"/><div className="leg b"/></div>
                <div className="previewMeta"><b>4K</b><span>PHOTOREAL</span><span>ROT: 0°</span><span>ACES / LINEAR</span><span>D65</span></div>
                {generated && <div className="generatedBadge"><Check size={14}/> GENERATION READY</div>}
              </div>
            </div>
            <div className="turnaround">
              <div className="sectionTitle">ORTHOGRAPHIC <b>52 ARKit</b><br/>TURNAROUND <b>BLENDSHAPES</b></div>
              <div className="views">{['FRONT','3/4 PROFILE','BACK'].map(v=><div className="view" key={v}><strong>{v}</strong><div className="miniFigure">●<span>│</span><i>╱ ╲</i></div><small>100% RIGGED</small></div>)}</div>
              <div className="shader"><b>PBR SHADER</b><strong>LUMEN READY</strong><div className="swatches"><i/><i/><i/><i/><i/></div></div>
            </div>
          </div>

          <div className="lowerGrid">
            <div className="module"><h3>FOLEY & SOUND DESIGN</h3><div className="wave">∿∿∿∿∿∿∿∿∿∿∿</div><p>FOOTSTEPS_CONCRETE&nbsp;&nbsp; 0:03</p><p>CLOTH_RUSTLE&nbsp;&nbsp; 0:02</p><p>METAL_CLINK&nbsp;&nbsp; 0:01</p><div className="actions"><button><Radio/> RECORD</button><button><Scissors/> EDIT</button><button><SlidersHorizontal/> MIX</button></div></div>
            <div className="module dialogue"><h3>AI DIALOGUE & ADAK</h3><div className="dialogCard"><div className="avatarMini">G</div><span>What&apos;s the mission today, boss?</span></div><div className="wave">∿∿∿∿∿∿∿∿∿</div><button className="primary" onClick={runGenerate}><Sparkles/> GENERATE</button><button>VOICE RESYNC</button><button>ADAK FLOW</button></div>
            <div className="module timeline"><h3>TIMELINE / SEQUENCE</h3>{['VIDEO','DIALOGUE','FOLEY','MUSIC','SFX'].map((x,i)=><div className="track" key={x}><b>{x}</b><span style={{width:`${45+i*9}%`}}/></div>)}</div>
            <div className="module audit"><h3>AUDIT FEED <em>(REAL-TIME)</em></h3>{['Project Loaded: GODSPEED','Memory Slab Verified','Character Loaded','Animation Applied','Foley Recorded','ADAK Generated','Render Started','Frame Verified','All Systems Go'].map((x,i)=><p key={i}><Check size={13}/>{x}</p>)}<button>CLEAR</button></div>
          </div>
        </section>

        <aside className={gabbyOpen ? 'gabby' : 'gabby closed'}>
          <button className="gabbyClose" onClick={()=>setGabbyOpen(!gabbyOpen)} aria-label={gabbyOpen?'Collapse Gabby':'Open Gabby'}>{gabbyOpen?<X/>:<Sparkles/>}</button>
          {gabbyOpen && <>
            <div className="gabbyTitle">CONCIERGE: GABBY</div>
            <div className="gabbyPortrait"><Brain size={48}/></div>
            <p>All systems online.</p><p>What are we building tonight?</p>
            <div className="gabbyActions"><button>NEW PROJECT</button><button>OPEN PROJECT</button></div>
            <div className="projectCard"><span>PROJECT: GODSPEED</span><b>STATUS: VERIFIED</b><div className="progress"><i/></div><small>87%</small></div>
            <div className="engines"><h3>ENGINES</h3>{[['APEX ENGINE','REAL-TIME',Activity],['APEX RENDER','PHOTOREAL',ImageIcon],['PHYSICS','ADVANCED',Move3d],['AUDIO ENGINE','SPATIAL',Radio],['AI GENERATION','MULTI-MODEL',Sparkles],['WORLD BUILDER','PROCEDURAL',Layers]].map(([a,b,I])=><button key={a as string}><I size={17}/><span>{a as string}<small>{b as string}</small></span></button>)}</div>
            <div className="gabbyPrompt"><label>CREATE WITH GABBY</label><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} /><button className="primary" onClick={runGenerate}><Wand2/> GENERATE CHARACTER</button></div>
          </>}
        </aside>
      </section>

      <footer className="bottomBar"><div className="ops">{['BUILD','RUN','TEST','VERIFY','DEPLOY','PUBLISH'].map(x=><button key={x}><Check size={14}/>{x}</button>)}</div><div className="apexWord">APEX <small>REAL-TIME ENGINE</small></div><div className="footerTruth"><ShieldCheck/> TRUTH: VERIFIED</div><div className="gabbyOnline"><Mic/> GABBY ONLINE</div></footer>
    </main>
  );
}
