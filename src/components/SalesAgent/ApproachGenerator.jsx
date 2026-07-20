import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCopy, FaCheck, FaMagic, FaSpinner, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { generateApproachMessages } from '../../services/aiService';

export default function ApproachGenerator({ prospectData, freelancerProfile, apiKey, onAddLead }) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(null);
  const [hasPrototype, setHasPrototype] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const handleGenerate = async () => {
    if (!freelancerProfile) {
      alert("Por favor, preencha o seu perfil na aba 'Meu Perfil' primeiro.");
      return;
    }
    setLoading(true);
    setMessages(null);
    try {
      const result = await generateApproachMessages(prospectData, freelancerProfile, hasPrototype, apiKey);
      setMessages(result);
    } catch (e) {
      alert("Erro ao gerar mensagens: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Container>
      <Header>
        <h3>Gerador de Abordagem Personalizada</h3>
        <p>Criando mensagens baseadas nos problemas identificados do prospect.</p>
      </Header>

      <Controls>
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={hasPrototype} 
            onChange={(e) => setHasPrototype(e.target.checked)} 
          />
          Já tenho um protótipo/layout pronto para apresentar
        </label>
        
        <GenerateBtn onClick={handleGenerate} disabled={loading}>
          {loading ? <FaSpinner className="spin" /> : <FaMagic />} 
          <span>{loading ? 'Gerando mensagens...' : 'Gerar Abordagens'}</span>
        </GenerateBtn>
      </Controls>

      {messages && (
        <Results className="animate-fade-in">
          <Card>
            <div className="card-header">
              <span className="icon">🎯</span>
              <h4>Ângulo da Dor</h4>
            </div>
            <p className="message-text">"{messages.anguloDor}"</p>
            <CopyBtn onClick={() => copyToClipboard(messages.anguloDor, 'dor')}>
              {copiedIndex === 'dor' ? <span className="copy-inner"><FaCheck /> Copiado</span> : <span className="copy-inner"><FaCopy /> Copiar</span>}
            </CopyBtn>
          </Card>

          <Card>
            <div className="card-header">
              <span className="icon">🏆</span>
              <h4>Ângulo do Resultado</h4>
            </div>
            <p className="message-text">"{messages.anguloResultado}"</p>
            <CopyBtn onClick={() => copyToClipboard(messages.anguloResultado, 'resultado')}>
              {copiedIndex === 'resultado' ? <span className="copy-inner"><FaCheck /> Copiado</span> : <span className="copy-inner"><FaCopy /> Copiar</span>}
            </CopyBtn>
          </Card>

          <Card>
            <div className="card-header">
              <span className="icon">⚡</span>
              <h4>Ângulo da Curiosidade</h4>
            </div>
            <p className="message-text">"{messages.anguloCuriosidade}"</p>
            <CopyBtn onClick={() => copyToClipboard(messages.anguloCuriosidade, 'curiosidade')}>
              {copiedIndex === 'curiosidade' ? <span className="copy-inner"><FaCheck /> Copiado</span> : <span className="copy-inner"><FaCopy /> Copiar</span>}
            </CopyBtn>
          </Card>

          <FollowUpSection>
            <button className="toggle-btn" onClick={() => setShowFollowUp(!showFollowUp)}>
              {showFollowUp ? <FaChevronUp /> : <FaChevronDown />} Ver sequência de Follow-up sugerida
            </button>
            
            {showFollowUp && messages.followUp && (
              <div className="followup-list animate-fade-in">
                <div className="followup-item">
                  <strong>Dia 1:</strong>
                  <p>"{messages.followUp.dia1}"</p>
                  <CopyBtn onClick={() => copyToClipboard(messages.followUp.dia1, 'dia1')}>
                    {copiedIndex === 'dia1' ? <FaCheck /> : <FaCopy />}
                  </CopyBtn>
                </div>
                <div className="followup-item">
                  <strong>Dia 3:</strong>
                  <p>"{messages.followUp.dia3}"</p>
                  <CopyBtn onClick={() => copyToClipboard(messages.followUp.dia3, 'dia3')}>
                    {copiedIndex === 'dia3' ? <FaCheck /> : <FaCopy />}
                  </CopyBtn>
                </div>
                <div className="followup-item">
                  <strong>Dia 7:</strong>
                  <p>"{messages.followUp.dia7}"</p>
                  <CopyBtn onClick={() => copyToClipboard(messages.followUp.dia7, 'dia7')}>
                    {copiedIndex === 'dia7' ? <FaCheck /> : <FaCopy />}
                  </CopyBtn>
                </div>
              </div>
            )}
          </FollowUpSection>

          <ActionRow>
             <button className="btn-secondary" onClick={() => onAddLead(prospectData, messages)}>
               Adicionar ao Pipeline de Leads
             </button>
          </ActionRow>
        </Results>
      )}
    </Container>
  );
}

const Container = styled.div`
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
`;

const Header = styled.div`
  margin-bottom: 20px;
  h3 { margin: 0 0 8px 0; font-size: 1.2rem; color: #f8fafc; }
  p { margin: 0; color: #94a3b8; font-size: 0.9rem; }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #e2e8f0;
    font-size: 0.95rem;

    input {
      accent-color: #10b981;
      width: 18px;
      height: 18px;
    }
  }
`;

const GenerateBtn = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;

const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.div`
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  position: relative;

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    .icon { font-size: 1.2rem; }
    h4 { margin: 0; color: #f1f5f9; font-size: 1.05rem; }
  }

  .message-text {
    color: #cbd5e1;
    line-height: 1.6;
    margin: 0;
    font-style: italic;
    padding-right: 100px;
  }
`;

const CopyBtn = styled.button`
  position: absolute;
  right: 20px;
  bottom: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const FollowUpSection = styled.div`
  margin-top: 16px;

  .toggle-btn {
    background: none;
    border: none;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-weight: 500;
    padding: 8px 0;
    
    &:hover { color: #f8fafc; }
  }

  .followup-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 12px;
  }

  .followup-item {
    background: rgba(15, 23, 42, 0.5);
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    position: relative;

    strong { color: #f1f5f9; white-space: nowrap; }
    p { margin: 0; color: #cbd5e1; font-style: italic; padding-right: 40px; }
    
    button {
      position: absolute;
      right: 12px;
      top: 12px;
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      &:hover { color: white; }
    }
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;

  .btn-secondary {
    background: rgba(16, 185, 129, 0.1);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(16, 185, 129, 0.2);
    }
  }
`;
