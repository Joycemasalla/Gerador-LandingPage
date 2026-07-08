import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaInstagram, FaCheck, FaTimes, FaSpinner, FaArrowRight } from 'react-icons/fa';

export default function ExtractionScreen({ handle, onFinishLogs, isExtractionDone, extractedData, errorMsg, onFallback }) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Simular logs de carregamento iniciais
  useEffect(() => {
    const messages = [
      { text: "Iniciando conexão com o proxy local...", time: 200, pct: 10 },
      { text: `Pesquisando perfil "@${handle.replace('@', '')}" no Instagram...`, time: 800, pct: 25 },
      { text: "Buscando dados em indexadores públicos...", time: 1800, pct: 45 },
      { text: "Analisando publicações e comentários recentes...", time: 2800, pct: 60 }
    ];

    const timers = [];
    
    messages.forEach(msg => {
      const t = setTimeout(() => {
        if (!hasError) {
          setLogs(prev => [...prev, { text: msg.text, status: 'info' }]);
          setProgress(msg.pct);
        }
      }, msg.time);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [handle, hasError]);

  // Executado quando ocorre um erro
  useEffect(() => {
    if (errorMsg) {
      setHasError(true);
      setProgress(100);
      
      // Filtrar mensagens repetidas ou simplificar
      const cleanErr = errorMsg.includes('Quota exceeded') 
        ? 'Limite de cota de requisições do Gemini excedido (Erro 429).' 
        : errorMsg;

      setLogs(prev => [
        ...prev,
        { text: `Falha na extração: ${cleanErr}`, status: 'fail' },
        { text: "Ativando o modo de preenchimento manual...", status: 'info' }
      ]);
    }
  }, [errorMsg]);

  // Executado quando a extração real do backend termina com sucesso
  useEffect(() => {
    if (isExtractionDone && extractedData && !errorMsg) {
      setProgress(100);
      
      const finalLogs = [];
      const identity = extractedData.identity || {};
      const services = extractedData.services || [];
      const targetAudience = extractedData.targetAudience || {};

      if (identity.businessName) {
        finalLogs.push({ text: `Nome do negócio identificado: "${identity.businessName}"`, status: 'success' });
      } else {
        finalLogs.push({ text: "Nome do negócio não encontrado", status: 'fail' });
      }

      if (identity.segment) {
        finalLogs.push({ text: `Segmento detectado: ${identity.segment}`, status: 'success' });
      } else {
        finalLogs.push({ text: "Segmento de atuação não identificado", status: 'fail' });
      }

      if (services.length > 0) {
        finalLogs.push({ text: `${services.length} serviços extraídos do perfil`, status: 'success' });
      } else {
        finalLogs.push({ text: "Nenhum serviço identificado nas publicações", status: 'fail' });
      }

      if (targetAudience.idealClient) {
        finalLogs.push({ text: "Perfil do cliente ideal identificado", status: 'success' });
      } else {
        finalLogs.push({ text: "Perfil de cliente ideal ausente — perguntaremos a seguir", status: 'fail' });
      }

      setLogs(prev => [
        ...prev,
        { text: "✓ Análise concluída com sucesso!", status: 'done' }
      ]);

      setTimeout(() => {
        setLogs(finalLogs);
        setShowSummary(true);
        setTimeout(() => {
          onFinishLogs();
        }, 2500);
      }, 800);
    }
  }, [isExtractionDone, extractedData, errorMsg, onFinishLogs]);

  return (
    <Container>
      <SpinnerSection>
        <InstagramLogoWrapper $hasError={hasError}>
          <FaInstagram />
          {!hasError && <Spinner />}
        </InstagramLogoWrapper>
        <Title>
          {hasError 
            ? "Falha na Extração Automática" 
            : showSummary 
              ? "Resultados da Extração" 
              : "Análise Inteligente de Perfil"
          }
        </Title>
        <Subtitle>
          {hasError 
            ? "Não foi possível resgatar os dados públicos deste perfil no momento. Você poderá responder todas as perguntas na entrevista guiada." 
            : showSummary 
              ? "Mapeamos os dados encontrados. Vamos preencher as lacunas na entrevista." 
              : `Extraindo informações de @${handle.replace('@', '')} sem inventar dados...`
          }
        </Subtitle>
      </SpinnerSection>

      <ProgressWrapper>
        <ProgressBar $width={progress} $hasError={hasError} />
        <ProgressText>{progress}%</ProgressText>
      </ProgressWrapper>

      <ConsoleWrapper>
        <ConsoleTitle>LOG DE EXTRAÇÃO IA</ConsoleTitle>
        <ConsoleLines>
          {logs.map((log, idx) => (
            <ConsoleLine key={idx} $status={log.status} className="animate-slide-up">
              {log.status === 'success' && <FaCheck className="icon-success" />}
              {log.status === 'fail' && <span className="icon-fail"><FaTimes /></span>}
              {log.status === 'info' && <FaSpinner className="icon-spinner" />}
              {log.status === 'done' && <span className="icon-done">✨</span>}
              <span>{log.text}</span>
            </ConsoleLine>
          ))}
        </ConsoleLines>
      </ConsoleWrapper>

      {hasError && (
        <FallbackBtn type="button" onClick={onFallback}>
          Iniciar Entrevista Manual <FaArrowRight />
        </FallbackBtn>
      )}
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px;
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  gap: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(217, 70, 239, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(217, 70, 239, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(217, 70, 239, 0); }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
`;

const InstagramLogoWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  background: ${props => props.$hasError 
    ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' 
    : 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'};
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  animation: ${props => props.$hasError ? 'none' : pulse} 2s infinite ease-in-out;
  box-shadow: ${props => props.$hasError ? '0 8px 24px rgba(239, 68, 68, 0.35)' : 'none'};
`;

const Spinner = styled.div`
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 3px solid transparent;
  border-top-color: #f472b6;
  border-bottom-color: #8b5cf6;
  border-radius: 50%;
  animation: ${rotate} 2s linear infinite;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #94a3b8;
  max-width: 400px;
  margin: 0;
  line-height: 1.5;
`;

const ProgressWrapper = styled.div`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ProgressBar = styled.div`
  width: ${props => props.$width}%;
  height: 100%;
  background: ${props => props.$hasError 
    ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)' 
    : 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)'};
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ProgressText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
`;

const ConsoleWrapper = styled.div`
  width: 100%;
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  font-family: 'Courier New', Courier, monospace;
`;

const ConsoleTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 1px;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 6px;
`;

const ConsoleLines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ConsoleLine = styled.div`
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.4;
  animation: ${slideUp} 0.3s ease-out forwards;
  
  color: ${props => {
    if (props.$status === 'success') return '#4ade80';
    if (props.$status === 'fail') return '#f87171';
    if (props.$status === 'done') return '#f472b6';
    return '#cbd5e1';
  }};

  .icon-success {
    color: #4ade80;
    font-size: 0.8rem;
  }

  .icon-fail {
    color: #f87171;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
  }

  .icon-spinner {
    animation: ${rotate} 1s linear infinite;
    color: #94a3b8;
  }
  
  .icon-done {
    font-size: 0.9rem;
  }
`;

const FallbackBtn = styled.button`
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  transition: all 0.2s;
  
  &:hover {
    background: #7c3aed;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(139, 92, 246, 0.4);
  }
`;
