import React from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { Heading } from '../../components/Heading';
import { Paragraph } from '../../components/Paragraph';
import { Button } from '../../components/Button';

const SplitWrapper = styled.section`
  padding: calc(var(--spacing-base) * 10) 0;
  min-height: 80vh;
  display: flex;
  align-items: center;

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: calc(var(--spacing-base) * 6);
    align-items: center;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }

  .content-area {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-base) * 3);
    
    @media (max-width: 768px) {
      align-items: center;
    }
  }

  .image-area {
    width: 100%;
    aspect-ratio: 4/3;
    border-radius: var(--radius-card);
    overflow: hidden;
    box-shadow: var(--shadow-card);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

export function SplitHero({ data, assets, metadata }) {
  const { headline, subheadline } = data || {};
  const ctaText = data?.ctaText || metadata?.primaryCtaAction;
  const image = assets?.[0] || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80';

  return (
    <SplitWrapper>
      <Container>
        <div className="grid">
          <div className="content-area">
            <Heading as="h1">{headline}</Heading>
            <Paragraph size="lg" muted>{subheadline}</Paragraph>
            {ctaText && (
              <div>
                <Button size="lg">{ctaText}</Button>
              </div>
            )}
          </div>
          <div className="image-area">
            <img src={image} alt="Hero" />
          </div>
        </div>
      </Container>
    </SplitWrapper>
  );
}
