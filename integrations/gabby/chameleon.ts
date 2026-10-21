export type ChameleonMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChameleonReply = {
  content: string;
  served_by: string;
  rerouted: boolean;
  trail?: Array<{ provider: string; reason: string; status: number }>;
  latency_ms?: number;
};

// Inject the app's existing Supabase client at the call site. This avoids creating
// a second client or assuming a path that may not exist in the consuming app.
type SupabaseInvoker = {
  functions: {
    invoke(name: string, options: { body: unknown }): Promise<{ data: unknown; error: { message: string } | null }>;
  };
};

const LOCAL_BASE_URL =
  (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
    ?.VITE_CHAMELEON_LOCAL_BASE_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8080/v1";

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function probeLocal(): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(`${LOCAL_BASE_URL}/models`, { method: "GET" }, 700);
    return response.ok;
  } catch {
    // Local access is optional; CORS, mixed-content, offline, and stopped-runtime failures fall back to cloud.
    return false;
  }
}

export async function chameleonChat(
  messages: ChameleonMessage[],
  supabase: SupabaseInvoker,
): Promise<ChameleonReply> {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Chameleon needs at least one chat message.");
  }

  if (await probeLocal()) {
    try {
      const response = await fetchWithTimeout(
        `${LOCAL_BASE_URL}/chat/completions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "hybrid", messages, max_tokens: 1024, stream: false }),
        },
        8_000,
      );
      if (response.ok) {
        const payload = await response.json();
        const content = payload?.choices?.[0]?.message?.content;
        if (typeof content === "string" && content.trim()) {
          return { content, served_by: "local-runtime", rerouted: false };
        }
      }
    } catch {
      // A local runtime failure must not block the cloud path.
    }
  }

  const { data, error } = await supabase.functions.invoke("chameleon", { body: { messages } });
  if (error) throw new Error(`Chameleon cloud route failed: ${error.message}`);
  if (!data || typeof (data as ChameleonReply).content !== "string" || typeof (data as ChameleonReply).served_by !== "string") {
    throw new Error("Chameleon returned an invalid response.");
  }
  return data as ChameleonReply;
}
