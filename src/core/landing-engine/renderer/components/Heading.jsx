import React from 'react';
import styled, { css } from 'styled-components';

const sizeMap = {
  h1: css`
    font-size: clamp(2.75rem, 5.5vw, 4.5rem);
    letter-spacing: -0.03em;
    line-height: 1.05;
  `,
  h2: css`
    font-size: clamp(2rem, 4vw, 3rem);
    letter-spacing: -0.02em;
    line-height: 1.15;
  `,
  h3: css`
    font-size: clamp(1.25rem, 2.2vw, 1.5rem);
    letter-spacing: -0.01em;
    line-height: 1.3;
  `,
  h4: css`
    font-size: 1.125rem;
    line-height: 1.35;
  `,
};

const StyledHeading = styled.h2`
  color: var(--color-foreground);
  text-align: ${(p) => p.$align || 'left'};
  font-family: var(--font-display);
  font-weight: 800;
  margin: 0;
  ${(p) => sizeMap[p.$as] || sizeMap.h2}
`;

export function Heading({ children, as = 'h2', level, align, className, style }) {
  const tag = as || (level ? `h${level}` : 'h2');
  return (
    <StyledHeading as={tag} $as={tag} $align={align} className={className} style={style}>
      {children}
    </StyledHeading>
  );
}
