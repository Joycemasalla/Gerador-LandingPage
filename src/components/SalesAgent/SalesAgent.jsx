import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaSearch, FaUser, FaListUl, FaComments, FaBookOpen } from 'react-icons/fa';
import MyProfile from './MyProfile';
import ProspectAnalysis from './ProspectAnalysis';
import LeadPipeline from './LeadPipeline';
import ConversationFlow from './ConversationFlow';
import SituationsLibrary from './SituationsLibrary';

export default function SalesAgent({ onBack, apiKey }) {
  const [activeTab, setActiveTab] = useState('analyze');
  const [freelancerProfile, setFreelancerProfile] = useState(null);

  // Carregar o perfil do freelancer para passar pros outros componentes
  useEffect(() => {
    const saved = localStorage.getItem('salesagent_profile');
    if (saved) {
      try {
        setFreelancerProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao ler profile do localstorage", e);
      }
    }
  }, []);

  const handleProfileUpdate = (profile) => {
    setFreelancerProfile(profile);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <MyProfile profile={freelancerProfile} onUpdate={handleProfileUpdate} />;
      case 'analyze':
        return <ProspectAnalysis apiKey={apiKey} freelancerProfile={freelancerProfile} />;
      case 'pipeline':
        return <LeadPipeline />;
      case 'situations':
        return (
          <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            <ConversationFlow freelancerProfile={freelancerProfile} apiKey={apiKey} />
            <SituationsLibrary />
          </div>
        );
      default:
        return <ProspectAnalysis apiKey={apiKey} freelancerProfile={freelancerProfile} />;
    }
  };

  return (
    <Container className="animate-fade-in">
      <Header>
        <BackButton onClick={onBack}>
          <FaChevronLeft /> Voltar ao Início
        </BackButton>
        <Title>
          <span className="icon">💬</span> Agente Comercial
        </Title>
      </Header>

      <TabsContainer>
        <Tab active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
          <FaUser /> Meu Perfil
        </Tab>
        <Tab active={activeTab === 'analyze'} onClick={() => setActiveTab('analyze')}>
          <FaSearch /> Analisar Prospect
        </Tab>
        <Tab active={activeTab === 'pipeline'} onClick={() => setActiveTab('pipeline')}>
          <FaListUl /> Pipeline
        </Tab>
        <Tab active={activeTab === 'situations'} onClick={() => setActiveTab('situations')}>
          <FaComments /> Situações & Objeções
        </Tab>
      </TabsContainer>

      <ContentArea>
        {renderContent()}
      </ContentArea>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #020617;
  color: #f8fafc;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 20px 32px;
  background: rgba(30, 41, 59, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  gap: 24px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;

  .icon {
    font-size: 1.8rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 32px;
  background: rgba(30, 41, 59, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const Tab = styled.button`
  background: transparent;
  border: none;
  border-bottom: 3px solid ${props => props.active ? '#10b981' : 'transparent'};
  color: ${props => props.active ? '#10b981' : '#64748b'};
  padding: 16px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.active ? '#10b981' : '#f8fafc'};
  }
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
  }
`;
