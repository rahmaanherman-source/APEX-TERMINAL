'use client';

import { useState } from 'react';
import {
  Activity, Box, Brain, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleDot, Eye, GitBranch, Image as ImageIcon, Layers, Lightbulb,
  Maximize2, Menu, Mic, Move3d, Play, Plus, Radio, Scissors, Search,
  Settings, ShieldCheck, SlidersHorizontal, Sparkles, Sun, Wand2, X
} from 'lucide-react';

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
      <style>{css}</style>
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

const css = `
*{box-sizing:border-box}.apexStudio{height:100vh;min-height:760px;background:#05080d;color:#e8edf5;font-family:Inter,ui-sans-serif,system-ui,sans-serif;overflow:hidden}.topbar{height:68px;border-bottom:1px solid #17344a;display:flex;align-items:center;gap:14px;padding:0 22px;background:#060b12}.iconBtn,.tool,.nav,.tab,.topbar button,.bottomBar button,.module button,.gabby button,.railToggle{background:none;border:0;color:#aab5c4;cursor:pointer}.iconBtn{border:1px solid #20374a;border-radius:10px;padding:9px}.brandMark{color:#27d7ff;font-size:28px}.brand{display:flex;flex-direction:column;letter-spacing:1.5px;font-size:17px}.brand span{font-size:10px;color:#7e8b9b}.command{height:38px;flex:1;max-width:640px;margin-left:45px;border:1px solid #16445e;border-radius:22px;display:flex;align-items:center;gap:10px;padding:0 16px;color:#9ba9ba;font-size:12px}.command svg:last-child{margin-left:auto}.truth{display:flex;align-items:center;gap:7px;border:1px solid #008b66;color:#00e5a0;border-radius:20px;padding:7px 14px;font-size:12px;font-weight:800}.clock{color:#a7b1bd;font-size:13px}.owner{margin-left:auto;font-size:12px;font-weight:800}.owner small{display:block;color:#20c8ff;font-size:9px}.shell{height:calc(100vh - 122px);display:grid;grid-template-columns:auto 1fr 310px}.leftRail{width:175px;border-right:1px solid #152d3d;background:#071019;padding:18px 10px;position:relative}.leftRail.collapsed{width:46px}.railToggle{position:absolute;right:-13px;top:50px;background:#0a121b;border:1px solid #1d6a88;border-radius:8px;padding:4px;z-index:3}.railTitle{font-size:10px;color:#8292a5;margin:5px 8px 14px}.nav{display:flex;align-items:center;gap:11px;width:100%;padding:10px 9px;border-radius:7px;font-size:11px;text-align:left}.nav.active{background:#0a2940;color:#27d7ff}.studio{min-width:0;display:flex;flex-direction:column;background:#050a11}.studioHead{height:68px;border-bottom:1px solid #17344a;padding:10px 18px;display:flex;justify-content:space-between;align-items:center}.studioHead>b,.studioHead div>b{font-size:16px;letter-spacing:1px}.studioHead span{display:block;color:#6f7e90;font-size:9px;margin-top:5px}.project{font-size:11px;color:#cbd4df}.project em{font-style:normal;color:#00e5a0;border:1px solid #087f65;padding:5px 8px;border-radius:12px;margin-left:10px}.tabs{display:flex;height:42px;border-bottom:1px solid #142a39;padding-left:18px}.tab{padding:0 17px;font-size:11px;letter-spacing:.5px}.tab.on{color:#25d5ff;border-bottom:2px solid #25d5ff}.workarea{flex:1;min-height:0;display:grid;grid-template-columns:42px 1fr 300px;padding:12px;gap:10px}.toolrail{border:1px solid #153244;border-radius:8px;display:flex;flex-direction:column;align-items:center;padding:6px}.tool{padding:9px}.tool.on{color:#1bd9ff;background:#08273a;border-radius:7px}.characterCanvas{border:1px solid #1a3447;border-radius:10px;background:radial-gradient(circle at 50% 42%,#102238,#070d15 60%);position:relative;min-height:330px;overflow:hidden}.canvasLabel{position:absolute;left:18px;top:15px;background:#191c28;border:1px solid #6b6688;color:#28d7ff;padding:10px 13px;border-radius:6px;font-size:11px;z-index:2}.canvasLabel span{color:#00e5a0}.heroPreview{height:100%;min-height:330px;display:flex;align-items:center;justify-content:center;position:relative}.heroGlow{position:absolute;width:270px;height:270px;background:radial-gradient(circle,#15577c55,transparent 68%)}.heroSilhouette{width:170px;height:285px;position:relative;filter:drop-shadow(0 0 25px #1bc8ff55)}.heroSilhouette .head{position:absolute;width:82px;height:92px;border-radius:48% 48% 45% 45%;background:linear-gradient(135deg,#694b3b,#161922);left:44px;top:15px}.heroSilhouette .torso{position:absolute;width:120px;height:145px;border-radius:32px 32px 20px 20px;background:linear-gradient(135deg,#27313b,#070a0e);left:25px;top:93px;border:1px solid #44515d}.heroSilhouette .arm{position:absolute;width:32px;height:125px;border-radius:18px;background:#131b23;top:104px}.heroSilhouette .arm.a{left:5px;transform:rotate(12deg)}.heroSilhouette .arm.b{right:5px;transform:rotate(-12deg)}.heroSilhouette .leg{position:absolute;width:42px;height:95px;background:#10161d;border-radius:15px;top:222px}.heroSilhouette .leg.a{left:40px}.heroSilhouette .leg.b{right:40px}.previewMeta{position:absolute;bottom:15px;left:18px;right:18px;display:grid;grid-template-columns:repeat(4,1fr);font-size:10px;color:#a8b4c1;gap:6px}.previewMeta b{color:#fff}.generatedBadge{position:absolute;right:15px;top:15px;color:#00e5a0;border:1px solid #007f61;border-radius:12px;padding:5px 8px;font-size:9px}.turnaround{border:1px solid #1a3447;border-radius:10px;padding:13px;background:#070d15;overflow:auto}.sectionTitle{font-size:11px;line-height:1.5;color:#aeb8c5}.sectionTitle b{color:#1fd7ff}.views{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:12px}.view{border:1px solid #293644;border-radius:7px;text-align:center;padding:8px;background:#0a1018}.view strong{font-size:8px;color:#9ba6b4}.miniFigure{height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#f5c76b;font-size:22px}.miniFigure span{font-size:45px;line-height:.65}.miniFigure i{font-style:normal;font-size:18px}.view small{display:block;color:#00e5a0;font-size:8px}.shader{margin-top:10px;border-top:1px solid #24313f;padding-top:12px;display:flex;gap:8px;align-items:center;font-size:10px}.shader strong{color:#ffbf00}.swatches{display:flex;gap:4px;margin-left:auto}.swatches i{width:16px;height:16px;border-radius:50%;background:linear-gradient(135deg,#eee,#333);border:1px solid #68717c}.swatches i:nth-child(2){background:linear-gradient(135deg,#8d6144,#251a15)}.swatches i:nth-child(3){background:linear-gradient(135deg,#c39a65,#4c3622)}.swatches i:nth-child(4){background:#161b21}.swatches i:nth-child(5){background:#2e3b47}.gabby{border-left:1px solid #17344a;background:#071019;padding:13px;position:relative;overflow:auto}.gabby.closed{width:46px;padding:5px}.gabbyClose{position:absolute;right:8px;top:8px;border:1px solid #1c435a!important;border-radius:7px!important;padding:5px!important}.gabbyTitle{color:#25d5ff;font-size:13px;font-weight:800;letter-spacing:.5px}.gabbyPortrait{height:105px;border:1px solid #16435a;border-radius:9px;margin-top:10px;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,#11324b,#071019)}.gabby p{font-size:10px;color:#a8b4c1;margin:8px 0}.gabbyActions{display:grid;grid-template-columns:1fr 1fr;gap:7px}.gabbyActions button,.gabbyPrompt button,.projectCard{border:1px solid #195172!important;border-radius:6px!important;padding:9px!important;font-size:9px}.projectCard{margin-top:10px;display:block}.projectCard span{font-size:10px}.projectCard b{display:block;color:#00e5a0;font-size:9px;margin-top:7px}.progress{height:4px;background:#172a36;border-radius:4px;margin-top:8px}.progress i{display:block;width:87%;height:100%;background:#16cfff}.projectCard small{display:block;text-align:right;color:#8f9ba9;margin-top:3px}.engines{margin-top:12px}.engines h3,.module h3{font-size:10px;color:#b7c1cd;letter-spacing:.8px;margin:0 0 8px}.engines{display:grid;grid-template-columns:1fr 1fr;gap:6px}.engines h3{grid-column:1/-1}.engines button{border:1px solid #1b3546!important;border-radius:6px!important;padding:9px!important;display:flex;gap:7px;align-items:center;text-align:left}.engines span{font-size:8px}.engines small{display:block;color:#6f8190;font-size:7px;margin-top:3px}.gabbyPrompt{margin-top:12px;border-top:1px solid #1b3546;padding-top:10px}.gabbyPrompt label{font-size:9px;color:#7f91a3}.gabbyPrompt textarea{width:100%;height:85px;margin:7px 0;background:#0a1018;border:1px solid #1d3b4e;color:#dbe5ef;border-radius:6px;padding:8px;font-size:9px;resize:vertical}.primary{background:#063c53!important;color:#2ad8ff!important;border-color:#1dbde5!important}.lowerGrid{height:190px;display:grid;grid-template-columns:1.1fr 1.1fr 1.3fr 1fr;gap:8px;padding:0 12px 10px}.module{border:1px solid #173447;border-radius:8px;background:#071019;padding:10px;min-width:0;overflow:hidden}.wave{color:#5b80ff;letter-spacing:1px;font-size:20px;white-space:nowrap;overflow:hidden}.module p{font-size:8px;color:#8794a2;margin:4px 0}.actions{display:flex;gap:4px;margin-top:7px}.actions button{font-size:7px;border:1px solid #254054;padding:5px;border-radius:5px;display:flex;align-items:center;gap:3px}.dialogCard{border:1px solid #173b52;border-radius:6px;padding:7px;display:flex;gap:7px;font-size:8px;color:#b4c0cb}.avatarMini{width:22px;height:22px;border-radius:50%;background:#163c54;display:flex;align-items:center;justify-content:center;color:#2ad8ff}.dialogue button{font-size:7px;border:1px solid #254054;padding:6px;border-radius:5px;margin-right:3px}.track{display:flex;align-items:center;gap:7px;margin:10px 0}.track b{width:50px;font-size:7px;color:#81909e}.track span{height:10px;background:#115d85;border-radius:3px;display:block}.track:nth-child(3) span{background:#187b58}.track:nth-child(4) span{background:#7549ad}.audit p{display:flex;align-items:center;gap:5px;color:#a8b6c4}.audit p svg{color:#00e5a0}.audit em{color:#00e5a0;font-style:normal}.audit>button{float:right;font-size:7px}.bottomBar{height:54px;border-top:1px solid #17344a;background:#060b12;display:flex;align-items:center;padding:0 20px;gap:12px}.ops{display:flex;gap:3px}.ops button{display:flex;align-items:center;gap:5px;font-size:9px;padding:7px}.apexWord{font-size:25px;color:#32d7ff;font-weight:900;letter-spacing:4px;margin:auto}.apexWord small{display:block;font-size:6px;letter-spacing:1px;text-align:center}.footerTruth,.gabbyOnline{display:flex;align-items:center;gap:5px;color:#00e5a0;font-size:9px}.gabbyOnline{color:#25d5ff}@media(max-width:1000px){.shell{grid-template-columns:46px 1fr}.gabby{position:absolute;right:0;top:68px;bottom:54px;width:310px;z-index:10}.leftRail{width:46px}.leftRail:not(.collapsed){width:160px}.workarea{grid-template-columns:38px 1fr}.turnaround{display:none}.lowerGrid{grid-template-columns:1fr 1fr;height:210px;overflow:auto}}@media(max-width:700px){.brand,.clock,.owner{display:none}.command{margin-left:0}.truth{margin-left:auto}.studioHead .project{display:none}.workarea{grid-template-columns:1fr}.toolrail{position:absolute;z-index:4;left:52px;top:118px;display:flex;flex-direction:row}.lowerGrid{grid-template-columns:1fr;height:230px}.ops button{font-size:0}.apexWord{font-size:18px}.footerTruth{display:none}}
`;
