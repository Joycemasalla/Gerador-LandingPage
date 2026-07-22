import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaInstagram, FaArrowRight, FaMagic, FaExclamationTriangle, FaListAlt, FaCheck } from 'react-icons/fa';
import { analyzeInstagramProfile } from '../../services/aiService';
import { buildQuestionQueue, mergeAnswerIntoJson, finalizeClientJson, normalizeSegment, normalizeCategory } from '../../utils/interviewEngine';
import { BUSINESS_CATEGORIES, detectCategoryFromSegment } from '../../utils/businessCategories';
import ExtractionScreen from './ExtractionScreen';
import QuestionCard from './QuestionCard';
import ReviewScreen from './ReviewScreen';

const SEGMENT_OPTIONS = [
  "Barbearia",
  "Salão de Beleza",
  "Clínica de Estética",
  "Hamburgueria",
  "Restaurante / Cafeteria",
  "Pet Shop",
  "Clínica de Saúde / Consultório",
  "Academia / Studio Fitness",
  "Revendedora de Produtos (Natura, Avon, Boticário)",
  "E-commerce / Loja Online",
  "Loja de Roupas / Moda",
  "Consultoria / Coaching",
  "Curso / Infoproduto",
  "Prestador de Serviços (Eletricista, Encanador, etc.)",
  "Advocacia / Escritório Jurídico",
  "Imobiliária / Corretor de Imóveis",
  "Fotografia / Audiovisual",
  "Evento / Buffet / Casamento",
  "Agência (Marketing, Design, Dev)",
  "Assistência Técnica",
  "Escola / Educação",
  "Turismo / Viagens"
];

const EMPTY_RICH_JSON = {
  identity: {
    businessName: null,
    segment: null,
    segmentKeywords: [],
    bio: null,
    foundingStory: null,
    ownerName: null,
    neighborhood: null,
    city: null,
    state: null,
    address: null,
    yearsInBusiness: null,
    teamSize: null,
    certifications: [],
    awards: []
  },
  businessCategory: null, // ID da categoria de negócio (uma das 8)
  targetAudience: {
    idealClient: null,
    primaryPain: null,
    secondaryPains: [],
    mainObjection: null,
    desiredTransformation: null
  },
  services: [],
  differentials: [],
  process: { steps: [] },
  testimonials: [],
  faq: [],
  contacts: {
    whatsapp: null,
    instagram: null,
    email: null,
    website: null,
    googleMapsUrl: null,
    openingHours: null,
    paymentMethods: []
  },
  branding: {
    preferredColors: null,
    extractedColorsFromInstagram: null,
    logoUrl: null,
    existingBrandPersonality: null,
    preferredTone: null,
    preferredDesignStyle: null
  },
  aiContext: {
    dataCompleteness: 'low',
    missingCriticalData: ['businessName', 'segment', 'idealClient', 'primaryPain', 'whatsapp'],
    dataConfidence: {}
  }
};

