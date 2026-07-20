import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FaSearch, FaBook, FaCopy, FaCheck } from 'react-icons/fa';

const LIBRARY_DATA = [
  {
    category: "Objeções de Preço",
    situations: [
      { title: "Tá caro", script: "Entendo perfeitamente, o investimento tem que fazer sentido para você. O que exatamente faz o valor parecer alto no momento? É o fluxo de caixa desse mês ou você imaginava que o serviço seria mais simples?" },
      { title: "Sem orçamento agora", script: "Sem problemas! Muitos clientes meus começaram assim. Que tal fazermos o seguinte: eu te entrego a primeira etapa do projeto agora por um valor menor, para você já ter resultado, e mês que vem a gente complementa. O que acha?" },
      { title: "Vi mais barato", script: "Faz parte pesquisar! A diferença principal é que eu não entrego apenas uma página bonitinha, eu entrego um sistema desenhado para converter visitantes em clientes reais pro seu WhatsApp. A economia inicial com amadores costuma custar muito caro em vendas perdidas depois." }
    ]
  },
  {
    category: "Objeções de Tempo",
    situations: [
      { title: "Vou pensar", script: "Claro, sem problema. Só me conta: tem alguma dúvida específica que eu possa esclarecer agora? Às vezes é uma coisa pequena que trava a decisão e eu consigo te ajudar rapidinho." },
      { title: "Me manda mais tarde", script: "Combinado. Vou deixar uma anotação aqui para te chamar amanhã à tarde, fica bom para você? Enquanto isso, dá uma olhada nesse link do meu portfólio que tem tudo a ver com a sua área." },
      { title: "Tô ocupado", script: "Sem problemas, sei como é a correria! Me diz um dia e horário na semana que vem que seja mais tranquilo para conversarmos por 10 minutinhos." }
    ]
  },
  {
    category: "Objeções de Confiança",
    situations: [
      { title: "Não te conheço", script: "Super entendo sua cautela. Para te deixar mais tranquilo, eu posso te enviar o contato de dois clientes meus do mesmo segmento que o seu para você perguntar como foi o processo. Pode ser?" },
      { title: "Como sei que funciona?", script: "Ótima pergunta. O que eu faço é baseado em dados e padrões de comportamento do consumidor, não em 'achismo'. Além disso, eu configuro métricas para você acompanhar exatamente quantos cliques estão chegando no seu WhatsApp através do meu trabalho." }
    ]
  },
  {
    category: "Ghosting (Sumiço)",
    situations: [
      { title: "Sumiu após receber a proposta", script: "Oi [Nome], tudo bem? Sei que a rotina engole a gente às vezes! Só passando para saber se conseguiu dar uma olhada na proposta ou se ficou alguma dúvida sobre o escopo do projeto." },
      { title: "Sumiu após interesse inicial", script: "Oi [Nome]! Estou fechando minha agenda do mês e lembrei do projeto da sua empresa. Ainda faz sentido seguirmos em frente ou podemos deixar para o próximo trimestre?" }
    ]
  },
  {
    category: "Concorrência",
    situations: [
      { title: "Já tenho agência", script: "Que bacana! Meu trabalho de Landing Pages costuma rodar em paralelo com o de agências, inclusive potencializando os anúncios que eles já fazem para você. Tem alguma campanha específica rodando hoje que precisa de mais conversão?" },
      { title: "Sobrinho/Primo que faz", script: "Entendi! É muito comum ter alguém próximo ajudando. O que eu ofereço é uma visão técnica de neuromarketing e conversão que geralmente quem não é especialista focado nisso deixa passar. Quer que eu faça uma auditoria rápida e gratuita no que vocês já têm pronto?" }
    ]
  },
  {
    category: "Interesse Vago",
    situations: [
      { title: "Me manda os valores", script: "Eu adoraria te mandar uma tabela, mas como meu trabalho é personalizado para o seu problema atual, eu não tenho 'pacotes prontos'. Preciso de 2 minutinhos seus para entender se o foco de vocês agora é captação de leads ou venda direta. Podemos falar rápido?" }
    ]
  }
];

export default function SituationsLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedScript, setCopiedScript] = useState(null);

  const filteredLibrary = useMemo(() => {
    if (!searchTerm) return LIBRARY_DATA;
    const lowerTerm = searchTerm.toLowerCase();
    
    return LIBRARY_DATA.map(category => {
      const filteredSituations = category.situations.filter(sit => 
        sit.title.toLowerCase().includes(lowerTerm) || 
        sit.script.toLowerCase().includes(lowerTerm)
      );
      return { ...category, situations: filteredSituations };
    }).filter(category => category.situations.length > 0);
  }, [searchTerm]);

  const handleCopy = (script) => {
    navigator.clipboard.writeText(script);
    setCopiedScript(script);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  return (
    <Container className="animate-fade-in">
      <Header>
        <div className="title-area">
          <FaBook className="icon" />
          <h3>Biblioteca de Situações</h3>
        </div>
        <SearchBox>
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar objeção (ex: 'caro', 'pensar', 'concorrência')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
      </Header>

      <Content>
        {filteredLibrary.length === 0 ? (
          <EmptyState>Nenhum roteiro encontrado para "{searchTerm}"</EmptyState>
        ) : (
          filteredLibrary.map((cat, i) => (
            <CategoryGroup key={i}>
              <h4>{cat.category}</h4>
              <div className="situations-grid">
                {cat.situations.map((sit, j) => (
                  <ScriptCard key={j}>
                    <h5>{sit.title}</h5>
                    <p>"{sit.script}"</p>
                    <CopyBtn onClick={() => handleCopy(sit.script)}>
                      {copiedScript === sit.script ? <><FaCheck/> Copiado</> : <><FaCopy/> Copiar</>}
                    </CopyBtn>
                  </ScriptCard>
                ))}
              </div>
            </CategoryGroup>
          ))
        )}
      </Content>
    </Container>
  );
}

const Container = styled.div`
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  .title-area {
    display: flex;
    align-items: center;
    gap: 10px;

    .icon { color: #8b5cf6; font-size: 1.2rem; }
    h3 { margin: 0; color: #f8fafc; font-size: 1.3rem; }
  }
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;

  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
  }

  input {
    width: 100%;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px 16px 12px 40px;
    color: white;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus { border-color: #8b5cf6; }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #94a3b8;
  padding: 40px;
  font-style: italic;
`;

const CategoryGroup = styled.div`
  h4 {
    margin: 0 0 16px 0;
    color: #a78bfa;
    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
    padding-bottom: 8px;
    font-size: 1.1rem;
  }

  .situations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
`;

const ScriptCard = styled.div`
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;

  h5 { margin: 0 0 8px 0; color: #e2e8f0; font-size: 1rem; }
  
  p { 
    margin: 0 0 16px 0; 
    color: #94a3b8; 
    font-style: italic; 
    line-height: 1.5; 
    font-size: 0.9rem;
    flex: 1;
  }
`;

const CopyBtn = styled.button`
  align-self: flex-end;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #cbd5e1;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;
