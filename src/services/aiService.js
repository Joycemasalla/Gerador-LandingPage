import { supabase } from "@/integrations/supabase/client";

/**
 * Analisa um perfil do Instagram via Firecrawl + Gemini e retorna JSON rico.
 */
export async function analyzeInstagramProfile(instagramHandle, _customApiKey = '') {
  const { data, error } = await supabase.functions.invoke('analyze-profile', {
    body: { instagramHandle },
  });
  if (error) {
    const details = error?.context ? await error.context.text().catch(() => '') : '';
    throw new Error(details || error.message || 'Erro ao analisar perfil');
  }
  if (data?.error) throw new Error(data.message || data.error);
  return data;
}

/**
 * Gera uma Landing Page completa via IA.
 */
export async function generateLandingPage(clientData, images = [], _customApiKey = '') {
  const { data, error } = await supabase.functions.invoke('generate', {
    body: { clientData, images },
  });
  if (error) {
    const details = error?.context ? await error.context.text().catch(() => '') : '';
    throw new Error(details || error.message || 'Erro ao gerar landing page');
  }
  if (data?.error) throw new Error(data.message || data.error);
  return data;
}