export default function InterviewWizard({ customApiKey, apifyApiKey, onComplete }) {
  const [step, setStep] = useState('type_selection'); // idle | type_selection | extracting | category | interviewing | reviewing | generating
  const [generationType, setGenerationType] = useState('landing_page'); // 'landing_page' | 'site_institucional'
  const [instaHandle, setInstaHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [detectedCategory, setDetectedCategory] = useState(null); // categoria auto-detectada
  const [selectedCategory, setSelectedCategory] = useState(null); // categoria confirmada pelo usuário
  
  // Fila de perguntas do Wizard
  const [questionQueue, setQuestionQueue] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [history, setHistory] = useState([]); // Histórico de JSONs para permitir "Voltar"

  // Handler: usuário escolheu o tipo de projeto
  const handleTypeSelected = (type) => {
    setGenerationType(type);
    // Avançar para a tela de entrada/extração
    setStep('idle');
  };

  // Iniciar extração do Instagram
  const handleStartExtraction = async (e) => {
    e.preventDefault();
    if (!instaHandle.trim()) {
      alert('Por favor, informe o seu Instagram.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setStep('extracting');

    try {
      const data = await analyzeInstagramProfile(instaHandle, customApiKey, apifyApiKey);
      
      // Sanitizar JSON extraído garantindo todos os campos da especificação
      const sanitized = {
        ...EMPTY_RICH_JSON,
        ...data,
        identity: { ...EMPTY_RICH_JSON.identity, ...(data.identity || {}) },
        targetAudience: { ...EMPTY_RICH_JSON.targetAudience, ...(data.targetAudience || {}) },
        contacts: { ...EMPTY_RICH_JSON.contacts, ...(data.contacts || {}) },
        branding: { ...EMPTY_RICH_JSON.branding, ...(data.branding || {}) },
        aiContext: { ...EMPTY_RICH_JSON.aiContext, ...(data.aiContext || {}) }
      };

      // Se veio com whatsapp antigo, mapeia
      if (data.contacts?.phone && !sanitized.contacts.whatsapp) {
        sanitized.contacts.whatsapp = data.contacts.phone;
      }
      // Forçar o instagram handle
      sanitized.contacts.instagram = instaHandle;

      setExtractedData(sanitized);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Erro ao conectar com o serviço de extração.');
    } finally {
      setIsLoading(false);
    }
  };

  // Callback de término de animação da extração
  const handleFinishExtractionLogs = () => {
    // Tentar detectar a categoria via segmento do Instagram
    const segmentName = extractedData?.identity?.segment || '';
    const detected = detectCategoryFromSegment(segmentName) || 
                     (normalizeCategory(segmentName) ? BUSINESS_CATEGORIES.find(c => c.id === normalizeCategory(segmentName)) : null);
    setDetectedCategory(detected || null);

    // Ir para o Passo 0 (seleção de categoria)
    setStep('category');
  };

  // Passo 0: usuário confirmou/selecionou a categoria
  const handleCategorySelected = (category) => {
    setSelectedCategory(category);

    // Salvar businessCategory e generationType no JSON
    const currentData = extractedData || JSON.parse(JSON.stringify(EMPTY_RICH_JSON));
    const updatedJson = { ...currentData, businessCategory: category.id, generationType };
    setExtractedData(updatedJson);

    // Construir fila de perguntas com a categoria definida
    const segmentName = updatedJson.identity?.segment || '';
    let queue = buildQuestionQueue(updatedJson, segmentName);

    // Inserir perguntas de identidade se estiverem faltando
    const prepends = [];
    if (!updatedJson.identity?.businessName) {
      prepends.push({
        id: 'identity.businessName',
        priority: 'critical',
        type: 'text_input',
        question: 'Qual o nome do seu negócio?',
        hint: 'Esse nome será exibido em destaque nos títulos e cabeçalhos da página.',
        skipLabel: null,
        optionsList: []
      });
    }
    if (!updatedJson.identity?.segment) {
      prepends.push({
        id: 'identity.segment',
        priority: 'critical',
        type: 'single_choice',
        question: 'Qual o segmento de atuação do seu negócio?',
        hint: 'Isso define a personalidade do design e carrega sugestões específicas no questionário.',
        skipLabel: null,
        options: { default: BUSINESS_CATEGORIES.map(c => c.label) },
        optionsList: BUSINESS_CATEGORIES.map(c => c.label),
        allowCustom: true,
        customPlaceholder: "Ex: Revendedora Natura, Consultoria financeira, Loja de roupas..."
      });
    }

    // ── Perguntas extras exclusivas do Site Institucional ──
    const institucionalExtras = [];
    if (generationType === 'site_institucional') {
      institucionalExtras.push(
        {
          id: 'identity.foundingStory',
          priority: 'critical',
          type: 'text_input',
          question: 'Conte a história da empresa: quando foi fundada, por quem e qual a missão?',
          hint: 'Essa narrativa será usada na seção "Sobre a Empresa" com efeito de scroll storytelling.',
          skipLabel: 'Pular',
          optionsList: []
        },
        {
          id: 'identity.teamSize',
          priority: 'important',
          type: 'text_input',
          question: 'Quantas pessoas fazem parte da equipe? Quais são os principais cargos/nomes?',
          hint: 'A seção de equipe terá efeito de reveal visual com hover premium em cada membro.',
          skipLabel: 'Pular',
          optionsList: []
        },
        {
          id: 'aiContext.conquistas',
          priority: 'important',
          type: 'text_input',
          question: 'Quais são os números de conquistas da empresa? (ex: "500 clientes", "8 anos", "98% satisfação")',
          hint: 'Esses números serão exibidos com animação de count-up ao rolar a página.',
          skipLabel: 'Pular',
          optionsList: []
        },
        {
          id: 'branding.preferredDesignStyle',
          priority: 'important',
          type: 'single_choice',
          question: 'Qual estilo visual melhor representa a sua empresa?',
          hint: 'Isso define a direção criativa completa: tipografia, paleta, atmosfera e motion do site.',
          skipLabel: 'Deixar a IA decidir',
          optionsList: [
            'Minimalismo Luxo — Espaços em branco, tipografia editorial, sofisticação silenciosa',
            'Dark Premium — Fundo escuro, detalhes dourados/neon, impacto visual forte',
            'Moderno Tech — Clean, azul/violeta, ícones lineares, sensação de inovação',
            'Editorial Clássico — Serif elegante, paleta neutra, presença de autoridade',
            'Vibrante Contemporâneo — Cores vivas, gradientes bold, energia e movimento'
          ]
        }
      );
    }

    queue = [...prepends, ...institucionalExtras, ...queue];

    if (queue.length > 0) {
      setQuestionQueue(queue);
      setCurrentQuestionIdx(0);
      setHistory([updatedJson]);
      setStep('interviewing');
    } else {
      const finalized = finalizeClientJson(updatedJson);
      setExtractedData(finalized);
      setStep('reviewing');
    }
  };

  // Iniciar modo manual do zero
  const handleStartManual = () => {
    setErrorMsg('');
    const baseJson = { ...JSON.parse(JSON.stringify(EMPTY_RICH_JSON)), generationType };
    setExtractedData(baseJson);
    setDetectedCategory(null);
    setSelectedCategory(null);
    // Ir direto para seleção de categoria (Passo 0)
    setStep('category');
  };

  // Preencher com Dados Falsos de Teste
  const handleMockExtraction = () => {
    setErrorMsg('');
    const mockJson = {
      ...EMPTY_RICH_JSON,
      identity: {
        businessName: "Studio Beauty Test (MOCK)",
        segment: "Salão de Beleza",
        segmentKeywords: ["Cabelo", "Maquiagem", "Estética"],
        bio: "O melhor salão da região focado em realçar sua beleza natural.",
        foundingStory: "Criado em 2020.",
        ownerName: "Maria da Silva",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        address: "Rua das Flores, 100",
        yearsInBusiness: 4,
        teamSize: 5,
        certifications: [],
        awards: []
      },
      targetAudience: {
        idealClient: "Mulheres que buscam se sentir bonitas e confiantes",
        primaryPain: "Cabelos danificados e sem vida",
        secondaryPains: [],
        mainObjection: "Preço alto ou medo de danificar mais o cabelo",
        desiredTransformation: "Autoestima renovada e cabelos saudáveis"
      },
      services: [{ name: "Corte e Escova VIP", description: "Transformação completa do visual", targetResult: "Fios saudáveis, leves e com movimento", priceRange: "R$ 150", duration: "1h 30m", featured: true }],
      differentials: [{ title: "Atendimento VIP", description: "Café, champanhe e um ambiente totalmente climatizado para você relaxar." }],
      process: { steps: [{ order: 1, title: "Agendamento Fácil", description: "Fale conosco pelo WhatsApp e agende seu horário." }] },
      testimonials: [{ name: "Ana Beatriz", role: "Cliente Fidelizada", rating: 5, text: "Amei o corte! O atendimento é excepcional e os produtos são de primeiríssima linha.", source: "Instagram", isPlaceholder: false }],
      faq: [{ question: "Quais as formas de pagamento?", answer: "Aceitamos todos os cartões de crédito e Pix." }],
      contacts: {
        whatsapp: "11999999999",
        instagram: "@studiobeautytest",
        email: "contato@teste.com",
        website: "",
        googleMapsUrl: "",
        openingHours: "Terça a Sábado, das 9h as 18h",
        paymentMethods: ["Pix", "Cartão de Crédito"]
      },
      branding: {
        preferredColors: ["#ff7a59"],
        extractedColorsFromInstagram: ["#ff7a59"],
        logoUrl: "",
        existingBrandPersonality: "Elegante e descontraído",
        preferredTone: "persuasivo",
        preferredDesignStyle: "elegant"
      }
    };
    
    setExtractedData(mockJson);
    setHistory([mockJson]);
    setStep('reviewing');
  };

  // Responder pergunta atual
  const handleAnswerQuestion = (answer) => {
    const currentQuestion = questionQueue[currentQuestionIdx];
    const currentJson = history[history.length - 1];

    let updatedJson = mergeAnswerIntoJson(currentJson, currentQuestion.id, answer);

    // Caso a resposta seja o segmento, atualizar opções das próximas perguntas
    if (currentQuestion.id === 'identity.segment') {
      const normalizedSeg = normalizeSegment(answer);
      // Recalcular fila a partir da posição seguinte usando o novo segmento
      const baseQueue = buildQuestionQueue(updatedJson, answer);
      
      // Manter as perguntas críticas do início que ainda não foram respondidas e anexar as novas baseadas no segmento
      const currentQueueProgress = questionQueue.slice(0, currentQuestionIdx + 1);
      const remainingQuestions = baseQueue.filter(bq => {
        return !currentQueueProgress.some(qp => qp.id === bq.id);
      });
      
      setQuestionQueue([...currentQueueProgress, ...remainingQuestions]);
    }

    setExtractedData(updatedJson);
    setHistory(prev => [...prev, updatedJson]);

    if (currentQuestionIdx + 1 < questionQueue.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Finalizar e ir para revisão
      const finalized = finalizeClientJson(updatedJson);
      setExtractedData(finalized);
      setStep('reviewing');
    }
  };

  // Pular pergunta atual (grava nulo)
  const handleSkipQuestion = () => {
    const currentQuestion = questionQueue[currentQuestionIdx];
    const currentJson = history[history.length - 1];

    const updatedJson = mergeAnswerIntoJson(currentJson, currentQuestion.id, null);
    
    setExtractedData(updatedJson);
    setHistory(prev => [...prev, updatedJson]);

    if (currentQuestionIdx + 1 < questionQueue.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      const finalized = finalizeClientJson(updatedJson);
      setExtractedData(finalized);
      setStep('reviewing');
    }
  };

  // Voltar pergunta anterior
  const handleBackQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
      setHistory(prev => {
        const updated = [...prev];
        updated.pop();
        setExtractedData(updated[updated.length - 1]);
        return updated;
      });
    }
  };

  // Modificação direta no Review Screen
  const handleUpdateFromReview = (newJson) => {
    const finalized = finalizeClientJson(newJson);
    setExtractedData(finalized);
  };

  // Submissão final para geração (Landing Page ou Site Institucional)
  const handleGenerateLandingPage = () => {
    setStep('generating');
    // Garantir que generationType está salvo no JSON final
    const finalData = { ...extractedData, generationType };
    onComplete(finalData, finalData.instagramImages || []);
  };

  const progressPercentage = questionQueue.length > 0 
    ? Math.round((currentQuestionIdx / questionQueue.length) * 100) 
    : 0;

  return (
    <WizardLayout>
      {/* TELA: Seleção do Tipo de Projeto */}
      {step === 'type_selection' && (
        <TypeSelectionScreen className="animate-fade-in">
          <TypeSelectionHeader>
            <h2>O que você quer criar?</h2>
            <p>Escolha o tipo de projeto para personalizar toda a experiência de geração.</p>
          </TypeSelectionHeader>
          <TypeCardsGrid>
            <TypeCard
              onClick={() => handleTypeSelected('landing_page')}
              $active={generationType === 'landing_page'}
            >
              <TypeCardIcon>🎯</TypeCardIcon>
              <TypeCardTitle>Landing Page</TypeCardTitle>
              <TypeCardSubtitle>Alta Conversão</TypeCardSubtitle>
              <TypeCardList>
                <li>Página única focada em 1 ação</li>
                <li>CTA agressivo (WhatsApp / Agendamento)</li>
                <li>Copywriting de neuromarketing</li>
                <li>Ideal para tráfego pago</li>
                <li>Motion Cinemático</li>
              </TypeCardList>
              <TypeCardBadge $color="#8b5cf6">Modo CRO</TypeCardBadge>
            </TypeCard>

            <TypeCard
              onClick={() => handleTypeSelected('site_institucional')}
              $active={generationType === 'site_institucional'}
            >
              <TypeCardIcon>🏢</TypeCardIcon>
              <TypeCardTitle>Site Institucional</TypeCardTitle>
              <TypeCardSubtitle>Presença Digital Premium</TypeCardSubtitle>
              <TypeCardList>
                <li>Multi-seções com navegação completa</li>
                <li>Sobre, Equipe, Portfólio, Conquistas</li>
                <li>Storytelling visual da marca</li>
                <li>Cursor custom + Motion Imersivo</li>
                <li>Padrão Awwwards / Apple / Linear</li>
              </TypeCardList>
              <TypeCardBadge $color="#06b6d4">Modo Premium</TypeCardBadge>
            </TypeCard>
          </TypeCardsGrid>
        </TypeSelectionScreen>
      )}

      {/* TELA: Entrada / Configuração Inicial (idle) */}
      {step === 'idle' && (
        <WelcomeCard className="animate-fade-in">
          <IconWrapper>
            <FaInstagram />
          </IconWrapper>
          <TypeBadgeInline $type={generationType}>
            {generationType === 'site_institucional' ? '🏢 Site Institucional' : '🎯 Landing Page'}
            <button onClick={() => setStep('type_selection')} title="Trocar tipo de projeto">✕ trocar</button>
          </TypeBadgeInline>
          <h2>{generationType === 'site_institucional' ? 'Crie seu Site Institucional Premium' : 'Construa sua Landing Page CRO'}</h2>
          <p>
            {generationType === 'site_institucional'
              ? 'Analisamos seu Instagram e conduzimos uma entrevista guiada para criar um briefing institucional premium com motion imersivo nível Awwwards.'
              : 'Analisamos seu perfil público do Instagram para extrair dados visuais, cores e serviços. Depois, o motor de entrevista ajusta as lacunas para criar uma página ultra comercial de alta conversão.'
            }
          </p>

          <Form onSubmit={handleStartExtraction}>
            <label>Link ou @ do perfil no Instagram</label>
            <InputGroup>
              <input 
                type="text" 
                placeholder="Ex: @studioglamour.beauty" 
                value={instaHandle}
                onChange={(e) => setInstaHandle(e.target.value)}
              />
              <SubmitBtn type="submit">
                Analisar <FaArrowRight />
              </SubmitBtn>
            </InputGroup>
          </Form>

          <OrDivider>
            <span>ou se preferir</span>
          </OrDivider>

          <ManualBtn type="button" onClick={handleStartManual}>
            <FaMagic /> Criar Manualmente do Zero
          </ManualBtn>
          <ManualBtn type="button" onClick={handleMockExtraction} style={{ marginTop: '10px', background: '#1e293b', borderColor: '#334155' }}>
            🧪 Preencher com Dados de Teste (Mock)
          </ManualBtn>
        </WelcomeCard>
      )}

      {/* TELA: Extraindo dados públicos (extracting) */}
      {step === 'extracting' && (
        <ExtractionScreen 
          handle={instaHandle}
          isExtractionDone={!isLoading && !errorMsg}
          extractedData={extractedData}
          errorMsg={errorMsg}
          onFallback={handleStartManual}
          onFinishLogs={handleFinishExtractionLogs}
        />
      )}

      {/* TELA: Passo 0 — Seleção de Categoria (category) */}
      {step === 'category' && (
        <CategoryScreen className="animate-fade-in">
          <CategoryHeader>
            <CategoryTitle>
              {detectedCategory ? (
                <>
                  <span className="step-badge">Passo 0 de X</span>
                  <h2>Confirme a categoria do negócio</h2>
                  <p>Detectamos automaticamente a categoria abaixo. Confirme ou escolha outra.</p>
                </>
              ) : (
                <>
                  <span className="step-badge">Passo 0</span>
                  <h2>Qual é a categoria do negócio?</h2>
                  <p>Isso define a estrutura, o CTA e as perguntas certas para a landing page.</p>
                </>
              )}
            </CategoryTitle>
          </CategoryHeader>

          <CategoryGrid>
            {BUSINESS_CATEGORIES.map((cat) => {
              const isDetected = detectedCategory?.id === cat.id;
              const isSelected = selectedCategory?.id === cat.id;
              return (
                <CategoryCard
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  $isDetected={isDetected}
                  $isSelected={isSelected}
                >
                  {isDetected && (
                    <DetectedBadge>
                      <FaCheck size={9} /> Detectado
                    </DetectedBadge>
                  )}
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-label">{cat.label}</span>
                  <span className="cat-examples">{cat.examples}</span>
                  {isSelected && <SelectedCheckmark><FaCheck /></SelectedCheckmark>}
                </CategoryCard>
              );
            })}
          </CategoryGrid>

          <CategoryConfirmBtn
            onClick={() => selectedCategory && handleCategorySelected(selectedCategory)}
            disabled={!selectedCategory}
          >
            {selectedCategory
              ? `Confirmar: ${selectedCategory.icon} ${selectedCategory.label} →`
              : 'Selecione uma categoria para continuar'}
          </CategoryConfirmBtn>
        </CategoryScreen>
      )}

      {/* TELA: Entrevista Guiada (interviewing) */}
      {step === 'interviewing' && questionQueue.length > 0 && (
        <InterviewSection className="animate-fade-in">
          <ProgressBarWrapper>
            <div className="progress-info">
              <span>Fase 2: Entrevista Guiada</span>
              <span>Pergunta {currentQuestionIdx + 1} de {questionQueue.length}</span>
            </div>
            <div className="bar">
              <div className="fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </ProgressBarWrapper>
          
          <QuestionCard 
            key={questionQueue[currentQuestionIdx].id}
            question={questionQueue[currentQuestionIdx]}
            segment={extractedData?.identity?.segment}
            onAnswer={handleAnswerQuestion}
            onSkip={handleSkipQuestion}
            onBack={handleBackQuestion}
            showBack={currentQuestionIdx > 0}
          />
        </InterviewSection>
      )}

      {/* TELA: Revisão de Dados Extraídos (reviewing) */}
      {step === 'reviewing' && extractedData && (
        <ReviewScreen 
          clientJson={extractedData} 
          onUpdate={handleUpdateFromReview}
          onGenerate={handleGenerateLandingPage}
        />
      )}
    </WizardLayout>
  );
}

// Styled Components
const WizardLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 150px);
  padding: 20px 0;
