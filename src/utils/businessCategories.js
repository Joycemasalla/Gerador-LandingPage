/**
 * Taxonomia das 8 Categorias de Negócio
 * 
 * Cada categoria define:
 * - Estrutura de seções (quais aparecem e em que ordem)
 * - CTA principal e objetivo de conversão
 * - Tom de voz recomendado
 * - IDs das perguntas do questionBank a incluir
 * - Perguntas específicas exclusivas da categoria
 * - Regras de prompt injetadas em {REGRAS_NICHO}
 * - Keywords para auto-detecção via segmento do Instagram
 */

export const BUSINESS_CATEGORIES = [
  // ─────────────────────────────────────────────────────────────────
  // 1. SERVIÇO POR AGENDAMENTO
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'agendamento',
    label: 'Serviço por Agendamento',
    examples: 'Salão, Barbearia, Estética, Pet Shop',
    icon: '✂️',
    primaryCTA: 'Agendar Horário',
    primaryCTAAction: 'whatsapp_scheduling',
    mainConversionGoal: 'agendar_horario',
    voiceTone: 'acolhedor',
    voiceToneDescription: 'Caloroso, próximo, que transmite cuidado e confiança. Usa linguagem informal mas elegante.',
    keywords: ['barbearia', 'barber', 'salão', 'salao', 'cabelo', 'hair', 'beleza', 'estética', 'estetica', 'spa', 'facial', 'pet', 'banho', 'tosa', 'nail', 'unhas', 'manicure', 'massagem'],
    sections: [
      { id: 'hero',           label: 'Hero',                    enabled: true,  weight: 10 },
      { id: 'social_proof',   label: 'Números / Prova Social',  enabled: true,  weight: 9  },
      { id: 'pain_points',    label: 'Problemas do Cliente',    enabled: true,  weight: 8  },
      { id: 'services',       label: 'Serviços',                enabled: true,  weight: 9  },
      { id: 'about',          label: 'Sobre / Autoridade',      enabled: true,  weight: 7  },
      { id: 'differentials',  label: 'Diferenciais',            enabled: true,  weight: 8  },
      { id: 'how_it_works',   label: 'Como Funciona (3 passos)',enabled: true,  weight: 9  },
      { id: 'gallery',        label: 'Galeria de Resultados',   enabled: true,  weight: 8  },
      { id: 'testimonials',   label: 'Depoimentos',             enabled: true,  weight: 9  },
      { id: 'faq',            label: 'FAQ',                     enabled: true,  weight: 7  },
      { id: 'cta_final',      label: 'CTA Final',               enabled: true,  weight: 10 },
      { id: 'footer',         label: 'Footer + Localização',    enabled: true,  weight: 6  },
    ],
    questionIds: [
      'targetAudience.idealClient',
      'targetAudience.primaryPain',
      'contacts.whatsapp',
      'targetAudience.mainObjection',
      'differentials',
      'branding.preferredTone',
      'branding.preferredColors',
      'contacts.openingHours',
      'contacts.paymentMethods',
      'faq',
      'testimonials',
      'process.steps',
    ],
    categorySpecificQuestions: [],
    promptRules: `
CATEGORIA: Serviço por Agendamento (Salão / Barbearia / Estética / Pet Shop)

ÊNFASE PRINCIPAL: A seção "Como Funciona" é o coração da conversão. Os 3 passos devem remover toda a fricção do agendamento.

SEÇÕES PRIORITÁRIAS (nesta ordem de impacto):
1. "Como Funciona" — 3 passos simples: Agendar → Ser Atendido → Resultado Incrível
2. Prova Social — Depoimentos com nome/foto + número de clientes atendidos
3. Galeria de Resultados — Antes/depois, fotos de trabalhos reais
4. CTA repetido: "Agendar pelo WhatsApp" em destaque em toda a página

COPY STRATEGY:
- Headline deve incluir a transformação esperada ("Saia com o cabelo dos seus sonhos")
- Subheadline deve remover a objeção principal de imediato
- Depoimentos devem citar o nome do profissional quando possível

NÃO incluir:
- Seção de catálogo/vitrine de produtos (exceto se for pet shop com loja)
- Página de preços detalhada (redirecionar para WhatsApp)
- Credenciais técnicas excessivas (OAB, CRM) — foco em portfólio visual
`,
  },

  // ─────────────────────────────────────────────────────────────────
  // 2. ALIMENTAÇÃO
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'alimentacao',
    label: 'Alimentação',
    examples: 'Restaurante, Hamburgueria, Cafeteria, Pizzaria',
    icon: '🍔',
    primaryCTA: 'Ver Cardápio / Fazer Pedido',
    primaryCTAAction: 'menu_or_order',
    mainConversionGoal: 'ver_cardapio',
    voiceTone: 'apetitoso',
    voiceToneDescription: 'Vibrante, sensorial, que desperta o apetite. Usa linguagem que ativa os sentidos (cheiro, sabor, textura).',
    keywords: ['restaurante', 'hamburguer', 'hamburgueria', 'burger', 'lanche', 'lanchonete', 'cafeteria', 'cafe', 'café', 'comida', 'gourmet', 'bistrô', 'bistro', 'gastronomia', 'jantar', 'almoço', 'almoco', 'pizza', 'pizzaria', 'sushi', 'japonês', 'japones', 'churrasco'],
    sections: [
      { id: 'hero',           label: 'Hero com Foto de Produto', enabled: true,  weight: 10 },
      { id: 'menu_highlights',label: 'Destaques do Cardápio',    enabled: true,  weight: 10 },
      { id: 'gallery',        label: 'Galeria / Ambiente',       enabled: true,  weight: 9  },
      { id: 'differentials',  label: 'Diferenciais',             enabled: true,  weight: 8  },
      { id: 'location',       label: 'Localização + Horários',   enabled: true,  weight: 9  },
      { id: 'reviews',        label: 'Avaliações (Google/iFood)', enabled: true, weight: 9  },
      { id: 'how_to_order',   label: 'Como Pedir / Delivery',    enabled: true,  weight: 8  },
      { id: 'faq',            label: 'FAQ',                      enabled: true,  weight: 6  },
      { id: 'cta_final',      label: 'CTA Final',                enabled: true,  weight: 10 },
      { id: 'footer',         label: 'Footer + Mapa',            enabled: true,  weight: 7  },
      // Seções DESABILITADAS para alimentação
      { id: 'pain_points',    label: 'Problemas do Cliente',     enabled: false, weight: 0  },
      { id: 'about',          label: 'Sobre (secundário)',        enabled: false, weight: 0  },
      { id: 'how_it_works',   label: 'Como Funciona',            enabled: false, weight: 0  },
    ],
    questionIds: [
      'targetAudience.idealClient',
      'contacts.whatsapp',
      'differentials',
      'branding.preferredTone',
      'branding.preferredColors',
      'contacts.openingHours',
      'contacts.paymentMethods',
      'faq',
      'testimonials',
    ],
    categorySpecificQuestions: [
      {
        id: 'business.deliveryAvailable',
        priority: 'critical',
        type: 'single_choice',
        question: 'Como os clientes podem pedir?',
        hint: 'Define qual CTA e seção de pedido será destacada.',
        skipLabel: 'Pular',
        options: {
          default: [
            'Delivery próprio (entregamos em casa)',
            'Retirada no local (balcão)',
            'Delivery + Retirada',
            'iFood / Rappi / Delivery externo',
            'Somente consumo no local',
          ],
        },
      },
      {
        id: 'business.menuHighlights',
        priority: 'important',
        type: 'text_input',
        question: 'Quais são os 3 pratos/itens mais pedidos ou mais especiais do cardápio?',
        hint: 'Esses serão os itens em destaque visual na seção de cardápio.',
        skipLabel: 'Pular',
        options: { default: [] },
      },
    ],
    promptRules: `
CATEGORIA: Alimentação (Restaurante / Hamburgueria / Cafeteria)

ÊNFASE PRINCIPAL: A experiência visual e sensorial é tudo. As imagens dos pratos são o principal elemento de conversão.

SEÇÕES PRIORITÁRIAS (nesta ordem de impacto):
1. Destaques do Cardápio — Cards de produtos com foto de alta qualidade, nome e descrição apetitosa
2. Galeria do Ambiente — Fotos do local, da equipe, dos ingredientes
3. Localização + Horários — Mapa integrado, dias e horários claros
4. Avaliações — Estrelas do Google/iFood com depoimentos reais

COPY STRATEGY:
- Linguagem sensorial: "crocante por fora, suculento por dentro", "feito na hora, com ingredientes frescos"
- Headline pode ser o nome do prato principal ou a proposta do restaurante
- CTA principal: "Ver Cardápio", "Fazer Pedido" ou "Delivery pelo WhatsApp"
- Incluir horário de funcionamento com destaque visual

NÃO incluir:
- Seção "Pain Points" genérica (não converte para alimentação)
- Seção "Sobre o Dono" excessiva (breve, no máximo 2 parágrafos)
- Processo de 3 passos no estilo serviço (substituir por "Como Pedir")
`,
  },

  // ─────────────────────────────────────────────────────────────────
  // 3. REVENDA / LOJA
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'revenda',
    label: 'Revenda / Loja',
    examples: 'Revendedora, Loja de Roupas, Eletrônicos, Cosméticos',
    icon: '🛍️',
    primaryCTA: 'Ver Catálogo / Comprar',
    primaryCTAAction: 'catalog_or_buy',
    mainConversionGoal: 'ver_catalogo',
    voiceTone: 'comercial',
    voiceToneDescription: 'Direto, persuasivo, focado em benefícios do produto e facilidade de compra. Destaca valor e condições.',
    keywords: ['loja', 'revenda', 'revendedora', 'roupas', 'moda', 'fashion', 'eletrônico', 'eletronico', 'cosmético', 'cosmetico', 'beleza', 'perfume', 'calçado', 'calcado', 'acessório', 'acessorio', 'bijuteria', 'presentes', 'artigos', 'produtos', 'catálogo', 'catalogo'],
    sections: [
      { id: 'hero',              label: 'Hero com Vitrine',         enabled: true,  weight: 10 },
      { id: 'featured_products', label: 'Produtos em Destaque',     enabled: true,  weight: 10 },
      { id: 'differentials',     label: 'Diferenciais de Compra',   enabled: true,  weight: 9  },
      { id: 'how_to_buy',        label: 'Como Comprar (3 passos)',   enabled: true,  weight: 9  },
      { id: 'testimonials',      label: 'Depoimentos de Clientes',  enabled: true,  weight: 8  },
      { id: 'faq',               label: 'FAQ (Frete, Troca, Pag.)', enabled: true,  weight: 8  },
      { id: 'cta_final',         label: 'CTA Final',                enabled: true,  weight: 10 },
      { id: 'footer',            label: 'Footer',                   enabled: true,  weight: 6  },
      // Seções DESABILITADAS para revenda
      { id: 'pain_points',       label: 'Pain Points',              enabled: false, weight: 0  },
      { id: 'about',             label: 'Sobre',                    enabled: false, weight: 0  },
      { id: 'how_it_works',      label: 'Como Funciona',            enabled: false, weight: 0  },
    ],
    questionIds: [
      'targetAudience.idealClient',
      'contacts.whatsapp',
      'differentials',
      'branding.preferredTone',
      'branding.preferredColors',
      'contacts.paymentMethods',
      'faq',
      'testimonials',
    ],
    categorySpecificQuestions: [
      {
        id: 'business.deliveryAvailable',
        priority: 'critical',
        type: 'single_choice',
        question: 'Você faz entrega (delivery) dos produtos?',
        hint: 'Isso define se haverá destaque para área de entrega e prazo.',
        skipLabel: 'Pular',
        options: {
          default: [
            'Sim, entrego em toda a cidade',
            'Sim, entrego em todo o Brasil (pelos Correios)',
            'Sim, entrego em bairros específicos',
            'Não, somente retirada no local',
            'Somente via WhatsApp / catálogo digital',
          ],
        },
      },
      {
        id: 'business.catalogType',
        priority: 'important',
        type: 'single_choice',
        question: 'Como os clientes acessam seus produtos?',
        hint: 'Define a estrutura da vitrine e do CTA principal.',
        skipLabel: 'Pular',
        options: {
          default: [
            'Catálogo no WhatsApp / Loja no WhatsApp',
            'Instagram Shopping',
            'Site próprio / loja virtual',
            'Somente loja física',
            'Encomendas direto pelo WhatsApp',
          ],
        },
      },
      {
        id: 'business.installments',
        priority: 'important',
        type: 'single_choice',
        question: 'Você parcela as vendas? Em quantas vezes?',
        hint: 'Facilidade de parcelamento é um dos maiores conversores em lojas.',
        skipLabel: 'Pular',
        options: {
          default: [
            'Sim, em até 2x sem juros',
            'Sim, em até 3x sem juros',
            'Sim, em até 6x sem juros',
            'Sim, em até 12x (com juros do cartão)',
            'Não parcelo, somente à vista',
          ],
        },
      },
    ],
    promptRules: `
CATEGORIA: Revenda / Loja

ÊNFASE PRINCIPAL: A vitrine de produtos é o elemento central. O cliente decide comprar pela foto e pela facilidade de aquisição.

SEÇÕES PRIORITÁRIAS (nesta ordem de impacto):
1. Produtos em Destaque — Grid de produtos com foto, nome, preço (se aplicável) e botão "Pedir pelo WhatsApp"
2. Diferenciais de Compra — Entrega rápida, parcelamento, troca garantida, preço justo
3. Como Comprar — 3 passos simples: Ver catálogo → Escolher → Pedir pelo WhatsApp
4. FAQ — Frete, prazo de entrega, política de troca, formas de pagamento

COPY STRATEGY:
- Headline: proposta de valor da loja ("Moda feminina com preço justo", "Eletrônicos originais com garantia")
- Subheadline: facilidade de compra ("Peça pelo WhatsApp e receba em casa")
- CTA principal: "Ver Catálogo", "Ver Produtos", "Comprar pelo WhatsApp"
- Destacar parcelamento, frete grátis (se houver), garantia e troca

NÃO incluir:
- Seção "Sobre o Dono" (irrelevante para loja)
- Seção "Pain Points" genérica
- "Como Funciona" no estilo serviço — substituir por "Como Comprar"
- Credenciais ou formação do proprietário
`,
  },

  // ─────────────────────────────────────────────────────────────────
  // 4. SAÚDE
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'saude',
    label: 'Saúde',
    examples: 'Médico, Dentista, Psicólogo, Nutricionista, Fisioterapeuta',
    icon: '🩺',
    primaryCTA: 'Agendar Consulta',
    primaryCTAAction: 'whatsapp_appointment',
    mainConversionGoal: 'agendar_consulta',
    voiceTone: 'tecnico_acolhedor',
    voiceToneDescription: 'Autoridade técnica equilibrada com humanização. Transmite segurança, competência e empatia. Evita jargões excessivos.',
    keywords: ['saúde', 'saude', 'médico', 'medico', 'clínica', 'clinica', 'dentista', 'odontologia', 'psicólogo', 'psicologo', 'psiquiatra', 'nutricionista', 'fisioterapeuta', 'fisioterapia', 'consultório', 'consultorio', 'pediatra', 'ginecologista', 'cardiologista', 'dermatologista', 'ortopedista', 'neurologista', 'endocrinologista'],
    sections: [
      { id: 'hero',           label: 'Hero com Autoridade',         enabled: true,  weight: 10 },
      { id: 'authority',      label: 'Autoridade + Credenciais',    enabled: true,  weight: 10 },
      { id: 'specialties',    label: 'Especialidades / Tratamentos',enabled: true,  weight: 9  },
      { id: 'credentials',    label: 'Formação / CRM / CRO / CRP',  enabled: true,  weight: 9  },
      { id: 'process',        label: 'Processo da Consulta',        enabled: true,  weight: 8  },
      { id: 'testimonials',   label: 'Depoimentos de Pacientes',    enabled: true,  weight: 9  },
      { id: 'faq',            label: 'FAQ (plano, agendamento)',     enabled: true,  weight: 8  },
      { id: 'cta_final',      label: 'CTA Final',                   enabled: true,  weight: 10 },
      { id: 'footer',         label: 'Footer + Localização',        enabled: true,  weight: 6  },
      // Seções DESABILITADAS para saúde
      { id: 'pain_points',    label: 'Pain Points (genérico)',      enabled: false, weight: 0  },
      { id: 'gallery',        label: 'Galeria de Resultados',       enabled: false, weight: 0  },
    ],
    questionIds: [
      'targetAudience.idealClient',
      'contacts.whatsapp',
      'differentials',
      'branding.preferredTone',
      'branding.preferredColors',
      'contacts.openingHours',
      'contacts.paymentMethods',
      'faq',
      'testimonials',
      'process.steps',
    ],
    categorySpecificQuestions: [
      {
        id: 'business.insuranceAccepted',
        priority: 'critical',
        type: 'single_choice',
        question: 'Você aceita plano de saúde?',
        hint: 'Esta informação é decisiva para muitos pacientes e deve aparecer em destaque.',
        skipLabel: 'Pular',
        options: {
          default: [
            'Sim, aceito vários convênios (Unimed, Bradesco, SulAmérica...)',
            'Sim, aceito alguns convênios (informar quais)',
            'Não aceito planos, somente consulta particular',
            'Aceito reembolso por convênio',
            'Atendimento pelo SUS',
          ],
        },
      },
      {
        id: 'business.credentials',
        priority: 'critical',
        type: 'text_input',
        question: 'Qual o número do seu registro profissional? (CRM, CRO, CRP, CRN, CREFITO...)',
        hint: 'O registro profissional é prova de credibilidade e obrigatório para profissionais de saúde regulamentados.',
        skipLabel: 'Omitir credencial',
        options: { default: [] },
      },
      {
        id: 'business.mainSpecialty',
        priority: 'critical',
        type: 'text_input',
        question: 'Qual é a sua especialidade principal ou foco de atendimento?',
        hint: 'Ex: Implante Dentário, Ansiedade e Depressão, Emagrecimento e Reeducação Alimentar.',
        skipLabel: 'Pular',
        options: { default: [] },
      },
    ],
    promptRules: `
CATEGORIA: Saúde (Médico / Dentista / Psicólogo / Nutricionista)

ÊNFASE PRINCIPAL: Autoridade e credibilidade são os pilares de conversão. O paciente precisa confiar ANTES de agendar.

SEÇÕES PRIORITÁRIAS (nesta ordem de impacto):
1. Autoridade — Foto profissional de alta qualidade, nome completo, especialidade, registro profissional
2. Credenciais — Formação, pós-graduação, cursos relevantes, tempo de experiência
3. Especialidades — Tratamentos/procedimentos com linguagem acessível (não técnica demais)
4. Processo da Consulta — Como é o atendimento, o que esperar na primeira consulta
5. Depoimentos — De preferência com nome e contexto (ex: "paciente há 3 anos")

COPY STRATEGY:
- NÃO usar "Pain Points" genéricos — em saúde isso pode soar explorador
- Usar linguagem empática e humanizada: "Cuidamos da sua saúde com atenção individualizada"
- Destacar se aceita plano de saúde em posição de destaque (após o Hero)
- CTA principal: "Agendar Consulta pelo WhatsApp"
- FAQ deve responder: plano aceito, valor da consulta, como agendar, o que levar

COMPLIANCE:
- Não fazer promessas de cura ou resultados garantidos (CFM/CFO/CFP)
- Não usar linguagem sensacionalista ou que induza medo excessivo
`,
  },

  // ─────────────────────────────────────────────────────────────────
  // 5. SERVIÇO PROFISSIONAL
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'profissional',
    label: 'Serviço Profissional',
    examples: 'Advogado, Contador, Consultor, Arquiteto, Designer',
    icon: '💼',
    primaryCTA: 'Solicitar Orçamento',
    primaryCTAAction: 'whatsapp_quote',
    mainConversionGoal: 'solicitar_orcamento',
    voiceTone: 'tecnico',
    voiceToneDescription: 'Formal, preciso, que demonstra expertise e profissionalismo. Transmite competência e confiabilidade.',
    keywords: ['advogado', 'advocacia', 'juridico', 'jurídico', 'direito', 'contador', 'contabilidade', 'contabil', 'contábil', 'consultor', 'consultoria', 'arquiteto', 'arquitetura', 'designer', 'agência', 'agencia', 'marketing', 'assessoria', 'coach', 'mentor', 'engenheiro', 'engenharia', 'financeiro', 'investimento'],
    sections: [
      { id: 'hero',           label: 'Hero com Proposta de Valor',  enabled: true,  weight: 10 },
      { id: 'authority',      label: 'Autoridade + Credenciais',    enabled: true,  weight: 10 },
      { id: 'services',       label: 'Áreas de Atuação',            enabled: true,  weight: 9  },
      { id: 'cases',          label: 'Cases / Resultados',          enabled: true,  weight: 9  },
      { id: 'credentials',    label: 'Formação / OAB / CRC / CAU',  enabled: true,  weight: 8  },
      { id: 'process',        label: 'Processo de Atendimento',     enabled: true,  weight: 8  },
      { id: 'testimonials',   label: 'Depoimentos de Clientes',     enabled: true,  weight: 8  },
      { id: 'faq',            label: 'FAQ',                         enabled: true,  weight: 7  },
      { id: 'cta_final',      label: 'CTA Final',                   enabled: true,  weight: 10 },
      { id: 'footer',         label: 'Footer',                      enabled: true,  weight: 6  },
      // Seções DESABILITADAS
      { id: 'pain_points',    label: 'Pain Points (genérico)',      enabled: false, weight: 0  },
      { id: 'gallery',        label: 'Galeria',                     enabled: false, weight: 0  },
      { id: 'how_it_works',   label: 'Como Funciona simples',       enabled: false, weight: 0  },
    ],
    questionIds: [
      'targetAudience.idealClient',
      'contacts.whatsapp',
      'differentials',
      'branding.preferredTone',
      'branding.preferredColors',
      'contacts.openingHours',
      'faq',
      'testimonials',
      'process.steps',
    ],
    categorySpecificQuestions: [
      {
        id: 'business.professionalRegistration',
        priority: 'critical',
        type: 'text_input',
        question: 'Qual o número do seu registro profissional? (OAB, CRC, CAU, CFA...)',
        hint: 'Registro profissional é sinal de credibilidade e legalidade. Aparecerá em destaque.',
        skipLabel: 'Omitir registro',
        options: { default: [] },
      },
      {
        id: 'business.yearsExperience',
        priority: 'important',
        type: 'text_input',
        question: 'Quantos anos de experiência no mercado?',
        hint: 'Tempo de experiência é um dos gatilhos de autoridade mais eficazes.',
        skipLabel: 'Pular',
        options: { default: [] },
      },
      {
        id: 'business.consultationType',
        priority: 'important',
        type: 'single_choice',
        question: 'Como funciona o primeiro contato com você?',
        hint: 'Define o fluxo de conversão e o processo de onboarding do cliente.',
        skipLabel: 'Pular',
        options: {
          default: [
            'Consulta inicial gratuita pelo WhatsApp/videochamada',
            'Consulta inicial paga (valor a combinar)',
            'Preenchimento de formulário + proposta por e-mail',
            'Reunião presencial no escritório',
            'Orçamento detalhado por escrito',
          ],
        },
      },
    ],
    promptRules: `
CATEGORIA: Serviço Profissional (Advogado / Contador / Consultor / Arquiteto)

ÊNFASE PRINCIPAL: Autoridade técnica e resultados comprovados são os pilares. O cliente precisa sentir que está contratando o melhor.

SEÇÕES PRIORITÁRIAS (nesta ordem de impacto):
1. Autoridade — Apresentação profissional forte, registro, especialidade clara
2. Áreas de Atuação — Serviços descritos com linguagem que o cliente entende
3. Cases / Resultados — Resultados concretos obtidos para outros clientes (sem violar sigilo)
4. Processo — Como funciona o atendimento passo a passo
5. Depoimentos — De clientes satisfeitos com contexto do problema resolvido

COPY STRATEGY:
- Headline: benefício direto ("Proteja seu patrimônio com assessoria jurídica especializada")
- Subheadline: credencial de autoridade ("X anos de experiência, Y casos resolvidos")
- CTA principal: "Solicitar Orçamento pelo WhatsApp" ou "Agendar Consultoria"
- Tom formal mas não distante — competente e acessível

NÃO incluir:
- "Como Funciona em 3 Passos" simplificado (usar Processo de Atendimento detalhado)
- Pain Points genéricos (substitua por um problema real do nicho)
- Galeria de fotos de resultado (exceto arquitetos/designers)
- Preços fixos (redirecionar para consulta de orçamento)
`,
  },

  // ─────────────────────────────────────────────────────────────────
  // 6. FITNESS / BEM-ESTAR
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'fitness',
    label: 'Fitness / Bem-estar',
    examples: 'Academia, Personal Trainer, Pilates, Crossfit, Yoga',
    icon: '💪',
    primaryCTA: 'Aula Experimental Grátis',
    primaryCTAAction: 'free_trial',
    mainConversionGoal: 'aula_experimental',
    voiceTone: 'motivacional',
    voiceToneDescription: 'Enérgico, motivador, que inspira ação e transformação. Usa linguagem de superação sem ser agressivo.',
    keywords: ['academia', 'fitness', 'treino', 'crossfit', 'musculação', 'musculacao', 'personal', 'pilates', 'yoga', 'funcional', 'emagrecer', 'emagrecimento', 'hipertrofia', 'corpo', 'saúde', 'bem-estar', 'bem estar', 'spinning', 'bike', 'dança', 'danca', 'zumba', 'natação', 'natacao'],
    sections: [
      { id: 'hero',               label: 'Hero com Transformação',    enabled: true,  weight: 10 },
      { id: 'transformation',     label: 'Transformação / Antes-Depois', enabled: true, weight: 10 },
      { id: 'plans',              label: 'Planos / Preços',           enabled: true,  weight: 9  },
      { id: 'free_trial',         label: 'Aula Experimental Grátis',  enabled: true,  weight: 10 },
      { id: 'differentials',      label: 'Diferenciais',              enabled: true,  weight: 8  },
      { id: 'testimonials',       label: 'Depoimentos + Resultados',  enabled: true,  weight: 9  },
      { id: 'gallery',            label: 'Galeria do Ambiente',       enabled: true,  weight: 7  },
      { id: 'faq',                label: 'FAQ',                       enabled: true,  weight: 7  },
      { id: 'cta_final',          label: 'CTA Final',                 enabled: true,  weight: 10 },
      { id: 'footer',             label: 'Footer + Localização',      enabled: true,  weight: 6  },
      // Seções DESABILITADAS
      { id: 'about',              label: 'Sobre (secundário)',         enabled: false, weight: 0  },
      { id: 'pain_points',        label: 'Pain Points',               enabled: false, weight: 0  },
    ],
    questionIds: [
      'targetAudience.idealClient',
      'targetAudience.primaryPain',
      'contacts.whatsapp',
      'targetAudience.mainObjection',
      'differentials',
      'branding.preferredTone',
      'branding.preferredColors',
      'contacts.openingHours',
      'contacts.paymentMethods',
      'faq',
      'testimonials',
    ],
    categorySpecificQuestions: [
      {
        id: 'business.trialAvailable',
        priority: 'critical',
        type: 'single_choice',
        question: 'Você oferece alguma aula ou período experimental gratuito?',
        hint: 'A aula grátis é o principal conversor para academias e studios.',
        skipLabel: 'Não oferece experimental',
        options: {
          default: [
            'Sim, 1 aula experimental completamente grátis',
            'Sim, 3 dias experimentais grátis',
            'Sim, 1 semana experimental grátis',
            'Sim, período de teste com desconto especial',
            'Não, mas tenho a primeira mensalidade com desconto',
          ],
        },
      },
      {
        id: 'business.plansAvailable',
        priority: 'important',
        type: 'text_input',
        question: 'Quais os planos disponíveis? (Descreva nome + preço aproximado)',
        hint: 'Ex: Mensal R$99 / Trimestral R$249 / Anual R$799. A seção de planos é decisiva.',
        skipLabel: 'Não exibir preços na LP',
        options: { default: [] },
      },
    ],
    promptRules: `
CATEGORIA: Fitness / Bem-estar (Academia / Personal / Pilates)

ÊNFASE PRINCIPAL: Transformação visual e motivação emocional. O cliente compra o resultado, não o serviço.

SEÇÕES PRIORITÁRIAS (nesta ordem de impacto):
1. Transformação — Antes e depois de alunos reais, depoimentos com resultado concreto
2. Aula Experimental Grátis — CTA em destaque máximo, sem fricção para testar
3. Planos e Preços — Tabela de planos clara com destaque no plano mais popular
4. Depoimentos — Com resultados específicos ("perdi 12kg em 3 meses")

COPY STRATEGY:
- Headline: transformação desejada ("Seu melhor corpo começa aqui", "Emagreça e ganhe energia de verdade")
- Subheadline: reduzir fricção ("Primeira aula 100% grátis, sem compromisso")
- CTA principal: "Garantir Minha Aula Grátis" (não "Agendar")
- Tom motivacional mas sem promessas irrealistas

NÃO incluir:
- Autoridade técnica excessiva (substitua por resultados dos alunos)
- Credenciais formais (CREF aparece discretamente no footer)
- Processo de atendimento complexo (deve parecer fácil começar)
`,
  },

  // ─────────────────────────────────────────────────────────────────
  // 7. EDUCAÇÃO
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'educacao',
    label: 'Educação',
    examples: 'Escola, Curso, Professor Particular, Coaching',
    icon: '📚',
    primaryCTA: 'Matricular / Visitar',
    primaryCTAAction: 'enrollment',
    mainConversionGoal: 'matricula',
    voiceTone: 'inspirador',
    voiceToneDescription: 'Inspirador e acolhedor. Transmite que o aprendizado é transformador e acessível. Usa linguagem de crescimento e evolução.',
    keywords: ['escola', 'curso', 'professor', 'professora', 'aula', 'ensino', 'educação', 'educacao', 'coaching', 'coach', 'mentoría', 'mentoria', 'mentor', 'treinamento', 'workshop', 'capacitação', 'capacitacao', 'idioma', 'inglês', 'ingles', 'musica', 'música', 'dança', 'concurso', 'vestibular', 'enem'],
    sections: [
      { id: 'hero',           label: 'Hero com Proposta Educacional', enabled: true,  weight: 10 },
      { id: 'method',         label: 'Método / Diferencial Pedagógico', enabled: true, weight: 10 },
      { id: 'results',        label: 'Resultados / Aprovações',       enabled: true,  weight: 9  },
      { id: 'testimonials',   label: 'Depoimentos de Alunos',         enabled: true,  weight: 9  },
      { id: 'enrollment',     label: 'Processo de Matrícula',         enabled: true,  weight: 8  },
      { id: 'differentials',  label: 'Diferenciais',                  enabled: true,  weight: 8  },
      { id: 'faq',            label: 'FAQ',                           enabled: true,  weight: 7  },
      { id: 'cta_final',      label: 'CTA Final',                     enabled: true,  weight: 10 },
      { id: 'footer',         label: 'Footer + Localização',          enabled: true,  weight: 6  },
      // Seções DESABILITADAS
      { id: 'pain_points',    label: 'Pain Points',                   enabled: false, weight: 0  },
      { id: 'gallery',        label: 'Galeria',                       enabled: false, weight: 0  },
    ],
    questionIds: [
      'targetAudience.idealClient',
      'contacts.whatsapp',
      'differentials',
      'branding.preferredTone',
      'branding.preferredColors',
      'contacts.openingHours',
      'contacts.paymentMethods',
      'faq',
      'testimonials',
    ],
    categorySpecificQuestions: [
      {
        id: 'business.teachingMethod',
        priority: 'critical',
        type: 'text_input',
        question: 'Qual é o grande diferencial do seu método de ensino?',
        hint: 'O que faz o seu curso/escola ser diferente das demais opções? Ex: "Aulas práticas 70% do tempo", "Turmas reduzidas com até 8 alunos".',
        skipLabel: 'Pular',
        options: { default: [] },
      },
      {
        id: 'business.notableResults',
        priority: 'important',
        type: 'text_input',
        question: 'Você tem resultados ou aprovações notáveis para destacar?',
        hint: 'Ex: "95% dos alunos aprovados no vestibular", "Mais de 200 alunos formados", "Alunos em empresas internacionais".',
        skipLabel: 'Pular',
        options: { default: [] },
      },
      {
        id: 'business.modality',
        priority: 'important',
        type: 'single_choice',
        question: 'Como são as aulas?',
        hint: 'Define a comunicação sobre formato e acessibilidade do curso.',
        skipLabel: 'Pular',
        options: {
          default: [
            'Presencial (no local físico)',
            'Online ao vivo (videoconferência)',
            'Online gravado (acesso a qualquer hora)',
            'Híbrido (presencial + online)',
            'Domiciliar (professor vai até o aluno)',
          ],
        },
      },
    ],
    promptRules: `
CATEGORIA: Educação (Escola / Curso / Professor Particular)

ÊNFASE PRINCIPAL: O método e os resultados dos alunos são os pilares de conversão. O cliente compra transformação e futuro.

SEÇÕES PRIORITÁRIAS (nesta ordem de impacto):
1. Método — O que torna o ensino único e eficaz
2. Resultados / Aprovações — Números concretos, conquistas de alunos
3. Depoimentos de Alunos — Com contexto: "Aprovado em X após Y meses"
4. Processo de Matrícula — Simples, sem burocracia aparente

COPY STRATEGY:
- Headline: resultado final desejado pelo aluno ("Aprenda inglês em 6 meses", "Passe no vestibular")
- Subheadline: o método ou diferencial ("Com o método X, turmas de até 8 alunos")
- CTA principal: "Garantir Minha Vaga", "Agendar Visita" ou "Matricular pelo WhatsApp"
- Depoimentos com nome, curso e resultado específico

NÃO incluir:
- "Pain Points" genéricos (substituir por storytelling do aluno que alcançou o resultado)
- Galeria de ambiente como foco principal (o método importa mais que o espaço físico)
- Preços sem contexto (explicar o valor antes do preço)
`,
  },

  // ─────────────────────────────────────────────────────────────────
  // 8. SERVIÇO TÉCNICO
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'tecnico',
    label: 'Serviço Técnico',
    examples: 'Mecânico, Eletricista, Encanador, Marido de Aluguel',
    icon: '🔧',
    primaryCTA: 'Solicitar Orçamento Agora',
    primaryCTAAction: 'whatsapp_quote_urgent',
    mainConversionGoal: 'solicitar_orcamento',
    voiceTone: 'confiavel',
    voiceToneDescription: 'Direto, confiável, que transmite competência técnica e credibilidade. Foca em rapidez, garantia e profissionalismo.',
    keywords: ['mecânico', 'mecanico', 'mecânica', 'mecanica', 'eletricista', 'elétrico', 'eletrico', 'encanador', 'encanamento', 'hidráulico', 'hidraulico', 'marido', 'aluguel', 'reforma', 'pedreiro', 'pintor', 'pintura', 'marceneiro', 'marcenaria', 'ar condicionado', 'refrigeração', 'refrigeracao', 'técnico', 'tecnico', 'conserto', 'manutenção', 'manutencao'],
    sections: [
      { id: 'hero',           label: 'Hero com Urgência',            enabled: true,  weight: 10 },
      { id: 'services',       label: 'Serviços Oferecidos',          enabled: true,  weight: 10 },
      { id: 'credibility',    label: 'Credibilidade (anos/fotos)',    enabled: true,  weight: 9  },
      { id: 'service_area',   label: 'Área de Atendimento',          enabled: true,  weight: 8  },
      { id: 'differentials',  label: 'Diferenciais',                 enabled: true,  weight: 8  },
      { id: 'testimonials',   label: 'Depoimentos',                  enabled: true,  weight: 9  },
      { id: 'faq',            label: 'FAQ (garantia, prazo, valor)',  enabled: true,  weight: 8  },
      { id: 'cta_final',      label: 'CTA Final com Urgência',       enabled: true,  weight: 10 },
      { id: 'footer',         label: 'Footer',                       enabled: true,  weight: 6  },
      // Seções DESABILITADAS
      { id: 'pain_points',    label: 'Pain Points',                  enabled: false, weight: 0  },
      { id: 'about',          label: 'Sobre',                        enabled: false, weight: 0  },
      { id: 'how_it_works',   label: 'Como Funciona formal',         enabled: false, weight: 0  },
    ],
    questionIds: [
      'targetAudience.idealClient',
      'contacts.whatsapp',
      'differentials',
      'branding.preferredTone',
      'branding.preferredColors',
      'contacts.openingHours',
      'contacts.paymentMethods',
      'faq',
      'testimonials',
    ],
    categorySpecificQuestions: [
      {
        id: 'business.serviceArea',
        priority: 'critical',
        type: 'text_input',
        question: 'Qual é a área de atendimento? (bairros, cidades ou raio em km)',
        hint: 'Clientes locais precisam saber se você atende na região deles.',
        skipLabel: 'Pular',
        options: { default: [] },
      },
      {
        id: 'business.urgencyAvailable',
        priority: 'important',
        type: 'single_choice',
        question: 'Você atende emergências / urgências?',
        hint: 'Atendimento urgente é um diferencial muito valorizado em serviços técnicos.',
        skipLabel: 'Pular',
        options: {
          default: [
            'Sim, atendo 24h emergências',
            'Sim, atendo urgências em horário comercial',
            'Agendo para o próximo dia útil',
            'Somente com agendamento prévio',
          ],
        },
      },
      {
        id: 'business.warrantyPeriod',
        priority: 'important',
        type: 'single_choice',
        question: 'Qual é o prazo de garantia dos seus serviços?',
        hint: 'Garantia é o principal neutralizador de objeções em serviços técnicos.',
        skipLabel: 'Sem garantia formal',
        options: {
          default: [
            '30 dias de garantia',
            '90 dias de garantia',
            '6 meses de garantia',
            '1 ano de garantia',
            'Garantia vitalícia na mão de obra',
          ],
        },
      },
    ],
    promptRules: `
CATEGORIA: Serviço Técnico (Mecânico / Eletricista / Encanador)

ÊNFASE PRINCIPAL: Credibilidade, rapidez e garantia são os pilares. O cliente precisa sentir que pode confiar e que o problema será resolvido.

SEÇÕES PRIORITÁRIAS (nesta ordem de impacto):
1. Serviços — Lista clara de todos os serviços prestados
2. Credibilidade — Anos no mercado, número de atendimentos, fotos de trabalhos realizados
3. Área de Atendimento — Mapa ou lista de bairros/cidades atendidos
4. Garantia — Destaque visual para o prazo de garantia oferecido
5. CTA com urgência — "Solicitar Orçamento AGORA" ou "Ligar Agora"

COPY STRATEGY:
- Headline: solução rápida ("Eletricista em até 1h na sua casa", "Conserto de ar-condicionado com garantia")
- Subheadline: credibilidade + urgência ("X anos de experiência, orçamento sem compromisso")
- CTA principal: "Solicitar Orçamento pelo WhatsApp" (urgente, imediato)
- Depoimentos: clientes que tiveram problema resolvido rapidamente

NÃO incluir:
- Credenciais formais longas (diferente de profissional de saúde/direito)
- Processo de atendimento burocrático (deve parecer simples e rápido)
- "Pain Points" — substitua por "Problemas que resolvemos" como lista de serviços
`,
  },
];

