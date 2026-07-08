import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  width: 100%;
  max-width: ${props => props.$maxWidth || '1120px'};
  margin: 0 auto;
  padding: 0 calc(var(--spacing-base) * 2.5);
`;

export function Container({ children, maxWidth, className }) {
  return (
    <StyledContainer $maxWidth={maxWidth} className={className}>
      {children}
    </StyledContainer>
  );
}
