// Selected text is never executed. Only the exact safe-mode command names pass.
const allowed = new Set(["Get-Date", "Get-Location", "Get-ChildItem", "Get-Process"]);
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "apex-terminal-selection",
    title: "Run allowed APEX command",
    contexts: ["selection"]
  });
});
chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== "apex-terminal-selection") return;
  const command = (info.selectionText || "").trim();
  if (!allowed.has(command)) return;
  const {token} = await chrome.storage.local.get(["token"]);
  if (!token) return;
  try {
    await fetch("http://127.0.0.1:18765/exec", {
      method:"POST",
      headers:{"Content-Type":"application/json","X-APEX-Token":token},
      body:JSON.stringify({command,mode:"terminal"})
    });
  } catch { /* The popup shows connection status; no command fallback. */ }
});