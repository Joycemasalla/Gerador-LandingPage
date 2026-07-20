import { LOVABLE_MASTER_TEMPLATE } from '../core/templates/lovableMasterTemplate.js';
import { INSTITUCIONAL_MASTER_TEMPLATE } from '../core/templates/institucionalMasterTemplate.js';
import { getCategoryById, formatSectionsForPrompt } from './businessCategories.js';

/**
 * Constrói o prompt final substituindo os placeholders do template
 * pelos dados estruturados gerados pela IA.
 *
 * O template selecionado depende do `generationType`:
 * - 'landing_page' (padrão) → LOVABLE_MASTER_TEMPLATE (CRO / conversão)
 * - 'site_institucional'    → INSTITUCIONAL_MASTER_TEMPLATE (Awwwards / imersivo)
 *
 * Placeholders de categoria populados automaticamente via CATEGORIA_ID:
 * - {CATEGORIA}          → nome da categoria
 * - {CTA_PRINCIPAL}      → texto do CTA da categoria
 * - {TOM_CATEGORIA}      → descrição do tom de voz
 * - {ARQUITETURA_SECOES} → lista de seções ativas/inativas formatada
 * - {REGRAS_NICHO}       → regras de prompt da categoria
 *
 * Placeholders exclusivos do Site Institucional:
 * - {PAGINAS}    → páginas/seções desejadas
 * - {HISTORIA}   → história / fundação da empresa
 * - {EQUIPE}     → membros da equipe
 * - {CONQUISTAS} → números e conquistas (para counters animados)
 * - {MISSAO}     → missão da empresa
 * - {VISAO}      → visão da empresa
 * - {VALORES}    → valores da empresa
 *
 * @param {Object} structuredStrategy Objeto contendo os dados estratégicos
 * @param {string} [generationType]   'landing_page' | 'site_institucional'
 * @returns {string} Prompt final pronto para uso
 */
