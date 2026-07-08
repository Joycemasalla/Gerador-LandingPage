/**
 * Banco de perguntas do wizard de entrevista guiada.
 * Contém perguntas estruturadas com prioridade, tipo e opções contextuais por segmento de mercado.
 */

export const questions = [
  {
    id: "targetAudience.idealClient",
    priority: "critical",
    type: "single_choice",
    question: "Quem é o cliente principal de {{businessName}}?",
    hint: "Isso define a linguagem e o tom de toda a landing page.",
    skipLabel: "Deixar a IA decidir",
    options: {
      default: [
        "Pessoas que buscam atendimento personalizado e de alta qualidade",
        "Profissionais urbanos que valorizam conveniência e agilidade",
        "Famílias que buscam segurança, conforto e cuidado premium",
        "Jovens modernos interessados em novidades e tendências"
      ],
      barbearia: [
        "Homens modernos que valorizam estilo, barba bem cuidada e corte alinhado",
        "Jovens urbanos que buscam cortes modernos, degradê perfeito e um ambiente descontraído",
        "Homens de negócios que precisam de um visual impecável e atendimento pontual",
        "Pai e filho que buscam um momento de cuidado compartilhado tradicional"
      ],
      salao: [
        "Mulheres que buscam transformação capilar de alto nível (loiras, coloração, alisamento)",
        "Profissionais modernas que necessitam de cuidados práticos e duradouros no dia a dia",
        "Noivas e madrinhas buscando dia de princesa para eventos especiais",
        "Mulheres focadas em tratamentos de saúde capilar e cronograma personalizado"
      ],
      estetica: [
        "Mulheres e homens focados em rejuvenescimento facial e contorno corporal",
        "Pessoas buscando redução de medidas, gordura localizada e celulite rapidamente",
        "Clientes buscando cuidados com a pele (limpeza profunda, acne, manchas)",
        "Pessoas estressadas que procuram bem-estar, relaxamento e massagens corporais"
      ],
      hamburgueria: [
        "Jovens e casais fãs de hambúrguer artesanal suculento com blend premium",
        "Famílias que buscam lanches saborosos, porções caprichadas e ambiente acolhedor",
        "Fãs de smash burger rápido com ingredientes frescos para comer a qualquer hora",
        "Grupo de amigos procurando um ponto de encontro animado e boas bebidas"
      ],
      petshop: [
        "Tutores dedicados que tratam seus cães e gatos como membros da família",
        "Donos de pets que necessitam de serviços de banho, tosa e higiene com alto carinho",
        "Tutores de animais exóticos ou que precisam de rações e acessórios específicos",
        "Pessoas ocupadas que precisam de serviço de leva-e-traz para seus pets"
      ],
      saude: [
        "Pessoas de todas as idades que procuram atendimento médico atencioso e humanizado",
        "Pacientes com dores crônicas buscando reabilitação ou alívio com profissionais qualificados",
        "Pessoas focadas em medicina preventiva, check-up e melhora da qualidade de vida",
        "Famílias procurando cuidados contínuos e acompanhamento médico próximo"
      ],
      academia: [
        "Iniciantes buscando emagrecimento, saúde e mudança de hábitos com apoio de instrutores",
        "Praticantes avançados focados em hipertrofia, força e alta performance esportiva",
        "Pessoas maduras que procuram exercícios para longevidade, postura e flexibilidade",
        "Jovens e adults que gostam de treinos dinâmicos, aulas coletivas e crossfit"
      ],
      restaurante: [
        "Casais e famílias que buscam uma experiência gastronômica memorável e saborosa",
        "Profissionais que almoçam fora e necessitam de prato feito de qualidade e rápido",
        "Fãs da culinária típica (italiana, japonesa, brasileira) preparados com ingredientes selecionados",
        "Pessoas que celebram datas especiais em um ambiente diferenciado e intimista"
      ]
    }
  },
  {
    id: "targetAudience.primaryPain",
    priority: "critical",
    type: "single_choice",
    question: "Qual é a dor ou frustração principal que seu cliente enfrenta?",
    hint: "Conectar-se com a dor real do cliente é a melhor técnica de conversão (CRO).",
    skipLabel: "Deixar a IA deduzir",
    options: {
      default: [
        "Dificuldade de encontrar serviços confiáveis e com garantia de qualidade",
        "Falta de tempo para pesquisar e agendar atendimentos de forma simples",
        "Preços abusivos que não correspondem à qualidade entregue",
        "Atendimento impessoal e frio que não entende as necessidades reais"
      ],
      barbearia: [
        "Dificuldade de encontrar um barbeiro que realmente entenda meu estilo",
        "Degradê que desanda ou perde a linha em apenas 2 dias após o corte",
        "Longas filas de espera e atrasos constantes sem hora marcada",
        "Atendimento apressado, sem atenção aos detalhes e acabamento malfeito"
      ],
      salao: [
        "Medo de o loiro ficar amarelado, ressecado ou sofrer corte químico",
        "Sair do salão decepcionada com o resultado diferente do que foi pedido",
        "Salões que cobram caro mas usam produtos de baixa qualidade ou sem registro",
        "Escova ou penteado que desmancha logo no início da festa ou evento"
      ],
      estetica: [
        "Procedimentos que prometem milagres mas não entregam nenhum resultado visível",
        "Falta de confiança sobre a qualificação do profissional que realiza a aplicação",
        "Medo de sentir dor excessiva ou sofrer queimaduras em procedimentos com laser/ácidos",
        "Resultados que duram pouquíssimo tempo por falta de acompanhamento pós-tratamento"
      ],
      hamburgueria: [
        "Lanches que chegam frios, murchos ou montados de forma desleixada no delivery",
        "Ingredientes industrializados e sem sabor que não satisfazem o apetite",
        "Tempo de espera absurdo, tanto na mesa do salão quanto no prazo de entrega",
        "Hambúrguer com preço premium que na realidade parece um lanche comum de fast-food"
      ],
      petshop: [
        "Medo de deixar o pet com profissionais que possam tratá-lo com grosseria ou agressividade",
        "Pets que voltam extremamente estressados, tremendo ou machucados do banho e tosa",
        "Falta de higiene visível na área de banho e tosa dos animais",
        "Dificuldade crônica de encontrar horários convenientes na agenda do estabelecimento"
      ],
      saude: [
        "Dificuldade extrema para conseguir uma consulta rápida em momentos de necessidade",
        "Atendimento médico mecânico, frio e focado em passar remédios correndo",
        "Falta de clareza nas explicações e dúvidas que continuam sem resposta após a consulta",
        "Preocupação em não conseguir um acompanhamento contínuo e integrado"
      ],
      academia: [
        "Medo de ser julgado ou se sentir deslocado por não saber usar os aparelhos",
        "Falta de atenção dos instrutores que parecem ignorar quem não é atleta",
        "Ambiente lotado onde é preciso disputar e esperar muito para revezar as máquinas",
        "Treinos genéricos e sem graça que fazem a pessoa desistir no primeiro mês"
      ],
      restaurante: [
        "Pratos insossos, ingredientes de qualidade duvidosa ou que não condizem com o cardápio",
        "Demora excessiva na cozinha que estraga o almoço ou jantar especial",
        "Atendimento confuso, garçons mal treinados e cobranças erradas na conta",
        "Ambiente barulhento, mal climatizado ou com mesas coladas demais umas nas outras"
      ]
    }
  },
  {
    id: "contacts.whatsapp",
    priority: "critical",
    type: "text_input",
    question: "Qual o WhatsApp de atendimento do negócio?",
    hint: "O botão de chamada para ação (CTA) principal direcionará para este número.",
    skipLabel: "Omitir botão de WhatsApp",
    options: {
      default: []
    }
  },
  {
    id: "targetAudience.mainObjection",
    priority: "important",
    type: "single_choice",
    question: "Qual a objeção que mais impede o cliente de fechar com vocês?",
    hint: "A landing page usará textos estratégicos para neutralizar essa barreira.",
    skipLabel: "Pular objeção",
    options: {
      default: [
        "Preço: acham que o serviço é caro demais",
        "Confiança: medo de não ter o resultado prometido",
        "Tempo: acham que o processo demora ou exige muito esforço",
        "Localização: preferem algo mais próximo ou cômodo"
      ],
      barbearia: [
        "Acha que o serviço de barbeiro premium não justifica o preço comparado a cortadores tradicionais",
        "Insegurança se o corte/barba modernos vão se adequar ao formato do seu rosto",
        "Acha que vai perder muito tempo esperando mesmo que agende com horário marcado",
        "Medo de que o local seja barulhento ou desconfortável para relaxar"
      ],
      salao: [
        "Insegurança sobre a saúde do cabelo após procedimentos químicos intensos",
        "Acha que o orçamento vai estourar com taxas e serviços extras embutidos na hora",
        "Dificuldade de encaixar horários de longa duração na rotina apertada",
        "Medo de mudar o visual radicalmente e se arrepender"
      ],
      estetica: [
        "Preço de pacotes estéticos e a necessidade de muitas sessões para ver resultado",
        "Desconfiança se os tratamentos realmente funcionam para o caso específico dela",
        "Medo de dor física, agulhas ou reações adversas na pele",
        "Achar que os resultados vão desaparecer assim que parar as sessões"
      ],
      hamburgueria: [
        "Preço alto cobrado por hambúrguer gourmet quando comparado a lanches simples de bairro",
        "Dúvida se a qualidade do delivery vai se manter excelente até chegar em casa",
        "Achar que o tamanho do hambúrguer não é suficiente para matar a fome",
        "Preocupação se existem opções vegetarianas ou adaptáveis a restrições alimentares"
      ],
      petshop: [
        "Insegurança se o pet será bem tratado na ausência do tutor",
        "Acha que o banho profissional de pet shop é muito caro comparado a lavar em casa",
        "Medo de contaminação por pulgas ou estresse devido ao contato com outros animais no local",
        "Preocupação com a segurança no transporte de leva-e-traz do pet"
      ],
      saude: [
        "Medo de que a consulta particular seja extremamente cara e sem retorno garantido",
        "Insegurança se o profissional realmente se importa com seu histórico ou apenas quer medicar",
        "Preocupação com a demora para agendar retornos ou exames complementares",
        "Dúvida se o consultório aceita reembolso de convênio médico ou formas facilitadas"
      ],
      academia: [
        "Acha que mensalidade de academia é desperdício pois tem histórico de desistir rápido",
        "Sentir vergonha por estar fora de forma ou medo de não se adaptar à rotina de treinos",
        "Dificuldade de encontrar horário livre para treinar sem pegar a academia hiperlotada",
        "Achar que os treinos serão chatos, repetitivos ou causarão lesões corporais"
      ],
      restaurante: [
        "Achar o valor dos pratos elevado demais para refeições cotidianas",
        "Preocupação em pegar filas demoradas na porta para conseguir mesa em dias de pico",
        "Dúvida se a porção é individual ou serve bem duas pessoas",
        "Medo de o ambiente não ser adequado para ir com crianças pequenas ou idosos"
      ]
    }
  },
  {
    id: "differentials",
    priority: "important",
    type: "multi_choice",
    question: "Quais são os principais diferenciais da marca?",
    hint: "Selecione até 3 itens que fazem seu negócio se destacar da concorrência.",
    skipLabel: "Omitir diferenciais",
    options: {
      default: [
        "Atendimento humanizado e personalizado",
        "Profissionais certificados e experientes",
        "Produtos importados e de marcas líderes",
        "Ambiente moderno, climatizado e aconchegante",
        "Facilidade de agendamento online 24h",
        "Garantia total de satisfação ou retoque"
      ],
      barbearia: [
        "Cerveja gelada cortesia ou café especial de boas-vindas",
        "Espaço de lazer com videogame e mesa de bilhar",
        "Especialistas em barboterapia com toalha quente e óleos essenciais",
        "Produtos exclusivos de linha própria para cuidado diário em casa",
        "Atendimento infantil com cadeira temática e paciência",
        "Pontualidade rigorosa nos horários agendados"
      ],
      salao: [
        "Especialistas formados em academias internacionais (ex: Vidal Sassoon)",
        "Diagnóstico capilar digital gratuito antes de iniciar a química",
        "Uso exclusivo de produtos premium livres de formol",
        "Espaço VIP com privacidade para tratamentos mais longos",
        "Bebidas finas e cardápio de lanches saudáveis cortesia",
        "Garantia de retorno e retoque em até 7 dias se necessário"
      ],
      estetica: [
        "Equipamentos de última geração aprovados pela ANVISA",
        "Protocolos exclusivos desenvolvidos internamente com resultados comprovados",
        "Consulta de avaliação integrada com plano de tratamento individualizado",
        "Ambiente privativo com isolamento acústico e cromoterapia",
        "Acompanhamento semanal com fotos de evolução e suporte via WhatsApp",
        "Profissionais pós-graduadas em dermato-funcional ou biomedicina"
      ],
      hamburgueria: [
        "Blend de carnes frescas moído diariamente (nunca congelado)",
        "Pão artesanal de fabricação própria assado a cada poucas horas",
        "Molhos artesanais exclusivos e maionese secreta da casa",
        "Batatas fritas rústicas crocantes feitas na hora",
        "Opções criativas com ingredientes locais e queijos artesanais",
        "Embalagem térmica inovadora que mantém o lanche perfeito até o delivery"
      ],
      petshop: [
        "Câmeras ao vivo para o tutor acompanhar o banho e tosa de onde estiver",
        "Uso exclusivo de cosméticos hipoalergênicos e água em temperatura controlada",
        "Secadores super silenciosos para não estressar ou assustar os pets",
        "Taxistas de pet treinados em direção defensiva e transporte seguro",
        "Brinquedoteca para os pets socializarem antes e depois do banho",
        "Toalhas esterilizadas e embaladas individualmente por motivos de higiene"
      ],
      saude: [
        "Consultas sem pressa com duração mínima de 1 hora",
        "Acesso direto ao WhatsApp do médico para esclarecer dúvidas pós-consulta",
        "Integração com prontuário digital seguro e prescrição via celular",
        "Espaço lúdico para atendimento de crianças ou sala de espera calma",
        "Disponibilidade para consultas domiciliares ou telemedicina imediata",
        "Facilidade na emissão de relatórios detalhados para reembolso de convênio"
      ],
      academia: [
        "Acompanhamento personalizado incluso na mensalidade (sem custo extra)",
        "Avaliação física de alta precisão com bioimpedância mensal",
        "Equipamentos importados de última geração com design ergonômico",
        "Grade ampla de aulas coletivas inclusas (Dança, Pilates, Funcional, Bike)",
        "Ambiente arejado com ar-condicionado central e som profissional",
        "Aplicativo exclusivo para acompanhar treinos, evolução e dicas de nutrição"
      ],
      restaurante: [
        "Ingredientes orgânicos de pequenos produtores da região",
        "Cozinha aberta onde o cliente pode assistir à preparação dos pratos",
        "Carta de vinhos e coquetéis autorais criada por sommeliers renomados",
        "Sobremesas de alta confeitaria preparadas diariamente na casa",
        "Área infantil ampla e segura com monitor para as crianças brincarem",
        "Pratos clássicos servidos com um toque moderno e apresentação impecável"
      ]
    }
  },
  {
    id: "branding.preferredTone",
    priority: "important",
    type: "scale",
    question: "Qual o tom de voz da comunicação da marca?",
    hint: "Arraste o cursor para definir o equilíbrio da escrita comercial.",
    skipLabel: "Manter tom neutro",
    options: {
      default: ["Formal / Profissional", "Descontraído / Persuasivo"]
    }
  },
  {
    id: "branding.preferredColors",
    priority: "important",
    type: "color_picker",
    question: "Quais as cores de preferência para o design?",
    hint: "Selecione uma das paletas curadas para seu segmento ou defina suas cores.",
    skipLabel: "Usar cores extraídas do perfil",
    options: {
      default: [
        { name: "Slate Corporate", colors: ["#1e293b", "#3b82f6", "#f8fafc", "#0f172a"] },
        { name: "Clean Tech", colors: ["#0f172a", "#10b981", "#f9fafb", "#1e293b"] }
      ],
      barbearia: [
        { name: "Industrial Barber", colors: ["#000000", "#d97706", "#f3f4f6", "#111827"] },
        { name: "Vintage Oak", colors: ["#2d1a12", "#c5a880", "#fdfbf7", "#1e110b"] }
      ],
      salao: [
        { name: "Gold Premium", colors: ["#111111", "#c5a880", "#fafafa", "#1f1f1f"] },
        { name: "Rose Chic", colors: ["#2e1520", "#ec4899", "#fff5f7", "#3d1e2b"] }
      ],
      estetica: [
        { name: "Clean Wellness", colors: ["#164e63", "#0d9488", "#f0fdfa", "#115e59"] },
        { name: "Lilac SPA", colors: ["#3b0764", "#a855f7", "#faf5ff", "#581c87"] }
      ],
      hamburgueria: [
        { name: "Brutal Charcoal", colors: ["#0a0a0c", "#dc2626", "#fef2f2", "#18181b"] },
        { name: "Smash Mustard", colors: ["#1c1917", "#eab308", "#fcf8f2", "#292524"] }
      ],
      petshop: [
        { name: "Friendly Doggy", colors: ["#1e3a8a", "#f97316", "#eff6ff", "#1d4ed8"] },
        { name: "Sweet Kitty", colors: ["#1c1917", "#ff7a59", "#fdfbf7", "#ff9b85"] }
      ],
      saude: [
        { name: "Doctor Cyan", colors: ["#0f172a", "#06b6d4", "#f0f9ff", "#0891b2"] },
        { name: "Natural Green", colors: ["#14532d", "#22c55e", "#f0fdf4", "#15803d"] }
      ],
      academia: [
        { name: "Volcano Iron", colors: ["#09090b", "#ea580c", "#fcfcfc", "#171719"] },
        { name: "Acid Electro", colors: ["#000000", "#a3e635", "#f9fafb", "#1a1a1a"] }
      ],
      restaurante: [
        { name: "Italian Bistro", colors: ["#450a0a", "#16a34a", "#fffbeb", "#7f1d1d"] },
        { name: "Sushi Minimal", colors: ["#09090b", "#e11d48", "#fafaf9", "#1c1917"] }
      ]
    }
  },
  {
    id: "contacts.openingHours",
    priority: "important",
    type: "time_selector",
    question: "Quais os horários de funcionamento do negócio?",
    hint: "Marque os dias e os respectivos períodos em que o estabelecimento atende.",
    skipLabel: "Omitir horários",
    options: {
      default: [
        "Segunda a Sexta: 09h às 18h",
        "Sábado: 09h às 13h",
        "Domingo: Fechado"
      ]
    }
  },
  {
    id: "contacts.paymentMethods",
    priority: "important",
    type: "multi_choice",
    question: "Quais as formas de pagamento aceitas?",
    hint: "Selecione as opções aceitas para facilitar a compra do cliente.",
    skipLabel: "Omitir pagamentos",
    options: {
      default: [
        "Pix (com desconto)",
        "Cartão de Crédito (até 3x sem juros)",
        "Cartão de Crédito (até 12x)",
        "Cartão de Débito",
        "Dinheiro",
        "Vale-Alimentação / Refeição"
      ]
    }
  },
  {
    id: "faq",
    priority: "enrichment",
    type: "list_builder",
    question: "Deseja adicionar Perguntas Frequentes (FAQ)?",
    hint: "Deixe respostas prontas para as dúvidas mais comuns dos seus clientes.",
    skipLabel: "Omitir FAQ personalizado",
    options: {
      default: [
        { question: "Preciso agendar horário?", answer: "Sim, trabalhamos exclusivamente com agendamento prévio para garantir atenção total ao seu atendimento." },
        { question: "Quais as formas de pagamento?", answer: "Aceitamos Pix, cartões de débito e crédito. Parcelamos em até 3x sem juros." },
        { question: "Onde vocês ficam localizados?", answer: "Estamos no endereço indicado no rodapé da página. Há estacionamento no local." }
      ]
    }
  },
  {
    id: "testimonials",
    priority: "enrichment",
    type: "list_builder",
    question: "Deseja incluir depoimentos reais dos seus clientes?",
    hint: "Caso pule, a IA gerará depoimentos realistas e sinalizados como exemplo.",
    skipLabel: "Usar exemplos da IA",
    options: {
      default: [
        { name: "Ana Souza", role: "Cliente há 1 ano", rating: 5, text: "O melhor atendimento que já recebi! A equipe é atenciosa e o resultado superou todas as minhas expectativas.", isPlaceholder: false },
        { name: "Carlos Lima", role: "Cliente Mensal", rating: 5, text: "Ambiente impecável, pontualidade excelente e profissionais de altíssima competência. Recomendo de olhos fechados.", isPlaceholder: false }
      ]
    }
  },
  {
    id: "process.steps",
    priority: "enrichment",
    type: "list_builder",
    question: "Como funciona a jornada de atendimento do cliente?",
    hint: "Descreva de forma simples o passo a passo desde o contato até a entrega.",
    skipLabel: "Usar fluxo padrão da IA",
    options: {
      default: [
        { order: 1, title: "Agendamento Simples", description: "Clique no botão e escolha seu horário ideal conosco via WhatsApp de forma rápida." },
        { order: 2, title: "Atendimento Exclusivo", description: "Você é recebido em nosso espaço aconchegante para um diagnóstico e serviço personalizado." },
        { order: 3, title: "Resultado Incrível", description: "Você sai pronto, satisfeito e com a garantia de um serviço premium de alto padrão." }
      ]
    }
  }
];
