import React, { useState } from 'react';
import styled from 'styled-components';
import { FaRobot, FaKey, FaBookOpen, FaPlus, FaChevronLeft } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import InterviewWizard from './components/InterviewWizard/InterviewWizard';
import PreviewSection from './components/PreviewSection';
import { LandingEngine } from './core/landing-engine';

export default function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState([]);
  const [generatedData, setGeneratedData] = useState(null);
  const [images, setImages] = useState([]);
  const [customApiKey, setCustomApiKey] = useState('');
  const [showConfig, setShowConfig] = useState(false);

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
      await addLog('🤖 Inicializando Agente InstaPage AI...', 200);
      await addLog('🔗 Conectando ao Servidor Proxy Local na porta 3001...', 500);
      await addLog('📊 Processando JSON rico de 10 blocos estruturado...', 400);
      await addLog('🧠 IA analisando perfil do cliente ideal e dor real...', 600);
      await addLog('⚡ Mapeando objeções comerciais e diferenciais do nicho...', 600);
      await addLog('✨ Redigindo copywriting sob medida baseado nos Pilares CRO...', 800);
      await addLog('🎨 Selecionando fontes e harmonizando paleta de cores (WCAG)...', 700);
      await addLog('🛠️ Validando integridade e estruturação de saída da Landing Page...', 700);

      // Chamada real à nova Landing Engine (Data-driven)
      const engine = new LandingEngine(null, customApiKey);
      const data = await engine.generate(JSON.stringify(richClientJson, null, 2));

      // Normalizar nomes que o EngineRenderer espera (copyModel, assetModel)
      data.copyModel = data.copy;
      data.assetModel = extractedImages && extractedImages.length > 0
        ? { assets: extractedImages }
        : (data.assets && data.assets.assets ? data.assets : { assets: [] });

      await addLog('📦 Resposta recebida da IA com sucesso!', 300);
      await addLog('🚀 Renderizando Landing Page...', 200);

      setGeneratedData(data);
      if (extractedImages && extractedImages.length > 0) {
        setImages(extractedImages);
      }
      
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
    if (window.confirm('Tem certeza de que deseja criar uma nova Landing Page? Todo o progresso atual será perdido.')) {
      setGeneratedData(null);
      setImages([]);
      setGenerationLogs([]);
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
            </p>
            <div className="input-group">
              <label>Gemini API Key</label>
              <input 
                type="password" 
                placeholder="Insira sua chave AIzaSy..." 
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
              />
            </div>
            <button className="close-btn" onClick={() => setShowConfig(false)}>Salvar e Fechar</button>
          </div>
        </ConfigPanel>
      )}

      {/* Área Principal de Conteúdo */}
      <ContentArea>
        {generatedData !== null || isGenerating ? (
          <PreviewSection 
            generatedData={generatedData} 
            images={images} 
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
      color: white;
    }
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
