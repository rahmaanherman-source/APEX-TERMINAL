// Terminal Types
export interface TerminalCommand {
  id: string;
  command: string;
  output: string;
  timestamp: Date;
}

// AI Agent Types
export interface AIAgent {
  id: string;
  name: string;
  role: string;
  model: string;
  status: 'active' | 'inactive';
}

// File Explorer Types
export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileNode[];
}

// Git Types
export interface GitRepo {
  id: string;
  name: string;
  path: string;
  branch: string;
}

// Cloud Types
export interface CloudProvider {
  id: string;
  name: string;
  type: 'vercel' | 'cloudflare' | 'aws' | 'azure' | 'google-cloud';
  credentials: Record<string, string>;
}

// Database Types
export interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgres' | 'mysql' | 'sqlite' | 'redis' | 'mongodb';
  host: string;
  port: number;
  credentials: Record<string, string>;
}

// Vault Types
export interface Secret {
  id: string;
  key: string;
  value: string;
  encrypted: boolean;
}

// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  repositories: GitRepo[];
  terminals: TerminalCommand[];
  activeAgent?: AIAgent;
}