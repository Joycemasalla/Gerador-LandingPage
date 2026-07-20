import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Loader2, AlertCircle, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeInstagramProfile } from '../../services/aiService';
import ApproachGenerator from './ApproachGenerator';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const SearchBox = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 500px;
  margin: 1.5rem auto 0;
`;

const Input = styled.input`
  flex: 1;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid #475569;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #f8fafc;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ResultCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const ScoreBadge = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid ${props => props.$color};
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  min-width: 120px;
  
  .score {
    font-size: 2rem;
    font-weight: 700;
    color: ${props => props.$color};
    line-height: 1;
    margin-bottom: 0.25rem;
  }
  
  .label {
    font-size: 0.7rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const SituationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    font-size: 0.95rem;
    color: #cbd5e1;
  }
`;

const StrategyBox = styled.div`
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;

  h4 {
    color: #a78bfa;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    margin: 0;
    color: #e2e8f0;
    line-height: 1.5;
  }
`;

const GenerateBtn = styled(Button)`
  width: 100%;
  justify-content: center;
  margin-top: 2rem;
  padding: 1rem;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  
  &:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
`;

export default function ProspectAnalysis({ apiKey }) {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [error, setError] = useState('');

  const calculateScore = (profile) => {
    let score = 0;
    let problems = [];
    let goodPoints = [];

    const hasWebsite = !!profile?.contacts?.website;
    const isLinkTree = hasWebsite && (profile.contacts.website.includes('linktr.ee') || profile.contacts.website.includes('beacons'));
    const hasWhatsapp = !!profile?.contacts?.whatsapp;
    
    if (!hasWebsite) {
      score += 45;
      problems.push("Sem site próprio (nenhum link na bio)");
    } else if (isLinkTree) {
      score += 25;
      problems.push("Usa Linktree ou agregador (baixa conversão, sem rastreamento)");
    } else {
      goodPoints.push("Possui site próprio");
      score -= 10;
    }

    if (!hasWhatsapp) {
      score += 15;
      problems.push("WhatsApp não está claro ou visível");
    } else {
      score += 10;
      goodPoints.push("WhatsApp disponível");
    }

    if (profile?.aiContext?.dataCompleteness === 'low') {
      score += 20;
      problems.push("Perfil desorganizado ou com poucas informações claras");
    } else {
      score += 15;
      goodPoints.push("Perfil ativo e com informações razoáveis");
    }

    // Cap at 98 for realism
    score = Math.min(score, 98);
    score = Math.max(score, 12);

    let strategy = '';
    let strategyDesc = '';
    
    if (score >= 70 && !hasWebsite) {
      strategy = "Criação de Landing Page do Zero";
      strategyDesc = "O cliente precisa de uma página de alta conversão urgente. Foque em mostrar como ele está perdendo clientes por não centralizar as ofertas e o contato.";
    } else if (score >= 40 && isLinkTree) {
      strategy = "Modernização / Substituição de Linktree";
      strategyDesc = "Ofereça um 'Link na Bio Premium' ou Landing Page que passe mais credibilidade e permita rastrear os cliques (Pixel/Analytics).";
    } else {
      strategy = "Landing Page de Campanha";
      strategyDesc = "Eles já têm uma base. Foque em oferecer uma página específica para um serviço de alto ticket ou para campanhas de anúncios.";
    }

    return {
      score,
      problems,
      goodPoints,
      strategy,
      strategyDesc,
      color: score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#3b82f6'
    };
  };

  const handleAnalyze = async () => {
    if (!handle) return;
    setLoading(true);
    setError('');
    setResult(null);
    setShowGenerator(false);
    
    try {
      const data = await analyzeInstagramProfile(handle, apiKey);
      const analysis = calculateScore(data);
      setResult({ profile: data, analysis });
    } catch (err) {
      setError(err.message || 'Erro ao analisar o perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <SearchBox>
        <h2 style={{ margin: '0 0 0.5rem', color: '#f8fafc' }}>Analisar Prospect</h2>
        <p style={{ margin: 0, color: '#94a3b8' }}>
          Cole o @ do Instagram do cliente. A IA fará uma varredura para encontrar falhas de conversão.
        </p>
        
        <InputGroup>
          <Input 
            placeholder="@hamburgueria_doze" 
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
          <Button onClick={handleAnalyze} disabled={loading || !handle}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            {loading ? 'Analisando...' : 'Analisar'}
          </Button>
        </InputGroup>
        
        {error && (
          <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem' }}>
            <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> 
            {error}
          </p>
        )}
      </SearchBox>

      <AnimatePresence>
        {result && !showGenerator && (
          <ResultCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <h3 style={{ margin: '0 0 0.25rem', color: '#f8fafc', fontSize: '1.25rem' }}>
              Análise: {result.profile.identity?.businessName || handle}
            </h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
              {result.profile.identity?.segment || 'Segmento não identificado'}
            </p>

            <ScoreBadge $color={result.analysis.color}>
              <div className="score">{result.analysis.score}</div>
              <div className="label">Oportunidade</div>
            </ScoreBadge>

            <h4 style={{ marginTop: '2rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>Situação Digital</h4>
            <SituationList>
              {result.analysis.problems.map((p, i) => (
                <li key={i}>
                  <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} /> {p}
                </li>
              ))}
              {result.analysis.goodPoints.map((p, i) => (
                <li key={i}>
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} /> {p}
                </li>
              ))}
            </SituationList>

            <StrategyBox>
              <h4><Zap size={18} /> Estratégia Recomendada: {result.analysis.strategy}</h4>
              <p>{result.analysis.strategyDesc}</p>
            </StrategyBox>

            <GenerateBtn onClick={() => setShowGenerator(true)}>
              Gerar Mensagens de Abordagem <ChevronRight size={18} />
            </GenerateBtn>
          </ResultCard>
        )}

        {showGenerator && result && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ApproachGenerator 
              prospectData={result} 
              onBack={() => setShowGenerator(false)} 
              apiKey={apiKey}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
