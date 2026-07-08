// Helpers de IA + parsing JSON robusto para as edge functions

const GEMINI_MODEL = "gemini-2.5-flash";

export function normalizeHandle(raw: string): string {
  if (!raw) return "";
  const cleaned = raw
    .trim()
    .replace(/https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/\/$/, "")
    .replace(/^@/, "");
  return `@${cleaned}`;
}

export function parseJsonFromAI(text: string): any {
  const cleanText = text.replace(/<analise>[\s\S]*?<\/analise>/gi, "").trim();
  try {
    return JSON.parse(cleanText);
  } catch {}
  try {
    const cleaned = cleanText
      .replace(/^```json\s*/im, "")
      .replace(/^```\s*/im, "")
      .replace(/```\s*$/m, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {}
  try {
    const a = cleanText.indexOf("{");
    const b = cleanText.lastIndexOf("}");
    if (a !== -1 && b > a) return JSON.parse(cleanText.slice(a, b + 1));
  } catch {}
  throw new Error(
    `Não foi possível extrair JSON válido da IA. Início: ${text.slice(0, 200)}`,
  );
}

export async function callGemini(
  apiKey: string,
  prompt: string,
  opts: { jsonMode?: boolean; googleSearch?: boolean } = {},
): Promise<string> {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const body: any = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  };
  if (opts.jsonMode) {
    body.generationConfig.responseMimeType = "application/json";
  }
  if (opts.googleSearch) {
    body.tools = [{ googleSearch: {} }];
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errText}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text)
    .join("") ?? "";
  if (!text) throw new Error("Resposta vazia da Gemini");
  return text;
}

// Contraste WCAG
function luminance(hex: string): number {
  let cleaned = hex.replace("#", "");
  if (cleaned.length === 3) {
    cleaned = cleaned.split("").map((c) => c + c).join("");
  }
  const rgb = parseInt(cleaned, 16);
  const [r, g, b] = [(rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255].map(
    (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    },
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrastRatio(h1: string, h2: string): number {
  const l1 = luminance(h1), l2 = luminance(h2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
export function textColorFor(bg: string): string {
  return contrastRatio(bg, "#ffffff") > contrastRatio(bg, "#1a1a1a")
    ? "#f8fafc"
    : "#0f172a";
}

// Firecrawl scrape
export async function firecrawlScrape(url: string, formats: string[] = ["markdown", "links"]) {
  const key = Deno.env.get("FIRECRAWL_API_KEY");
  if (!key) throw new Error("FIRECRAWL_API_KEY não configurada");
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, formats, onlyMainContent: false }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Firecrawl ${res.status}`);
  return data.data || data;
}

// Fallback images por segmento
export const SEGMENT_FALLBACK_IMAGES: Record<string, string[]> = {
  estetica: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80",
  ],
  barbearia: [
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1593702295094-aea22597af65?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503951458645-643d53efd90f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1532710093739-9470acff878f?auto=format&fit=crop&w=800&q=80",
  ],
  hamburgueria: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80",
  ],
  pet: [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80",
  ],
  clinica: [
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504813184591-01552ff7c780?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
  ],
  geral: [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542744173-8e0853c0374a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  ],
};

export function pickFallbackKey(seg: string): string {
  const s = (seg || "").toLowerCase();
  if (/estetica|spa|beleza|maquiagem|unha|sobrancelha|salao|cabelo|hair/.test(s)) return "estetica";
  if (/barbearia|barber|barba/.test(s)) return "barbearia";
  if (/hamburguer|burger|doce|bolo|comida|restaurante|pizza|gastronomia|buffet/.test(s)) return "hamburgueria";
  if (/pet|dog|veterin|gato/.test(s)) return "pet";
  if (/medic|clinic|odonto|dentista|psicolog|terapia|fisio|saude/.test(s)) return "clinica";
  return "geral";
}

export async function fetchInstagramImages(handle: string, segment: string): Promise<string[]> {
  const cleaned = handle.replace(/^@/, "");
  const fallback = SEGMENT_FALLBACK_IMAGES[pickFallbackKey(segment)] || SEGMENT_FALLBACK_IMAGES.geral;
  try {
    const scraped = await firecrawlScrape(`https://imgsed.com/${cleaned}/`, ["html", "links"]);
    const html: string = scraped?.html || "";
    const links: string[] = scraped?.links || [];
    const urls: string[] = [];
    const imgRe = /<img[^>]+src="([^"]+)"/g;
    let m;
    while ((m = imgRe.exec(html)) !== null) {
      const u = m[1].replace(/&amp;/g, "&");
      if ((u.includes("cdninstagram") || u.includes("imginn")) && !u.includes("profile_pic") && !u.includes("150x150")) {
        if (!urls.includes(u)) urls.push(u);
      }
    }
    for (const l of links) {
      if ((l.includes("cdninstagram") || l.includes("imginn")) && !urls.includes(l)) urls.push(l);
    }
    if (urls.length >= 3) {
      const picked = urls.slice(0, 6);
      return picked.length >= 6 ? picked : [...picked, ...fallback.slice(0, 6 - picked.length)];
    }
  } catch (e) {
    console.warn("Firecrawl scrape falhou:", (e as Error).message);
  }
  return fallback;
}
