import React, { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// Cria estilos globais no documento
const GlobalThemeStyles = createGlobalStyle`
  :root {
    --color-background: ${props => props.theme.colors?.background || '#ffffff'};
    --color-foreground: ${props => props.theme.colors?.foreground || '#000000'};
    --color-primary: ${props => props.theme.colors?.primary || '#3b82f6'};
    --color-muted: ${props => props.theme.colors?.muted || '#f1f5f9'};
    
    --font-display: ${props => props.theme.typography?.displayFont ? `'${props.theme.typography.displayFont}', sans-serif` : 'system-ui, sans-serif'};
    --font-body: ${props => props.theme.typography?.bodyFont ? `'${props.theme.typography.bodyFont}', sans-serif` : 'system-ui, sans-serif'};
    
    --radius-button: ${props => props.theme.borders?.radius?.button || '8px'};
    --radius-card: ${props => props.theme.borders?.radius?.card || '16px'};
    
    --shadow-card: ${props => props.theme.shadows?.card || 'none'};
    
    --spacing-base: ${props => props.theme.spacing?.base || 8}px;
  }

  /* Reset básico e aplicação de tipografia/cores na raiz deste contexto */
  .landing-engine-root {
    font-family: var(--font-body);
    background-color: var(--color-background);
    color: var(--color-foreground);
    line-height: 1.6;
    overflow-x: hidden;
  }

  .landing-engine-root h1, 
  .landing-engine-root h2, 
  .landing-engine-root h3, 
  .landing-engine-root h4 {
    font-family: var(--font-display);
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: calc(var(--spacing-base) * 2);
  }
`;

/**
 * Envelopa a renderização da Landing Page e injeta as variáveis CSS.
 */
export function DesignSystem({ themeTokens, children }) {
  // Carregar fontes do Google dinamicamente se necessário
  useEffect(() => {
    if (!themeTokens?.typography) return;
    
    const { displayFont, bodyFont } = themeTokens.typography;
    const fontNames = new Set([displayFont, bodyFont].filter(Boolean));
    
    if (fontNames.size > 0) {
      const familyString = Array.from(fontNames)
        .map(name => `family=${name.replace(/\s+/g, '+')}:wght@400;600;800`)
        .join('&');
        
      const url = `https://fonts.googleapis.com/css2?${familyString}&display=swap`;
      
      // Verifica se a fonte já não foi carregada no head
      if (!document.querySelector(`link[href="${url}"]`)) {
        const link = document.createElement('link');
        link.href = url;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    }
  }, [themeTokens]);

  return (
    <>
      <GlobalThemeStyles theme={themeTokens || {}} />
      <div className="landing-engine-root">
        {children}
      </div>
    </>
  );
}
