import type { Handler } from 'aws-lambda';

type TruthGateState = 'OBSERVED' | 'FAILED' | 'BLOCKED' | 'UNVERIFIED' | 'NOT_CONNECTED' | 'INCONCLUSIVE';

interface ApexApiResponse {
  state: TruthGateState;
  recordId?: string;
  provenance?: string;
  error?: string;
  evidence?: unknown;
}

const APEX_API_URL = process.env.APEX_API_URL ?? '';
const APEX_API_KEY = process.env.APEX_API_KEY ?? '';

function speech(text: string) {
  return { type: 'PlainText', text };
}

function response(text: string, end = false, directives: unknown[] = []) {
  return {
    version: '1.0',
    response: {
      outputSpeech: speech(text),
      directives,
      shouldEndSession: end
    }
  };
}

function log(event: string, data: Record<string, unknown> = {}) {
  console.log(JSON.stringify({ event, ...data }));
}

async function callApexApi(path: string, params: Record<string, string> = {}): Promise<ApexApiResponse> {
  if (!APEX_API_URL) return { state: 'NOT_CONNECTED' };
  const url = new URL(path, APEX_API_URL);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        ...(APEX_API_KEY ? { Authorization: `Bearer ${APEX_API_KEY}` } : {})
      }
    });
    if (!res.ok) {
      log('APEX_API_ERROR', { status: res.status, path });
      return { state: 'FAILED', error: `HTTP_${res.status}` };
    }
    return (await res.json()) as ApexApiResponse;
  } catch (error) {
    log('APEX_API_ERROR', { path, error: String(error) });
    return { state: 'NOT_CONNECTED', error: String(error) };
  }
}

function notConnected(label: string) {
  return response(`Apex Heritage is not connected to the live system. ${label} could not be verified.`);
}

function stateResponse(label: string, state: TruthGateState, recordId?: string) {
  const target = recordId ? `Record ${recordId}` : label;
  switch (state) {
    case 'OBSERVED': return response(`${target}: OBSERVED. The live system returned evidence.`);
    case 'BLOCKED': return response(`${target}: BLOCKED. The live system did not authorize the requested operation.`);
    case 'FAILED': return response(`${target}: FAILED. The live operation returned an error.`);
    case 'INCONCLUSIVE': return response(`${target}: INCONCLUSIVE. The available evidence does not support a definitive result.`);
    case 'UNVERIFIED': return response(`${target}: UNVERIFIED. Evidence exists but verification has not passed.`);
    default: return notConnected(label);
  }
}

export const handler: Handler = async (event: any) => {
  const intent = event?.request?.intent?.name ?? '';
  const slots = event?.request?.intent?.slots ?? {};
  log('REQUEST', { intent });

  if (intent === 'AMAZON.StopIntent' || intent === 'AMAZON.CancelIntent') {
    return response('Apex Heritage out.', true);
  }
  if (intent === 'AMAZON.HelpIntent') {
    return response('You can ask Apex Heritage to search records, check provenance, run a Truth Gate, browse the marketplace, or view your collection.');
  }

  switch (intent) {
    case 'SearchHeritageIntent': {
      const q = slots.HeritageCategory?.value ?? '';
      const culture = slots.Culture?.value ?? '';
      const api = await callApexApi('/api/v1/records/search', { q, ...(culture ? { culture } : {}) });
      if (api.state === 'NOT_CONNECTED') return notConnected('Search');
      return stateResponse(`Search for ${q}`, api.state);
    }
    case 'GetRecordStatusIntent': {
      const recordId = slots.RecordID?.value ?? '';
      const api = await callApexApi('/api/v1/truth-gates', { recordId });
      if (api.state === 'NOT_CONNECTED') return notConnected('Status check');
      return stateResponse('Status check', api.state, recordId);
    }
    case 'GetProvenanceIntent': {
      const recordId = slots.RecordID?.value ?? '';
      const api = await callApexApi('/api/v1/provenance', { recordId });
      if (api.state === 'NOT_CONNECTED') return notConnected('Provenance check');
      if (api.state !== 'OBSERVED') return stateResponse('Provenance check', api.state, recordId);
      return response(`Provenance for record ${recordId}: ${api.provenance ?? 'evidence returned without a provenance summary.'}`);
    }
    case 'CheckMarketplaceIntent': {
      const category = slots.HeritageCategory?.value ?? '';
      const api = await callApexApi('/api/v1/marketplace', category ? { q: category } : {});
      if (api.state === 'NOT_CONNECTED') return notConnected('Marketplace');
      return stateResponse('Marketplace', api.state);
    }
    case 'ListCollectionIntent': {
      const api = await callApexApi('/api/v1/collection');
      if (api.state === 'NOT_CONNECTED') return notConnected('Collection');
      return stateResponse('Collection', api.state);
    }
    case 'ListUploadHistoryIntent': {
      const api = await callApexApi('/api/v1/uploads');
      if (api.state === 'NOT_CONNECTED') return notConnected('Upload history');
      return stateResponse('Upload history', api.state);
    }
    case 'RunTruthGateIntent': {
      const recordId = slots.RecordID?.value ?? '';
      const api = await callApexApi('/api/v1/truth-gates/run', { recordId });
      if (api.state === 'NOT_CONNECTED') return notConnected('Truth Gate');
      return stateResponse('Truth Gate', api.state, recordId);
    }
    default:
      return response('I did not understand. Ask Apex Heritage for help.');
  }
};
