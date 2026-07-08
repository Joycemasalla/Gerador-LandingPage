import { corsHeaders } from "../_shared/cors.ts";
import { callGemini, contrastRatio, fetchInstagramImages, parseJsonFromAI, textColorFor } from "../_shared/ai.ts";
import { GENERATE_PROMPT } from "../_shared/prompts.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { clientData, images = [] } = await req.json();
    if (!clientData) return json({ error: "clientData é obrigatório" }, 400);

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return json({ error: "GEMINI_API_KEY não configurada" }, 500);

    const prompt = GENERATE_PROMPT.replace(
      "{{clientDataJson}}",
      JSON.stringify(clientData, null, 2),
    );
    console.log(`[generate] Gerando LP para ${clientData?.identity?.businessName || "cliente"}`);

    const raw = await callGemini(apiKey, prompt, { jsonMode: true });
    const parsed = parseJsonFromAI(raw);

    // Depoimentos: preservar manuais, marcar IA como placeholder
    const manual = (clientData.testimonials || []).filter((t: any) => t && t.isPlaceholder === false);
    if (manual.length > 0) {
      const names = new Set(manual.map((t: any) => t.name));
      const extras = (parsed.testimonials || []).filter((t: any) => !names.has(t.name)).map((t: any) => ({ ...t, isPlaceholder: true }));
      parsed.testimonials = [...manual, ...extras].slice(0, 3);
    } else if (parsed.testimonials) {
      parsed.testimonials = parsed.testimonials.map((t: any) => ({ ...t, isPlaceholder: true }));
    }

    if (clientData.identity?.segment && !parsed.segment) {
      parsed.segment = clientData.identity.segment;
    }

    // Alinhar themeName ao segmento
    if (parsed.theme) {
      const t = parsed.theme;
      const seg = (clientData.identity?.segment || parsed.segment || "").toLowerCase();
      if (/barbearia|barber|hamburguer|burger|tatuag|tattoo/.test(seg)) t.themeName = "bold";
      else if (/estetica|spa|odontolog|luxo|clinica vip|joias/.test(seg)) t.themeName = "elegant";
      else if (/pet|dog|veterin|doceria|bolo|escola|infantil/.test(seg)) t.themeName = "friendly";
      else if (/medico|advogad|consultor|arquitet|psicolog/.test(seg)) t.themeName = "minimalist";

      if (t.themeName === "bold") {
        t.darkColor ||= "#0a0a0c";
        t.lightColor ||= "#111827";
        t.textColor ||= "#f3f4f6";
        t.textColorOnDark ||= "#f3f4f6";
      }
      const lightBg = t.lightColor || "#F9FAFB";
      const darkBg = t.darkColor || "#1F2937";
      if (contrastRatio(t.textColor || "#334155", lightBg) < 4.5) t.textColor = textColorFor(lightBg);
      if (contrastRatio(t.textColorOnDark || "#cbd5e1", darkBg) < 4.5) t.textColorOnDark = textColorFor(darkBg);
    }

    // Imagens
    if (!images || images.length === 0) {
      const handle = clientData.contacts?.instagram || clientData.identity?.businessName || "";
      if (handle) {
        parsed.images = await fetchInstagramImages(handle, clientData.identity?.segment || "");
      }
    } else {
      parsed.images = images;
    }

    return json(parsed);
  } catch (err) {
    console.error("[generate] Erro:", err);
    return json({ error: "Erro ao gerar landing page", message: (err as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
