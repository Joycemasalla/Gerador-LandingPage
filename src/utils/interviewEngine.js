import { questions } from './questionBank';

/**
 * Normaliza a string do segmento para mapear com o banco de perguntas
 */
export function normalizeSegment(segment) {
  if (!segment) return 'default';
  const s = segment.toLowerCase();
  if (s.includes('barber') || s.includes('barbearia')) return 'barbearia';
  if (s.includes('salão') || s.includes('salao') || s.includes('cabelo') || s.includes('hair') || s.includes('beleza')) return 'salao';
  if (s.includes('estética') || s.includes('estetica') || s.includes('spa') || s.includes('facial') || s.includes('corporal')) return 'estetica';
  if (s.includes('hambúrguer') || s.includes('hamburguer') || s.includes('burger') || s.includes('lanche') || s.includes('lanchonete')) return 'hamburgueria';
  if (s.includes('pet') || s.includes('banho') || s.includes('tosa') || s.includes('veterinário') || s.includes('veterinario') || s.includes('dog') || s.includes('cat')) return 'petshop';
  if (s.includes('saúde') || s.includes('saude') || s.includes('médico') || s.includes('medico') || s.includes('clínica') || s.includes('clinica') || s.includes('dentista') || s.includes('psicolog')) return 'saude';
  if (s.includes('academia') || s.includes('fitness') || s.includes('treino') || s.includes('crossfit') || s.includes('musculação')) return 'academia';
  if (s.includes('restaurante') || s.includes('comida') || s.includes('gourmet') || s.includes('bistrô') || s.includes('bistro') || s.includes('gastronomia') || s.includes('jantar') || s.includes('almoço')) return 'restaurante';
  return 'default';
}

/**
 * Obtém um valor aninhado em um objeto a partir do caminho (ex: "targetAudience.idealClient")
 */
export function getNestedValue(obj, path) {
  if (!obj) return undefined;
  return path.split('.').reduce((acc, part) => {
    return acc && acc[part] !== undefined ? acc[part] : undefined;
  }, obj);
}

/**
 * Define um valor aninhado em um objeto a partir do caminho
 */
export function setNestedValue(obj, path, value) {
  if (!obj) return;
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined || current[part] === null) {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

/**
 * Verifica se um campo está ausente ou com baixa confiança no JSON extraído
 */
export function isFieldMissing(json, fieldPath) {
  const value = getNestedValue(json, fieldPath);
  
  // Se for nulo ou indefinido, está ausente
  if (value === undefined || value === null) {
    return true;
  }
  
  // Se for array vazio, está ausente
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  
  // Se for string vazia, está ausente
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }

  // Verificar se o bloco relacionado tem baixa confiança no aiContext
  const firstKey = fieldPath.split('.')[0];
  const confidence = getNestedValue(json, `aiContext.dataConfidence.${firstKey}`);
  if (confidence === 'low') {
    return true;
  }

  return false;
}

/**
 * Analisa o JSON extraído e retorna a fila de perguntas pendentes (ordenada por prioridade)
 */
export function buildQuestionQueue(extractedJson, segment) {
  const queue = [];
  const normalizedSeg = normalizeSegment(segment);

  // Filtrar as perguntas do banco cujos campos correspondentes estão ausentes ou baixos
  for (const q of questions) {
    if (isFieldMissing(extractedJson, q.id)) {
      // Personalizar o texto da pergunta com o nome do negócio, se disponível
      const businessName = getNestedValue(extractedJson, 'identity.businessName') || 'seu negócio';
      const customizedQuestion = q.question.replace(/{{businessName}}/g, businessName);
      
      // Obter as opções específicas do segmento ou o padrão
      const optionsForSegment = q.options[normalizedSeg] || q.options.default || [];

      queue.push({
        ...q,
        question: customizedQuestion,
        optionsList: optionsForSegment
      });
    }
  }

  // Ordena a fila: critical primeiro, depois important, depois enrichment
  const priorityOrder = { critical: 1, important: 2, enrichment: 3 };
  queue.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return queue;
}

/**
 * Mescla a resposta do usuário no JSON rico baseado no ID da pergunta
 */
export function mergeAnswerIntoJson(json, questionId, answer) {
  const updatedJson = JSON.parse(JSON.stringify(json));

  // Tratar formatação de campos especiais
  if (questionId === 'differentials' && Array.isArray(answer)) {
    // Converter array de strings em array de objetos differentials
    const formattedDifferentials = answer.map(title => ({
      title,
      description: null
    }));
    setNestedValue(updatedJson, questionId, formattedDifferentials);
  } else if (questionId === 'branding.preferredColors' && typeof answer === 'object') {
    // Se selecionou uma paleta, answer pode ser { name, colors: [...] } ou as cores direto
    const colors = Array.isArray(answer) ? answer : (answer.colors || null);
    setNestedValue(updatedJson, questionId, colors);
  } else if (questionId === 'contacts.paymentMethods' && Array.isArray(answer)) {
    setNestedValue(updatedJson, questionId, answer);
  } else {
    // Armazenamento genérico direto
    setNestedValue(updatedJson, questionId, answer);
  }

  return updatedJson;
}

/**
 * Finaliza o JSON do cliente calculando a completude e atualizando o aiContext
 */
export function finalizeClientJson(json) {
  const updatedJson = JSON.parse(JSON.stringify(json));
  
  if (!updatedJson.aiContext) {
    updatedJson.aiContext = {
      dataCompleteness: 'medium',
      missingCriticalData: [],
      dataConfidence: {}
    };
  }

  const criticalFields = [
    'identity.businessName',
    'identity.segment',
    'targetAudience.idealClient',
    'targetAudience.primaryPain',
    'contacts.whatsapp'
  ];

  const missingCritical = criticalFields.filter(field => isFieldMissing(updatedJson, field));
  
  updatedJson.aiContext.missingCriticalData = missingCritical.map(f => f.split('.').pop());

  // Calcular completude qualitativa
  let totalChecked = 0;
  let filledCount = 0;

  const checkFields = [
    'identity.businessName',
    'identity.segment',
    'identity.bio',
    'targetAudience.idealClient',
    'targetAudience.primaryPain',
    'services',
    'differentials',
    'process.steps',
    'testimonials',
    'faq',
    'contacts.whatsapp',
    'branding.preferredColors'
  ];

  checkFields.forEach(field => {
    totalChecked++;
    if (!isFieldMissing(updatedJson, field)) {
      filledCount++;
    }
  });

  const ratio = filledCount / totalChecked;
  if (ratio >= 0.8) {
    updatedJson.aiContext.dataCompleteness = 'high';
  } else if (ratio >= 0.5) {
    updatedJson.aiContext.dataCompleteness = 'medium';
  } else {
    updatedJson.aiContext.dataCompleteness = 'low';
  }

  return updatedJson;
}
