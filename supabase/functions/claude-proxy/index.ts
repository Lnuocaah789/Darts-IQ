// Supabase Edge Function: proxies chat requests to the Anthropic Messages API
// so the API key never ships to the browser. Deploy with:
//   supabase functions deploy claude-proxy
// and set the secret once with:
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Allowed models are restricted server-side so a compromised client can't
// be used to run arbitrary/expensive models on this key.
const ALLOWED_MODELS = new Set(["claude-haiku-4-5-20251001", "claude-sonnet-4-5"]);
const MAX_TOKENS_CAP = 1200;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { model, max_tokens, messages, system } = await req.json();

    if (!ALLOWED_MODELS.has(model)) {
      return new Response(JSON.stringify({ error: "Model not allowed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = {
      model,
      max_tokens: Math.min(Number(max_tokens) || 150, MAX_TOKENS_CAP),
      messages,
      ...(system ? { system } : {}),
    };

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const data = await anthropicRes.text();
    return new Response(data, {
      status: anthropicRes.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
