chrome.runtime.onInstalled.addListener(() => {
  if (chrome.contextMenus) {
    chrome.contextMenus.create({
      id: "apex-terminal-selection",
      title: "Send selection to APEX Terminal",
      contexts: ["selection"]
    });
  }
});

if (chrome.contextMenus) {
  chrome.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId !== "apex-terminal-selection" || !info.selectionText) return;
    const {token} = await chrome.storage.local.get(["token"]);
    if (!token) return;
    await fetch("http://127.0.0.1:18765/exec", {
      method:"POST",
      headers:{"Content-Type":"application/json","X-APEX-Token":token},
      body:JSON.stringify({command:info.selectionText,mode:"terminal"})
    });
  });
}