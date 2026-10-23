const $ = (id) => document.getElementById(id);
const status = $("status");
const token = $("token");
const mode = $("mode");
const command = $("command");
const allowed = new Set(["Get-Date", "Get-Location", "Get-ChildItem", "Get-Process"]);
chrome.storage.local.get(["token"], ({token: saved}) => { if (saved) token.value = saved; });
async function healthCheck() {
  try {
    const r = await fetch("http://127.0.0.1:18765/health");
    const j = await r.json();
    status.textContent = j.ok ? "● APEX bridge online" : "Bridge unavailable";
  } catch { status.textContent = "○ Start apex-terminal-bridge.ps1 on the PC"; }
}
healthCheck();
$("send").addEventListener("click", async () => {
  const t = token.value.trim(), c = command.value.trim();
  if (!t) { status.textContent = "Token required"; return; }
  if (!allowed.has(c)) { status.textContent = "Safe mode: choose Get-Date, Get-Location, Get-ChildItem, or Get-Process"; return; }
  await chrome.storage.local.set({token:t});
  try {
    const r = await fetch("http://127.0.0.1:18765/exec", {
      method:"POST",
      headers:{"Content-Type":"application/json","X-APEX-Token":t},
      body:JSON.stringify({command:c,mode:mode.value})
    });
    const j = await r.json();
    status.textContent = j.ok ? "✓ Dispatched (" + j.correlation_id + ")" : "✕ " + (j.error || "Command failed") + " (" + (j.correlation_id || "no ID") + ")";
  } catch { status.textContent = "✕ Bridge unreachable or origin not configured"; }
});