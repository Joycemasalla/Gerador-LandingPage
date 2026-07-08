import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${props => props.$variant === 'secondary' ? 'var(--color-muted)' : 'var(--color-primary)'};
  color: ${props => props.$variant === 'secondary' ? 'var(--color-foreground)' : '#ffffff'};
  text-decoration: none;
  font-weight: 600;
  font-family: var(--font-body);
  font-size: ${props => props.$size === 'lg' ? '1.125rem' : '0.95rem'};
  padding: ${props => props.$size === 'lg' ? '14px 32px' : '10px 24px'};
  border-radius: var(--radius-button);
  box-shadow: ${props => props.$variant === 'primary' ? '0 4px 14px rgba(0,0,0,0.1)' : 'none'};
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
    box-shadow: ${props => props.$variant === 'primary' ? '0 6px 20px rgba(0,0,0,0.15)' : 'none'};
  }
`;

export function Button({ children, href = '#', variant = 'primary', size = 'md', className }) {
  return (
    <StyledButton href={href} $variant={variant} $size={size} className={className}>
      {children}
    </StyledButton>
  );
}
