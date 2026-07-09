import { LOVABLE_MASTER_TEMPLATE } from '../core/templates/lovableMasterTemplate.js';

/**
 * Constrói o prompt final do Lovable substituindo os placeholders do template
 * pelos dados estruturados gerados pela IA.
 * 
 * @param {Object} structuredStrategy Objeto contendo os dados estratégicos (Nome, Nicho, etc)
 * @returns {string} Prompt final pronto para uso
 */
export function buildLovablePrompt(structuredStrategy) {
  if (!structuredStrategy) return LOVABLE_MASTER_TEMPLATE;

  let prompt = LOVABLE_MASTER_TEMPLATE;
  
  const formatValue = (val) => {
    if (val === null || val === undefined || val === "") return "Não especificado";
    
    if (Array.isArray(val)) {
      if (val.length === 0) return "Nenhum";
      return val.map(item => {
        if (typeof item === 'object') {
          // Extrair título e descrição se existirem (ex: diferencias, servicos)
          if (item.title && item.description) return `- **${item.title}**: ${item.description}`;
          if (item.name && item.description) return `- **${item.name}**: ${item.description}`;
          if (item.question && item.answer) return `- **${item.question}**: ${item.answer}`;
          return `- ${JSON.stringify(item)}`;
        }
        return `- ${item}`;
      }).join('\n');
    }
    
    if (typeof val === 'object') return JSON.stringify(val, null, 2);
    return val;
  };

  for (const [key, value] of Object.entries(structuredStrategy)) {
    const placeholder = `{${key.toUpperCase()}}`;
    const formattedValue = formatValue(value);
    
    // Substitui todas as ocorrências (usando split/join para retrocompatibilidade)
    prompt = prompt.split(placeholder).join(formattedValue);
  }
  
  // Limpar eventuais placeholders que sobraram
  prompt = prompt.replace(/\{[A-Z_]+\}/g, "Não especificado");

  return prompt;
}
