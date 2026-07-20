import React, { useState } from 'react';
import styled from 'styled-components';
import { FaRobot, FaPaperPlane, FaSpinner, FaTimes } from 'react-icons/fa';
import { generateObjectionResponse } from '../../services/aiService';

const QUICK_SITUATIONS = [
  {
    title: "Visualizou e não respondeu",
    script: "Oi [Nome], vi que conseguiu ver minha mensagem anterior. Sei que a rotina deve estar corrida! Quando tiver um tempinho, me dá um alô para me contar o que achou ou se ficou alguma dúvida. Abraço!"
  },
  {
    title: "Pediu desconto",
    script: "Não confronte o preço de cara. Pergunte: 'O que exatamente faz o valor parecer alto para você agora? Assim consigo entender se tem algo no escopo que podemos ajustar para caber no seu orçamento.' Isso revela se é objeção real ou apenas negociação."
  },
  {
    title: "Quer pensar",
    script: "Claro, [Nome], entendo perfeitamente. Só para me ajudar a te ajudar: tem algum ponto específico da proposta que te deixou na dúvida? Às vezes é uma coisinha pequena que eu consigo esclarecer agora mesmo."
  },
  {
    title: "Já tem alguém",
    script: "Que ótimo que vocês já investem nisso! Meu objetivo não é tomar o lugar de quem já atende vocês, mas sim somar. Posso te enviar apenas uma ideia rápida que tive para o site de vocês, sem compromisso?"
  },
  {
    title: "Perguntou o preço (cedo demais)",
    script: "O valor exato depende do que você realmente precisa para ter resultado. Eu não quero te passar um preço genérico que fique fora da sua realidade. Me conta rapidamente: qual o seu maior desafio hoje com as vendas?"
  },
  {
    title: "Quer ver portfólio",
    script: "Claro! Separei este projeto [Link] que tem um cenário bem parecido com o seu. Nele nós focamos em [Benefício]. Dá uma olhada e me diz o que acha dessa pegada visual para o seu negócio."
  }
];

export default function ConversationFlow({ freelancerProfile, apiKey }) {
  const [clientMessage, setClientMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [selectedSituation, setSelectedSituation] = useState(null);

  const handleGenerateResponse = async () => {
    if (!clientMessage.trim()) return;
    if (!freelancerProfile) {
      alert("Configure seu Perfil na primeira aba para que a IA possa usar seu tom de voz.");
      return;
    }

    setLoading(true);
    setAiResponse('');
    try {
      const resp = await generateObjectionResponse(clientMessage, freelancerProfile, apiKey);
      setAiResponse(resp);
    } catch (e) {
      alert("Erro ao gerar resposta: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="animate-fade-in">
      <Header>
        <h2>Conversa & Objeções</h2>
        <p>Scripts rápidos e assistente com IA para você nunca travar numa negociação.</p>
      </Header>

      <Section>
        <h3>⚡ Respostas Rápidas</h3>
        <Grid>
          {QUICK_SITUATIONS.map((sit, idx) => (
            <QuickBtn key={idx} onClick={() => setSelectedSituation(sit)}>
              {sit.title}
            </QuickBtn>
          ))}
        </Grid>

        {selectedSituation && (
          <SituationCard className="animate-fade-in">
            <div className="card-header">
              <h4>{selectedSituation.title}</h4>
              <button onClick={() => setSelectedSituation(null)}><FaTimes /></button>
            </div>
            <p>{selectedSituation.script}</p>
          </SituationCard>
        )}
      </Section>

      <Section className="ai-section">
        <h3><FaRobot /> Assistente de Resposta (IA)</h3>
        <p className="subtitle">O cliente mandou uma mensagem difícil? Cole aqui:</p>
        
        <TextArea 
          value={clientMessage}
          onChange={(e) => setClientMessage(e.target.value)}
          placeholder='Ex: "Achei interessante mas tá um pouco caro pra mim agora, quem sabe mais pra frente"'
          rows={4}
        />
        
        <GenerateBtn onClick={handleGenerateResponse} disabled={loading || !clientMessage.trim()}>
          {loading ? <FaSpinner className="spin" /> : <FaPaperPlane />}
          <span>{loading ? 'Gerando...' : 'Gerar Resposta Empática'}</span>
        </GenerateBtn>

        {aiResponse && (
          <AiResultCard className="animate-fade-in">
            <div className="card-header">
              <FaRobot className="icon" /> <strong>Sugestão da IA:</strong>
            </div>
            <p>{aiResponse}</p>
          </AiResultCard>
        )}
      </Section>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  h2 { margin: 0 0 8px 0; font-size: 1.4rem; color: #f8fafc; }
  p { margin: 0; color: #94a3b8; font-size: 0.95rem; }
`;

const Section = styled.div`
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;

  h3 {
    margin: 0 0 16px 0;
    color: #e2e8f0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .subtitle {
    color: #94a3b8;
    margin: 0 0 12px 0;
    font-size: 0.9rem;
  }

  &.ai-section {
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
    border-color: rgba(99, 102, 241, 0.2);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`;

const QuickBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 12px 16px;
  border-radius: 8px;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.4);
    color: white;
  }
`;

const SituationCard = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border-left: 4px solid #3b82f6;
  padding: 16px 20px;
  border-radius: 4px 8px 8px 4px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    h4 { margin: 0; color: #60a5fa; }
    button {
      background: none; border: none; color: #94a3b8; cursor: pointer;
      &:hover { color: white; }
    }
  }

  p { margin: 0; color: #cbd5e1; line-height: 1.5; font-style: italic; }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 16px;
  color: white;
  font-size: 0.95rem;
  outline: none;
  resize: vertical;
  margin-bottom: 16px;
  font-family: 'Inter', sans-serif;

  &:focus {
    border-color: #6366f1;
  }
`;

const GenerateBtn = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
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
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  &:disabled { opacity: 0.6; cursor: not-allowed; }

  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;

const AiResultCard = styled.div`
  margin-top: 20px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 16px 20px;
  border-radius: 8px;

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #34d399;
    margin-bottom: 8px;
    .icon { font-size: 1.2rem; }
  }

  p { margin: 0; color: #e2e8f0; line-height: 1.5; }
`;
