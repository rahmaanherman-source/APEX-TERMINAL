import type { ConnectedApp } from './hub-types';

const providers = [
  ['vercel','Vercel','deployment','DEPLOY'], ['figma','Figma','design','DESIGN'],
  ['canva','Canva','design','DESIGN'], ['openai','OpenAI','ai','AI'], ['codex','Codex','agent','ENGINE'],
  ['replit','Replit','builder','BUILD'], ['hugging-face','Hugging Face','ai','MODELS'], ['lovable','Lovable','builder','BUILD'],
  ['jotform','Jotform','forms','FORMS'], ['linear','Linear','work','WORK'], ['notion','Notion','work','WORK'],
  ['ramp','Ramp','finance','FINANCE'], ['posthog','PostHog','analytics','ANALYTICS'], ['supabase','Supabase','database','DATA'],
  ['descript','Descript','media','MEDIA'], ['sharepoint','SharePoint','work','WORK'], ['outlook','Outlook Calendar','work','CALENDAR'],
];

export const connectedApps: ConnectedApp[] = providers.map(([id, name, category, capabilitySummary]) => ({
  id, name, category, capabilitySummary,
  iconKey: id,
  status: 'UNKNOWN',
  workspaceRoute: 'CONNECTIONS',
}));

export const hubModules = [
  { id: 'dashboard', label: 'DASHBOARD', destination: 'DASHBOARD' as const },
  { id: 'projects', label: 'PROJECTS', destination: 'PROJECTS' as const },
  { id: 'tools', label: 'TOOLS', destination: 'TOOLS' as const },
  { id: 'engines', label: 'ENGINES', destination: 'ENGINES' as const },
  { id: 'connections', label: 'CONNECTIONS', destination: 'CONNECTIONS' as const },
  { id: 'marketplace', label: 'MARKETPLACE', destination: 'MARKETPLACE' as const },
  { id: 'audit', label: 'AUDIT LOG', destination: 'AUDIT_LOG' as const },
  { id: 'memory', label: 'MEMORY SLABS', destination: 'MEMORY_SLABS' as const },
  { id: 'settings', label: 'SETTINGS', destination: 'SETTINGS' as const },
];
