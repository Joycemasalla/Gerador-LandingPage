import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Search, LayoutDashboard, MessageSquare } from 'lucide-react';

import MyProfile from './MyProfile';
import ProspectAnalysis from './ProspectAnalysis';
import LeadPipeline from './LeadPipeline';
import SituationsLibrary from './SituationsLibrary';

const AgentContainer = styled.div`
  min-height: 100vh;
  background: #020617;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #1e293b;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0.5rem;
  border-radius: 6px;

  &:hover {
    color: #f8fafc;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const TitleArea = styled.div`
  h1 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  p {
    margin: 0;
    font-size: 0.8rem;
    color: #64748b;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  margin-left: auto;
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.$active ? 'rgba(16, 185, 129, 0.1)' : 'transparent'};
  color: ${props => props.$active ? '#10b981' : '#94a3b8'};
  border: 1px solid ${props => props.$active ? 'rgba(16, 185, 129, 0.2)' : 'transparent'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
    color: ${props => props.$active ? '#10b981' : '#f8fafc'};
  }
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export default function SalesAgent({ onBack, apiKey }) {
  const [activeTab, setActiveTab] = useState('analyze');

  const tabs = [
    { id: 'profile', label: 'Meu Perfil', icon: <User size={18} /> },
    { id: 'analyze', label: 'Analisar Prospect', icon: <Search size={18} /> },
    { id: 'pipeline', label: 'Pipeline', icon: <LayoutDashboard size={18} /> },
    { id: 'situations', label: 'Situações & Objeções', icon: <MessageSquare size={18} /> }
  ];

  return (
    <AgentContainer>
      <Header>
        <BackButton onClick={onBack}>
          <ArrowLeft size={16} /> Voltar ao Início
        </BackButton>
        
        <TitleArea>
          <h1>Agente Comercial AI</h1>
          <p>Seu playbook interativo de vendas</p>
        </TitleArea>

        <Nav>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </TabButton>
          ))}
        </Nav>
      </Header>

      <ContentArea>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%' }}
          >
            {activeTab === 'profile' && <MyProfile />}
            {activeTab === 'analyze' && <ProspectAnalysis apiKey={apiKey} />}
            {activeTab === 'pipeline' && <LeadPipeline />}
            {activeTab === 'situations' && <SituationsLibrary apiKey={apiKey} />}
          </motion.div>
        </AnimatePresence>
      </ContentArea>
    </AgentContainer>
  );
}
