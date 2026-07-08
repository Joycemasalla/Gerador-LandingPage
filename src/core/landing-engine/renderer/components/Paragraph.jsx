import React from 'react';
import styled from 'styled-components';

const StyledParagraph = styled.p`
  color: var(--color-foreground);
  opacity: ${props => props.$muted ? 0.8 : 1};
  text-align: ${props => props.$align || 'left'};
  font-size: ${props => props.$size === 'lg' ? '1.125rem' : '1rem'};
  line-height: 1.6;
  margin-bottom: ${props => props.$noMargin ? '0' : '1.5rem'};
`;

export function Paragraph({ children, size = 'md', align, muted = false, noMargin = false, className }) {
  return (
    <StyledParagraph $size={size} $align={align} $muted={muted} $noMargin={noMargin} className={className}>
      {children}
    </StyledParagraph>
  );
}
