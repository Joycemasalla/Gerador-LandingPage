import React, { useState } from 'react';
import styled from 'styled-components';
import { FaInstagram, FaGlobe, FaSearch, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaMagic } from 'react-icons/fa';
import { analyzeInstagramProfile, analyzeWebsite } from '../../services/aiService';
import ApproachGenerator from './ApproachGenerator';

export default function ProspectAnalysis({ apiKey, freelancerProfile }) {
  const [mode, setMode] = useState('instagram'); // 'instagram', 'site', 'both'
  const [instagramUrl, setInstagramUrl] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [error, setError] = useState(null);

  const calculateScore = (problems) => {
    let score = 100;
    const str = problems.join(' ').toLowerCase();
    
    if (str.includes('sem site') || str.includes('não possui site')) score -= 30;
    if (str.includes('lento') || str.includes('performance')) score -= 20;
    if (str.includes('mobile') || str.includes('responsivo')) score -= 25;
    if (str.includes('desatualizado') || str.includes('ruim')) score -= 20;
    if (str.includes('whatsapp') && (str.includes('sem') || str.includes('não tem'))) score -= 25;
    if (str.includes('link') && str.includes('quebrado')) score -= 15;
    
    return Math.max(0, score);
  };

  const determineStrategy = (score, problemsStr) => {
    if (score >= 70 && problemsStr.includes('sem site')) return 'Criação do zero (Landing Page)';
    if (score < 70 && (problemsStr.includes('ruim') || problemsStr.includes('desatualizado'))) return 'Redesign / Modernização';
    return 'Landing Page de Campanha Específica';
  };

  const handleAnalyze = async () => {
    if (mode === 'instagram' && !instagramUrl) return alert("Insira o @ do Instagram");
    if (mode === 'site' && !siteUrl) return alert("Insira a URL do Site");
    if (mode === 'both' && (!instagramUrl || !siteUrl)) return alert("Insira ambos os links");

    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setShowGenerator(false);

    try {
      let combinedProblems = [];
      let combinedScore = 100;
      let identity = {};

      if (mode === 'instagram' || mode === 'both') {
        const profile = await analyzeInstagramProfile(instagramUrl, apiKey);
        identity = profile.identity || {};
        
        // Simular alguns problemas baseados no AI Context ou dados faltando
        if (!identity.website) combinedProblems.push("Sem site próprio");
        if (!profile.contacts?.whatsapp) combinedProblems.push("Sem botão de WhatsApp visível");
        if (profile.aiContext?.missingCriticalData?.length > 0) {
           combinedProblems.push("Falta de clareza na oferta/serviços");
        }
      }

      if (mode === 'site' || mode === 'both') {
        const siteData = await analyzeWebsite(siteUrl, apiKey);
        if (siteData && siteData.problems) {
          combinedProblems = [...combinedProblems, ...siteData.problems];
        }
        if (mode === 'site') {
          // Quando é apenas site, pegamos uma identidade básica
          identity = { businessName: siteUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0], segment: 'Geral', city: 'Online' };
        }
      }

      if (combinedProblems.length === 0) {
        combinedProblems.push("Não foram encontrados problemas graves aparentes, mas há espaço para otimização de conversão.");
      }

      combinedScore = calculateScore(combinedProblems);
      const strategy = determineStrategy(combinedScore, combinedProblems.join(' ').toLowerCase());

      setAnalysisResult({
        profile: { identity },
        analysis: {
          problems: combinedProblems,
          score: combinedScore,
          strategy
        }
      });

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = (prospect, messages) => {
    const leads = JSON.parse(localStorage.getItem('salesagent_leads') || '[]');
    const newLead = {
      id: Date.now().toString(),
      name: prospect.profile.identity?.businessName || 'Desconhecido',
      handle: instagramUrl || siteUrl,
      score: prospect.analysis.score,
      status: 'Identificado',
      lastContact: new Date().toISOString(),
      messages: messages
    };
    leads.push(newLead);
    localStorage.setItem('salesagent_leads', JSON.stringify(leads));
    alert("Lead adicionado ao Pipeline com sucesso!");
  };

  return (
    <Container className="animate-fade-in">
      <Header>
        <h2>Analisar Prospect</h2>
        <p>Insira os dados do negócio para gerar uma auditoria rápida e abordagens cirúrgicas.</p>
      </Header>

      <InputSection>
        <ModeSelector>
          <ModeBtn active={mode === 'instagram'} onClick={() => setMode('instagram')}>
            <FaInstagram /> Só Instagram
          </ModeBtn>
          <ModeBtn active={mode === 'site'} onClick={() => setMode('site')}>
            <FaGlobe /> Só Site
          </ModeBtn>
          <ModeBtn active={mode === 'both'} onClick={() => setMode('both')}>
            <FaInstagram /> + <FaGlobe /> Ambos
          </ModeBtn>
        </ModeSelector>

        <FormRow>
          {(mode === 'instagram' || mode === 'both') && (
            <InputGroup>
              <label>@ Instagram ou URL do perfil</label>
              <input 
                type="text" 
                value={instagramUrl} 
                onChange={(e) => setInstagramUrl(e.target.value)} 
                placeholder="@hamburgueria_doze" 
              />
            </InputGroup>
          )}
          
          {(mode === 'site' || mode === 'both') && (
            <InputGroup>
              <label>URL do Site</label>
              <input 
                type="text" 
                value={siteUrl} 
                onChange={(e) => setSiteUrl(e.target.value)} 
                placeholder="www.hamburgueriadoze.com.br" 
              />
            </InputGroup>
          )}
        </FormRow>

        <AnalyzeBtn onClick={handleAnalyze} disabled={loading}>
          {loading ? <FaSpinner className="spin" /> : <FaSearch />} 
          <span>{loading ? 'Analisando...' : 'Analisar Prospect'}</span>
        </AnalyzeBtn>
      </InputSection>

      {error && (
        <ErrorMsg>
          <FaExclamationTriangle /> {error}
        </ErrorMsg>
      )}

      {analysisResult && (
        <ResultSection className="animate-fade-in">
          <ScoreBoard>
            <div className="title">
              <h3>📊 Análise de Oportunidade</h3>
              <span>{analysisResult.profile.identity?.businessName}</span>
            </div>
            <div className="score">
              Score: <span className={analysisResult.analysis.score > 70 ? 'high' : 'low'}>{analysisResult.analysis.score}/100</span> 🔥
            </div>
          </ScoreBoard>

          <ProblemsList>
            {analysisResult.analysis.problems.map((prob, i) => (
              <div key={i} className="problem-item">
                <FaExclamationTriangle className="icon-warn" /> {prob}
              </div>
            ))}
          </ProblemsList>

          <StrategyBox>
            <strong>Estratégia Recomendada:</strong> {analysisResult.analysis.strategy}
          </StrategyBox>

          {!showGenerator ? (
            <GenerateApproachBtn onClick={() => setShowGenerator(true)}>
              <FaMagic /> Gerar Mensagens de Abordagem
            </GenerateApproachBtn>
          ) : (
            <ApproachGenerator 
              prospectData={analysisResult} 
              freelancerProfile={freelancerProfile} 
              apiKey={apiKey} 
              onAddLead={handleAddLead}
            />
          )}
        </ResultSection>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 24px;
  h2 { margin: 0 0 8px 0; font-size: 1.5rem; }
  p { color: #94a3b8; margin: 0; }
`;

const InputSection = styled.div`
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const ModeSelector = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const ModeBtn = styled.button`
  background: ${props => props.active ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.5)'};
  border: 1px solid ${props => props.active ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#60a5fa' : '#94a3b8'};
  padding: 10px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: rgba(59, 130, 246, 0.15);
    color: #60a5fa;
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  @media (max-width: 600px) { flex-direction: column; }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #cbd5e1;
  }

  input {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px 16px;
    color: white;
    font-size: 0.95rem;
    outline: none;
    
    &:focus { border-color: #3b82f6; }
  }
`;

const AnalyzeBtn = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  font-size: 1rem;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;

const ErrorMsg = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ResultSection = styled.div`
  background: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
`;

const ScoreBoard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 16px;
  margin-bottom: 20px;

  .title h3 { margin: 0 0 4px 0; }
  .title span { color: #94a3b8; font-size: 0.9rem; }

  .score {
    font-size: 1.2rem;
    font-weight: 600;
    
    .high { color: #34d399; font-size: 1.5rem; }
    .low { color: #fbbf24; font-size: 1.5rem; }
  }
`;

const ProblemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;

  .problem-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(15, 23, 42, 0.4);
    padding: 12px 16px;
    border-radius: 8px;
    color: #e2e8f0;

    .icon-warn { color: #ef4444; }
  }
`;

const StrategyBox = styled.div`
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
  border-left: 4px solid #8b5cf6;
  padding: 16px;
  border-radius: 4px 8px 8px 4px;
  color: #e2e8f0;
  margin-bottom: 24px;
  
  strong { color: #a78bfa; }
`;

const GenerateApproachBtn = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
`;