`;

const WelcomeCard = styled.div`
  background: rgba(30, 41, 59, 0.45);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  h2 {
    font-size: 1.6rem;
    font-weight: 800;
    color: white;
    margin: 0;
    letter-spacing: -0.5px;
  }

  p {
    font-size: 0.9rem;
    color: #94a3b8;
    line-height: 1.6;
    margin: 0;
  }
`;

const IconWrapper = styled.div`
  background: linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%);
  color: white;
  width: 68px;
  height: 68px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  box-shadow: 0 8px 24px rgba(220, 39, 67, 0.35);
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;

  label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #cbd5e1;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;

  &:focus-within {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.25);
  }

  input {
    background: transparent;
    border: none;
    padding: 14px 18px;
    color: white;
    font-size: 0.95rem;
    outline: none;
    width: 100%;

    &::placeholder {
      color: #475569;
    }
  }
`;

const SubmitBtn = styled.button`
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 0 24px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;

  &:hover {
    background: #7c3aed;
  }
`;

const OrDivider = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  color: #475569;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;

  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  span {
    padding: 0 10px;
  }
`;

const ManualBtn = styled.button`
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  border-radius: 12px;
  padding: 14px;
  width: 100%;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: #8b5cf6;
    color: white;
  }
`;

const InterviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 600px;
`;

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    font-weight: 600;
    color: #94a3b8;
  }

  .bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
    overflow: hidden;

    .fill {
      height: 100%;
      background: #8b5cf6;
      transition: width 0.3s ease;
      border-radius: 3px;
    }
  }
`;

