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
      ],
      revenda: [
        "Mulheres que adoram moda e buscam peças com estilo a preço justo",
        "Pessoas que procuram produtos originais com garantia e facilidade de compra",
        "Clientes fiéis que indicam amigos por causa da confiança e qualidade dos produtos",
        "Consumidores que valorizam atendimento rápido e entrega no prazo combinado"
      ],
      profissional: [
        "Pessoas físicas que precisam resolver questões jurídicas, fiscais ou financeiras",
        "Empresários e empreendedores que buscam assessoria estratégica para crescer",
        "Empresas de pequeno e médio porte que precisam de suporte técnico especializado",
        "Profissionais liberais que precisam de suporte contábil, jurídico ou de gestão"
      ],
      fitness: [
        "Iniciantes que querem emagrecer e adotar hábitos saudáveis com orientação profissional",
        "Pessoas que querem ganhar massa muscular e definição com treino personalizado",
        "Mulheres e homens que buscam saúde, disposição e qualidade de vida a longo prazo",
        "Atletas amadores que buscam evolução de performance e recuperação adequada"
      ],
      educacao: [
        "Estudantes que buscam aprovação em vestibulares, concursos ou certificações",
        "Adultos que querem aprender novas habilidades para crescer profissionalmente",
        "Pais que buscam reforço escolar de qualidade para seus filhos",
        "Profissionais que querem se especializar ou mudar de área com capacitação adequada"
      ],
      tecnico: [
        "Proprietários de imóveis que precisam de manutenção e reparos rápidos e confiáveis",
        "Locatários e síndicos que precisam de serviços técnicos com garantia",
        "Empresas que necessitam de manutenção predial e suporte técnico recorrente",
        "Pessoas que passaram por mau atendimento anterior e buscam profissional de confiança"
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
      ],
      fitness: [
        "Medo de se machucar por falta de acompanhamento profissional adequado",
        "Começar e desistir em poucas semanas por não ver resultados rápidos",
        "Academia lotada onde os aparelhos ficam em fila e não tem instrutor disponível",
        "Treinos genéricos que não respeitam o corpo e o objetivo individual"
      ],
      educacao: [
        "Métodos de ensino ultrapassados que não prendem a atenção e não geram resultados",
        "Turmas grandes demais onde o aluno se perde sem atenção individualizada",
        "Professores que explicam bem mas não conseguem adaptar ao ritmo do aluno",
        "Custo de cursos que não entregam o retorno esperado na prática"
      ],
      tecnico: [
        "Profissionais que somem após o serviço e não dão garantia do trabalho",
        "Orçamentos superfaturados ou cobranças de serviços que não foram executados",
        "Demora excessiva para iniciar e concluir o serviço contratado",
        "Trabalhos mal feitos que precisam ser refeitos em pouco tempo"
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
      ],
      revenda: [
        "Preocupação de pagar e não receber o produto ou receber algo diferente do anunciado",
        "Medo do produto ser defeituoso e não conseguir troca ou reembolso",
        "Insegurança sobre o prazo e a qualidade da entrega do pedido",
        "Preço parecer caro comparado a outros vendedores que podem não entregar o mesmo"
      ],
      profissional: [
        "Custo elevado do serviço sem garantia de resultado concreto",
        "Falta de clareza sobre quanto vai custar e qual o prazo para conclusão",
        "Medo de contratar um profissional sem experiência ou que não entenda o caso",
        "Desconfiança sobre a seriedade e comprometimento do profissional"
      ],
      fitness: [
        "Histórico de inscrições em academias sem conseguir manter a frequência",
        "Preocupação com o preço da mensalidade e a dificuldade de cancelamento",
        "Medo de não ter resultado e se sentir envergonhado ou fora do lugar",
        "Dúvida se o horário disponível vai encaixar na rotina apertada"
      ],
      educacao: [
        "Preço do curso versus resultado esperado — se realmente vai valer o investimento",
        "Medo de não ter tempo disponível para acompanhar as aulas e atividades",
        "Incerteza se o método vai funcionar para o seu perfil de aprendizado",
        "Desconfiança se o professor ou escola tem credibilidade e resultados reais"
      ],
      tecnico: [
        "Medo de ser cobrado por serviços desnecessários ou valor acima do mercado",
        "Desconfiança sobre a qualidade e durabilidade do serviço prestado",
        "Preocupação com o profissional ter acesso à casa sem ser de confiança",
        "Experiências ruins anteriores com profissionais que não terminaram o serviço"
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
      ],
      revenda: [
        "Entrega rápida com rastreamento e embalagem segura",
        "Garantia de troca em até 7 dias sem burocracia",
        "Parcelamento facilitado em até 12x",
        "Atendimento personalizado pelo WhatsApp com resposta rápida",
        "Produtos originais com nota fiscal e garantia do fabricante",
        "Preço abaixo do mercado por compra direta do fornecedor"
      ],
      profissional: [
        "Atendimento consultivo com escuta ativa e diagnóstico preciso do problema",
        "Transparência total sobre honorários, prazos e etapas do trabalho",
        "Experiência comprovada com cases de sucesso reais",
        "Registro profissional ativo (OAB / CRC / CAU) e ética irrepreensível",
        "Atualização constante com cursos e especializações recentes",
        "Suporte contínuo pós-entrega com acompanhamento do caso"
      ],
      fitness: [
        "Treino 100% personalizado com avaliação física e anamnese completa",
        "Instrutores formados em educação física com certificações atuais",
        "Ambiente climatizado, equipamentos modernos e limpeza impecável",
        "Acompanhamento de evolução com fotos e planilhas mensais",
        "Aula experimental grátis sem compromisso para conhecer o método",
        "Turmas reduzidas com atenção individual para cada aluno"
      ],
      educacao: [
        "Método próprio com abordagem prática e foco em resultado real",
        "Turmas pequenas com atenção individualizada para cada aluno",
        "Material didático exclusivo incluído sem custo adicional",
        "Professores com formação na área e experiência de mercado",
        "Acompanhamento do progresso com relatório periódico para o responsável",
        "Ambiente físico aconchegante e infraestrutura completa"
      ],
      tecnico: [
        "Orçamento gratuito e transparente sem surpresas na hora do pagamento",
        "Garantia formal por escrito em todos os serviços realizados",
        "Profissional uniformizado, identificado e com referências verificáveis",
        "Pontualidade rigorosa com comunicação antecipada de qualquer imprevisto",
        "Uso de peças e materiais originais com nota fiscal",
        "Atendimento de emergência com chegada rápida na sua região"
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
      ],
      revenda: [
        { name: "Fashion Dark", colors: ["#0a0a0a", "#d4af37", "#fafafa", "#1a1a1a"] },
        { name: "Fresh Commerce", colors: ["#0f172a", "#0ea5e9", "#f8fafc", "#1e293b"] }
      ],
      profissional: [
        { name: "Corporate Navy", colors: ["#0f172a", "#1d4ed8", "#f8fafc", "#1e293b"] },
        { name: "Law Premium", colors: ["#1c1917", "#92400e", "#fafaf9", "#292524"] }
      ],
      fitness: [
        { name: "Volcano Iron", colors: ["#09090b", "#ea580c", "#fcfcfc", "#171719"] },
        { name: "Neon Power", colors: ["#000000", "#84cc16", "#f9fafb", "#0a0a0a"] }
      ],
      educacao: [
        { name: "Academic Blue", colors: ["#0f172a", "#2563eb", "#f8fafc", "#1e293b"] },
        { name: "Warm Learn", colors: ["#1c1917", "#d97706", "#fffbeb", "#292524"] }
      ],
      tecnico: [
        { name: "Steel Tech", colors: ["#18181b", "#3b82f6", "#f8fafc", "#27272a"] },
        { name: "Heavy Duty", colors: ["#0c0a09", "#f59e0b", "#fafaf9", "#1c1917"] }
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
      ],
      revenda: [
        { question: "Vocês fazem entrega?", answer: "Sim! Realizamos entrega em toda a cidade. O prazo e o frete são combinados no pedido pelo WhatsApp." },
        { question: "Posso trocar se não gostar?", answer: "Sim, aceitamos trocas em até 7 dias corridos após o recebimento, desde que o produto esteja sem uso e com etiqueta." },
        { question: "Parcelam as compras?", answer: "Parcelamos em até 3x sem juros no cartão de crédito. Pix e débito têm desconto especial." }
      ],
      profissional: [
        { question: "Como funciona a primeira consulta?", answer: "A primeira conversa é gratuita e acontece pelo WhatsApp ou videochamada. Apresento meu trabalho e entendo o seu caso." },
        { question: "Quanto custa o serviço?", answer: "O valor varia conforme a complexidade do caso. Após a análise inicial, apresento uma proposta detalhada e transparente." },
        { question: "Qual o prazo para conclusão?", answer: "Depende do tipo de serviço. Na nossa conversa inicial definimos prazos realistas e assinamos um contrato de prestação de serviços." }
      ],
      fitness: [
        { question: "Preciso de experiência prévia?", answer: "Não! Atendemos desde iniciantes absolutos até atletas avançados. O treino é 100% adaptado ao seu nível e objetivo." },
        { question: "Posso fazer uma aula grátis antes?", answer: "Sim! Oferecemos uma aula experimental completamente gratuita. Basta entrar em contato pelo WhatsApp para agendar." },
        { question: "Como funciona o cancelamento?", answer: "Trabalhamos com contratos mensais sem fidelidade obrigatória. O cancelamento é feito com 30 dias de antecedência." }
      ],
      educacao: [
        { question: "As aulas são presenciais ou online?", answer: "Oferecemos ambas as modalidades. Você pode escolher a que melhor se adapta à sua rotina." },
        { question: "Como é o processo de matrícula?", answer: "É simples! Entre em contato pelo WhatsApp, conversamos sobre seus objetivos e agendamos uma visita ou aula experimental." },
        { question: "Qual o material didático utilizado?", answer: "Utilizamos material próprio desenvolvido especificamente para o nosso método, incluído no valor da mensalidade." }
      ],
      tecnico: [
        { question: "O orçamento tem algum custo?", answer: "Não! O orçamento é completamente gratuito e sem compromisso. Solicite agora pelo WhatsApp." },
        { question: "Vocês oferecem garantia?", answer: "Sim, todos os nossos serviços têm garantia formal por escrito. O prazo varia conforme o tipo de serviço." },
        { question: "Atendem aos finais de semana?", answer: "Sim, atendemos de segunda a sábado. Para urgências, temos atendimento emergencial. Consulte disponibilidade." }
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
