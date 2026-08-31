'use client';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function GabbyLauncher() {
  return <Link href="/gabby" aria-label="Open Gabby Orb Intelligence" className="fixed left-2 top-1/2 z-50 -translate-y-1/2 rounded-r-xl border border-cyan-400/40 bg-[#06111a]/95 px-2 py-3 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,.12)] backdrop-blur hover:bg-cyan-950/80">
    <span className="flex flex-col items-center gap-1"><Sparkles size={16}/><span className="text-[8px] font-black tracking-widest [writing-mode:vertical-rl]">GABBY</span></span>
  </Link>;
}
