import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrash, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const STAGES = [
  'Identificado',
  'Abordado',
  'Respondeu',
  'Em Negociação',
  'Fechado/Perdido'
];

export default function LeadPipeline() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = () => {
    const saved = localStorage.getItem('salesagent_leads');
    if (saved) {
      try {
        setLeads(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao ler leads", e);
      }
    }
  };

  const saveLeads = (newLeads) => {
    setLeads(newLeads);
    localStorage.setItem('salesagent_leads', JSON.stringify(newLeads));
  };

  const moveLead = (id, direction) => {
    const updated = leads.map(lead => {
      if (lead.id === id) {
        const currentIndex = STAGES.indexOf(lead.status);
        let newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < STAGES.length) {
          return { ...lead, status: STAGES[newIndex], lastContact: new Date().toISOString() };
        }
      }
      return lead;
    });
    saveLeads(updated);
  };

  const deleteLead = (id) => {
    if (window.confirm("Remover este lead do funil?")) {
      const updated = leads.filter(l => l.id !== id);
      saveLeads(updated);
    }
  };

  return (
    <Container className="animate-fade-in">
      <Header>
        <h2>Pipeline de Leads</h2>
        <p>Acompanhe seus contatos e evolução das negociações.</p>
      </Header>

      <Board>
        {STAGES.map(stage => {
          const stageLeads = leads.filter(l => l.status === stage);
          return (
            <Column key={stage}>
              <div className="col-header">
                <h3>{stage}</h3>
                <span className="count">{stageLeads.length}</span>
              </div>
              <div className="col-content">
                {stageLeads.length === 0 ? (
                  <div className="empty">Vazio</div>
                ) : (
                  stageLeads.map(lead => (
                    <LeadCard key={lead.id}>
                      <div className="card-top">
                        <h4>{lead.name}</h4>
                        <button className="del-btn" onClick={() => deleteLead(lead.id)}><FaTrash /></button>
                      </div>
                      <div className="handle">{lead.handle}</div>
                      <div className="meta">
                        <span className={`score ${lead.score > 70 ? 'high' : 'low'}`}>
                          Score: {lead.score}
                        </span>
                        <span className="date">
                          {new Date(lead.lastContact).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="actions">
                        <button 
                          disabled={STAGES.indexOf(stage) === 0} 
                          onClick={() => moveLead(lead.id, -1)}
                        >
                          <FaArrowLeft />
                        </button>
                        <button 
                          disabled={STAGES.indexOf(stage) === STAGES.length - 1} 
                          onClick={() => moveLead(lead.id, 1)}
                        >
                          <FaArrowRight />
                        </button>
                      </div>
                    </LeadCard>
                  ))
                )}
              </div>
            </Column>
          );
        })}
      </Board>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  margin-bottom: 24px;
  h2 { margin: 0 0 8px 0; font-size: 1.5rem; color: #f8fafc; }
  p { margin: 0; color: #94a3b8; font-size: 0.95rem; }
`;

const Board = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;
  min-height: 400px;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
  }
`;

const Column = styled.div`
  flex: 1;
  min-width: 260px;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  display: flex;
  flex-direction: column;

  .col-header {
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 { margin: 0; font-size: 1rem; color: #cbd5e1; }
    .count { 
      background: rgba(255, 255, 255, 0.1); 
      padding: 2px 8px; 
      border-radius: 12px; 
      font-size: 0.8rem; 
    }
  }

  .col-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
    overflow-y: auto;

    .empty {
      text-align: center;
      color: #475569;
      font-size: 0.9rem;
      margin-top: 20px;
      font-style: italic;
    }
  }
`;

const LeadCard = styled.div`
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(59, 130, 246, 0.3);
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 4px;

    h4 { margin: 0; color: #f1f5f9; font-size: 0.95rem; }
    
    .del-btn {
      background: none;
      border: none;
      color: #475569;
      cursor: pointer;
      font-size: 0.8rem;
      &:hover { color: #ef4444; }
    }
  }

  .handle {
    color: #94a3b8;
    font-size: 0.8rem;
    margin-bottom: 12px;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 0.8rem;

    .score {
      font-weight: 600;
      &.high { color: #34d399; }
      &.low { color: #fbbf24; }
    }

    .date { color: #64748b; }
  }

  .actions {
    display: flex;
    justify-content: space-between;
    border-top: 1px dashed rgba(255, 255, 255, 0.1);
    padding-top: 8px;

    button {
      background: rgba(255, 255, 255, 0.05);
      border: none;
      color: #94a3b8;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover:not(:disabled) { background: rgba(59, 130, 246, 0.2); color: white; }
      &:disabled { opacity: 0.3; cursor: not-allowed; }
    }
  }
`;
