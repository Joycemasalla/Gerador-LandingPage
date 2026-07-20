/* =============================================
   AGENTE DE VENDAS — LÓGICA PRINCIPAL (app.js)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- ESTADO E ELEMENTOS ---
    const state = {
        perfil: JSON.parse(localStorage.getItem('agente_perfil')) || {},
        currentModule: 'perfil'
    };

    const els = {
        sidebar: document.getElementById('sidebar'),
        overlay: document.getElementById('overlay'),
        menuBtn: document.getElementById('menuBtn'),
        sidebarToggle: document.getElementById('sidebarToggle'),
        topbarTitle: document.getElementById('topbarTitle'),
        navItems: document.querySelectorAll('.nav-item'),
        modules: document.querySelectorAll('.module'),
        
        // Perfil
        pNome: document.getElementById('pNome'),
        pServico: document.getElementById('pServico'),
        pSegmento: document.getElementById('pSegmento'),
        pDiferencial: document.getElementById('pDiferencial'),
        pProto: document.getElementById('pProto'),
        pProtoLink: document.getElementById('pProtoLink'),
        protoLinkGroup: document.getElementById('protoLinkGroup'),
        pWhatsapp: document.getElementById('pWhatsapp'),
        salvarPerfilBtn: document.getElementById('salvarPerfil'),
        saveFeedback: document.getElementById('saveFeedback'),
        
        // Mini Perfil (Sidebar)
        profileName: document.getElementById('profileName'),
        profileAvatar: document.getElementById('profileAvatar'),

        // Lead
        lNome: document.getElementById('lNome'),
        lEmpresa: document.getElementById('lEmpresa'),
        lSegmento: document.getElementById('lSegmento'),
        lCanal: document.getElementById('lCanal'),
        lSituacao: document.getElementById('lSituacao'),
        lObservacao: document.getElementById('lObservacao'),
        gerarMensagemBtn: document.getElementById('gerarMensagem'),
        mensagemGeradaCard: document.getElementById('mensagemGeradaCard'),
        mensagemGerada: document.getElementById('mensagemGerada'),
        copiarMensagemBtn: document.getElementById('copiarMensagem'),
        gerarNovamenteBtn: document.getElementById('gerarNovamente'),
        dicaSegmento: document.getElementById('dicaSegmento'),

        // Fluxo
        etapaBtns: document.querySelectorAll('.etapa-btn'),
        fluxoTitulo: document.getElementById('fluxoTitulo'),
        opcoesFluxo: document.getElementById('opcoesFluxo'),
        fluxoResultado: document.getElementById('fluxoResultado'),
        fluxoContent: document.getElementById('fluxoContent'),
        resultadoBadge: document.getElementById('resultadoBadge'),
        resultadoTitulo: document.getElementById('resultadoTitulo'),
        resultadoObjetivo: document.getElementById('resultadoObjetivo'),
        resultadoEstrategia: document.getElementById('resultadoEstrategia'),
        resultadoMensagem: document.getElementById('resultadoMensagem'),
        copiarResultadoBtn: document.getElementById('copiarResultado'),
        resultadoProximo: document.getElementById('resultadoProximo'),
        voltarFluxoBtn: document.getElementById('voltarFluxo'),

        // Situações
        searchSituacao: document.getElementById('searchSituacao'),
        situacoesGrid: document.getElementById('situacoesGrid'),

        // Iniciante
        frasesIniciante: document.getElementById('frasesIniciante'),
        objecoesIniciante: document.getElementById('objecoesIniciante'),

        // Modal / Toast
        modalOverlay: document.getElementById('modalOverlay'),
        modalContent: document.getElementById('modalContent'),
        modalClose: document.getElementById('modalClose'),
        toast: document.getElementById('toast')
    };

    // --- DADOS FIXOS (PLAYBOOK) ---
    const playbook = {
        fluxos: {
            primeiro: [
                { id: 'rapido', icon: '📱', text: 'Respondeu rápido (menos de 10 min)', obj: 'Aproveitar o momentum', est: 'Responda com energia, seja natural e já encaminhe para a descoberta.', msg: 'Que ótimo falar com você tão rápido, [Nome]! 😊 Fico feliz que tenha dado atenção. Me conta um pouco: como está a situação atual de vocês em relação à captação de novos clientes?', prox: 'Fazer as perguntas de descoberta' },
                { id: 'visualizou', icon: '👁️', text: 'Visualizou e não respondeu (1-2 dias)', obj: 'Reabrir a conversa sem pressão', est: 'Não mencione que viu. Retome com um novo ângulo de valor.', msg: 'Oi [Nome], tudo bem? Queria compartilhar uma coisa rápida que achei relevante para negócios como o seu. [Dica/Case]. Qualquer dúvida, é só chamar! 😉', prox: 'Aguardar 3 dias para follow-up' },
                { id: 'fantasma', icon: '🔇', text: 'Parou de responder do nada', obj: 'Reativar com leveza', est: 'Uma mensagem leve e descontraída. Deixe a porta aberta.', msg: 'Oi [Nome]! 😄 Imagino que o dia a dia está corrido. Não precisa se preocupar — só queria deixar a porta aberta caso você queira retomar em outro momento. Fico à disposição!', prox: 'Encerrar com cordialidade. Contato em 30 dias.' }
            ],
            descoberta: [
                { id: 'sem_dinheiro', icon: '💸', text: 'Disse que está sem dinheiro', obj: 'Separar real de desculpa', est: 'Valide, não confronte. Apresente uma versão menor se necessário.', msg: 'Entendo perfeitamente, [Nome]. Posso te perguntar uma coisa? É uma questão de timing (agora não é o ideal) ou o investimento não está dentro do disponível? Pergunto pois posso ter um caminho alternativo 😊', prox: 'Oferecer parcelamento ou agendar para o futuro.' },
                { id: 'ja_tem', icon: '🔄', text: 'Já possui outro fornecedor', obj: 'Entender a satisfação', est: 'Mostre empatia. Plante uma semente sem tentar vender hoje.', msg: 'Que bom que você já tem esse suporte, [Nome]! Fico curioso: os resultados estão sendo o que você esperava? Pergunto porque às vezes o cliente sente que poderia extrair mais. Se um dia quiser trocar uma ideia, fico à disposição.', prox: 'Aprofundar se houver abertura.' },
                { id: 'mais_info', icon: 'ℹ️', text: 'Pediu mais informações/portfólio', obj: 'Fornecer info direcional', est: 'Responda com clareza mas não mande tudo de uma vez. Faça uma pergunta de volta.', msg: 'Com prazer, [Nome]! Me conta: o que mais te interessa entender melhor — o processo, os resultados, as formas de pagamento? Assim te passo exatamente o que precisa 😊', prox: 'Converter para reunião rápida.' }
            ],
            apresentacao: [
                { id: 'concorrente', icon: '⚔️', text: 'Comparou com a concorrência', obj: 'Diferenciar sem denegrir', est: 'Pergunte o que o diferenciou. Não fale mal do outro.', msg: 'Totalmente válido comparar, [Nome]! Me faz uma pergunta: além do preço, o que mais você está levando em conta nessa decisão? Pergunto para entender se o que entrego faz sentido para você.', prox: 'Apresentar diferenciais alinhados.' },
                { id: 'nao_entendeu', icon: '❓', text: 'Não entendeu a proposta', obj: 'Simplificar', est: 'Use uma analogia ou comparação simples.', msg: 'Boa pergunta! Deixa eu simplificar: pensa que é como ter um vendedor trabalhando 24h por dia para sua empresa, enviando os interessados direto para o seu WhatsApp. Faz mais sentido assim?', prox: 'Confirmar entendimento.' },
                { id: 'inseguro', icon: '😟', text: 'Demonstrou insegurança', obj: 'Reduzir risco', est: 'Ofereça garantia, mostre processo.', msg: 'Entendo sua preocupação, [Nome]! Toda mudança gera insegurança. Por isso, antes de qualquer compromisso, que tal a gente conversar 15 minutos para eu te mostrar como funciona? Sem pressão nenhuma 😊', prox: 'Agendar call.' }
            ],
            fechamento: [
                { id: 'pensar', icon: '🤔', text: 'Disse "Vou pensar"', obj: 'Descobrir objeção real', est: 'Pergunte gentilmente o que está na dúvida.', msg: 'Claro, com toda a razão mesmo! Só para eu te ajudar: tem algo específico que ainda está em aberto ou alguma dúvida? Pergunto para ter certeza de que tem tudo que precisa para decidir.', prox: 'Tratar a objeção que surgir.' },
                { id: 'desconto', icon: '🏷️', text: 'Pediu desconto', obj: 'Manter valor', est: 'Nunca dê sem contrapartida (ex: prazo).', msg: 'Fico feliz que tenha gostado! O valor já reflete o resultado, não quero reduzir o escopo. Mas posso te dizer: se a gente fechar até sexta, consigo ajustar a entrada para facilitar. Ajudaria?', prox: 'Fechar com condição.' },
                { id: 'imediato', icon: '✅', text: 'Quer fechar agora!', obj: 'Confirmar e agir', est: 'Seja ágil. Não deixe esfriar.', msg: 'Perfeito, [Nome]! Fico muito feliz 😊 Próximos passos: 1. Vou gerar o contrato 2. Acertamos o pagamento 3. Eu começo em seguida. Te mando tudo em instantes!', prox: 'Gerar link de pagamento/contrato.' }
            ]
        },
        situacoes: [
            { titulo: 'Está caro', preview: 'Como responder quando o cliente acha o valor alto.', obj: 'Descobrir se é percepção de valor ou orçamento real.', est: 'Pergunte a que ele está comparando e apresente o ROI.', msg: 'Entendo, [Nome]. Me ajuda a entender melhor: está caro em relação ao quê? Ao seu orçamento disponível ou ao resultado que espera? Pergunto porque podemos encontrar um caminho juntos 😊' },
            { titulo: 'Vou pensar', preview: 'A desculpa clássica para não dizer não agora.', obj: 'Descobrir a objeção oculta.', est: 'Valide o direito dele pensar e pergunte qual a dúvida pendente.', msg: 'Claro, faz todo sentido! Só para te ajudar melhor: o que ainda está em aberto na sua cabeça? Às vezes é uma dúvida simples que a gente resolve rápido 😊' },
            { titulo: 'Preciso falar com meu sócio', preview: 'A decisão não depende só dele.', obj: 'Facilitar a apresentação para o outro decisor.', est: 'Não pressione. Ofereça-se para apresentar aos dois.', msg: 'Totalmente certo! Decisões assim merecem uma boa conversa. Para facilitar: o que acha de marcarmos uma call com você e seu sócio juntos? Assim apresento e tiro dúvidas de todos 😊' },
            { titulo: 'Manda tudo por texto', preview: 'Cliente ocupado que não quer reunião.', obj: 'Evitar textão e descobrir a dor.', est: 'Mande algo muito resumido e devolva com uma pergunta.', msg: 'Posso sim! Só para personalizar: qual é o seu maior desafio hoje na captação de clientes? Assim mando só o que é relevante, sem te encher de informação 😊' },
            { titulo: 'Não confio / Não te conheço', preview: 'Objeção fatal de autoridade.', obj: 'Gerar confiança com provas.', est: 'Seja transparente. Ofereça ver o trabalho antes.', msg: 'Entendo completamente, [Nome]. Confiança se constrói. Por isso, estou aberto a te mostrar exemplos e explicar meu processo passo a passo. Além disso, só entrego quando você aprovar 100% 😊' }
        ],
        iniciante: {
            frases: [
                "Como estou no início da minha operação autônoma, tenho pouquíssimos clientes. Isso significa que meu tempo e atenção estão 100% dedicados a fazer o SEU projeto dar certo.",
                "Não vou te cobrar pelo design inicial. Vou criar um protótipo com a cara da sua empresa. Se você achar incrível, a gente fecha negócio. Risco zero para você.",
                "Diferente de grandes agências onde você fala com um estagiário de atendimento, aqui você fala direto com quem executa o projeto."
            ],
            objecoes: [
                { 
                    trigger: 'Você tem portfólio para eu ver?', 
                    logica: 'O cliente quer saber se você tem capacidade técnica, não quantos anos de empresa você tem.',
                    resposta: 'Como comecei a atuar de forma independente há pouco tempo, estou construindo meu portfólio oficial agora. Mas para você não ter dúvidas da qualidade, eu proponho o seguinte: eu monto a estrutura inicial do seu projeto sem compromisso. Você avalia o visual. Se gostar, fechamos.' 
                },
                { 
                    trigger: 'Por que cobrar tão barato/diferente?', 
                    logica: 'Preço baixo sem justificativa gera desconfiança.',
                    resposta: 'O valor está especial porque estou no meu primeiro ano de operação independente e minha meta principal hoje é construir cases de sucesso. Eu prefiro cobrar um valor acessível agora e ter você como um cliente hiper-satisfeito que vai me indicar para outros.' 
                }
            ]
        }
    };

    // --- NAVEGAÇÃO E UI ---
    function initUI() {
        // Toggle Sidebar Mobile
        els.menuBtn.addEventListener('click', () => {
            els.sidebar.classList.add('open');
            els.overlay.classList.add('active');
        });
        
        const closeSidebar = () => {
            els.sidebar.classList.remove('open');
            els.overlay.classList.remove('active');
        };
        els.sidebarToggle.addEventListener('click', closeSidebar);
        els.overlay.addEventListener('click', closeSidebar);

        // Navegação entre módulos
        els.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const mod = item.getAttribute('data-module');
                
                // Atualizar Menu
                els.navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Atualizar Título
                els.topbarTitle.textContent = item.querySelector('.nav-label').textContent;

                // Mostrar Módulo
                els.modules.forEach(m => m.classList.remove('active'));
                document.getElementById(`module-${mod}`).classList.add('active');

                // Mobile fechar menu
                if (window.innerWidth <= 768) closeSidebar();
                window.scrollTo(0, 0);
            });
        });

        // Field condicionais
        els.pProto.addEventListener('change', (e) => {
            els.protoLinkGroup.style.display = e.target.value === 'sim' ? 'flex' : 'none';
        });

        // Carregar Perfil
        if (state.perfil.pNome) {
            els.pNome.value = state.perfil.pNome;
            els.pServico.value = state.perfil.pServico || '';
            els.pSegmento.value = state.perfil.pSegmento || '';
            els.pDiferencial.value = state.perfil.pDiferencial || '';
            els.pProto.value = state.perfil.pProto || 'nao';
            els.pProtoLink.value = state.perfil.pProtoLink || '';
            els.pWhatsapp.value = state.perfil.pWhatsapp || '';
            els.pProto.dispatchEvent(new Event('change'));
            updateMiniProfile();
        }
    }

    // --- FUNÇÕES DE PERFIL ---
    els.salvarPerfilBtn.addEventListener('click', () => {
        state.perfil = {
            pNome: els.pNome.value.trim(),
            pServico: els.pServico.value.trim(),
            pSegmento: els.pSegmento.value.trim(),
            pDiferencial: els.pDiferencial.value,
            pProto: els.pProto.value,
            pProtoLink: els.pProtoLink.value.trim(),
            pWhatsapp: els.pWhatsapp.value.trim()
        };
        localStorage.setItem('agente_perfil', JSON.stringify(state.perfil));
        
        updateMiniProfile();
        
        els.saveFeedback.style.display = 'block';
        setTimeout(() => els.saveFeedback.style.display = 'none', 3000);
    });

    function updateMiniProfile() {
        if (state.perfil.pNome) {
            els.profileName.textContent = state.perfil.pNome;
            els.profileAvatar.textContent = state.perfil.pNome.charAt(0).toUpperCase();
        }
    }

    // --- FUNÇÕES DO LEAD (GERADOR) ---
    els.gerarMensagemBtn.addEventListener('click', () => {
        const lead = {
            nome: els.lNome.value.trim() || 'Responsável',
            empresa: els.lEmpresa.value.trim() || 'sua empresa',
            segmento: els.lSegmento.value,
            canal: els.lCanal.value,
            situacao: els.lSituacao.value,
            obs: els.lObservacao.value.trim()
        };

        const meuNome = state.perfil.pNome || 'Consultor';
        
        let msg = '';
        let dica = '';

        // Lógica simples de montagem
        if (lead.canal === 'whatsapp') {
            msg = `Oi ${lead.nome}! Tudo bem?\n\nAcompanho o trabalho da ${lead.empresa} e acho o serviço de vocês excelente.\n\n`;
        } else {
            msg = `Olá ${lead.nome}, tudo bem? Acompanho a ${lead.empresa} por aqui.\n\n`;
        }

        if (lead.situacao === 'semsite' || lead.situacao === 'siteruim') {
            msg += `Como atuo com posicionamento digital, fiz uma análise rápida e notei que vocês estão deixando clientes na mesa porque a presença atual no Google não reflete a qualidade do serviço de vocês.\n\n`;
        } else {
            msg += `Como atuo com atração de clientes, notei uma grande oportunidade de aumentar as captações de vocês no digital.\n\n`;
        }

        if (state.perfil.pProto === 'sim' && state.perfil.pDiferencial === 'prototipo') {
            msg += `Tomei a liberdade e montei um protótipo de uma página de vendas para vocês. Ficou muito profissional.\n\nVocê teria 5 minutinhos amanhã para eu te mostrar a tela? Sem custo nenhum, só pra você ver o potencial.`;
            dica = 'Dica: Envie esta mensagem e NÃO mande o link ainda. Gere a curiosidade para ele aceitar a reunião/call.';
        } else if (lead.obs) {
            msg += `Inclusive, notei que ${lead.obs.toLowerCase()}.\n\nPosso te mostrar como resolver isso e atrair mais clientes em uma chamada de 10 minutos amanhã?`;
            dica = 'Dica: Você usou uma observação real. Isso aumenta muito a taxa de resposta.';
        } else {
            msg += `Você teria 10 minutinhos amanhã, pela manhã ou tarde, para eu te mostrar como resolver isso de forma prática?`;
            dica = 'Dica: O objetivo do primeiro contato é VENDER A REUNIÃO, não vender o serviço.';
        }

        els.mensagemGerada.textContent = msg;
        els.dicaSegmento.innerHTML = `<strong>💡 ${dica}</strong>`;
        els.mensagemGeradaCard.style.display = 'block';
        els.mensagemGeradaCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    els.copiarMensagemBtn.addEventListener('click', () => {
        window.copyText(els.copiarMensagemBtn, els.mensagemGerada.textContent);
    });
    
    els.gerarNovamenteBtn.addEventListener('click', () => {
        els.gerarMensagemBtn.click();
    });

    // --- FUNÇÕES DO FLUXO ---
    function renderFluxoOpcoes(etapaKey) {
        const opcoes = playbook.fluxos[etapaKey] || [];
        els.opcoesFluxo.innerHTML = '';
        
        if(opcoes.length === 0) {
            els.opcoesFluxo.innerHTML = '<p style="color:var(--text-muted); grid-column: 1/-1">Nenhuma opção configurada para esta etapa ainda.</p>';
            return;
        }

        opcoes.forEach(op => {
            const btn = document.createElement('button');
            btn.className = 'opcao-btn';
            btn.innerHTML = `<span class="opcao-icon">${op.icon}</span> <span class="opcao-text">${op.text}</span>`;
            btn.addEventListener('click', () => {
                els.fluxoContent.style.display = 'none';
                
                els.resultadoTitulo.textContent = op.text;
                els.resultadoObjetivo.textContent = op.obj;
                els.resultadoEstrategia.textContent = op.est;
                els.resultadoMensagem.textContent = op.msg;
                els.resultadoProximo.textContent = op.prox;
                
                els.fluxoResultado.style.display = 'block';
            });
            els.opcoesFluxo.appendChild(btn);
        });
    }

    els.etapaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            els.etapaBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            els.fluxoResultado.style.display = 'none';
            els.fluxoContent.style.display = 'block';
            renderFluxoOpcoes(btn.getAttribute('data-etapa'));
        });
    });

    els.voltarFluxoBtn.addEventListener('click', () => {
        els.fluxoResultado.style.display = 'none';
        els.fluxoContent.style.display = 'block';
    });

    els.copiarResultadoBtn.addEventListener('click', () => {
        window.copyText(els.copiarResultadoBtn, els.resultadoMensagem.textContent);
    });

    // Inicializa primeira etapa do fluxo
    renderFluxoOpcoes('primeiro');


    // --- SITUAÇÕES & RESPOSTAS ---
    function renderSituacoes(filter = '') {
        els.situacoesGrid.innerHTML = '';
        const lowerFilter = filter.toLowerCase();
        
        const filtered = playbook.situacoes.filter(s => 
            s.titulo.toLowerCase().includes(lowerFilter) || 
            s.preview.toLowerCase().includes(lowerFilter)
        );

        filtered.forEach(s => {
            const card = document.createElement('div');
            card.className = 'situacao-card';
            card.innerHTML = `
                <div class="situacao-titulo">${s.titulo}</div>
                <div class="situacao-preview">${s.preview}</div>
            `;
            card.addEventListener('click', () => openModal(s));
            els.situacoesGrid.appendChild(card);
        });
    }

    els.searchSituacao.addEventListener('input', (e) => {
        renderSituacoes(e.target.value);
    });
    
    renderSituacoes();

    // --- MODO INICIANTE ---
    function renderIniciante() {
        // Frases
        playbook.iniciante.frases.forEach(frase => {
            const div = document.createElement('div');
            div.className = 'frase-item';
            div.innerHTML = `
                <div class="frase-text">"${frase}"</div>
                <button class="btn-copy small" onclick="copyText(this, '${frase.replace(/'/g, "\\'")}')">📋</button>
            `;
            els.frasesIniciante.appendChild(div);
        });

        // Objeções
        playbook.iniciante.objecoes.forEach(obj => {
            const item = document.createElement('div');
            item.className = 'objecao-item';
            item.innerHTML = `
                <div class="objecao-header">
                    <span class="objecao-trigger">${obj.trigger}</span>
                    <span class="objecao-chevron">▼</span>
                </div>
                <div class="objecao-body">
                    <p class="objecao-logica">Lógica: ${obj.logica}</p>
                    <div class="mensagem-preview">${obj.resposta}</div>
                </div>
            `;
            item.querySelector('.objecao-header').addEventListener('click', () => {
                item.classList.toggle('open');
            });
            els.objecoesIniciante.appendChild(item);
        });
    }
    renderIniciante();

    // --- UTLIDADES ---
    function openModal(data) {
        els.modalContent.innerHTML = `
            <h2>${data.titulo}</h2>
            <span class="result-label">🎯 Objetivo</span>
            <p>${data.obj}</p>
            <span class="result-label">🧠 Estratégia</span>
            <p>${data.est}</p>
            <span class="result-label">💬 Mensagem Sugerida</span>
            <div class="mensagem-preview">${data.msg}</div>
            <button class="btn-copy" onclick="copyText(this, '${data.msg.replace(/'/g, "\\'")}')">📋 Copiar Mensagem</button>
        `;
        els.modalOverlay.style.display = 'flex';
    }

    els.modalClose.addEventListener('click', () => els.modalOverlay.style.display = 'none');
    els.modalOverlay.addEventListener('click', (e) => {
        if(e.target === els.modalOverlay) els.modalOverlay.style.display = 'none';
    });

    window.copyText = function(btnElement, text) {
        navigator.clipboard.writeText(text).then(() => {
            els.toast.classList.add('show');
            const originalText = btnElement.innerHTML;
            btnElement.innerHTML = '✅ Copiado!';
            setTimeout(() => {
                els.toast.classList.remove('show');
                btnElement.innerHTML = originalText;
            }, 2000);
        });
    };

    // INIT
    initUI();
});
