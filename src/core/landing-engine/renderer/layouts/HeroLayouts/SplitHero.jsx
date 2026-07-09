import React from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { Heading } from '../../components/Heading';
import { Paragraph } from '../../components/Paragraph';
import { Button } from '../../components/Button';

const Wrapper = styled.section`
  position: relative;
  padding: clamp(64px, 10vh, 128px) 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 15% 20%, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent 55%),
    radial-gradient(circle at 90% 80%, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent 60%),
    var(--color-background);

  .grid {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: clamp(32px, 5vw, 72px);
    align-items: center;
    @media (max-width: 900px) { grid-template-columns: 1fr; text-align: left; }
  }

  .eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px; border-radius: 999px;
    background: color-mix(in srgb, var(--color-primary) 12%, transparent);
    color: var(--color-primary);
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
    width: fit-content;
  }
  .eyebrow::before { content: ''; width: 6px; height: 6px; border-radius: 999px; background: var(--color-primary); }

  .actions { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 8px; }

  .trust {
    display: flex; align-items: center; gap: 14px; margin-top: 28px;
    color: var(--color-foreground); opacity: 0.75; font-size: 0.9rem;
  }
  .avatars { display: flex; }
  .avatars span {
    width: 34px; height: 34px; border-radius: 999px;
    background: linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 40%, #ffffff));
    border: 2px solid var(--color-background);
    margin-left: -10px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.12);
  }
  .avatars span:first-child { margin-left: 0; }

  .media {
    position: relative;
    aspect-ratio: 4/5;
    border-radius: calc(var(--radius-card) + 8px);
    overflow: hidden;
    box-shadow: 0 30px 80px -20px rgba(0,0,0,0.35), 0 10px 30px -10px rgba(0,0,0,0.2);
  }
  .media img { width: 100%; height: 100%; object-fit: cover; }
  .media::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.35));
  }
  .badge {
    position: absolute; left: 20px; bottom: 20px; z-index: 2;
    background: rgba(255,255,255,0.95); backdrop-filter: blur(8px);
    padding: 10px 14px; border-radius: 12px;
    display: flex; align-items: center; gap: 10px;
    font-size: 0.85rem; font-weight: 700; color: #111;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
  .badge .stars { color: #f59e0b; letter-spacing: 2px; }
`;

export function SplitHero({ data, assets, metadata }) {
  const { headline, subheadline, eyebrow, body } = data || {};
  const ctaText = data?.ctaText || metadata?.primaryCtaAction;
  const image = assets?.[0] || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
  const tagline = eyebrow || 'Atendimento premium';

  return (
    <Wrapper>
      <Container>
        <div className="grid">
          <div>
            <span className="eyebrow">{tagline}</span>
            <div style={{ height: 20 }} />
            <Heading as="h1">{headline || 'Sua marca. Uma landing page que converte.'}</Heading>
            <div style={{ height: 16 }} />
            <Paragraph size="lg" muted>
              {subheadline || body || 'Uma página feita sob medida para transformar visitantes em clientes reais.'}
            </Paragraph>
            {ctaText && (
              <div className="actions">
                <Button size="lg">{ctaText} →</Button>
                <Button size="lg" variant="secondary">Saber mais</Button>
              </div>
            )}
            <div className="trust">
              <div className="avatars">
                <span /><span /><span /><span />
              </div>
              <div>
                <div style={{ color: '#f59e0b', letterSpacing: 2, marginBottom: 2 }}>★★★★★</div>
                <div>+500 clientes satisfeitos este mês</div>
              </div>
            </div>
          </div>
          <div className="media">
            <img src={image} alt={headline || 'Hero'} />
            <div className="badge">
              <span className="stars">★★★★★</span>
              <span>Avaliação 4.9/5</span>
            </div>
          </div>
        </div>
      </Container>
    </Wrapper>
  );
}
