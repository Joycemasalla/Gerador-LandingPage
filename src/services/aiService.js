/**
 * Serviço de comunicação com o servidor proxy local para geração de Landing Pages via IA
 */

/**
 * Analisa um perfil do Instagram via Google Search Grounding
 * e retorna os dados estruturados do negócio para pré-preencher o formulário.
 * @param {string} instagramHandle - Link ou @ do Instagram (ex: @studioglamour.beauty)
 * @param {string} customApiKey - Chave da API Gemini opcional
 * @returns {Promise<ProfileData>} Dados extraídos do perfil
 */
export async function analyzeInstagramProfile(instagramHandle, customApiKey = '') {
  try {
    const response = await fetch('/api/analyze-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': customApiKey
      },
      body: JSON.stringify({ instagramHandle })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `Erro do servidor: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na análise do perfil Instagram:', error);
    throw error;
  }
}

/**
 * Gera uma Landing Page completa via IA a partir do JSON rico e imagens.
 * @param {object} clientData - JSON de 10 blocos estruturado do negócio
 * @param {Array} images - Lista de caminhos de imagens do Instagram ou fallbacks
 * @param {string} customApiKey - Chave da API Gemini opcional
 */
export async function generateLandingPage(clientData, images = [], customApiKey = '') {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': customApiKey
      },
      body: JSON.stringify({ clientData, images })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `Erro do servidor: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no serviço de geração de IA:', error);
    throw error;
  }
}
