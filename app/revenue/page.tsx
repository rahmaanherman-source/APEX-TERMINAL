'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BadgeCheck, CircleDollarSign, Clock3, Download, RefreshCw, Search, ShieldCheck, Users } from 'lucide-react';
import './revenue.css';

type Overview = {
  configured: boolean;
  status: string;
  lastRun?: { run_date: string; status: string; check_score: number; data_cutoff: string; check_reasons: Array<{key:string;passed:boolean;reason:string}> };
  metrics?: { date:string; revenue:number; orders:number; refunds:number; mrr:number; churn_rate:number; ltv:number };
  error?: string;
};
const money = (v:number|undefined) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v ?? 0);

export default function RevenuePage() {
  const [period,setPeriod] = useState<'MoM'|'YoY'>('MoM');
  const [overview,setOverview] = useState<Overview|null>(null);
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(true);
  const [query,setQuery] = useState('');
  const [tab,setTab] = useState<'overview'|'integrity'|'customers'|'insights'>('overview');
  const [customers,setCustomers] = useState<Array<{id:string;name:string;email:string;lifetime_value:number;order_count:number}>>([]);
  const [role,setRole] = useState<'admin'|'viewer'|'unknown'>('unknown');
  const [running,setRunning] = useState(false);
  const [palette,setPalette] = useState('Neon Rush');
  const [mode,setMode] = useState<'dark'|'light'>('dark');
  const [override,setOverride] = useState<{id:string;title:string}|null>(null);
  const [reason,setReason] = useState('');

  async function load() {
    setLoading(true); setError('');
    try {
      const r = await fetch('/api/revenue/overview',{cache:'no-store'});
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Revenue service unavailable');
      setOverview(data);
      setRole(data.role ?? 'unknown');
    } catch(e) { setError(e instanceof Error ? e.message : 'Revenue service unavailable'); }
    finally { setLoading(false); }
  }
  async function loadCustomers() {
    try {
      const r=await fetch('/api/revenue/customers?query='+encodeURIComponent(query),{cache:'no-store'});
      const data=await r.json(); if(!r.ok) throw new Error(data.error||'Customer data unavailable');
      setCustomers(data.customers||[]);
    } catch(e) { setError(e instanceof Error ? e.message : 'Customer data unavailable'); }
  }
  useEffect(()=>{ void load(); },[]);
  useEffect(()=>{ if(tab==='customers') void loadCustomers(); },[tab,query]);

  const m = overview?.metrics;
  const aov = m?.orders ? (m.revenue / m.orders) : 0;
  const checks = overview?.lastRun?.check_reasons || [];
  const palettes = [
    {name:'Neon Rush',accent:'#00FFB4',bg:'#101417'},
    {name:'Liquid Gold',accent:'#D4AF37',bg:'#0A0B0E'},
    {name:'Electric Violet',accent:'#A78BFA',bg:'#11101A'},
    {name:'Arctic Blue',accent:'#55C7FF',bg:'#0B1420'},
    {name:'Solar Ember',accent:'#FF8A3D',bg:'#19110E'},
    {name:'Rose Quartz',accent:'#FF78AC',bg:'#1B1017'},
  ];
  const selected=palettes.find(p=>p.name===palette)||palettes[0];
  const filtered=useMemo(()=>customers.filter(c=>(c.name+' '+c.email).toLowerCase().includes(query.toLowerCase())),[customers,query]);
  async function rerun() {
    setRunning(true);
    try { const r=await fetch('/api/revenue/sync',{method:'POST'}); const d=await r.json(); if(!r.ok) throw new Error(d.error||'Sync failed'); await load(); }
    catch(e) { setError(e instanceof Error?e.message:'Sync failed'); }
    finally { setRunning(false); }
  }
  async function submitOverride() {
    if(!override || reason.trim().length<8) return;
    try {
      const r=await fetch('/api/revenue/insights/'+encodeURIComponent(override.id)+'/override',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({reason:reason.trim()})});
      const d=await r.json(); if(!r.ok) throw new Error(d.error||'Override failed');
      setOverride(null); setReason(''); await load();
    } catch(e) { setError(e instanceof Error?e.message:'Override failed'); }
  }

  return <main className="revenue-root" data-mode={mode} style={{'--rev-accent':selected.accent,'--rev-bg':mode==='light'?'#F5F7F8':selected.bg} as React.CSSProperties}>
    <header className="rev-head">
      <div><div className="rev-eyebrow">APEX 365 / CONTROL ROOM</div><h1>Revenue <span>Intelligence</span></h1><p>Shopify read-only analytics · Daily audited snapshots</p></div>
      <div className="rev-actions">
        <button className="rev-quiet" onClick={()=>setMode(mode==='dark'?'light':'dark')}>{mode==='dark'?'Light mode':'Dark mode'}</button>
        <select aria-label="Color palette" value={palette} onChange={e=>setPalette(e.target.value)}>{palettes.map(p=><option key={p.name}>{p.name}</option>)}</select>
        <button className="rev-primary" onClick={()=>void load()}><RefreshCw size={16}/> Refresh</button>
      </div>
    </header>
    <nav className="rev-tabs" aria-label="Revenue sections">
      {([['overview','Overview'],['integrity','Data Integrity'],['customers','Customers'],['insights','Insight Solver']] as const).map(([id,label])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}>{label}</button>)}
    </nav>
    {error&&<div className="rev-alert"><AlertTriangle size={17}/><span>{error}</span></div>}
    {loading&&<p className="rev-muted">Loading verified revenue data…</p>}
    {!loading&&!overview?.configured&&<section className="rev-empty"><AlertTriangle size={26}/><h2>Revenue data is not connected</h2><p>No demo numbers are shown. Configure Shopify Admin read-only access, Postgres, and the existing Apex Hub authentication adapter to load live data.</p><p className="rev-muted">State: BLOCKED / CONFIGURATION REQUIRED</p></section>}
    {overview?.configured&&tab==='overview'&&<section>
      <div className="rev-toolbar"><span>Daily snapshot · {m?.date||'No snapshot'}</span><div className="rev-toggle"><button className={period==='MoM'?'selected':''} onClick={()=>setPeriod('MoM')}>MoM</button><button className={period==='YoY'?'selected':''} onClick={()=>setPeriod('YoY')}>YoY</button></div></div>
      <div className="rev-grid">
        {[
          {label:'Net Revenue',value:money(m?.revenue),icon:CircleDollarSign,sub:'Gross orders less refunds'},
          {label:'Orders',value:String(m?.orders??0),icon:Activity,sub:'Unique order IDs'},
          {label:'Average Order Value',value:money(aov),icon:ArrowUpRight,sub:'Net revenue ÷ orders'},
          {label:'Monthly Recurring Revenue',value:money(m?.mrr),icon:ArrowUpRight,sub:'Requires subscription classification'},
          {label:'Churn',value:((m?.churn_rate??0)*100).toFixed(1)+'%',icon:ArrowDownRight,sub:'Requires recurring cohort data'},
          {label:'Customer LTV',value:money(m?.ltv),icon:Users,sub:'Average observed customer net value'},
        ].map(k=><article className="rev-card" key={k.label}><div className="rev-card-label">{k.label}<k.icon size={18}/></div><strong>{k.value}</strong><small>{k.sub}</small></article>)}
      </div>
      <p className="rev-muted">Period comparison: {period}. Comparative deltas are not displayed until matching prior-period snapshots are available.</p>
    </section>}
    {overview?.configured&&tab==='integrity'&&<section className="rev-panel"><div className="rev-panel-head"><div><h2><ShieldCheck size={20}/> Data Integrity Inspector</h2><p>Cutoff and reconciliation evidence for the last run</p></div><button className="rev-primary" disabled={role!=='admin'||running} onClick={()=>void rerun()}><RefreshCw size={16}/>{running?'Running…':'Re-run snapshot'}</button></div>
      <div className="rev-integrity"><div><small>Last run</small><strong>{overview.lastRun?.status||'NO RUN'}</strong></div><div><small>Check score</small><strong>{overview.lastRun?.check_score==null?'—':(overview.lastRun.check_score*100).toFixed(0)+'%'}</strong></div><div><small>Data cutoff</small><strong>{overview.lastRun?.data_cutoff?new Date(overview.lastRun.data_cutoff).toLocaleString():'—'}</strong></div></div>
      {(overview.lastRun?.check_score??0)<0.9&&<div className="rev-alert"><AlertTriangle size={17}/>Manual review required</div>}
      {checks.map(c=><div className="rev-check" key={c.key}><span className={c.passed?'rev-pass':'rev-fail'}>{c.passed?'PASS':'FAIL'}</span><div><strong>{c.key.replaceAll('_',' ')}</strong><p>{c.reason}</p></div></div>)}
    </section>}
    {overview?.configured&&tab==='customers'&&<section className="rev-panel"><div className="rev-panel-head"><div><h2><Users size={20}/> Customers</h2><p>Search by customer name or email</p></div><label className="rev-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search customers"/></label></div>
      <div className="rev-table-wrap"><table><thead><tr><th>Customer</th><th>Email</th><th>Lifetime value</th><th>Orders</th></tr></thead><tbody>{filtered.map(c=><tr key={c.id}><td>{c.name||'—'}</td><td>{c.email||'—'}</td><td>{money(c.lifetime_value)}</td><td>{c.order_count}</td></tr>)}</tbody></table></div>
    </section>}
    {overview?.configured&&tab==='insights'&&<section className="rev-panel"><div className="rev-panel-head"><div><h2><BadgeCheck size={20}/> Insight Solver Canvas</h2><p>Evidence-backed trends only. No generated insight is treated as verified without checks.</p></div></div>
      <div className="rev-empty"><Activity size={24}/><h3>No verified insights yet</h3><p>Insights will appear after trend detection has been connected to the snapshot history and each result has a recorded rationale and check score.</p></div>
    </section>}
    <footer className="rev-footer"><span><Clock3 size={14}/> Nightly target: 03:00 America/Chicago</span><span>Read-only source · Audit evidence required</span></footer>
    {override&&<div className="rev-modal-backdrop" role="presentation"><section className="rev-modal" role="dialog" aria-modal="true" aria-labelledby="override-title"><h2 id="override-title">Override insight</h2><p>{override.title}</p><label>Required reason<textarea value={reason} onChange={e=>setReason(e.target.value)} minLength={8} placeholder="Explain why this insight should be overridden."/></label><div className="rev-actions"><button className="rev-quiet" onClick={()=>{setOverride(null);setReason('')}}>Cancel</button><button className="rev-primary" disabled={reason.trim().length<8} onClick={()=>void submitOverride()}>Save audited override</button></div></section></div>}
  </main>;
}
