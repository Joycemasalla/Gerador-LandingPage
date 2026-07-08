import React from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { Heading } from '../../components/Heading';
import { Paragraph } from '../../components/Paragraph';
import { Card } from '../../components/Card';

const ProofWrapper = styled.section`
  padding: calc(var(--spacing-base) * 10) 0;
  background-color: var(--color-background);

  .header {
    text-align: center;
    margin-bottom: calc(var(--spacing-base) * 6);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: calc(var(--spacing-base) * 4);
  }
  
  .stars {
    color: #f59e0b; /* Amarelo das estrelas */
    font-size: 1.25rem;
    margin-bottom: calc(var(--spacing-base) * 1);
  }
`;

export function BasicSocialProof({ data }) {
  const { headline, items = [] } = data || {};

  return (
    <ProofWrapper>
      <Container>
        {headline && (
          <div className="header">
            <Heading as="h2" align="center">{headline}</Heading>
          </div>
        )}
        <div className="grid">
          {items.map((item, idx) => (
            <Card key={idx} bordered>
              <div className="stars">★★★★★</div>
              <Paragraph>"{item.description}"</Paragraph>
              <Heading as="h3" style={{ fontSize: '1rem', marginTop: 'auto' }}>- {item.title}</Heading>
            </Card>
          ))}
        </div>
      </Container>
    </ProofWrapper>
  );
}
