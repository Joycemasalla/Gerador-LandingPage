import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaRobot, FaKey, FaBookOpen, FaPlus, FaChevronLeft, FaHistory, FaTrash, FaTimes } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import InterviewWizard from './components/InterviewWizard/InterviewWizard';
import StrategyDashboard from './components/StrategyDashboard/StrategyDashboard';
import { generateStrategy } from './services/aiService';

export default function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState([]);
  const [generatedData, setGeneratedData] = useState(null);
  const [images, setImages] = useState([]);
  const [customApiKey, setCustomApiKey] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [savedStrategies, setSavedStrategies] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Carregar histórico inicial
  useEffect(() => {
    const saved = localStorage.getItem('instapage_history');
    if (saved) {
      try {
        setSavedStrategies(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar histórico', e);
      }
    }
  }, []);

  // Helper para adicionar logs com atraso para leitura (UX Premium)
  const addLog = (message, delay = 0) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setGenerationLogs(prev => [...prev, message]);
        resolve();
      }, delay);
    });
  };

  // Processo de geração da Landing Page via prompt CRO rico
  const handleGenerate = async (richClientJson, extractedImages = []) => {
    setIsGenerating(true);
    setGenerationLogs([]);
    setGeneratedData(null);
    setImages(extractedImages);

    try {
      await addLog('🤖 Inicializando Estrategista InstaPage AI...', 200);
      await addLog('📊 Lendo dados extraídos e dores do negócio...', 400);
      await addLog('🧠 Realizando auditoria comercial e de UX...', 600);
      await addLog('⚡ Mapeando problemas críticos e oportunidades de conversão...', 600);
      await addLog('📝 Estruturando Briefing de Neuromarketing e Copywriting...', 800);
      await addLog('🛠️ Redigindo o Super Prompt Otimizado para o Lovable...', 700);

      let dataToSave = null;

      if (customApiKey === 'mock') {
        await addLog('🧪 [MODO MOCK ATIVADO] Ignorando API...', 100);
        
        const mockData = {
          audit: "# Auditoria Completa do Negócio (MOCK)\\n\\nAqui estaria a auditoria real...",
          problems: "# Problemas e Oportunidades (MOCK)\\n\\nAqui estariam os problemas reais...",
          briefing: "# Briefing Estratégico (MOCK)\\n\\nAqui estaria o briefing real...",
          lovablePrompt: "Você é o Lovable... (MOCK PROMPT)"
        };
        
        setGeneratedData(mockData);
        dataToSave = mockData;
      } else {
        const data = await generateStrategy(richClientJson, customApiKey);
        setGeneratedData(data);
        dataToSave = data;
      }

      // Salvar no histórico
      const newStrategy = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        clientInfo: richClientJson,
        data: dataToSave,
        images: extractedImages
      };

      setSavedStrategies(prev => {
        const updated = [newStrategy, ...prev];
        localStorage.setItem('instapage_history', JSON.stringify(updated));
        return updated;
      });

      await addLog('📦 Documentos recebidos da IA com sucesso!', 300);
      await addLog('🚀 Renderizando Dashboard Estratégico...', 200);
      
      // Disparar confetes para comemoração
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

    } catch (error) {
      console.error(error);
      setGenerationLogs(prev => [
        ...prev, 
        `❌ Erro na geração: ${error.message}`
      ]);
      alert(`Ocorreu um erro ao gerar a página: ${error.message}\n\nCertifique-se de que o servidor local está ativo.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza de que deseja criar uma nova Estratégia? Todo o progresso atual será perdido.')) {
      setGeneratedData(null);
      setImages([]);
      setGenerationLogs([]);
    }
  };

  const loadStrategy = (strategy) => {
    setGeneratedData(strategy.data);
    setImages(strategy.images || []);
    setShowHistory(false);
  };

  const deleteStrategy = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Excluir esta estratégia salva?')) {
      setSavedStrategies(prev => {
        const updated = prev.filter(s => s.id !== id);
        localStorage.setItem('instapage_history', JSON.stringify(updated));
        return updated;
      });
    }
  };

  return (
    <DashboardLayout>
      {/* Header Administrativo */}
      <Header>
        <div className="logo-area" style={{ cursor: generatedData ? 'pointer' : 'default' }} onClick={generatedData ? handleReset : undefined}>
          <IconWrapper>
            <FaRobot />
          </IconWrapper>
          <div>
            <h1>InstaPage AI</h1>
            <p>Sistema de Entrevista Guiada & Geração CRO</p>
          </div>
        </div>

        <HeaderActions>
          <HistoryBtn onClick={() => setShowHistory(true)}>
            <FaHistory /> Histórico
          </HistoryBtn>
          {generatedData && !isGenerating && (
            <NewLpBtn onClick={handleReset}>
              <FaChevronLeft /> Criar Nova LP
            </NewLpBtn>
          )}
          <ConfigToggleBtn onClick={() => setShowConfig(!showConfig)}>
            <FaKey /> Configurações de API
          </ConfigToggleBtn>
          <a 
            href="https://github.com/google/generative-ai-js" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="doc-link"
          >
            <FaBookOpen /> Gemini Docs
          </a>
        </HeaderActions>
      </Header>

      {/* Painel de Configurações Colapsável */}
      {showConfig && (
        <ConfigPanel className="animate-fade-in">
          <div className="panel-content">
            <h4><FaKey /> Configurações do Agente de IA</h4>
            <p>
              Por padrão, o servidor proxy tenta ler <strong>GEMINI_API_KEY</strong> do arquivo <code>.env</code> na raiz do projeto. 
              Caso prefira, você pode colar sua chave temporária do Gemini diretamente abaixo. 
              <br/><br/>
              <em>Dica: digite <strong>mock</strong> no campo abaixo para usar dados falsos e não consumir sua cota!</em>
            </p>
            <div className="input-group">
              <label>Gemini API Key</label>
              <input 
                type="password" 
                placeholder="Insira sua chave AIzaSy... (ou 'mock' para teste)" 
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
              />
            </div>
            <button className="close-btn" onClick={() => setShowConfig(false)}>Salvar e Fechar</button>
          </div>
        </ConfigPanel>
      )}

      {/* History Drawer */}
      {showHistory && (
        <HistoryOverlay onClick={() => setShowHistory(false)}>
          <HistoryDrawer onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3><FaHistory /> Histórico de LPs</h3>
              <button className="close-btn" onClick={() => setShowHistory(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="drawer-content">
              {savedStrategies.length === 0 ? (
                <div className="empty-state">Nenhum histórico salvo.</div>
              ) : (
                savedStrategies.map(strategy => (
                  <HistoryCard key={strategy.id} onClick={() => loadStrategy(strategy)}>
                    <div className="card-info">
                      <h4>{strategy.clientInfo?.nomeDoNegocio || 'Estratégia Sem Nome'}</h4>
                      <span>{new Date(strategy.timestamp).toLocaleString('pt-BR')}</span>
                    </div>
                    <button className="delete-btn" onClick={(e) => deleteStrategy(e, strategy.id)} title="Excluir">
                      <FaTrash />
                    </button>
                  </HistoryCard>
                ))
              )}
            </div>
          </HistoryDrawer>
        </HistoryOverlay>
      )}

      {/* Área Principal de Conteúdo */}
      <ContentArea>
        {generatedData !== null || isGenerating ? (
          <StrategyDashboard 
            strategyData={generatedData} 
            isGenerating={isGenerating} 
            generationLogs={generationLogs} 
          />
        ) : (
          <InterviewWizard customApiKey={customApiKey} onComplete={handleGenerate} />
        )}
      </ContentArea>
    </DashboardLayout>
  );
}

// Styled Components
const DashboardLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: radial-gradient(circle at top right, #0f172a, #020617);
  padding: 24px;
  gap: 20px;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(31, 41, 55, 0.35);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px 24px;
  border-radius: 16px;
  z-index: 10;

  .logo-area {
    display: flex;
    align-items: center;
    gap: 16px;

    h1 {
      font-size: 1.4rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
      line-height: 1.2;
      margin: 0;
    }

    p {
      font-size: 0.8rem;
      color: #94a3b8;
      margin: 0;
    }
  }
`;

const IconWrapper = styled.div`
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  .doc-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 600;
    transition: color 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }
`;

const HistoryBtn = styled.button`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;

  &:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: #3b82f6;
    color: white;
  }
`;

const ConfigToggleBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const NewLpBtn = styled.button`
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  color: #a78bfa;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;

  &:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: #8b5cf6;
    color: white;
  }
`;

const ConfigPanel = styled.div`
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  animation: fadeIn 0.3s ease-out;

  .panel-content {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 15px;

    h4 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
    }

    p {
      font-size: 0.85rem;
      color: #94a3b8;
      line-height: 1.5;
      margin: 0;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 0.8rem;
        font-weight: 600;
        color: #cbd5e1;
      }

      input {
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 10px 14px;
        color: white;
        font-size: 0.9rem;
        outline: none;

        &:focus {
          border-color: #8b5cf6;
        }
      }
    }

    .close-btn {
      align-self: flex-start;
      background: #8b5cf6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: #7c3aed;
      }
    }
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const HistoryOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
`;

const HistoryDrawer = styled.div`
  width: 400px;
  max-width: 100%;
  height: 100%;
  background: #0f172a;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: -4px 0 24px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.3s ease-out;

  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    h3 {
      margin: 0;
      color: white;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .close-btn {
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 1.2rem;
      cursor: pointer;
      transition: color 0.2s;

      &:hover { color: white; }
    }
  }

  .drawer-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .empty-state {
      color: #94a3b8;
      text-align: center;
      margin-top: 40px;
      font-size: 0.9rem;
    }
  }
`;

const HistoryCard = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(30, 41, 59, 0.9);
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-2px);
  }

  .card-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    h4 {
      margin: 0;
      color: #f1f5f9;
      font-size: 1rem;
    }

    span {
      font-size: 0.75rem;
      color: #94a3b8;
    }
  }

  .delete-btn {
    background: none;
    border: none;
    color: #ef4444;
    opacity: 0.6;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
      opacity: 1;
      background: rgba(239, 68, 68, 0.1);
    }
  }
`;
