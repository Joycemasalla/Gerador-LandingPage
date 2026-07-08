import React from 'react';
import styled from 'styled-components';

const StyledHeading = styled.h2`
  color: var(--color-foreground);
  text-align: ${props => props.$align || 'left'};
  
  /* Fallback se a tag for H1 */
  ${props => props.as === 'h1' && `
    font-size: clamp(2.5rem, 5vw, 4rem);
    letter-spacing: -0.02em;
  `}
  
  /* Fallback se a tag for H2 */
  ${props => props.as === 'h2' && `
    font-size: clamp(2rem, 4vw, 3rem);
    letter-spacing: -0.01em;
  `}

  /* Fallback se a tag for H3 */
  ${props => props.as === 'h3' && `
    font-size: clamp(1.5rem, 3vw, 2rem);
  `}
`;

export function Heading({ children, level = 2, align, className }) {
  const as = `h${level}`;
  return (
    <StyledHeading as={as} $align={align} className={className}>
      {children}
    </StyledHeading>
  );
}
