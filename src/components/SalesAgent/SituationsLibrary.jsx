import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Search, MessageSquare, Bot, Sparkles, Loader2, Copy, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateObjectionResponse } from '../../services/aiService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Section = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 2rem;
`;

const Title = styled.h2`
  margin: 0 0 1.5rem;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid #475569;
  border-radius: 8px;
  padding: 1rem;
  color: #f8fafc;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const Button = styled.button`
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

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const AiResponseBox = styled(motion.div)`
  margin-top: 1.5rem;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  position: relative;

  p {
    margin: 0;
    color: #e2e8f0;
    line-height: 1.6;
    white-space: pre-wrap;
  }
`;

const CopyBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #a78bfa;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;

  &:hover { color: #c4b5fd; }
`;

const SearchInput = styled.div`
  position: relative;
  margin-bottom: 2rem;

  input {
    width: 100%;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid #475569;
    border-radius: 99px;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    color: #f8fafc;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #10b981;
    }
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const SituationCard = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid #475569;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #64748b;
  }
`;

const CardHeader = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  color: #e2e8f0;
  background: ${props => props.$isOpen ? 'rgba(255,255,255,0.05)' : 'transparent'};
`;

const CardContent = styled.div`
  padding: 0 1rem 1rem;
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.5;
  border-top: 1px solid #334155;
  margin-top: 0.5rem;
  padding-top: 1rem;
`;

const LIBRARY = [
  {
    category: "Objeções de Preço",
    title: "Achei caro / Pediu desconto",
    script: "Não confronte o preço de imediato. Responda: 'Entendo perfeitamente, [Nome]. Só para eu entender melhor e ver como posso ajustar a entrega: o que exatamente fez o valor parecer fora do orçamento agora? É o momento da empresa ou o retorno esperado?' Isso revela se é objeção real ou apenas negociação."
  },
  {
    category: "Objeções de Preço",
    title: "Vi mais barato / Meu sobrinho faz",
    script: "'Com certeza você encontra opções mais baratas, [Nome]. A diferença é que não entrego apenas um site bonitinho. Entrego uma máquina configurada para converter visitantes em clientes. Se o site do seu sobrinho não trouxer vendas, ele acaba saindo mais caro. Faz sentido focar no retorno ao invés do custo inicial?'"
  },
  {
    category: "Objeções de Tempo",
    title: "Vou pensar e te aviso",
    script: "Não deixe solto. Responda: 'Claro, sem problema! Apenas para eu não te incomodar à toa: tem alguma dúvida específica sobre o projeto ou os prazos que eu possa esclarecer agora? Às vezes é um detalhe pequeno que trava a decisão.'"
  },
  {
    category: "Ghosting",
    title: "Visualizou e não respondeu (Dia seguinte)",
    script: "'Oi [Nome], tudo bem? Sei que a rotina aí deve estar corrida. Só passando para confirmar se conseguiu ver a proposta que enviei ontem. Se precisar ajustar algum ponto, estou à disposição!'"
  },
  {
    category: "Interesse Vago",
    title: "Me manda o seu portfólio",
    script: "'Mando sim! Para eu não te enviar um monte de links aleatórios, me conta rapidamente: qual é o principal objetivo de vocês hoje? Vender mais serviço X ou captar leads para Y? Assim te mando os exemplos que deram mais resultado para esse mesmo objetivo.'"
  }
];

export default function SituationsLibrary({ apiKey }) {
  const [clientMessage, setClientMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [copiedAi, setCopiedAi] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [openCard, setOpenCard] = useState(null);

  const freelancerProfile = JSON.parse(localStorage.getItem('salesagent_profile') || '{}');

  const filteredLibrary = useMemo(() => {
    if (!searchTerm) return LIBRARY;
    const lower = searchTerm.toLowerCase();
    return LIBRARY.filter(item => 
      item.title.toLowerCase().includes(lower) || 
      item.category.toLowerCase().includes(lower) ||
      item.script.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  const handleGenerateResponse = async () => {
    if (!clientMessage.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    
    try {
      const response = await generateObjectionResponse(clientMessage, freelancerProfile, apiKey);
      setAiResponse(response);
    } catch (err) {
      alert("Erro ao gerar resposta: " + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const copyToClipboard = (text, isAi = false) => {
    navigator.clipboard.writeText(text);
    if (isAi) {
      setCopiedAi(true);
      setTimeout(() => setCopiedAi(false), 2000);
    }
  };

  return (
    <Container>
      {/* Assistente IA */}
      <Section>
        <Title><Bot size={24} color="#3b82f6" /> Assistente de Resposta Rápida (IA)</Title>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem', marginTop: '-1rem' }}>
          O cliente mandou uma mensagem difícil? Cole aqui e a IA cria uma resposta persuasiva baseada no seu perfil.
        </p>

        <Textarea 
          placeholder='Cole a mensagem do cliente aqui. Ex: "Achei interessante mas tá um pouco caro pra mim agora..."'
          value={clientMessage}
          onChange={(e) => setClientMessage(e.target.value)}
        />
        
        <Button onClick={handleGenerateResponse} disabled={aiLoading || !clientMessage.trim()}>
          {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {aiLoading ? 'Pensando na resposta...' : 'Gerar Resposta Empática'}
        </Button>

        <AnimatePresence>
          {aiResponse && (
            <AiResponseBox
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <CopyBtn onClick={() => copyToClipboard(aiResponse, true)}>
                {copiedAi ? <CheckCircle2 size={16} color="#10b981" /> : <Copy size={16} />}
                {copiedAi ? 'Copiado!' : 'Copiar'}
              </CopyBtn>
              <p>{aiResponse}</p>
            </AiResponseBox>
          )}
        </AnimatePresence>
      </Section>

      {/* Biblioteca de Situações */}
      <Section>
        <Title><MessageSquare size={24} color="#10b981" /> Biblioteca de Situações & Scripts</Title>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem', marginTop: '-1rem' }}>
          Scripts testados para lidar com objeções clássicas. Busque por "preço", "pensar", etc.
        </p>

        <SearchInput>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar por situação..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>

        <Grid>
          {filteredLibrary.map((item, idx) => {
            const isOpen = openCard === idx;
            return (
              <SituationCard key={idx} onClick={() => setOpenCard(isOpen ? null : idx)}>
                <CardHeader $isOpen={isOpen}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>
                      {item.category}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  {isOpen ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
                </CardHeader>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <CardContent>
                        {item.script}
                        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(item.script); }}
                            style={{ background: 'transparent', border: '1px solid #475569', color: '#e2e8f0', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            Copiar Script
                          </button>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SituationCard>
            );
          })}
        </Grid>
        {filteredLibrary.length === 0 && (
          <p style={{ color: '#64748b', textAlign: 'center', marginTop: '2rem' }}>
            Nenhuma situação encontrada para "{searchTerm}".
          </p>
        )}
      </Section>
    </Container>
  );
}
