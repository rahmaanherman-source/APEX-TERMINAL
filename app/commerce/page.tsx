'use client';

import { useState } from 'react';
import './commerce.css';

const steps = [
  ['01','VALIDATE','Choose a problem-solving product and document audience, pain points, angles, demand signals, cost of goods, and recurring-purchase potential.'],
  ['02','OFFER','State plainly what the customer gets, who it is for, when it starts, and the applicable terms.'],
  ['03','CREATIVE','Turn the approved offer into short-form ads and organic content. Creative is a delivery layer, not proof of demand.'],
  ['04','LAND','Send traffic to one focused offer page with one primary purchase action.'],
  ['05','MEASURE','Track visits, clicks, purchases, refunds, and feedback. Do not call a product a winner from likes or views alone.'],
];
const criteria = [
  'Solves a clear problem',
  'Can be explained from multiple useful angles',
  'Has an understandable emotional/customer benefit',
  'Can support year-round or repeat demand when evidence supports it',
  'Has workable economics after product, fulfillment, fees, refunds, and acquisition costs',
  'Has enough trustworthy source data to build the listing without inventing facts',
];

export default function CommerceLaunchPage() {
  const [copied, setCopied] = useState(false);
  const donationUrl = process.env.NEXT_PUBLIC_DONATION_URL || '';
  async function copyBrief() {
    const brief = ['APEX Commerce Launch','Validate the product before scaling.','','Criteria:',...criteria.map(x => '- '+x),'','Workflow: VALIDATE -> OFFER -> CREATIVE -> LAND -> MEASURE'].join('\n');
    await navigator.clipboard?.writeText(brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <main className="commerce">
      <header className="nav"><a href="/" className="logo">APEX <span>TERMINAL</span></a><div className="navLinks"><a href="#workflow">Workflow</a><a href="#criteria">Criteria</a><a href="#offer">Offer</a>{donationUrl?<a className="donate" href={donationUrl} target="_blank" rel="noreferrer">Donate</a>:<span className="donate muted">Donate</span>}</div></header>
      <section className="hero"><div className="eyebrow">APEX COMMERCE LAUNCH</div><h1>Validate the offer.<br/><em>Then scale the signal.</em></h1><p className="lead">A focused launch surface for turning product research into a clear offer, creative brief, landing page, and measurable customer test.</p><div className="heroActions"><a href="#offer" className="primary">BUILD THE OFFER</a><button onClick={copyBrief} className="secondary">{copied?'COPIED':'COPY LAUNCH BRIEF'}</button></div><div className="truth"><span/> EVIDENCE-FIRST · NO FAKE GREEN</div></section>
      <section id="workflow" className="section"><div className="sectionHead"><span>THE LOOP</span><h2>From product signal to live offer.</h2></div><div className="steps">{steps.map(([n,t,b])=><article key={n} className="step"><b>{n}</b><h3>{t}</h3><p>{b}</p></article>)}</div></section>
      <section id="criteria" className="section split"><div><span className="kicker">PRODUCT SCREEN</span><h2>What gets through the gate.</h2><p>Use documented evidence where available. A social signal can inform research, but it is not by itself proof of sales, margin, or product-market fit.</p></div><div className="criteria">{criteria.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span>{x}</div>)}</div></section>
      <section id="offer" className="offer"><div className="offerInner"><span className="kicker">ONE-PAGE OFFER</span><h2>Make the customer decision simple.</h2><div className="offerGrid"><div><label>WHAT IT IS</label><p>A product or service selected from the validated research process.</p></div><div><label>WHO IT'S FOR</label><p>The audience whose problem, use case, and buying context are supported by evidence.</p></div><div><label>WHAT THEY GET</label><p>A precise description of the deliverable, product, quantity, timing, and applicable terms.</p></div><div><label>WHEN IT STARTS</label><p>State the real fulfillment date or delivery window. Never promise a date that has not been confirmed.</p></div></div><div className="offerFooter"><span>APEX · REAL WORK, REAL SIGNAL</span>{donationUrl?<a href={donationUrl} target="_blank" rel="noreferrer" className="donateLarge">SUPPORT / DONATE ↗</a>:<span className="donateLarge disabled">SUPPORT / DONATE</span>}</div></div></section>
    </main>
  );
}
