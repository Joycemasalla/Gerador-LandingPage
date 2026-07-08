/**
 * Catálogo de imagens do Unsplash por segmento de negócio.
 * Seleciona fotos temáticas reais para cada nicho, evitando imagens genéricas.
 * As imagens são usadas como fallback quando o usuário não faz upload próprio.
 */

const IMAGE_CATALOG = {
  barbearia: {
    keywords: ['barbearia', 'barbeiro', 'barba', 'corte masculino', 'navalha', 'barber'],
    images: [
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80', // Barbeiro cortando cabelo
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80', // Interior barbearia vintage
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80', // Corte masculino de perto
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80', // Navalha e tesoura
    ]
  },
  salao: {
    keywords: ['salão', 'salao', 'cabeleireiro', 'cabelo', 'escova', 'mechas', 'loiro', 'beleza', 'beauty salon'],
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80', // Cabelereira com cliente
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', // Salão de beleza moderno
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80', // Corte feminino
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80', // Maquiagem e beleza
    ]
  },
  estetica: {
    keywords: ['estética', 'estetica', 'esteticista', 'spa', 'skin care', 'facial', 'sobrancelha', 'depilação', 'massagem'],
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', // Tratamento facial
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', // Spa relaxante
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80', // Cuidados com a pele
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80', // Massagem spa
    ]
  },
  hamburgueria: {
    keywords: ['hamburgueria', 'hamburguer', 'hambúrguer', 'burger', 'lanche', 'fast food', 'smash burger'],
    images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', // Hambúrguer artesanal suculento
      'https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=800&q=80', // Hambúrguer com batata frita
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80', // Combo de hambúrguer
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80', // Smash burger próximo
    ]
  },
  restaurante: {
    keywords: ['restaurante', 'comida', 'culinária', 'chef', 'prato', 'gastronomia', 'food'],
    images: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80', // Prato gourmet
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80', // Ambiente de restaurante
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80', // Comida italiana
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', // Mesa posta elegante
    ]
  },
  saude: {
    keywords: ['saúde', 'saude', 'clínica', 'clinica', 'médico', 'medico', 'hospital', 'fisioterapia', 'odonto', 'dentista', 'nutrição', 'psicólogo'],
    images: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80', // Consultório médico limpo
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80', // Estetoscópio
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80', // Saúde e bem-estar
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80', // Médico com tablet
    ]
  },
  academia: {
    keywords: ['academia', 'personal trainer', 'fitness', 'musculação', 'pilates', 'crossfit', 'gym', 'treino', 'esporte'],
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', // Academia moderna
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80', // Treino funcional
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80', // Halteres e equipamentos
      'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=800&q=80', // Treino de força
    ]
  },
  petshop: {
    keywords: ['pet shop', 'petshop', 'veterinário', 'veterinario', 'animal', 'cachorro', 'gato', 'pet', 'banho e tosa'],
    images: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80', // Cachorro bonito
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80', // Gato fofo
      'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80', // Banho de cachorro
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80', // Cachorros brincando
    ]
  },
  doceria: {
    keywords: ['doceria', 'confeitaria', 'bolo', 'doce', 'café', 'cafeteria', 'sobremesa', 'brigadeiro', 'padaria'],
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', // Bolo de camadas decorado
      'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=800&q=80', // Cupcakes e doces
      'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&w=800&q=80', // Café com espuma (latte art)
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80', // Mesa de café da manhã
    ]
  },
  corporativo: {
    keywords: ['advogado', 'consultoria', 'empresa', 'corporate', 'escritório', 'escritorio', 'contabilidade', 'financeiro', 'seguros', 'imobiliária'],
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', // Profissional corporativo
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', // Mesa de trabalho moderna
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80', // Reunião de negócios
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', // Escritório elegante
    ]
  },
};

// Fallback genérico para segmentos não mapeados
const GENERIC_IMAGES = [
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
];

/**
 * Detecta o nicho do negócio com base em palavras-chave do segmento e da bio.
 * @param {string} segment - Segmento do negócio (ex: "Barbearia", "Salão de Beleza")
 * @param {string} bio - Bio/descrição do negócio para contexto adicional
 * @returns {string[]} Array de URLs de imagens correspondentes ao nicho
 */
export function getImagesForSegment(segment = '', bio = '') {
  const searchText = `${segment} ${bio}`.toLowerCase();

  for (const [, catalog] of Object.entries(IMAGE_CATALOG)) {
    const matched = catalog.keywords.some(keyword =>
      searchText.includes(keyword.toLowerCase())
    );
    if (matched) {
      return catalog.images;
    }
  }

  return GENERIC_IMAGES;
}

/**
 * Retorna a primeira imagem do catálogo para o segmento detectado.
 * Útil como imagem padrão da seção "Sobre" e "Diferenciais".
 */
export function getPrimaryImageForSegment(segment = '', bio = '') {
  const images = getImagesForSegment(segment, bio);
  return images[0];
}

/**
 * Retorna a segunda imagem do catálogo (para a seção de Diferenciais).
 */
export function getSecondaryImageForSegment(segment = '', bio = '') {
  const images = getImagesForSegment(segment, bio);
  return images[1] || images[0];
}

export default IMAGE_CATALOG;