// ─────────────────────────────────────────────────────────────────
// FUNÇÕES UTILITÁRIAS
// ─────────────────────────────────────────────────────────────────

/**
 * Retorna a categoria pelo ID
 * @param {string} categoryId
 * @returns {Object|null}
 */
export function getCategoryById(categoryId) {
  return BUSINESS_CATEGORIES.find(c => c.id === categoryId) || null;
}

/**
 * Detecta a categoria mais provável a partir do segmento (string livre do Instagram)
 * @param {string} segment - Segmento detectado pelo Instagram
 * @returns {Object|null} - Categoria detectada ou null
 */
export function detectCategoryFromSegment(segment) {
  if (!segment) return null;
  const s = segment.toLowerCase();

  let bestMatch = null;
  let bestScore = 0;

  for (const category of BUSINESS_CATEGORIES) {
    let score = 0;
    for (const keyword of category.keywords) {
      if (s.includes(keyword)) {
        // Dar peso maior para keywords mais longas (mais específicas)
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = category;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

/**
 * Retorna as seções ativas (enabled: true) da categoria, ordenadas por weight (decrescente)
 * @param {string} categoryId
 * @returns {Array}
 */
export function getActiveSections(categoryId) {
  const category = getCategoryById(categoryId);
  if (!category) return [];
  return category.sections
    .filter(s => s.enabled)
    .sort((a, b) => b.weight - a.weight);
}

/**
 * Formata as seções ativas como texto para injeção no prompt (placeholder {ARQUITETURA_SECOES})
 * @param {string} categoryId
 * @returns {string}
 */
export function formatSectionsForPrompt(categoryId) {
  const category = getCategoryById(categoryId);
  if (!category) {
    return `1. Hero\n2. Diferenciais\n3. Serviços\n4. Depoimentos\n5. FAQ\n6. CTA Final\n7. Footer`;
  }

  const enabledSections = category.sections.filter(s => s.enabled);
  const disabledSections = category.sections.filter(s => !s.enabled);

  let text = '';
  enabledSections.forEach((s, i) => {
    text += `${i + 1}. ${s.label}\n`;
  });

  if (disabledSections.length > 0) {
    text += `\nSEÇÕES NÃO INCLUÍDAS (não gerar para este segmento):\n`;
    disabledSections.forEach(s => {
      text += `❌ ${s.label}\n`;
    });
  }

  return text.trim();
}

/**
 * Retorna as perguntas específicas de uma categoria (categorySpecificQuestions)
 * com optionsList já preparada
 * @param {string} categoryId
 * @returns {Array}
 */
export function getCategorySpecificQuestions(categoryId) {
  const category = getCategoryById(categoryId);
  if (!category) return [];
  return category.categorySpecificQuestions.map(q => ({
    ...q,
    optionsList: q.options?.default || [],
  }));
}
