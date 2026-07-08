import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaLaptop, FaMobileAlt, FaDownload, FaCode, FaRobot, FaMagic, FaFilePdf, FaPalette, FaFont } from 'react-icons/fa';
import { EngineRenderer } from '../core/landing-engine/renderer/EngineRenderer';
import { generateHTML, generateReactCode, downloadFile } from '../utils/exporter';

export default function PreviewSection({ 
  generatedData, 
  images = [], 
  isGenerating, 
  generationLogs = [] 
}) {
  const [device, setDevice] = useState('desktop');
  const [editedData, setEditedData] = useState(null);

  // Sincronizar com os dados gerados pela IA com sanitização de fallback
  useEffect(() => {
    if (generatedData) {
      setEditedData(generatedData);
    } else {
      setEditedData(null);
    }
  }, [generatedData]);

  const handleExportHTML = () => {
    if (!editedData) return;
    const htmlContent = generateHTML(editedData, images);
    const fileName = `${editedData.businessName.toLowerCase().replace(/\s+/g, '_')}_landing_page.html`;
    downloadFile(htmlContent, fileName, 'text/html');
  };

  const handleExportReact = () => {
    if (!editedData) return;
    const reactContent = generateReactCode(editedData, images);
    const fileName = 'GeneratedLandingPage.jsx';
    downloadFile(reactContent, fileName, 'text/plain');
  };

  const handleExportPDF = () => {
    if (!editedData) return;
    const htmlContent = generateHTML(editedData, images);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permita pop-ups para exportar em PDF.');
      return;
    }
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Dispara a janela de impressão do navegador após carregar as fontes e imagens
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

  const updateThemeField = (field, value) => {
    setEditedData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        theme: {
          ...prev.theme,
          [field]: value
        }
      };
    });
  };

  const applyPalettePreset = (themeName, primaryColor, secondaryColor, lightColor, darkColor) => {
    setEditedData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        theme: {
          ...prev.theme,
          themeName,
          primaryColor,
          secondaryColor,
          lightColor,
          darkColor
        }
      };
    });
  };

  return (
    <PreviewContainer>
      {/* Barra de controle superior */}
      <ControlBar>
        <DeviceToggle>
          <ToggleButton 
            $active={device === 'desktop'} 
            onClick={() => setDevice('desktop')}
            title="Visualização Desktop"
          >
            <FaLaptop /> Desktop
          </ToggleButton>
          <ToggleButton 
            $active={device === 'mobile'} 
            onClick={() => setDevice('mobile')}
            title="Visualização Mobile"
          >
            <FaMobileAlt /> Mobile
          </ToggleButton>
        </DeviceToggle>

        {generatedData && !isGenerating && (
          <Actions>
            <ActionButton onClick={handleExportHTML} className="btn-html">
              <FaDownload /> Exportar HTML
            </ActionButton>
            <ActionButton onClick={handleExportReact} className="btn-react">
              <FaCode /> Código React
            </ActionButton>
            <ActionButton onClick={handleExportPDF} className="btn-pdf">
              <FaFilePdf /> Exportar PDF
            </ActionButton>
          </Actions>
        )}
      </ControlBar>

      {/* Janela de preview */}
      <ViewportWrapper $hasData={!!editedData && !isGenerating}>
        {isGenerating ? (
          <LoadingScreen>
            <LoaderCircle>
              <FaRobot />
            </LoaderCircle>
            <h3>Construindo sua Landing Page...</h3>
            <p>Nossa IA está reescrevendo a biografia e criando designs de conversão.</p>
            <LogConsole>
              {generationLogs.map((log, idx) => (
                <div key={idx} className="log-line">
                  <span className="log-dot"></span> {log}
                </div>
              ))}
            </LogConsole>
          </LoadingScreen>
        ) : editedData ? (
          <>
            {/* Visualizador - Full Width sem painel lateral por enquanto */}
            <DeviceFrame className={device} style={{ width: '100%', margin: '0 auto' }}>
              <EngineRenderer 
                blueprint={editedData.blueprint}
                themeTokens={editedData.themeTokens}
                copyModel={editedData.copyModel}
                assetModel={editedData.assetModel}
              />
            </DeviceFrame>
          </>
        ) : (
          <WelcomeScreen>
            <IconContainer>
              <FaMagic />
            </IconContainer>
            <h2>Gerador de Landing Pages</h2>
            <p>
              Preencha os dados do Instagram na barra lateral esquerda e clique em 
              <strong>"Gerar Landing Page"</strong> para ver a IA criar sua página em tempo real.
            </p>
            <FeaturesList>
              <FeatureItem>
                <span className="feat-check">✓</span>
                <div>
                  <strong>Copywriting CRO:</strong> Bio do Instagram transformada em proposta de valor de alto impacto.
                </div>
              </FeatureItem>
              <FeatureItem>
                <span className="feat-check">✓</span>
                <div>
                  <strong>Mobile-First:</strong> Templates lindos e 100% responsivos para qualquer dispositivo.
                </div>
              </FeatureItem>
              <FeatureItem>
                <span className="feat-check">✓</span>
                <div>
                  <strong>Exportação Limpa:</strong> Baixe o arquivo HTML pronto ou o componente React em segundos.
                </div>
              </FeatureItem>
            </FeaturesList>
          </WelcomeScreen>
        )}
      </ViewportWrapper>

    </PreviewContainer>
  );
}

