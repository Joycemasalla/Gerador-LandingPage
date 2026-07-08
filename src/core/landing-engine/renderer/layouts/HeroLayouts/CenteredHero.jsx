import React from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { Heading } from '../../components/Heading';
import { Paragraph } from '../../components/Paragraph';
import { Button } from '../../components/Button';

const CenteredWrapper = styled.section`
  padding: calc(var(--spacing-base) * 12) 0;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(180deg, var(--color-muted) 0%, var(--color-background) 100%);

  .content-area {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--spacing-base) * 3);
  }
`;

export function CenteredHero({ data, metadata }) {
  const { headline, subheadline } = data || {};
  const ctaText = data?.ctaText || metadata?.primaryCtaAction;

  return (
    <CenteredWrapper>
      <Container>
        <div className="content-area">
          <Heading as="h1" align="center">{headline}</Heading>
          <Paragraph size="lg" align="center" muted>{subheadline}</Paragraph>
          {ctaText && (
            <div style={{ marginTop: 'var(--spacing-base)' }}>
              <Button size="lg">{ctaText}</Button>
            </div>
          )}
        </div>
      </Container>
    </CenteredWrapper>
  );
}
