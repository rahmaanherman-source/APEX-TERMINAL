import { SlabState } from "./SlabLifecycle";

export interface SlabUiState {
  state: SlabState;
  label: string;
  severity: "neutral" | "warning" | "success" | "critical";
}

export function toSlabUiState(state: SlabState): SlabUiState {
  switch (state) {
    case SlabState.INIT:
      return { state, label: "Initializing Hardware…", severity: "neutral" };
    case SlabState.PROBING:
      return { state, label: "Measuring Latency…", severity: "warning" };
    case SlabState.COMPARING:
      return { state, label: "Verifying Integrity…", severity: "warning" };
    case SlabState.COMMITTED:
      return { state, label: "System Online", severity: "success" };
    case SlabState.HALTED:
      return { state, label: "CRITICAL ERROR: Delta Mismatch", severity: "critical" };
  }
}
