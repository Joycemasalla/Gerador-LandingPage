/**
 * Serviço de comunicação com o servidor proxy local para geração de Landing Pages via IA
 */

export async function generateLandingPage(formData, customApiKey = '') {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': customApiKey
      },
      body: JSON.stringify(formData)
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
