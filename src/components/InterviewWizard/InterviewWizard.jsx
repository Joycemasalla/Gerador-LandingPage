import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaInstagram, FaArrowRight, FaMagic, FaExclamationTriangle, FaListAlt } from 'react-icons/fa';
import { analyzeInstagramProfile } from '../../services/aiService';
import { buildQuestionQueue, mergeAnswerIntoJson, finalizeClientJson, normalizeSegment } from '../../utils/interviewEngine';
import ExtractionScreen from './ExtractionScreen';
import QuestionCard from './QuestionCard';
import ReviewScreen from './ReviewScreen';

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

export default function InterviewWizard({ customApiKey, onComplete }) {
  const [step, setStep] = useState('idle'); // idle | extracting | interviewing | reviewing | generating
  const [instaHandle, setInstaHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  
  // Fila de perguntas do Wizard
  const [questionQueue, setQuestionQueue] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [history, setHistory] = useState([]); // Histórico de JSONs para permitir "Voltar"

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
      const data = await analyzeInstagramProfile(instaHandle, customApiKey);
      
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
    // Construir a fila baseada no JSON extraído
    const segmentName = extractedData.identity?.segment || '';
    let queue = buildQuestionQueue(extractedData, segmentName);

    // Se o nome do negócio ou segmento não foram identificados, inseri-los no começo da fila
    const prepends = [];
    if (!extractedData.identity?.businessName) {
      prepends.push({
        id: "identity.businessName",
        priority: "critical",
        type: "text_input",
        question: "Qual o nome do seu negócio?",
        hint: "Esse nome será exibido em destaque nos títulos e cabeçalhos da página.",
        skipLabel: null
      });
    }
    if (!extractedData.identity?.segment) {
      prepends.push({
        id: "identity.segment",
        priority: "critical",
        type: "single_choice",
        question: "Qual o segmento de atuação do seu negócio?",
        hint: "Isso define a personalidade do design e carrega sugestões específicas no questionário.",
        skipLabel: null,
        optionsList: [
          "Barbearia",
          "Salão de Beleza",
          "Clínica de Estética",
          "Hamburgueria",
          "Pet Shop",
          "Clínica de Saúde / Consultório",
          "Academia / Studio Fitness",
          "Restaurante / Cafeteria"
        ]
      });
    }

    queue = [...prepends, ...queue];

    if (queue.length > 0) {
      setQuestionQueue(queue);
      setCurrentQuestionIdx(0);
      setHistory([extractedData]);
      setStep('interviewing');
    } else {
      setStep('reviewing');
    }
  };

  // Iniciar modo manual do zero
  const handleStartManual = () => {
    setErrorMsg('');
    const baseJson = JSON.parse(JSON.stringify(EMPTY_RICH_JSON));
    setExtractedData(baseJson);

    // Fila manual completa contendo perguntas básicas e as 12 do banco
    const initialQueue = [
      {
        id: "identity.businessName",
        priority: "critical",
        type: "text_input",
        question: "Qual o nome do seu negócio?",
        hint: "Esse nome será exibido em destaque nos títulos e cabeçalhos da página.",
        skipLabel: null
      },
      {
        id: "identity.segment",
        priority: "critical",
        type: "single_choice",
        question: "Qual o segmento de atuação do seu negócio?",
        hint: "Isso define a personalidade do design e carrega sugestões específicas no questionário.",
        skipLabel: null,
        optionsList: [
          "Barbearia",
          "Salão de Beleza",
          "Clínica de Estética",
          "Hamburgueria",
          "Pet Shop",
          "Clínica de Saúde / Consultório",
          "Academia / Studio Fitness",
          "Restaurante / Cafeteria"
        ]
      },
      ...buildQuestionQueue(baseJson, '')
    ];

    setQuestionQueue(initialQueue);
    setCurrentQuestionIdx(0);
    setHistory([baseJson]);
    setStep('interviewing');
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

  // Submissão final para geração da Landing Page
  const handleGenerateLandingPage = () => {
    setStep('generating');
    onComplete(extractedData, extractedData.instagramImages || []);
  };

  const progressPercentage = questionQueue.length > 0 
    ? Math.round((currentQuestionIdx / questionQueue.length) * 100) 
    : 0;

  return (
    <WizardLayout>
      {/* TELA: Entrada / Configuração Inicial (idle) */}
      {step === 'idle' && (
        <WelcomeCard className="animate-fade-in">
          <IconWrapper>
            <FaInstagram />
          </IconWrapper>
          <h2>Construa sua Landing Page CRO</h2>
          <p>
            Analisamos seu perfil público do Instagram para extrair dados visuais, cores e serviços.
            Depois, o motor de entrevista ajusta as lacunas para criar uma página ultra comercial de alta conversão.
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
