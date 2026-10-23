# APEX Terminal Bridge — safe mode

The bridge binds only to `127.0.0.1:18765`. Run on Windows:

```powershell
$env:APEX_BRIDGE_ALLOWED_ORIGIN = "chrome-extension://YOUR_EXTENSION_ID"
powershell -ExecutionPolicy Bypass -File .\desktop-bridge\apex-terminal-bridge.ps1
```

For the APEX web page, set the exact page origin instead, such as `http://localhost:3000`. Only one origin is accepted per bridge instance. Without an allowed origin, browser requests carrying `Origin` are denied. Local clients without an Origin still require the token for `POST /exec`. `GET /health` remains unauthenticated and exposes only service availability.

First run creates `%LOCALAPPDATA%\APEX\TerminalBridge\token.txt`. Paste its contents into the extension or page. The extension stores it in `chrome.storage.local`; the page keeps it in memory. Keep the token private and rotate by stopping the bridge and deleting `token.txt`. Protect that file with OS account permissions. The bridge logs metadata (timestamp, correlation ID, action, decision, exit code) in `audit.jsonl`, without tokens or command output.

The bridge's decision stub accepts only exact, argument-free commands: `Get-Date`, `Get-Location`, `Get-ChildItem`, and `Get-Process`. No arbitrary PowerShell, pipelines, arguments, or selected text outside this list runs. `terminal` opens Windows Terminal; `exec` returns output. Both require `X-APEX-Token`.

Transport token check and origin check are implemented in the bridge. The command allowlist is a local policy stub; it is **not** a full identity, role, or Gatekeeper authorization system. The Vault is documented architecture, not secret storage used by this bridge. A successful `/health` response does not prove authentication or command execution. Production packaging should consider a signed Native Messaging host.

## Verification

On Windows, after setting the origin and running the bridge, check an allowed request with the token, then check missing token (`401`), disallowed command (`403`), and wrong Origin (`403`). Inspect `audit.jsonl` for distinct correlation IDs. No Windows runtime verification is recorded by this change.
