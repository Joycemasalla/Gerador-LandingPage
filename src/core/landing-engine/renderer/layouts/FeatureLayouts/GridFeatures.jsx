import React from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { Heading } from '../../components/Heading';
import { Paragraph } from '../../components/Paragraph';
import { Card } from '../../components/Card';

const GridWrapper = styled.section`
  padding: calc(var(--spacing-base) * 10) 0;
  background-color: var(--color-background);

  .header {
    text-align: center;
    margin-bottom: calc(var(--spacing-base) * 6);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: calc(var(--spacing-base) * 4);
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background-color: var(--color-muted);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

export function GridFeatures({ data }) {
  const { headline, items = [] } = data || {};

  return (
    <GridWrapper>
      <Container>
        {headline && (
          <div className="header">
            <Heading as="h2" align="center">{headline}</Heading>
          </div>
        )}
        <div className="grid">
          {items.map((item, idx) => (
            <Card key={idx} bordered>
              <div className="icon-wrapper">
                {idx + 1}
              </div>
              <Heading as="h3">{item.title}</Heading>
              <Paragraph muted>{item.description}</Paragraph>
            </Card>
          ))}
        </div>
      </Container>
    </GridWrapper>
  );
}
