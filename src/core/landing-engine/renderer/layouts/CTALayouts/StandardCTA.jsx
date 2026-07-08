import React from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { Heading } from '../../components/Heading';
import { Paragraph } from '../../components/Paragraph';
import { Button } from '../../components/Button';

const CTAWrapper = styled.section`
  padding: calc(var(--spacing-base) * 12) 0;
  background-color: var(--color-primary);
  color: #ffffff;
  text-align: center;

  .content {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--spacing-base) * 3);
  }

  /* Forçar os textos a ficarem brancos dentro desta seção específica, ignorando o --color-foreground padrão */
  h2, p {
    color: #ffffff;
  }
`;

export function StandardCTA({ data, metadata }) {
  const { headline, subheadline } = data || {};
  const ctaText = data?.ctaText || metadata?.primaryCtaAction;

  return (
    <CTAWrapper>
      <Container>
        <div className="content">
          <Heading as="h2" align="center">{headline}</Heading>
          <Paragraph size="lg" align="center" muted>{subheadline}</Paragraph>
          {ctaText && (
            <div style={{ marginTop: 'var(--spacing-base)' }}>
              {/* O botão secundário usa a cor muted (ex: f1f5f9) para dar contraste sobre o fundo primary */}
              <Button size="lg" variant="secondary">{ctaText}</Button>
            </div>
          )}
        </div>
      </Container>
    </CTAWrapper>
  );
}
