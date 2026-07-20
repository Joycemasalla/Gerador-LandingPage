import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Copy, Sparkles, Loader2, Calendar } from 'lucide-react';
import { generateApproachMessages } from '../../services/aiService';

const Container = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;

  &:hover {
    color: #f8fafc;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #cbd5e1;
  font-size: 0.9rem;
  cursor: pointer;
  background: rgba(15, 23, 42, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #475569;

  input {
    accent-color: #10b981;
    width: 16px;
    height: 16px;
  }
`;

const GenerateBtn = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  width: 100%;
  justify-content: center;
  margin-bottom: 2rem;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const MessageCard = styled(motion.div)`
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid ${props => props.$color || '#475569'};
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.$color};
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const MessageText = styled.div`
  color: #e2e8f0;
  font-size: 0.95rem;
  line-height: 1.6;
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  font-style: italic;
  white-space: pre-wrap;
`;

const CopyBtn = styled.button`
  margin-top: 1rem;
  background: transparent;
  border: 1px solid #475569;
  color: #cbd5e1;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const FollowUpSection = styled.div`
  margin-top: 3rem;
  border-top: 1px solid #334155;
  padding-top: 2rem;
`;

const AddToPipelineBtn = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover { background: #059669; }
`;

export default function ApproachGenerator({ prospectData, onBack, apiKey }) {
  const [hasPrototype, setHasPrototype] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [pipelineAdded, setPipelineAdded] = useState(false);

  const freelancerProfile = JSON.parse(localStorage.getItem('salesagent_profile') || '{}');

  const handleGenerate = async () => {
    setLoading(true);
    setMessages(null);
    try {
      const data = await generateApproachMessages(prospectData, freelancerProfile, hasPrototype, apiKey);
      setMessages(data);
    } catch (err) {
      alert("Erro ao gerar mensagens: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const addToPipeline = () => {
    const leads = JSON.parse(localStorage.getItem('salesagent_leads') || '[]');
    const newLead = {
      id: Date.now().toString(),
      name: prospectData.profile.identity?.businessName || prospectData.profile.identity?.handle || 'Desconhecido',
      handle: prospectData.profile.identity?.handle || '',
      score: prospectData.analysis.score,
      status: 'Abordado',
      date: new Date().toISOString()
    };
    localStorage.setItem('salesagent_leads', JSON.stringify([...leads, newLead]));
    setPipelineAdded(true);
  };

  return (
    <Container>
      <Header>
        <BackBtn onClick={onBack}>
          <ArrowLeft size={16} /> Voltar para Análise
        </BackBtn>
        <CheckboxLabel>
          <input 
            type="checkbox" 
            checked={hasPrototype} 
            onChange={(e) => setHasPrototype(e.target.checked)} 
          />
          Já tenho um protótipo pronto para eles
        </CheckboxLabel>
      </Header>

      {!messages && (
        <GenerateBtn onClick={handleGenerate} disabled={loading}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? 'Criando a melhor abordagem...' : 'Gerar Mensagens com IA'}
        </GenerateBtn>
      )}

      {messages && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#f8fafc' }}>Escolha o seu ângulo:</h3>
              <AddToPipelineBtn onClick={addToPipeline} disabled={pipelineAdded} style={{ opacity: pipelineAdded ? 0.5 : 1 }}>
                <CheckCircle2 size={16} />
                {pipelineAdded ? 'Salvo no Pipeline' : 'Salvar no Pipeline'}
              </AddToPipelineBtn>
            </div>
            <Grid>
              <MessageCard $color="#ef4444" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                <CardHeader $color="#ef4444">🎯 Foco na Dor</CardHeader>
                <MessageText>{messages.anguloDor}</MessageText>
                <CopyBtn onClick={() => handleCopy(messages.anguloDor, 'dor')}>
                  {copiedIndex === 'dor' ? <CheckCircle2 size={16} color="#10b981" /> : <Copy size={16} />} 
                  {copiedIndex === 'dor' ? 'Copiado!' : 'Copiar'}
                </CopyBtn>
              </MessageCard>

              <MessageCard $color="#10b981" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <CardHeader $color="#10b981">🏆 Foco no Resultado</CardHeader>
                <MessageText>{messages.anguloResultado}</MessageText>
                <CopyBtn onClick={() => handleCopy(messages.anguloResultado, 'resultado')}>
                  {copiedIndex === 'resultado' ? <CheckCircle2 size={16} color="#10b981" /> : <Copy size={16} />} 
                  {copiedIndex === 'resultado' ? 'Copiado!' : 'Copiar'}
                </CopyBtn>
              </MessageCard>

              <MessageCard $color="#3b82f6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <CardHeader $color="#3b82f6">⚡ Curiosidade</CardHeader>
                <MessageText>{messages.anguloCuriosidade}</MessageText>
                <CopyBtn onClick={() => handleCopy(messages.anguloCuriosidade, 'curiosidade')}>
                  {copiedIndex === 'curiosidade' ? <CheckCircle2 size={16} color="#10b981" /> : <Copy size={16} />} 
                  {copiedIndex === 'curiosidade' ? 'Copiado!' : 'Copiar'}
                </CopyBtn>
              </MessageCard>
            </Grid>

            {messages.followUp && (
              <FollowUpSection>
                <h3 style={{ margin: '0 0 1.5rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={20} color="#8b5cf6" />
                  Sequência de Follow-up Sugerida
                </h3>
                <Grid>
                  <MessageCard initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                    <CardHeader $color="#a78bfa">Dia 1 (Acompanhamento)</CardHeader>
                    <MessageText>{messages.followUp.dia1}</MessageText>
                    <CopyBtn onClick={() => handleCopy(messages.followUp.dia1, 'dia1')}>
                      {copiedIndex === 'dia1' ? <CheckCircle2 size={16} /> : <Copy size={16} />} Copiar
                    </CopyBtn>
                  </MessageCard>
                  
                  <MessageCard initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                    <CardHeader $color="#a78bfa">Dia 3 (Novo Ângulo)</CardHeader>
                    <MessageText>{messages.followUp.dia3}</MessageText>
                    <CopyBtn onClick={() => handleCopy(messages.followUp.dia3, 'dia3')}>
                      {copiedIndex === 'dia3' ? <CheckCircle2 size={16} /> : <Copy size={16} />} Copiar
                    </CopyBtn>
                  </MessageCard>

                  <MessageCard initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                    <CardHeader $color="#a78bfa">Dia 7 (Encerramento)</CardHeader>
                    <MessageText>{messages.followUp.dia7}</MessageText>
                    <CopyBtn onClick={() => handleCopy(messages.followUp.dia7, 'dia7')}>
                      {copiedIndex === 'dia7' ? <CheckCircle2 size={16} /> : <Copy size={16} />} Copiar
                    </CopyBtn>
                  </MessageCard>
                </Grid>
              </FollowUpSection>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </Container>
  );
}
