import React from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { Heading } from '../../components/Heading';
import { Paragraph } from '../../components/Paragraph';
import { Button } from '../../components/Button';

const Wrapper = styled.section`
  padding: clamp(72px, 12vh, 140px) 0;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 20%, color-mix(in srgb, #ffffff 20%, transparent), transparent 50%),
    radial-gradient(circle at 80% 80%, color-mix(in srgb, #000000 30%, transparent), transparent 55%),
    linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 60%, #000000));
  color: #ffffff;
  text-align: center;

  &::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
    background-size: 24px 24px;
    opacity: 0.4;
    pointer-events: none;
  }

  .card {
    position: relative;
    max-width: 780px; margin: 0 auto;
    display: flex; flex-direction: column; align-items: center;
    gap: 20px;
    padding: 0 20px;
  }
  h2, p { color: #ffffff !important; }
  .eyebrow {
    display: inline-block; padding: 6px 14px; border-radius: 999px;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
    color: #fff; font-size: 0.8rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.04em;
  }
  .actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; margin-top: 12px; }
  a[href="#"] { /* Botão primary sobre bg colorido: inverter */ }
`;

const WhiteButton = styled.a`
  display: inline-flex; align-items: center; gap: 8px;
  background: #ffffff; color: var(--color-primary);
  padding: 14px 32px; border-radius: var(--radius-button);
  font-weight: 700; font-size: 1.05rem; text-decoration: none;
  box-shadow: 0 12px 30px -10px rgba(0,0,0,0.35);
  transition: transform .25s ease, box-shadow .25s ease;
  &:hover { transform: translateY(-2px); box-shadow: 0 18px 40px -12px rgba(0,0,0,0.4); }
`;

const GhostButton = styled.a`
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: #fff;
  padding: 14px 28px; border-radius: var(--radius-button);
  font-weight: 700; font-size: 1.05rem; text-decoration: none;
  border: 1.5px solid rgba(255,255,255,0.4);
  transition: background .25s ease;
  &:hover { background: rgba(255,255,255,0.1); }
`;

export function StandardCTA({ data, metadata }) {
  const { headline, subheadline, eyebrow } = data || {};
  const ctaText = data?.ctaText || metadata?.primaryCtaAction || 'Falar agora';

  return (
    <Wrapper>
      <Container>
        <div className="card">
          <span className="eyebrow">{eyebrow || 'Vagas limitadas'}</span>
          <Heading as="h2" align="center">{headline || 'Pronto para dar o próximo passo?'}</Heading>
          <Paragraph size="lg" align="center">
            {subheadline || 'Fale com a gente agora e descubra como podemos te ajudar.'}
          </Paragraph>
          <div className="actions">
            <WhiteButton href="#">{ctaText} →</WhiteButton>
            <GhostButton href="#">Tenho dúvidas</GhostButton>
          </div>
        </div>
      </Container>
    </Wrapper>
  );
}
