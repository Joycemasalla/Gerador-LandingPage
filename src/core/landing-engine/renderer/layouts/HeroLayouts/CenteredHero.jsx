import React from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { Heading } from '../../components/Heading';
import { Paragraph } from '../../components/Paragraph';
import { Button } from '../../components/Button';

const Wrapper = styled.section`
  position: relative;
  padding: clamp(96px, 14vh, 160px) 0 clamp(64px, 10vh, 120px);
  text-align: center;
  overflow: hidden;
  background:
    radial-gradient(ellipse at top, color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 60%),
    var(--color-background);

  .eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px; border-radius: 999px;
    background: color-mix(in srgb, var(--color-primary) 12%, transparent);
    color: var(--color-primary);
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
  }
  .content { max-width: 820px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }
  .gallery {
    margin-top: 56px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    @media (max-width: 800px) { grid-template-columns: repeat(2, 1fr); }
  }
  .gallery div {
    aspect-ratio: 1/1;
    border-radius: 16px;
    background-size: cover; background-position: center;
    box-shadow: 0 20px 40px -20px rgba(0,0,0,0.35);
    transform: translateY(0);
    transition: transform .4s ease;
  }
  .gallery div:nth-child(even) { transform: translateY(20px); }
  .gallery div:hover { transform: translateY(-6px); }
`;

export function CenteredHero({ data, assets, metadata }) {
  const { headline, subheadline, eyebrow } = data || {};
  const ctaText = data?.ctaText || metadata?.primaryCtaAction;
  const gallery = (assets || []).slice(0, 4);

  return (
    <Wrapper>
      <Container>
        <div className="content">
          {(eyebrow || true) && <span className="eyebrow">{eyebrow || 'Feito com carinho'}</span>}
          <Heading as="h1" align="center">{headline || 'Uma experiência única, feita para você.'}</Heading>
          <Paragraph size="lg" align="center" muted>
            {subheadline || 'Descubra por que somos referência no que fazemos.'}
          </Paragraph>
          {ctaText && (
            <div className="actions">
              <Button size="lg">{ctaText} →</Button>
              <Button size="lg" variant="secondary">Ver serviços</Button>
            </div>
          )}
        </div>
        {gallery.length > 0 && (
          <div className="gallery">
            {gallery.map((src, i) => (
              <div key={i} style={{ backgroundImage: `url(${src})` }} />
            ))}
          </div>
        )}
      </Container>
    </Wrapper>
  );
}