export function buildLovablePrompt(structuredStrategy, generationType = 'landing_page') {
  const isSiteInstitucional = generationType === 'site_institucional';

  // Selecionar o template correto baseado no tipo de projeto
  const masterTemplate = isSiteInstitucional
    ? INSTITUCIONAL_MASTER_TEMPLATE
    : LOVABLE_MASTER_TEMPLATE;

  if (!structuredStrategy) return masterTemplate;

  let prompt = masterTemplate;

  // ── Injetar dados específicos da categoria ANTES do loop genérico ──
  const categoryId = structuredStrategy.CATEGORIA_ID || null;
  const category = categoryId ? getCategoryById(categoryId) : null;

  if (category) {
    if (!structuredStrategy.CATEGORIA) {
      structuredStrategy = {
        ...structuredStrategy,
        CATEGORIA: `${category.icon} ${category.label}`,
      };
    }
    if (!structuredStrategy.CTA_PRINCIPAL) {
      structuredStrategy = {
        ...structuredStrategy,
        CTA_PRINCIPAL: isSiteInstitucional
          ? 'Entrar em Contato'   // Site institucional usa CTA mais amplo
          : category.primaryCTA,
      };
    }
    if (!structuredStrategy.TOM_CATEGORIA) {
      structuredStrategy = {
        ...structuredStrategy,
        TOM_CATEGORIA: `${category.voiceTone} — ${category.voiceToneDescription}`,
      };
    }
    if (!structuredStrategy.ARQUITETURA_SECOES) {
      structuredStrategy = {
        ...structuredStrategy,
        ARQUITETURA_SECOES: isSiteInstitucional
          ? formatSectionsForPromptInstitucional(categoryId)
          : formatSectionsForPrompt(categoryId),
      };
    }
    if (!structuredStrategy.REGRAS_NICHO) {
      structuredStrategy = {
        ...structuredStrategy,
        REGRAS_NICHO: category.promptRules,
      };
    } else {
      structuredStrategy = {
        ...structuredStrategy,
        REGRAS_NICHO: `${structuredStrategy.REGRAS_NICHO}\n\n${category.promptRules}`,
      };
    }
  } else {
    // Fallback: sem categoria detectada, usar defaults
    if (!structuredStrategy.CATEGORIA) {
      structuredStrategy = { ...structuredStrategy, CATEGORIA: 'Negócio Local' };
    }
    if (!structuredStrategy.CTA_PRINCIPAL) {
      structuredStrategy = {
        ...structuredStrategy,
        CTA_PRINCIPAL: isSiteInstitucional
          ? 'Entrar em Contato'
          : 'Entrar em Contato pelo WhatsApp',
      };
    }
    if (!structuredStrategy.TOM_CATEGORIA) {
      structuredStrategy = { ...structuredStrategy, TOM_CATEGORIA: 'Neutro e profissional' };
    }
    if (!structuredStrategy.ARQUITETURA_SECOES) {
      structuredStrategy = {
        ...structuredStrategy,
        ARQUITETURA_SECOES: isSiteInstitucional
          ? formatSectionsForPromptInstitucional(null)
          : formatSectionsForPrompt(null),
      };
    }
  }

  // ── Defaults para campos exclusivos do Site Institucional ──
  if (isSiteInstitucional) {
    if (!structuredStrategy.PAGINAS) {
      structuredStrategy = {
        ...structuredStrategy,
        PAGINAS: '- Home\n- Sobre a Empresa\n- Serviços\n- Portfólio / Galeria\n- Depoimentos\n- Contato',
      };
    }
    if (!structuredStrategy.HISTORIA) {
      structuredStrategy = { ...structuredStrategy, HISTORIA: 'Não especificado' };
    }
    if (!structuredStrategy.EQUIPE) {
      structuredStrategy = { ...structuredStrategy, EQUIPE: 'Não especificado' };
    }
    if (!structuredStrategy.CONQUISTAS) {
      structuredStrategy = { ...structuredStrategy, CONQUISTAS: 'Não especificado' };
    }
    if (!structuredStrategy.MISSAO) {
      structuredStrategy = { ...structuredStrategy, MISSAO: 'Não especificado' };
    }
    if (!structuredStrategy.VISAO) {
      structuredStrategy = { ...structuredStrategy, VISAO: 'Não especificado' };
    }
    if (!structuredStrategy.VALORES) {
      structuredStrategy = { ...structuredStrategy, VALORES: 'Não especificado' };
    }
  }

  // ── Loop genérico de substituição de placeholders ──
  const formatValue = (val) => {
    if (val === null || val === undefined || val === '') return 'Não especificado';

    if (Array.isArray(val)) {
      if (val.length === 0) return 'Nenhum';
      return val.map(item => {
        if (typeof item === 'object') {
          if (item.title && item.description) return `- **${item.title}**: ${item.description}`;
          if (item.name && item.description) return `- **${item.name}**: ${item.description}`;
          if (item.name && item.role) return `- **${item.name}** (${item.role})`;
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
    // Pular chaves internas que não são placeholders do template
    if (key === 'CATEGORIA_ID') continue;

    const placeholder = `{${key.toUpperCase()}}`;
    const formattedValue = formatValue(value);

    // Substitui todas as ocorrências (usando split/join para retrocompatibilidade)
    prompt = prompt.split(placeholder).join(formattedValue);
  }

  // Limpar eventuais placeholders que sobraram
  prompt = prompt.replace(/\{[A-Z_]+\}/g, 'Não especificado');

  return prompt;
}

/**
 * Formata a lista de seções institucionais para injeção no prompt.
 * Gera uma arquitetura de seções expandida, adequada para um site completo.
 *
 * @param {string|null} categoryId
 * @returns {string}
 */
function formatSectionsForPromptInstitucional(categoryId) {
  const defaultSections = [
    { id: 'hero',          label: 'Hero Fullscreen (vídeo/parallax + reveal texto)',  enabled: true  },
    { id: 'sobre',         label: 'Sobre a Empresa / História (sticky storytelling)', enabled: true  },
    { id: 'services',      label: 'Serviços / Soluções (cards com hover premium)',    enabled: true  },
    { id: 'conquistas',    label: 'Conquistas / Números (counters animados)',          enabled: true  },
    { id: 'portfolio',     label: 'Portfólio / Galeria (lightbox cinemático)',         enabled: true  },
    { id: 'equipe',        label: 'Equipe (reveal com grayscale→color hover)',        enabled: true  },
    { id: 'testimonials',  label: 'Depoimentos (marquee infinito)',                   enabled: true  },
    { id: 'cta_contato',   label: 'CTA / Contato (botão magnético + formulário)',     enabled: true  },
    { id: 'footer',        label: 'Footer Completo (mapa, redes, links rápidos)',     enabled: true  },
  ];

  const lines = defaultSections.map(s => {
    const status = s.enabled ? '✅ ATIVA' : '❌ DESABILITADA';
    return `${status} → ${s.label}`;
  });

  return lines.join('\n');
}