// Styled Components
const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 85vh;
  background: #0f172a;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ControlBar = styled.div`
  background: #1e293b;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const DeviceToggle = styled.div`
  display: flex;
  gap: 5px;
  background: #0f172a;
  padding: 4px;
  border-radius: 8px;
`;

const ToggleButton = styled.button`
  background: ${props => props.$active ? '#3b82f6' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#94a3b8'};
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: white;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
  color: white;

  &.btn-html {
    background: #10b981;
    &:hover {
      background: #059669;
    }
  }

  &.btn-react {
    background: #6366f1;
    &:hover {
      background: #4f46e5;
    }
  }

  &.btn-pdf {
    background: #ef4444;
    &:hover {
      background: #dc2626;
    }
  }
`;

const ViewportWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  background: #090d16;
  display: ${props => props.$hasData ? 'flex' : 'flex'};
  gap: 20px;
  align-items: center;
  justify-content: center;
  padding: 20px;
  height: calc(100% - 56px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
`;

const StyleEditorPanel = styled.div`
  background: #1e293b;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 16px;
  overflow-y: auto;
  text-align: left;

  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: white;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const EditorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Opções de temas */
  .theme-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .theme-btn {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    color: #cbd5e1;
    padding: 8px;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }

    &.active {
      background: #3b82f6;
      border-color: #3b82f6;
      color: white;
    }
  }

  /* Presets rápidos */
  .preset-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }

  .preset-btn {
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    padding: 6px;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s;
    text-align: center;

    &:hover {
      transform: scale(1.05);
    }
  }

  select {
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 8px 12px;
    color: white;
    font-size: 0.85rem;
    outline: none;
    cursor: pointer;

    &:focus {
      border-color: #3b82f6;
    }
  }

  /* Inputs de cores lado a lado */
  .color-inputs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;

    div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    label {
      font-size: 0.7rem;
    }

    input[type="color"] {
      width: 100%;
      height: 38px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      background: none;
      cursor: pointer;
      padding: 0;

      &::-webkit-color-swatch-wrapper {
        padding: 0;
      }
      &::-webkit-color-swatch {
        border: none;
        border-radius: 5px;
      }
    }
  }
`;


const DeviceFrame = styled.div`
  background: white;
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &.desktop {
    width: 100%;
  }

  &.mobile {
    width: 375px;
    border-radius: 30px;
    border: 12px solid #1e293b;
  }
`;

const WelcomeScreen = styled.div`
  max-width: 500px;
  text-align: center;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 12px;
    color: #f3f4f6;
  }

  p {
    font-size: 0.95rem;
    color: #94a3b8;
    line-height: 1.5;
    margin-bottom: 30px;
  }
`;

const IconContainer = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(139, 92, 246, 0.1);
  color: #a78bfa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: 20px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
  }
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: left;
  background: rgba(30, 41, 59, 0.3);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.02);
`;

const FeatureItem = styled.div`
  display: flex;
  gap: 12px;
  font-size: 0.88rem;
  color: #94a3b8;

  .feat-check {
    color: #10b981;
    font-weight: 700;
  }

  strong {
    color: #f3f4f6;
  }
`;

const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  text-align: center;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 6px;
    color: #f3f4f6;
  }

  p {
    font-size: 0.88rem;
    color: #94a3b8;
    margin-bottom: 25px;
  }
`;

const LoaderCircle = styled.div`
  width: 64px;
  height: 64px;
  background: rgba(99, 102, 241, 0.1);
  border: 2px solid #6366f1;
  color: #818cf8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: 20px;
  animation: spin 3s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LogConsole = styled.div`
  width: 100%;
  min-width: 320px;
  max-width: 360px;
  background: #020617;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 12px 16px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  color: #38bdf8;
  text-align: left;
  max-height: 120px;
  overflow-y: auto;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.8);

  .log-line {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    line-height: 1.4;

    &:last-child {
      margin-bottom: 0;
      color: #34d399;
      font-weight: 600;
    }
  }

  .log-dot {
    width: 6px;
    height: 6px;
    background: #38bdf8;
    border-radius: 50%;
    display: inline-block;

    &:last-child {
      background: #34d399;
    }
  }
`;
