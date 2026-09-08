import React from "react";

/**
 * APEX TERMINAL — EXACT WORKSPACE SKELETON
 *
 * This file defines the required root composition only.
 * It is NOT a mock implementation and MUST NOT be used to replace
 * existing working services. Wire each region to the existing APEX
 * capability/adapter/runtime contracts.
 */

export type TruthState =
  | "DOCUMENTED"
  | "CONFIGURED"
  | "CONNECTED"
  | "RUNNABLE"
  | "TESTED"
  | "VERIFIED"
  | "NOT_CONFIGURED"
  | "CREDENTIAL_REQUIRED"
  | "PERMISSION_REQUIRED"
  | "SERVICE_UNAVAILABLE"
  | "EXECUTION_FAILED"
  | "BLOCKED";

export type ShellAction =
  | "dashboard"
  | "projects"
  | "tools"
  | "engines"
  | "connections"
  | "marketplace"
  | "audit-log"
  | "memory-slabs"
  | "settings"
  | "new-project"
  | "open-project"
  | "build"
  | "run"
  | "test"
  | "verify"
  | "deploy"
  | "publish";

export interface APEXShellProps {
  truthState: TruthState;
  gabbyOnline: boolean;
  projectId?: string;
  onAction: (action: ShellAction) => void;
}

export function ApexTerminalExactWorkspace({
  truthState,
  gabbyOnline,
  projectId,
  onAction,
}: APEXShellProps) {
  return (
    <main data-apex-shell="exact" data-truth={truthState}>
      <header data-region="header">
        <div data-brand="apex-terminal">APEX TERMINAL</div>
        <button data-action="gabby-command" aria-label="Gabby command/search">
          GABBY COMMAND / SEARCH
        </button>
        <span data-status="truth">{truthState}</span>
        <span data-context="project">{projectId ?? "NO PROJECT SELECTED"}</span>
      </header>

      <section data-region="workspace">
        {[
          "dashboard",
          "projects",
          "tools",
          "engines",
          "connections",
          "marketplace",
          "audit-log",
          "memory-slabs",
          "settings",
        ].map((action) => (
          <button key={action} data-action={action} onClick={() => onAction(action as ShellAction)}>
            {action.replaceAll("-", " ").toUpperCase()}
          </button>
        ))}
      </section>

      <section data-region="connected-apps">
        {/* Render actual provider registry state here. */}
      </section>

      <section data-region="creation-studio">
        <nav data-tabs="creation">
          <button>CREATE</button>
          <button>CHARACTERS</button>
          <button>WORLDS</button>
          <button>ANIMATION</button>
          <button>RENDER</button>
        </nav>
        <div data-tools="creation">
          <button>SCULPT</button>
          <button>MODEL</button>
          <button>TEXTURE</button>
          <button>RIG</button>
          <button>ANIMATE</button>
          <button>LIGHT</button>
          <button>RENDER</button>
        </div>
        {/* Mount the existing real Character/World/Animation/Render workspace. */}
      </section>

      <aside data-region="gabby">
        <h2>CONCIERGE: GABBY</h2>
        <button data-action="new-project" onClick={() => onAction("new-project")}>NEW PROJECT</button>
        <button data-action="open-project" onClick={() => onAction("open-project")}>OPEN PROJECT</button>
        <div data-gabby-state>{gabbyOnline ? "GABBY ONLINE" : "GABBY OFFLINE"}</div>
      </aside>

      <aside data-region="engines">
        <button>APEX ENGINE</button>
        <button>APEX RENDER</button>
        <button>PHYSICS</button>
        <button>AUDIO ENGINE</button>
        <button>AI GENERATION</button>
        <button>WORLD BUILDER</button>
      </aside>

      <section data-region="system-status">
        <span>CPU</span><span>GPU</span><span>RAM</span><span>VRAM</span><span>NET</span>
      </section>

      <section data-region="foley-sound-design" />
      <section data-region="ai-dialogue-adak" />

      <section data-region="timeline-sequence">
        <span>VIDEO</span>
        <span>DIALOGUE</span>
        <span>FOLEY</span>
        <span>MUSIC</span>
        <span>SFX</span>
      </section>

      <section data-region="audit-feed" aria-live="polite">
        {/* Render only real audit events. */}
      </section>

      <footer data-region="command-bar">
        {(["build", "run", "test", "verify", "deploy", "publish"] as const).map((action) => (
          <button key={action} data-action={action} onClick={() => onAction(action)}>
            {action.toUpperCase()}
          </button>
        ))}
        <strong data-engine="apex-realtime">APEX REAL-TIME ENGINE</strong>
        <span data-status="truth">TRUTH: {truthState}</span>
        <span data-status="gabby">GABBY: {gabbyOnline ? "ONLINE" : "OFFLINE"}</span>
      </footer>
    </main>
  );
}

/**
 * IMPLEMENTATION LAW
 *
 * 1. Keep the region IDs and information architecture intact.
 * 2. Replace placeholders with existing APEX implementations; do not
 *    create duplicate engines merely to fill the shell.
 * 3. Every action must resolve through the real route/auth/permission/
 *    capability/execution/readback/evidence/audit path.
 * 4. Status must come from runtime evidence. Never set VERIFIED locally.
 * 5. Visual similarity is not acceptance; functional and evidence gates
 *    are required before production status is claimed.
 */
