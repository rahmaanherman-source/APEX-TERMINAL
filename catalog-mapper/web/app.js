const stateEl = document.getElementById('state');
const fileEl = document.getElementById('file');
const sourceEl = document.getElementById('source');
const destinationEl = document.getElementById('destination');
const templateBox = document.getElementById('templateBox');
const templateEl = document.getElementById('template');
const mapButton = document.getElementById('map');
const results = document.getElementById('results');
const report = document.getElementById('report');
const download = document.getElementById('download');
let latestCsv = '';

function setState(text, cls = 'neutral') {
  stateEl.textContent = text;
  stateEl.className = `state ${cls}`;
}

async function loadDestinations() {
  const res = await fetch('/api/destinations');
  const destinations = await res.json();
  destinationEl.innerHTML = destinations.map(d => `<option value="${d.id}">${d.label}</option>`).join('');
  updateTemplateBox(destinations[0]);
  destinationEl.addEventListener('change', () => {
    const d = destinations.find(x => x.id === destinationEl.value);
    updateTemplateBox(d);
  });
}

function updateTemplateBox(destination) {
  templateBox.classList.toggle('hidden', !destination?.template_required);
}

fileEl.addEventListener('change', async () => {
  const file = fileEl.files?.[0];
  if (file) sourceEl.value = await file.text();
});

mapButton.addEventListener('click', async () => {
  if (!sourceEl.value.trim()) return setState('SOURCE REQUIRED', 'bad');
  setState('PROCESSING…', 'busy');
  mapButton.disabled = true;
  try {
    const res = await fetch('/api/map', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        source_csv: sourceEl.value,
        destination_id: destinationEl.value,
        destination_template_csv: templateEl.value
      })
    });
    const data = await res.json();
    results.classList.remove('hidden');
    document.getElementById('products').textContent = data.counts?.products ?? 0;
    document.getElementById('parts').textContent = data.parts_count ?? 0;
    document.getElementById('problemCount').textContent = data.validation?.problems?.length ?? (data.error ? 1 : 0);
    report.textContent = JSON.stringify({state: data.state, mapping: data.mapping, validation: data.validation}, null, 2);
    latestCsv = data.generated_csv || '';
    download.disabled = !latestCsv || data.state !== 'VERIFIED';
    setState(data.state || 'FAILED', data.state === 'VERIFIED' ? 'good' : 'bad');
  } catch (error) {
    report.textContent = String(error);
    setState('FAILED', 'bad');
  } finally {
    mapButton.disabled = false;
  }
});

download.addEventListener('click', () => {
  const blob = new Blob([latestCsv], {type: 'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mapped-catalog.csv';
  a.click();
  URL.revokeObjectURL(url);
});

loadDestinations().catch(() => setState('API UNAVAILABLE', 'bad'));
