import React from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { Heading } from '../../components/Heading';
import { Paragraph } from '../../components/Paragraph';

const FAQWrapper = styled.section`
  padding: calc(var(--spacing-base) * 10) 0;
  background-color: var(--color-muted);

  .header {
    text-align: center;
    margin-bottom: calc(var(--spacing-base) * 6);
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing-base) * 2);
    max-width: 800px;
    margin: 0 auto;
  }

  .faq-item {
    background-color: var(--color-background);
    border-radius: var(--radius-card);
    padding: calc(var(--spacing-base) * 3);
    box-shadow: var(--shadow-card);
  }
`;

export function BasicFAQ({ data }) {
  const { headline, items = [] } = data || {};

  return (
    <FAQWrapper>
      <Container>
        {headline && (
          <div className="header">
            <Heading as="h2" align="center">{headline}</Heading>
          </div>
        )}
        <div className="faq-list">
          {items.map((item, idx) => (
            <div className="faq-item" key={idx}>
              <Heading as="h3">{item.title}</Heading>
              <Paragraph muted noMargin>{item.description}</Paragraph>
            </div>
          ))}
        </div>
      </Container>
    </FAQWrapper>
  );
}
