import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCopy, FaDownload, FaCheck, FaClipboardList, FaExclamationTriangle, FaLightbulb, FaRobot, FaImages } from 'react-icons/fa';

export default function StrategyDashboard({ strategyData, isGenerating, generationLogs, images = [] }) {
  const [activeTab, setActiveTab] = useState('audit');
  const [copied, setCopied] = useState(null);

  if (isGenerating) {
    return (
      <LoadingContainer className="animate-fade-in">
        <FaRobot className="bot-icon spin-bounce" />
        <h3>O Estrategista está trabalhando...</h3>
        <LogsWrapper>
          {generationLogs && generationLogs.map((log, index) => (
            <LogItem key={index} className="animate-slide-up">
              {log}
            </LogItem>
          ))}
        </LogsWrapper>
      </LoadingContainer>
    );
  }

  const tabs = [
    { id: 'audit', title: 'Auditoria', icon: <FaClipboardList /> },
    { id: 'problems', title: 'Problemas & Oportunidades', icon: <FaExclamationTriangle /> },
    { id: 'briefing', title: 'Briefing Estratégico', icon: <FaLightbulb /> },
    { id: 'lovablePrompt', title: 'Prompt para Lovable', icon: <FaRobot /> }
  ];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = (text, filename) => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadImage = async (url, idx) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const ext = (blob.type.split('/')[1] || 'jpg').split(';')[0];
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `imagem-${idx + 1}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (e) {
      window.open(url, '_blank');
    }
  };

  const handleDownloadAllImages = async () => {
    for (let i = 0; i < images.length; i++) {
      await handleDownloadImage(images[i], i);
      await new Promise(r => setTimeout(r, 300));
    }
  };

  const handleDownloadAll = () => {
    const fullContent = `
# 1. Auditoria Comercial e UX
${strategyData.audit}

---

# 2. Problemas e Oportunidades
${strategyData.problems}

---

# 3. Briefing Estratégico
${strategyData.briefing}

---

# 4. Prompt para Lovable
${strategyData.lovablePrompt}
    `.trim();

    handleDownload(fullContent, 'Estrategia_Completa_InstaPage.md');
  };

  const renderContent = () => {
    const content = strategyData[activeTab];
    return (
      <ContentArea className="animate-fade-in">
        <ActionBar>
          <PrimaryActionBtn onClick={handleDownloadAll}>
            <FaDownload /> Baixar Tudo
          </PrimaryActionBtn>
          <ActionBtn onClick={() => handleCopy(content, activeTab)}>
            {copied === activeTab ? <><FaCheck /> Copiado!</> : <><FaCopy /> Copiar Aba</>}
          </ActionBtn>
          <ActionBtn onClick={() => handleDownload(content, `${activeTab}.md`)}>
            <FaDownload /> Baixar Aba
          </ActionBtn>
        </ActionBar>
        <MarkdownPreview>
          {content}
        </MarkdownPreview>
      </ContentArea>
    );
  };

  return (
    <DashboardContainer className="animate-fade-in">
      <Header>
        <h2>Estratégia e Briefing Concluídos!</h2>
        <p>Aqui estão os 4 documentos estratégicos gerados pela IA. Use o "Prompt para Lovable" para gerar a página final no Lovable.</p>
      </Header>

      <TabsContainer>
        {tabs.map(tab => (
          <Tab 
            key={tab.id} 
            $active={activeTab === tab.id} 
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.title}
          </Tab>
        ))}
      </TabsContainer>

      {strategyData && strategyData[activeTab] ? renderContent() : (
        <EmptyState>Nenhum dado encontrado para esta aba.</EmptyState>
      )}

      {images && images.length > 0 && (
        <GallerySection>
          <GalleryHeader>
            <h3><FaImages /> Imagens Extraídas ({images.length})</h3>
            <PrimaryActionBtn onClick={handleDownloadAllImages}>
              <FaDownload /> Baixar Todas
            </PrimaryActionBtn>
          </GalleryHeader>
          <GalleryGrid>
            {images.map((url, idx) => (
              <GalleryItem key={idx}>
                <img src={url} alt={`Imagem ${idx + 1}`} loading="lazy" />
                <button onClick={() => handleDownloadImage(url, idx)} title="Baixar imagem">
                  <FaDownload />
                </button>
              </GalleryItem>
            ))}
          </GalleryGrid>
        </GallerySection>
      )}
    </DashboardContainer>
  );
}

const GallerySection = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const GalleryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  h3 {
    margin: 0;
    color: white;
    font-size: 1.05rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
`;

const GalleryItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  background: #0f172a;
  border: 1px solid rgba(255,255,255,0.08);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  button {
    position: absolute;
    bottom: 6px;
    right: 6px;
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(255,255,255,0.15);
    color: #a78bfa;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: all 0.2s;
  }

  &:hover button {
    opacity: 1;
  }

  &:hover button:hover {
    background: #8b5cf6;
    color: white;
  }
`;

// Styled Components
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  height: 100%;
  min-height: 400px;
  
  .bot-icon {
    font-size: 3rem;
    color: #8b5cf6;
  }
  
  .spin-bounce {
    animation: bounce 2s infinite;
  }
  
  h3 {
    color: white;
    font-size: 1.4rem;
  }
`;

const LogsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  min-height: 200px;
`;

const LogItem = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  color: #a78bfa;
  border-left: 3px solid #8b5cf6;
  padding-left: 12px;
`;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 10px;

  h2 {
    font-size: 1.8rem;
    color: white;
    font-weight: 800;
    margin: 0 0 10px 0;
  }

  p {
    font-size: 1rem;
    color: #94a3b8;
    margin: 0;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  background: rgba(30, 41, 59, 0.45);
  padding: 8px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow-x: auto;
  
  /* Esconder scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Tab = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${props => props.$active ? 'rgba(139, 92, 246, 0.15)' : 'transparent'};
  color: ${props => props.$active ? '#a78bfa' : '#94a3b8'};
  border: 1px solid ${props => props.$active ? 'rgba(139, 92, 246, 0.3)' : 'transparent'};
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: ${props => props.$active ? '#a78bfa' : 'white'};
    background: ${props => props.$active ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const ContentArea = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(30, 41, 59, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }
`;

const PrimaryActionBtn = styled(ActionBtn)`
  border-color: rgba(139, 92, 246, 0.5);
  color: #a78bfa;

  &:hover {
    background: rgba(139, 92, 246, 0.15);
    color: white;
  }
`;

const MarkdownPreview = styled.pre`
  margin: 0;
  padding: 24px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #e2e8f0;
  height: 500px;
  overflow-y: auto;

  /* Custom scrollbar for content */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.1);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #64748b;
  font-style: italic;
`;
