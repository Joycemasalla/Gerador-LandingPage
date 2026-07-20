import React from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaCheckSquare, FaRegSquare, FaPlayCircle } from 'react-icons/fa';

export default function CaptureFlow({ onBack }) {
  return (
    <Container className="animate-fade-in">
      <Header>
        <BackButton onClick={onBack}>
          <FaChevronLeft /> Voltar ao Início
        </BackButton>
        <div className="title-area">
          <h1>🏗️ Fluxo Padrão de Captação</h1>
          <p>Processo reproduzível para cada novo cliente potencial.</p>
        </div>
      </Header>

      <ContentArea>
        <Section>
          <OverviewBox>
            <h3>Visão Geral do Fluxo</h3>
            <div className="flow-steps">
              <span>[1] Due Diligence</span> → <span>[2] Protótipo</span> → <span>[3] Auditoria</span> → <span>[4] Vídeo</span> → <span>[5] Abordagem</span>
            </div>
            <p>Cada etapa se apoia na anterior. O cliente só recebe a abordagem <strong>depois</strong> que todo o trabalho já foi feito por você. Isso inverte a lógica: quem chega com valor entregue tem muito mais poder de negociação.</p>
          </OverviewBox>
        </Section>

        <Section>
          <h2>✅ ETAPA 1 — Due Diligence</h2>
          <p className="subtitle"><strong>Objetivo:</strong> Entender profundamente o negócio antes de criar qualquer coisa.</p>
          
          <Grid>
            <Card>
              <h4>O que pesquisar no Instagram</h4>
              <ul>
                <li><FaRegSquare /> Quantos seguidores tem?</li>
                <li><FaRegSquare /> Com que frequência postam?</li>
                <li><FaRegSquare /> Que tipo de conteúdo performa melhor?</li>
                <li><FaRegSquare /> Qual é o tom de voz da marca?</li>
                <li><FaRegSquare /> Quais serviços aparecem mais?</li>
                <li><FaRegSquare /> O perfil tem link na bio?</li>
                <li><FaRegSquare /> Existe destaques de Stories? Quais?</li>
                <li><FaRegSquare /> Eles respondem comentários e DMs?</li>
              </ul>
            </Card>
            <Card>
              <h4>O que pesquisar no site atual</h4>
              <ul>
                <li><FaRegSquare /> Qual plataforma usam?</li>
                <li><FaRegSquare /> O site carrega rápido?</li>
                <li><FaRegSquare /> O site aparece no Google?</li>
                <li><FaRegSquare /> Tem botão de WhatsApp?</li>
                <li><FaRegSquare /> O design está alinhado com a marca?</li>
                <li><FaRegSquare /> Funciona bem no celular?</li>
                <li><FaRegSquare /> Tem depoimentos, endereço e serviços?</li>
                <li><FaRegSquare /> Tem formulário de contato claro?</li>
              </ul>
            </Card>
          </Grid>
          <div className="result-box">
            <strong>Resultado esperado:</strong> Um retrato claro de quem é o negócio, o que está faltando e qual oportunidade existe para o site.
          </div>
        </Section>

        <Section>
          <h2>✅ ETAPA 2 — Protótipo Personalizado</h2>
          <p className="subtitle"><strong>Objetivo:</strong> Criar um site real (não um mockup) baseado nos dados da Due Diligence.</p>
          
          <Card>
            <h4>O que o protótipo deve ter:</h4>
            <div className="two-columns">
              <ul>
                <li><FaCheckSquare className="check" /> Nome, logo e identidade visual</li>
                <li><FaCheckSquare className="check" /> Serviços reais do negócio</li>
                <li><FaCheckSquare className="check" /> Endereço e horário reais</li>
                <li><FaCheckSquare className="check" /> Botão de WhatsApp real</li>
                <li><FaCheckSquare className="check" /> Linguagem alinhada ao tom</li>
              </ul>
              <ul>
                <li><FaCheckSquare className="check" /> Fotos reais (Insta/Google Maps)</li>
                <li><FaCheckSquare className="check" /> Depoimentos (comentários)</li>
                <li><FaCheckSquare className="check" /> FAQ do segmento</li>
                <li><FaCheckSquare className="check" /> SEO básico (título, keywords)</li>
              </ul>
            </div>
            <div className="tip">
              <strong>Boas práticas:</strong> O site deve estar publicado e acessível via link. O cliente precisa conseguir navegar, clicar e ver no celular.
            </div>
          </Card>
        </Section>

        <Section>
          <h2>✅ ETAPA 3 — Auditoria Comparativa (Antes × Depois)</h2>
          <p className="subtitle"><strong>Objetivo:</strong> Mostrar de forma visual e objetiva a diferença.</p>
          
          <TableWrapper>
            <table>
              <thead>
                <tr>
                  <th>Critério</th>
                  <th>Site Atual</th>
                  <th>Protótipo</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Design</td><td>❌ Genérico / amador</td><td>✅ Profissional e alinhado</td></tr>
                <tr><td>Velocidade</td><td>❌ Lento</td><td>✅ Rápido e otimizado</td></tr>
                <tr><td>Celular</td><td>❌ Experiência ruim</td><td>✅ 100% responsivo</td></tr>
                <tr><td>WhatsApp</td><td>❌ Sem integração</td><td>✅ Botão direto</td></tr>
                <tr><td>Google (SEO)</td><td>❌ Não aparece</td><td>✅ Configurado localmente</td></tr>
                <tr><td>Serviços</td><td>❌ Incompletos</td><td>✅ Todos listados</td></tr>
                <tr><td>Depoimentos</td><td>❌ Ausentes</td><td>✅ Incluídos</td></tr>
              </tbody>
            </table>
          </TableWrapper>
        </Section>

        <Section>
          <h2>✅ ETAPA 4 — Vídeo de Apresentação</h2>
          <p className="subtitle"><strong>Objetivo:</strong> Apresentar o trabalho de forma pessoal em 3-5 minutos.</p>
          
          <Timeline>
            <TimelineItem>
              <div className="time">0:00 - 0:30</div>
              <div className="content">
                <strong>Apresentação pessoal</strong>
                <p>"Oi, meu nome é Joyce. Sou especialista em criação de sites... resolvi fazer um trabalho prático..."</p>
              </div>
            </TimelineItem>
            <TimelineItem>
              <div className="time">0:30 - 1:30</div>
              <div className="content">
                <strong>Mostrando o problema</strong>
                <p>Abre o site atual e aponta problemas de carregamento, celular, whatsapp...</p>
              </div>
            </TimelineItem>
            <TimelineItem>
              <div className="time">1:30 - 3:30</div>
              <div className="content">
                <strong>Mostrando o protótipo</strong>
                <p>Faz um tour completo com entusiasmo genuíno pelo novo site.</p>
              </div>
            </TimelineItem>
            <TimelineItem>
              <div className="time">3:30 - 5:00</div>
              <div className="content">
                <strong>Auditoria & CTA</strong>
                <p>Mostra a tabela comparativa e convida: "Criei sem compromisso, se quiser conversar responda a mensagem."</p>
              </div>
            </TimelineItem>
          </Timeline>
        </Section>

        <Section>
          <h2>✅ ETAPA 5 — Abordagem</h2>
          <p className="subtitle"><strong>Objetivo:</strong> Chegar com o trabalho pronto e um convite leve.</p>
          
          <ScriptBox>
            <div className="label">1. Primeira Mensagem (Gerar Curiosidade)</div>
            <p>Oi [Nome]! Tudo bem?<br/><br/>Me chamo Joyce. Um amigo meu, o Bruno, foi até o estabelecimento de vocês e ficou muito satisfeito... Daí ele me mostrou o site de vocês.<br/><br/>Como sou especialista em criação de sites, resolvi fazer uma surpresa e criar uma versão nova — especificamente pro negócio de vocês, sem compromisso.<br/><br/>Gravei um vídeo curto mostrando o que fiz. Posso mandar?</p>
            <div className="alert">⏳ Espere o "sim" antes de mandar o vídeo!</div>
          </ScriptBox>

          <ScriptBox>
            <div className="label">2. Após o SIM</div>
            <p>Aqui está! 👇<br/><br/>🎥 [link do vídeo]<br/><br/>E esse é o link do site: <strong>https://projeto.lovable.app</strong><br/><br/>Fico à disposição! 😊</p>
          </ScriptBox>
        </Section>

        <Section>
          <h2>📋 Checklist Final</h2>
          <Card>
            <ul className="checklist">
              <li><FaRegSquare /> Due Diligence concluída (Insta + Site)</li>
              <li><FaRegSquare /> Protótipo publicado</li>
              <li><FaRegSquare /> Auditoria comparativa montada</li>
              <li><FaRegSquare /> Vídeo gravado e enviado</li>
              <li><FaRegSquare /> Mensagem de abordagem enviada</li>
              <li><FaRegSquare /> Follow-up (se sem resposta em 3 dias)</li>
              <li><FaRegSquare /> Proposta enviada</li>
              <li><FaRegSquare /> Negociação / Fechamento</li>
            </ul>
          </Card>
        </Section>

      </ContentArea>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #0f172a;
  color: #e2e8f0;
  padding: 30px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;

  .title-area {
    h1 {
      margin: 0 0 8px 0;
      color: #fff;
    }
    p {
      margin: 0;
      color: #94a3b8;
    }
  }
`;

const BackButton = styled.button`
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ContentArea = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h2 {
    color: #8b5cf6;
    margin: 0;
    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
    padding-bottom: 8px;
  }

  .subtitle {
    margin: 0;
    color: #94a3b8;
  }
`;

const OverviewBox = styled.div`
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  padding: 24px;

  h3 { margin-top: 0; color: #fff; }

  .flow-steps {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    font-weight: bold;
    color: #a78bfa;
    margin-bottom: 16px;
    
    span {
      background: rgba(0,0,0,0.2);
      padding: 6px 12px;
      border-radius: 6px;
    }
  }

  p { margin: 0; line-height: 1.6; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 20px;

  h4 { margin: 0 0 16px 0; color: #f1f5f9; }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #cbd5e1;
    font-size: 0.95rem;

    svg { color: #64748b; }
    .check { color: #10b981; }
  }

  .two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .tip {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.05);
    font-size: 0.9rem;
    color: #94a3b8;
  }

  .checklist li {
    font-size: 1.1rem;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    &:last-child { border: none; }
  }
`;

const resultBox = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border-left: 4px solid #10b981;
  padding: 16px;
  border-radius: 4px;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    background: rgba(30, 41, 59, 0.5);
    border-radius: 12px;
    overflow: hidden;

    th, td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    th {
      background: rgba(255,255,255,0.05);
      color: #f1f5f9;
      font-weight: 600;
    }

    td {
      color: #cbd5e1;
    }
  }
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 20px;
  background: rgba(30, 41, 59, 0.5);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.05);

  .time {
    background: #3b82f6;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: bold;
    white-space: nowrap;
    align-self: flex-start;
  }

  .content {
    strong { display: block; margin-bottom: 8px; color: #f1f5f9; }
    p { margin: 0; color: #cbd5e1; font-size: 0.95rem; line-height: 1.5; }
  }
`;

const ScriptBox = styled.div`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 24px;
  position: relative;

  .label {
    position: absolute;
    top: -12px;
    left: 20px;
    background: #8b5cf6;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  p {
    margin: 10px 0 0 0;
    color: #e2e8f0;
    font-style: italic;
    line-height: 1.6;
  }

  .alert {
    margin-top: 16px;
    background: rgba(245, 158, 11, 0.1);
    color: #fbbf24;
    padding: 10px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: bold;
    display: inline-block;
  }
`;
