import React, { useState } from 'react';
import styled from 'styled-components';
import { FaRobot, FaKey, FaBookOpen } from 'react-icons/fa';
import confetti from 'canvas-confetti';
import GeneratorForm from './components/GeneratorForm';
import PreviewSection from './components/PreviewSection';
import { generateLandingPage } from './services/aiService';

export default function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState([]);
  const [generatedData, setGeneratedData] = useState(null);
  const [images, setImages] = useState([]);
  const [customApiKey, setCustomApiKey] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  // Helper para atualizar logs com atraso para que o usuário consiga lê-los (UX premium)
  const addLog = (message, delay = 0) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setGenerationLogs(prev => [...prev, message]);
        resolve();
      }, delay);
    });
  };

  const handleGenerate = async (formData) => {
    setIsGenerating(true);
    setGenerationLogs([]);
    setGeneratedData(null);
    setImages(formData.images || []);

    try {
      await addLog('🤖 Inicializando Agente de Landing Page...', 200);
      await addLog('🔗 Conectando ao Servidor Proxy Local na porta 3001...', 500);
      await addLog('📝 Construindo Prompt e instruindo modelo Gemini...', 600);
      await addLog('🧠 IA analisando biografia do Instagram...', 800);
      await addLog('✨ Gerando copywriting comercial persuasivo (CRO)...', 1000);
      await addLog('🎨 Escolhendo paleta de cores moderna...', 800);
      await addLog('🛠️ Estruturando dados e validando JSON...', 1000);

      // Chamada real ao proxy
      const data = await generateLandingPage(formData, customApiKey);

      await addLog('📦 Resposta recebida da IA com sucesso!', 300);
      await addLog('🚀 Renderizando Landing Page...', 200);

      // Salvar os dados finais gerados pela IA
      setGeneratedData(data);
      
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
      alert(`Ocorreu um erro: ${error.message}\n\nCertifique-se de que o servidor Express (server.js) está rodando e a chave API do Gemini está configurada.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header Administrativo */}
      <Header>
        <div className="logo-area">
          <IconWrapper>
            <FaRobot />
          </IconWrapper>
          <div>
            <h1>InstaPage AI</h1>
            <p>Gerador Inteligente de Landing Pages</p>
          </div>
        </div>

        <HeaderActions>
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
              Caso prefira, você pode colar sua chave temporária do Gemini diretamente abaixo (ela será enviada de forma segura nas requisições do cabeçalho).
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

      {/* Grid Principal */}
      <MainGrid>
        <Sidebar>
          <GeneratorForm onSubmit={handleGenerate} isGenerating={isGenerating} />
        </Sidebar>
        <PreviewArea>
          <PreviewSection 
            generatedData={generatedData} 
            images={images} 
            isGenerating={isGenerating} 
            generationLogs={generationLogs} 
          />
        </PreviewArea>
      </MainGrid>
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
    }

    p {
      font-size: 0.8rem;
      color: #94a3b8;
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
    }

    p {
      font-size: 0.85rem;
      color: #94a3b8;
      line-height: 1.5;
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
          border-color: #3b82f6;
        }
      }
    }

    .close-btn {
      align-self: flex-start;
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: #2563eb;
      }
    }
  }
`;

const MainGrid = styled.main`
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 20px;
  flex: 1;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  overflow: hidden;
`;

const PreviewArea = styled.div`
  overflow: hidden;
`;
