import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calendar, TrendingUp } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: calc(100vh - 160px);
  min-height: 500px;
`;

const Board = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  flex: 1;
  padding-bottom: 1rem;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #475569;
    border-radius: 4px;
  }
`;

const Column = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #334155;
  border-radius: 12px;
  min-width: 280px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
`;

const ColumnHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #334155;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #f8fafc;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .count {
    background: rgba(15, 23, 42, 0.6);
    color: #94a3b8;
    padding: 0.2rem 0.6rem;
    border-radius: 99px;
    font-size: 0.8rem;
    font-weight: 600;
  }
`;

const ColumnList = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LeadCard = styled(motion.div)`
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid #475569;
  border-radius: 8px;
  padding: 1rem;
  cursor: grab;
  position: relative;

  &:active {
    cursor: grabbing;
  }

  &:hover {
    border-color: #64748b;
  }
`;

const CardTitle = styled.h4`
  margin: 0 0 0.25rem;
  color: #f8fafc;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
`;

const CardSubtitle = styled.p`
  margin: 0 0 1rem;
  color: #94a3b8;
  font-size: 0.85rem;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #334155;
`;

const ScoreBadge = styled.div`
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  border: 1px solid ${props => props.$color}40;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const DateText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #64748b;
  font-size: 0.75rem;
`;

const DeleteBtn = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;

  ${LeadCard}:hover & {
    opacity: 1;
  }

  &:hover {
    color: #ef4444;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  padding: 1rem 0;
`;

const COLUMNS = [
  'Identificado',
  'Abordado',
  'Respondeu',
  'Em Negociação',
  'Fechado/Perdido'
];

export default function LeadPipeline() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('salesagent_leads');
    if (saved) {
      setLeads(JSON.parse(saved));
    }
  }, []);

  const saveLeads = (newLeads) => {
    setLeads(newLeads);
    localStorage.setItem('salesagent_leads', JSON.stringify(newLeads));
  };

  const handleDragStart = (e, leadId) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    const leadId = e.dataTransfer.getData('leadId');
    if (!leadId) return;

    const newLeads = leads.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, status };
      }
      return lead;
    });

    saveLeads(newLeads);
  };

  const handleDelete = (id) => {
    if (window.confirm('Remover este lead do pipeline?')) {
      const newLeads = leads.filter(l => l.id !== id);
      saveLeads(newLeads);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981'; // green
    if (score >= 40) return '#f59e0b'; // yellow
    return '#3b82f6'; // blue
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  // Add dummy lead for demo if empty
  const addDummyLead = () => {
    const dummy = {
      id: Date.now().toString(),
      name: 'Hamburgueria Exemplo',
      handle: '@hamburgueria_exemplo',
      score: 85,
      status: 'Identificado',
      date: new Date().toISOString()
    };
    saveLeads([...leads, dummy]);
  };

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: '#f8fafc' }}>Pipeline de Vendas</h2>
        {leads.length === 0 && (
          <button 
            onClick={addDummyLead}
            style={{ background: '#334155', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
          >
            Adicionar Lead Exemplo
          </button>
        )}
      </div>
      
      <Board>
        {COLUMNS.map(col => {
          const colLeads = leads.filter(l => l.status === col);
          return (
            <Column 
              key={col}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col)}
            >
              <ColumnHeader>
                <h3>{col}</h3>
                <span className="count">{colLeads.length}</span>
              </ColumnHeader>
              <ColumnList>
                <AnimatePresence>
                  {colLeads.length === 0 && (
                    <EmptyState>Solte os cards aqui</EmptyState>
                  )}
                  {colLeads.map(lead => (
                    <LeadCard
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <CardTitle>
                        {lead.name}
                        <DeleteBtn onClick={() => handleDelete(lead.id)}>
                          <Trash2 size={14} />
                        </DeleteBtn>
                      </CardTitle>
                      <CardSubtitle>{lead.handle}</CardSubtitle>
                      
                      <CardFooter>
                        <ScoreBadge $color={getScoreColor(lead.score)}>
                          <TrendingUp size={12} /> Score: {lead.score}
                        </ScoreBadge>
                        <DateText>
                          <Calendar size={12} /> {formatDate(lead.date)}
                        </DateText>
                      </CardFooter>
                    </LeadCard>
                  ))}
                </AnimatePresence>
              </ColumnList>
            </Column>
          );
        })}
      </Board>
    </Container>
  );
}
