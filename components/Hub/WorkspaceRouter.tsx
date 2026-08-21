'use client';

import type { ReactNode } from 'react';
import type { HubDestination } from './hub-types';
import Terminal from '@/components/Terminal/Terminal';

export default function WorkspaceRouter({ destination, children }: { destination: HubDestination; children: ReactNode }) {
  if (destination === 'TERMINAL') return <div className="hub-terminal-workspace"><Terminal /></div>;
  return <>{children}</>;
}
