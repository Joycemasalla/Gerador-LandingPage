/**
 * Copia um texto para a área de transferência de forma segura.
 * Tenta utilizar navigator.clipboard.writeText e, caso não esteja disponível ou ocorra um erro,
 * utiliza o fallback clássico com document.execCommand('copy').
 * 
 * @param {string} text O texto a ser copiado
 * @returns {Promise<boolean>} Retorna true se a cópia foi bem-sucedida, caso contrário false.
 */
export async function safeCopyToClipboard(text) {
  if (!text) return false;

  // 1. Tenta usar a API moderna navigator.clipboard se disponível e em contexto seguro
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("safeCopyToClipboard: navigator.clipboard falhou, tentando fallback. Erro:", err);
    }
  }

  // 2. Fallback usando o método tradicional document.execCommand
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Posiciona fora da tela e de forma invisível para evitar alterações visuais ou de rolagem
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    
    if (successful) {
      return true;
    }
    
    throw new Error("document.execCommand('copy') retornou falso");
  } catch (err) {
    console.error("safeCopyToClipboard: todos os métodos de cópia falharam. Erro:", err);
    return false;
  }
}