// ── Styled Components da Tela de Seleção de Categoria (Passo 0) ──────────────

const CategoryScreen = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 680px;
`;

const CategoryHeader = styled.div`
  text-align: center;
`;

const CategoryTitle = styled.div`
  .step-badge {
    display: inline-block;
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.3);
    color: #a78bfa;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 4px 12px;
    border-radius: 100px;
    margin-bottom: 12px;
  }

  h2 {
    font-size: 1.55rem;
    font-weight: 800;
    color: white;
    margin: 0 0 8px;
    letter-spacing: -0.4px;
  }

  p {
    font-size: 0.88rem;
    color: #94a3b8;
    margin: 0;
    line-height: 1.6;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 580px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryCard = styled.button`
  position: relative;
  background: ${({ $isSelected, $isDetected }) =>
    $isSelected
      ? 'rgba(139, 92, 246, 0.18)'
      : $isDetected
      ? 'rgba(16, 185, 129, 0.08)'
      : 'rgba(30, 41, 59, 0.5)'};
  border: 1.5px solid ${({ $isSelected, $isDetected }) =>
    $isSelected
      ? '#8b5cf6'
      : $isDetected
      ? '#10b981'
      : 'rgba(255, 255, 255, 0.07)'};
  border-radius: 16px;
  padding: 18px 10px 14px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  text-align: center;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(139, 92, 246, 0.12);
    border-color: rgba(139, 92, 246, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  .cat-icon {
    font-size: 2rem;
    line-height: 1;
    margin-bottom: 2px;
  }

  .cat-label {
    font-size: 0.78rem;
    font-weight: 700;
    color: ${({ $isSelected }) => ($isSelected ? '#c4b5fd' : 'white')};
    line-height: 1.2;
  }

  .cat-examples {
    font-size: 0.65rem;
    color: #64748b;
    line-height: 1.3;
  }
`;

const DetectedBadge = styled.div`
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: #10b981;
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
  letter-spacing: 0.3px;
`;

const SelectedCheckmark = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #8b5cf6;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
`;

const CategoryConfirmBtn = styled.button`
  background: ${({ disabled }) =>
    disabled ? 'rgba(30, 41, 59, 0.5)' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)'};
  color: ${({ disabled }) => (disabled ? '#475569' : 'white')};
  border: none;
  border-radius: 14px;
  padding: 16px 28px;
  font-size: 1rem;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.25s ease;
  letter-spacing: -0.2px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(139, 92, 246, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

// ── Styled Components — Tela de Seleção de Tipo de Projeto ──

const TypeSelectionScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  max-width: 780px;
  padding: 20px;
`;

const TypeSelectionHeader = styled.div`
  text-align: center;

  h2 {
    font-size: 1.8rem;
    font-weight: 800;
    color: white;
    letter-spacing: -0.5px;
    margin: 0 0 10px;
  }

  p {
    font-size: 0.95rem;
    color: #94a3b8;
    margin: 0;
  }
`;

const TypeCardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const TypeCard = styled.div`
  background: ${({ $active }) =>
    $active
      ? 'rgba(139, 92, 246, 0.12)'
      : 'rgba(30, 41, 59, 0.55)'};
  border: 2px solid ${({ $active }) =>
    $active ? 'rgba(139, 92, 246, 0.7)' : 'rgba(255, 255, 255, 0.07)'};
  border-radius: 20px;
  padding: 28px 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: rgba(139, 92, 246, 0.5);
    background: rgba(139, 92, 246, 0.08);
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: ${({ $active }) =>
      $active
        ? 'linear-gradient(90deg, #8b5cf6, #06b6d4)'
        : 'transparent'};
    transition: background 0.25s ease;
  }
`;

const TypeCardIcon = styled.div`
  font-size: 2.2rem;
  line-height: 1;
  margin-bottom: 4px;
`;

const TypeCardTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.3px;
`;

const TypeCardSubtitle = styled.div`
  font-size: 0.78rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const TypeCardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;

  li {
    font-size: 0.82rem;
    color: #cbd5e1;
    display: flex;
    align-items: center;
    gap: 6px;

    &::before {
      content: '✓';
      color: #8b5cf6;
      font-weight: 700;
      font-size: 0.75rem;
    }
  }
`;

const TypeCardBadge = styled.div`
  margin-top: 12px;
  align-self: flex-start;
  background: ${({ $color }) => `${$color}20`};
  border: 1px solid ${({ $color }) => `${$color}50`};
  color: ${({ $color }) => $color};
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TypeBadgeInline = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ $type }) =>
    $type === 'site_institucional'
      ? 'rgba(6, 182, 212, 0.12)'
      : 'rgba(139, 92, 246, 0.12)'};
  border: 1px solid ${({ $type }) =>
    $type === 'site_institucional'
      ? 'rgba(6, 182, 212, 0.3)'
      : 'rgba(139, 92, 246, 0.3)'};
  color: ${({ $type }) =>
    $type === 'site_institucional' ? '#22d3ee' : '#a78bfa'};
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;

  button {
    background: none;
    border: none;
    color: inherit;
    opacity: 0.6;
    cursor: pointer;
    font-size: 0.72rem;
    padding: 0;
    transition: opacity 0.2s;

    &:hover { opacity: 1; }
  }
`;


