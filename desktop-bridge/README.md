# APEX Terminal Bridge

Flow:
GABBY / APEX UI -> TERMINAL TOGGLE -> 127.0.0.1 -> APEX Terminal Bridge -> Windows Terminal / PowerShell

The bridge is local-only and does not listen on the LAN.

Run:
powershell -ExecutionPolicy Bypass -File .\desktop-bridge\apex-terminal-bridge.ps1

The first run creates:
%LOCALAPPDATA%\APEX\TerminalBridge\token.txt

Load desktop-bridge/extension as an unpacked Chromium/Edge extension and paste the local bridge token once.

Modes:
- TERMINAL: opens a visible Windows Terminal tab.
- EXEC: runs hidden and returns stdout/stderr.

For production packaging, the browser-extension side should move to a signed Native Messaging host. Chrome and Edge both support Native Messaging between an extension and a local native application.