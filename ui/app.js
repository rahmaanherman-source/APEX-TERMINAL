const tabs = [
  ["APEX HUB", "workspace"],
  ["APEX HERITAGE", "workspace"],
  ["GODSPEED", "workspace"],
  ["GOLDEN WORLD", "3D"],
];

const $ = (id) => document.getElementById(id);

function renderTabs() {
  const host = $("tabs");
  host.innerHTML = "";
  tabs.forEach(([name, type]) => {
    const button = document.createElement("button");
    button.className = "tab";
    button.innerHTML = `${name}<small>${type}</small>`;
    button.onclick = () => {
      $("active-title").textContent = name;
      $("feed").textContent = `OPEN · ${name}`;
    };
    host.appendChild(button);
  });
  $("tab-count").textContent = String(tabs.length);
}

function setState(state) {
  $("active-state").textContent = state;
  $("system-state").innerHTML = `<span class="dot"></span>${state}`;
  $("evidence-state").textContent = state;
}

function runLocalCommand(command) {
  const normalized = command.trim().toLowerCase();
  const executionId = crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}`;
  $("feed").textContent = `EXECUTE · ${executionId} · ${command}`;

  if (normalized === "system status" || normalized === "status" || normalized === "verify system") {
    const observation = {
      execution_id: executionId,
      action_id: "SYSTEM_STATUS",
      adapter: "ui_local_bridge",
      status: "UNVERIFIED",
      reason: "UI_SHELL_HAS_NO_BACKEND_OBSERVER",
    };
    setState("UNVERIFIED");
    $("output").textContent = JSON.stringify(observation, null, 2);
    $("inspector-content").textContent = "The UI is intentionally refusing to invent runtime state. Connect the real local adapter/API to verify this operation.";
    return;
  }

  setState("UNVERIFIED");
  $("output").textContent = JSON.stringify({
    execution_id: executionId,
    command,
    status: "UNVERIFIED",
    reason: "NO_EXECUTION_BACKEND_CONNECTED",
  }, null, 2);
  $("inspector-content").textContent = "Command captured. No backend claim was made.";
}

$("run").onclick = () => runLocalCommand($("command").value);
$("command").addEventListener("keydown", (event) => {
  if (event.key === "Enter") runLocalCommand(event.target.value);
});
window.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    $("command").focus();
  }
});

renderTabs();
