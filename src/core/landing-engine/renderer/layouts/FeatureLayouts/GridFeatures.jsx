import React from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { Heading } from '../../components/Heading';
import { Paragraph } from '../../components/Paragraph';
import { FaStar, FaBolt, FaHeart, FaShieldAlt, FaGem, FaMagic, FaAward, FaLeaf } from 'react-icons/fa';

const ICONS = [FaStar, FaBolt, FaHeart, FaShieldAlt, FaGem, FaMagic, FaAward, FaLeaf];

const Wrapper = styled.section`
  padding: clamp(72px, 10vh, 120px) 0;
  background-color: var(--color-background);

  .head { text-align: center; max-width: 720px; margin: 0 auto clamp(40px, 6vh, 72px); }
  .eyebrow {
    display: inline-block; padding: 6px 14px; border-radius: 999px;
    background: color-mix(in srgb, var(--color-primary) 12%, transparent);
    color: var(--color-primary); font-size: 0.8rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 16px;
  }
  .grid {
    display: grid; gap: 24px;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
  .card {
    position: relative;
    background: var(--color-background);
    border: 1px solid color-mix(in srgb, var(--color-foreground) 8%, transparent);
    border-radius: var(--radius-card);
    padding: 32px 28px;
    display: flex; flex-direction: column; gap: 14px;
    transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
    overflow: hidden;
  }
  .card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent 60%);
    opacity: 0; transition: opacity .3s ease;
  }
  .card:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 50px -20px rgba(0,0,0,0.2);
    border-color: color-mix(in srgb, var(--color-primary) 30%, transparent);
  }
  .card:hover::before { opacity: 1; }
  .card > * { position: relative; z-index: 1; }

  .icon {
    width: 56px; height: 56px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    background: color-mix(in srgb, var(--color-primary) 14%, transparent);
    color: var(--color-primary);
    font-size: 1.4rem;
  }
`;

export function GridFeatures({ data }) {
  const { headline, subheadline, eyebrow, items = [] } = data || {};
  const list = items.length ? items : [
    { title: 'Qualidade premium', description: 'Padrão elevado em cada detalhe do atendimento.' },
    { title: 'Atendimento humano', description: 'Cuidado pessoal do primeiro contato até o resultado.' },
    { title: 'Resultado garantido', description: 'Compromisso com a sua satisfação, sempre.' },
  ];

  return (
    <Wrapper>
      <Container>
        <div className="head">
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <Heading as="h2" align="center">{headline || 'Por que somos diferentes'}</Heading>
          {subheadline && <div style={{ marginTop: 12 }}><Paragraph size="lg" align="center" muted>{subheadline}</Paragraph></div>}
        </div>
        <div className="grid">
          {list.map((item, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <div className="card" key={idx}>
                <div className="icon"><Icon /></div>
                <Heading as="h3">{item.title}</Heading>
                <Paragraph muted noMargin>{item.description}</Paragraph>
              </div>
            );
          })}
        </div>
      </Container>
    </Wrapper>
  );
}
