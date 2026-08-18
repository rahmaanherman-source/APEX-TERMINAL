export interface HaltController {
  halt(reason: string, exitCode?: number): never;
}

export class ProcessHaltController implements HaltController {
  halt(reason: string, exitCode = 1): never {
    console.error(`🛑 APEX TERMINAL HALT: ${reason}`);
    process.exit(exitCode);
  }
}

export class ThrowHaltController implements HaltController {
  halt(reason: string, exitCode = 1): never {
    throw Object.assign(new Error(reason), { exitCode });
  }
}

export const defaultHaltController: HaltController = new ProcessHaltController();
