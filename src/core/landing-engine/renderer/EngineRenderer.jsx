import React from 'react';
import { DesignSystem } from './DesignSystem';
import { ComponentRegistry } from './registry';

/**
 * O Renderizador Mestre.
 * Lê o blueprint, pega os dados do CopyModel e monta a página.
 */
export function EngineRenderer({ blueprint, themeTokens, copyModel, assetModel }) {
  if (!blueprint || !blueprint.structure) {
    return <div>Carregando Blueprint...</div>;
  }

  const { structure, metadata } = blueprint;

  return (
    <DesignSystem themeTokens={themeTokens}>
      {/* Container mestre que vai renderizar as seções em cascata */}
      <main className="landing-page-wrapper">
        
        {structure.map((section, index) => {
          // 1. Achar o Renderer certo para este tipo de componente
          const RendererComponent = ComponentRegistry[section.componentType];
          
          if (!RendererComponent) {
            console.warn(`[EngineRenderer] ComponentType "${section.componentType}" não tem um Renderer registrado no registry.js.`);
            return null; // ou um bloco de Fallback
          }

          // 2. Extrair o copy específico desta seção
          const copyData = copyModel?.sectionsData?.[section.sectionId] || {};

          // 3. Renderizar injetando as props limpas
          return (
            <RendererComponent 
              key={`${section.sectionId}-${index}`} 
              section={section} 
              copyData={copyData} 
              assets={assetModel?.assets} 
              metadata={metadata} 
            />
          );
        })}

      </main>
    </DesignSystem>
  );
}
