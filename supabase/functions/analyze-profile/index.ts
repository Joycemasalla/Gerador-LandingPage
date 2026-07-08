import { corsHeaders } from "../_shared/cors.ts";
import { callGemini, fetchInstagramImages, firecrawlScrape, normalizeHandle, parseJsonFromAI } from "../_shared/ai.ts";
import { ANALYZE_PROMPT } from "../_shared/prompts.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { instagramHandle } = await req.json();
    if (!instagramHandle) {
      return json({ error: "instagramHandle é obrigatório" }, 400);
    }
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return json({ error: "GEMINI_API_KEY não configurada" }, 500);

    const handle = normalizeHandle(instagramHandle);
    const clean = handle.replace(/^@/, "");
    console.log(`[analyze] Iniciando análise de ${handle}`);

    // Scrape real via Firecrawl (imgsed é indexador público de perfis IG)
    let scrapedText = "";
    try {
      const scraped = await firecrawlScrape(`https://imgsed.com/${clean}/`, ["markdown"]);
      scrapedText = (scraped?.markdown || "").slice(0, 12000);
      console.log(`[analyze] Firecrawl retornou ${scrapedText.length} chars`);
    } catch (e) {
      console.warn("[analyze] Firecrawl falhou:", (e as Error).message);
      scrapedText = "(Scraping público indisponível — use apenas conhecimento web sobre o perfil.)";
    }

    const prompt = ANALYZE_PROMPT
      .replace(/{{instagramHandle}}/g, handle)
      .replace("{{scrapedData}}", scrapedText || "(vazio)");

    const raw = await callGemini(apiKey, prompt, { jsonMode: true });
    const profile = parseJsonFromAI(raw);

    // Anexar imagens (reais ou fallback)
    const segment = profile?.identity?.segment || "";
    profile.instagramImages = await fetchInstagramImages(handle, segment);

    return json(profile);
  } catch (err) {
    console.error("[analyze] Erro:", err);
    return json({ error: "Erro ao analisar perfil", message: (err as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
