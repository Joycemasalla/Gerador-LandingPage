import React from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { Heading } from '../../components/Heading';
import { Paragraph } from '../../components/Paragraph';
import { FaQuoteLeft } from 'react-icons/fa';

const Wrapper = styled.section`
  padding: clamp(72px, 10vh, 120px) 0;
  background: color-mix(in srgb, var(--color-muted) 60%, var(--color-background));

  .head { text-align: center; max-width: 720px; margin: 0 auto clamp(40px, 6vh, 72px); }
  .grid {
    display: grid; gap: 24px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  .card {
    position: relative;
    background: var(--color-background);
    border-radius: var(--radius-card);
    padding: 32px 28px;
    box-shadow: 0 10px 30px -15px rgba(0,0,0,0.15);
    display: flex; flex-direction: column; gap: 16px;
    border: 1px solid color-mix(in srgb, var(--color-foreground) 6%, transparent);
  }
  .quote {
    color: var(--color-primary); font-size: 1.75rem; opacity: 0.5;
  }
  .stars { color: #f59e0b; letter-spacing: 3px; font-size: 0.95rem; }
  .who { display: flex; align-items: center; gap: 12px; margin-top: auto; }
  .avatar {
    width: 44px; height: 44px; border-radius: 999px;
    background: linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 40%, #ffffff));
    color: #fff; display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 1rem;
  }
  .name { font-weight: 700; color: var(--color-foreground); font-size: 0.95rem; }
  .role { font-size: 0.8rem; opacity: 0.7; }
`;

function initials(name = '?') {
  return name.trim().split(/\s+/).slice(0, 2).map(s => s[0]?.toUpperCase() || '').join('') || '★';
}

export function BasicSocialProof({ data }) {
  const { headline, subheadline, items = [] } = data || {};
  const list = items.length ? items : [
    { title: 'Cliente satisfeito', description: 'Experiência incrível do início ao fim. Recomendo demais!' },
    { title: 'Cliente satisfeito', description: 'Atendimento nota 10 e resultado acima das expectativas.' },
    { title: 'Cliente satisfeito', description: 'Voltarei sempre. Simplesmente perfeito!' },
  ];

  return (
    <Wrapper>
      <Container>
        <div className="head">
          <Heading as="h2" align="center">{headline || 'O que nossos clientes dizem'}</Heading>
          {subheadline && <div style={{ marginTop: 12 }}><Paragraph size="lg" align="center" muted>{subheadline}</Paragraph></div>}
        </div>
        <div className="grid">
          {list.map((item, idx) => (
            <div className="card" key={idx}>
              <FaQuoteLeft className="quote" />
              <div className="stars">★★★★★</div>
              <Paragraph noMargin>{item.description}</Paragraph>
              <div className="who">
                <div className="avatar">{initials(item.title)}</div>
                <div>
                  <div className="name">{item.title}</div>
                  <div className="role">Cliente verificado</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Wrapper>
  );
}
