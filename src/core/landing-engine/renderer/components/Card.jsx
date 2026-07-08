import React from 'react';
import styled from 'styled-components';

const StyledCard = styled.div`
  background-color: var(--color-background);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: calc(var(--spacing-base) * 3);
  border: ${props => props.$bordered ? '1px solid var(--color-muted)' : 'none'};
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing-base) * 2);
  height: 100%;
`;

export function Card({ children, bordered = false, className }) {
  return (
    <StyledCard $bordered={bordered} className={className}>
      {children}
    </StyledCard>
  );
}
