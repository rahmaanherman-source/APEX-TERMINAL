import { GoogleGenAI } from '@google/genai';

const DEFAULT_MODEL = 'gemini-3.7-flash';

export type GoogleAIStudioStatus =
  | 'NOT_CONFIGURED'
  | 'CONFIGURED'
  | 'CONNECTED'
  | 'HEALTHY'
  | 'FAILED';

export interface GoogleAIStudioConnector {
  id: 'google-ai-studio';
  name: 'Google AI Studio / Gemini';
  status: GoogleAIStudioStatus;
  ready: boolean;
  model: string;
  interact(input: string, options?: { model?: string; background?: boolean }): Promise<{
    id: string | null;
    text: string;
    status: 'CONNECTED' | 'FAILED';
    raw: unknown;
  }>;
  ping(): Promise<{ ok: boolean; status: GoogleAIStudioStatus; sample?: string; error?: string }>;
}

export function createGoogleAIStudio(options: { apiKey?: string; model?: string } = {}): GoogleAIStudioConnector {
  const apiKey = options.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const model = options.model || DEFAULT_MODEL;

  if (!apiKey) {
    return {
      id: 'google-ai-studio',
      name: 'Google AI Studio / Gemini',
      status: 'NOT_CONFIGURED',
      ready: false,
      model,
      async interact() {
        throw new Error('GOOGLE_AI_STUDIO_NOT_CONFIGURED: set GEMINI_API_KEY or GOOGLE_API_KEY');
      },
      async ping() {
        return { ok: false, status: 'NOT_CONFIGURED', error: 'GEMINI_API_KEY or GOOGLE_API_KEY is required' };
      },
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  return {
    id: 'google-ai-studio',
    name: 'Google AI Studio / Gemini',
    status: 'CONFIGURED',
    ready: true,
    model,

    async interact(input, options = {}) {
      try {
        const interaction = await ai.interactions.create({
          model: options.model || model,
          input,
          background: options.background || false,
        });
        return {
          id: interaction.id || null,
          text: interaction.output_text || '',
          status: 'CONNECTED',
          raw: interaction,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`GOOGLE_AI_STUDIO_REQUEST_FAILED: ${message}`);
      }
    },

    async ping() {
      try {
        const result = await this.interact('Reply with exactly: APEX_GOOGLE_AI_HEALTHY');
        const sample = result.text.slice(0, 80);
        return { ok: sample.length > 0, status: sample.length > 0 ? 'HEALTHY' : 'FAILED', sample };
      } catch (error) {
        return {
          ok: false,
          status: 'FAILED',
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
  };
}
