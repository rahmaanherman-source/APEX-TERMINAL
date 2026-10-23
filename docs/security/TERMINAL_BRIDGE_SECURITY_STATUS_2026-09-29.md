# Terminal bridge security status — 2026-09-29

| Component | Code state | Runtime evidence |
| --- | --- | --- |
| Loopback listener | Implemented in `desktop-bridge/apex-terminal-bridge.ps1` | Windows runtime not tested in this change |
| Token on `POST /exec` | Implemented; absent/wrong token returns 401 | Runtime not tested |
| Origin policy | Exact `APEX_BRIDGE_ALLOWED_ORIGIN`; other browser origins return 403 | Runtime not tested |
| Command policy | Four exact, argument-free read-only PowerShell commands; deny others | Runtime not tested |
| Audit | Local `audit.jsonl` metadata with correlation ID; no token/output fields | Runtime not tested |
| Gatekeeper | Command policy is a decision stub only | Full user/role authorization not implemented |
| Vault | Architecture described in `docs/APEX_DESKTOP_VAULT_SETTLED_REPORT.md` | No secret-resolution boundary in bridge |
| Health | Unauthenticated service availability only | Does not prove auth/authorization |

Request order: loopback HTTP → exact Origin check → route/method → token check → request size/JSON → exact command policy → process → audit metadata/readback. `OPTIONS /exec` is preflight only. `GET /health` has no secret or privilege information.

Security limits: a stolen local token can run any of the four allowed commands. An allowed browser origin is a browser access control, not user identity. The page's token exists in its React state; the extension stores it in `chrome.storage.local`; the PowerShell script stores it in a local text file. The bridge does not call the proposed Desktop Vault. The audit file is local metadata logging, not a tamper-evident ledger. No claim of production readiness follows from code inspection.

Windows acceptance checks: launch bridge with exact extension origin; use allowed command and confirm correlation ID/audit; omit token and expect 401; send `Get-Content` or `Get-Date;whoami` and expect 403; use wrong Origin and expect 403; confirm `/health` exposes only availability; inspect no token/output in audit. Repeat with the web page origin if used. A full Gatekeeper/Vault integration requires separate implementation and tests.
