/**
 * Utilitário para exportar a Landing Page gerada pelo usuário.
 * Gera tanto um HTML único autônomo com estilos embutidos e CDN FontAwesome,
 * quanto o código fonte de componente React funcional com Styled Components.
 */

import { getImagesForSegment } from './imageCatalog';

// Mapeador de ícones do React Icons (Fa) para FontAwesome correspondentes
const mapIconToFontAwesome = (iconName) => {
  const iconMap = {
    FaCheck: 'fa-solid fa-check',
    FaStar: 'fa-solid fa-star',
    FaHandshake: 'fa-solid fa-handshake',
    FaUserCheck: 'fa-solid fa-user-check',
    FaHeart: 'fa-solid fa-heart',
    FaSparkles: 'fa-solid fa-wand-magic-sparkles',
    FaCog: 'fa-solid fa-gear',
    FaAward: 'fa-solid fa-award',
    FaShieldAlt: 'fa-solid fa-shield-halved',
    FaCrown: 'fa-solid fa-crown',
    FaGem: 'fa-solid fa-gem',
    FaClock: 'fa-solid fa-clock',
    FaMapMarkerAlt: 'fa-solid fa-location-dot',
    FaCalendarCheck: 'fa-solid fa-calendar-check',
    FaPhone: 'fa-solid fa-phone',
    FaEnvelope: 'fa-solid fa-envelope',
    FaInstagram: 'fa-brands fa-instagram',
    FaWhatsapp: 'fa-brands fa-whatsapp',
    FaArrowRight: 'fa-solid fa-arrow-right',
    FaCheckCircle: 'fa-solid fa-circle-check',
    FaPlus: 'fa-solid fa-plus',
    FaMinus: 'fa-solid fa-minus'
  };
  return iconMap[iconName] || 'fa-solid fa-star';
};

/**
 * Função para baixar o arquivo no navegador do cliente
 */
export function downloadFile(content, fileName, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * Gera um HTML autônomo compilado, responsivo, moderno e independente
 */
export function generateHTML(data, images = []) {
  const { 
    businessName, 
    tagline, 
    theme = {}, 
    hero = {}, 
    about = {}, 
    services = [], 
    benefits = [], 
    processSteps = [], 
    testimonials = [], 
    faq = [], 
    ctaSection = {}, 
    contacts = {}, 
    whatsappMessage,
    segment = '',
    bio = '',
    tickerWords = [],
    painPoints = []
  } = data;

  // Catálogo de imagens inteligente por segmento
  const catalogImages = getImagesForSegment(segment, bio);
  const resolveImage = (uploadedImg, fallbackIndex) =>
    uploadedImg || catalogImages[fallbackIndex] || catalogImages[0];

  const themeName = theme.themeName || 'minimalist';
  const primaryFont = theme.fontFamily || 'Inter';
  const secondaryFont = theme.secondaryFontFamily || 'Inter';

  // Montar link do WhatsApp
  const phoneFormatted = contacts?.phone ? contacts.phone.replace(/\D/g, '') : '';
  const waUrl = `https://wa.me/${phoneFormatted}?text=${encodeURIComponent(whatsappMessage || '')}`;
  
  // Montar link do Instagram
  const instaUrl = contacts?.instagram ? (contacts.instagram.startsWith('http') ? contacts.instagram : `https://instagram.com/${contacts.instagram.replace('@', '')}`) : '#';

  // Montar itens de serviços em HTML
  const servicesHTML = services.map(s => `
        <div class="service-card">
          <div class="service-icon">
            <i class="${mapIconToFontAwesome(s.icon)}"></i>
          </div>
          <h3>${s.title}</h3>
          <p>${s.description}</p>
          ${s.targetResult ? `<span class="target-result">🎯 ${s.targetResult}</span>` : ''}
        </div>
  `).join('');

  // Montar diferenciais em HTML
  const benefitsHTML = benefits.map(b => `
        <div class="benefit-item">
          <div class="benefit-icon">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div class="benefit-content">
            <h4>${b.title}</h4>
            <p>${b.description}</p>
          </div>
        </div>
  `).join('');

  // Montar passos de processo em HTML
  const processHTML = processSteps.map((step, idx) => `
        <div class="process-card">
          <div class="process-badge">${step.step || '0' + (idx + 1)}</div>
          <h3>${step.title}</h3>
          <p>${step.description}</p>
        </div>
  `).join('');

  // Montar depoimentos em HTML (filtrando placeholders)
  const realTestimonials = testimonials.filter(t => !t.isPlaceholder);
  const testimonialsHTML = realTestimonials.length > 0 
    ? realTestimonials.map(t => `
        <div class="testimonial-card">
          <div class="rating">
            ${Array.from({ length: t.rating || 5 }).map(() => `<i class="fa-solid fa-star"></i>`).join('')}
          </div>
          <p class="quote">"${t.text}"</p>
          <div class="client-info">
            <strong>${t.name}</strong>
            <span>${t.role || ''}</span>
          </div>
        </div>
    `).join('')
    : '\n        <!-- ATENÇÃO: adicione aqui depoimentos reais dos seus clientes -->\n  ';

  // Montar FAQ em HTML
  const faqHTML = faq.map((item, idx) => `
        <div class="faq-item">
          <button class="faq-question">
            <span>${item.question}</span>
            <i class="fa-solid fa-plus faq-toggle-icon"></i>
          </button>
          <div class="faq-answer-wrapper">
            <div class="faq-answer">
              <p>${item.answer}</p>
            </div>
          </div>
        </div>
  `).join('');

  // Montar galeria de imagens
  const galleryHTML = images.length > 0 
    ? `<section class="gallery-section">
        <div class="container">
          <h2 class="section-title">Galeria de Fotos</h2>
          <div class="gallery-grid">
            ${images.map(img => `
              <div class="gallery-item">
                <img src="${img}" alt="Imagem do negócio - ${businessName}" />
              </div>
            `).join('')}
          </div>
        </div>
      </section>`
    : '';

  // Configurações estéticas específicas baseadas na personalidade
  let customCSS = '';
  if (themeName === 'minimalist') {
    customCSS = `
      :root {
        --radius: 4px;
        --shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
        --border: 1px solid rgba(0, 0, 0, 0.08);
      }
      h1, h2, h3, .logo {
        font-family: '${primaryFont}', serif;
        font-weight: 700;
        letter-spacing: -0.2px;
      }
      .destaque {
        font-style: italic;
        color: var(--primary);
        font-family: '${primaryFont}', serif;
        border-bottom: 2px solid var(--secondary);
      }
    `;
  } else if (themeName === 'bold') {
    customCSS = `
      :root {
        --radius: 0px;
        --shadow: 4px 4px 0px var(--dark);
        --border: 2px solid var(--dark);
      }
      h1, h2, h3, .logo {
        font-family: '${primaryFont}', sans-serif;
        font-weight: 800;
        letter-spacing: -1px;
      }
      .hero-section h1 {
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .destaque {
        background-color: var(--secondary);
        color: var(--dark) !important;
        padding: 0px 8px;
        transform: rotate(-1deg);
        display: inline-block;
        box-shadow: 2px 2px 0px var(--dark);
        -webkit-text-fill-color: var(--dark) !important;
        -webkit-background-clip: unset !important;
      }
      .btn {
        border: 2px solid var(--dark);
      }
      .btn:hover {
        box-shadow: 2px 2px 0px var(--dark);
      }
      .service-icon, .process-badge, .trust-badge {
        border: 2px solid var(--dark);
      }
    `;
  } else if (themeName === 'elegant') {
    customCSS = `
      :root {
        --radius: 8px;
        --shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
        --border: 1px solid rgba(197, 168, 128, 0.2);
      }
      h1, h2, h3, .logo {
        font-family: '${primaryFont}', serif;
        font-weight: 600;
        letter-spacing: 0.5px;
      }
      .destaque {
        color: var(--secondary) !important;
        background: linear-gradient(135deg, #c5a880 0%, #e2d1b9 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700;
      }
      .hero-section, .about-section, .services-section, .benefits-section, .process-section, .gallery-section, .testimonials-section, .faq-section {
        border-bottom: var(--border);
      }
    `;
  } else if (themeName === 'friendly') {
    customCSS = `
      :root {
        --radius: 24px;
        --shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
        --border: 1px solid rgba(0, 0, 0, 0.05);
      }
      h1, h2, h3, .logo {
        font-family: '${primaryFont}', sans-serif;
        font-weight: 700;
        letter-spacing: 0px;
      }
      .destaque {
        color: var(--primary);
        border-bottom: 3px dashed var(--secondary);
        border-radius: 4px;
        padding: 0 4px;
      }
      .service-icon {
        border-radius: 16px;
      }
    `;
  }


  // Prevenir bugs se não houver fontes informadas
  const fontsToLoad = [primaryFont];
  if (secondaryFont && secondaryFont !== primaryFont) {
    fontsToLoad.push(secondaryFont);
  }
  const fontQuery = fontsToLoad.map(f => f.replace(/\s+/g, '+')).join('&family=');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName} - ${tagline}</title>
  
  <!-- Fontes do Google -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${fontQuery}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- FontAwesome Ícones -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <style>
    :root {
      --primary: ${theme.primaryColor || '#3B82F6'};
      --secondary: ${theme.secondaryColor || '#10B981'};
      --dark: ${theme.darkColor || '#1F2937'};
      --light: ${theme.lightColor || '#F9FAFB'};
      --text: ${theme.textColor || '#374151'};
      --font-family: '${secondaryFont}', sans-serif;

      /* Sistema de Contraste Garantido (WCAG AA) */
      --text-on-light: ${theme.textColor || '#334155'};
      --title-on-light: ${theme.textColor || '#0f172a'};
      --text-on-dark: ${theme.textColorOnDark || '#cbd5e1'};
      --title-on-dark: ${theme.textColorOnDark || '#ffffff'};
    }

    ${customCSS}

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-family);
      color: var(--text-on-light);
      background-color: var(--light);
      line-height: 1.6;
      overflow-x: hidden;
    }

    /* Ticker deslizante infinito */
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .ticker-wrapper {
      background-color: var(--dark);
      color: white;
      padding: 16px 0;
      overflow: hidden;
      white-space: nowrap;
      border-bottom: var(--border);
      display: flex;
    }

    .ticker-track {
      display: flex;
      width: max-content;
      animation: scroll 25s linear infinite;
    }

    .ticker-group {
      display: flex;
      align-items: center;
      gap: 40px;
      padding-right: 40px;
    }

    .ticker-group span {
      font-family: var(--font-family);
      font-weight: 800;
      font-size: 1.1rem;
      letter-spacing: 1px;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      color: white;
    }

    .ticker-wrapper .bullet {
      color: var(--secondary);
      font-size: 1.5rem;
    }


    .container {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }

    @media (max-width: 768px) {
      .grid {
        grid-template-columns: 1fr;
        gap: 30px;
      }
    }

    /* Animação suave */
    .fade-in {
      animation: fadeInUp 0.8s ease forwards;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Botão CTA Geral */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background-color: var(--primary);
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      padding: 12px 24px;
      border-radius: ${themeName === 'bold' ? '0px' : '50px'};
      box-shadow: var(--shadow);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      border: none;
    }

    .btn:hover {
      background-color: var(--secondary);
      transform: translateY(-2px);
      box-shadow: ${themeName === 'bold' ? '2px 2px 0px var(--dark)' : '0 6px 15px rgba(0, 0, 0, 0.12)'};
    }

    .btn-lg {
      padding: 14px 30px;
      font-size: 1.05rem;
    }

    .btn-sm {
      padding: 7px 15px;
      font-size: 0.85rem;
    }

    /* Cabeçalho */
    header {
      background-color: ${themeName === 'elegant' ? 'rgba(10, 7, 18, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 14px 0;
    }

    header .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    header .logo {
      font-size: 1.35rem;
      font-weight: 800;
      color: ${themeName === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
      letter-spacing: -0.5px;
    }

    /* Hero Section */
    .hero-section {
      background: ${themeName === 'elegant' 
        ? 'radial-gradient(circle at center, rgba(30, 20, 50, 0.95) 0%, rgba(6, 4, 10, 1) 100%)' 
        : 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(240,244,248,0.7) 100%)'};
      color: ${themeName === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
      padding: 100px 0;
      text-align: center;
      border-bottom: var(--border);
    }

    .hero-section h1 {
      font-size: 3.2rem;
      line-height: 1.2;
      margin-bottom: 20px;
      color: ${themeName === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
    }

    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 2.2rem;
      }
    }

    .hero-section p {
      font-size: 1.2rem;
      max-width: 650px;
      margin: 0 auto 30px auto;
      color: ${themeName === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
    }

    .trust-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background-color: ${themeName === 'elegant' ? 'rgba(197, 168, 128, 0.15)' : 'color-mix(in srgb, var(--primary) 10%, transparent)'};
      color: ${themeName === 'elegant' ? '#c5a880' : 'var(--primary)'};
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 700;
      margin-bottom: 24px;
    }

    /* Dores do Cliente (Pain Points) */
    .pain-points-section {
      padding: 80px 0;
      background-color: ${themeName === 'elegant' ? '#0a0712' : 'var(--light)'};
      border-bottom: var(--border);
    }

    .pain-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .pain-card {
      background-color: ${themeName === 'elegant' ? 'rgba(255, 255, 255, 0.03)' : 'white'};
      backdrop-filter: ${themeName === 'elegant' ? 'blur(10px)' : 'none'};
      color: ${themeName === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
      padding: 30px 24px;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: var(--border);
      display: flex;
      gap: 16px;
      align-items: flex-start;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .pain-card:hover {
      transform: translateY(-4px);
      box-shadow: ${themeName === 'bold' ? '6px 6px 0px var(--dark)' : '0 8px 25px rgba(0, 0, 0, 0.08)'};
    }

    .pain-card p {
      font-size: 0.95rem;
      font-weight: 500;
      line-height: 1.5;
    }

    .pain-icon {
      color: ${themeName === 'elegant' ? '#c5a880' : '#ef4444'};
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    /* Seção Sobre */
    .about-section {
      padding: 80px 0;
      background-color: ${themeName === 'elegant' ? '#0d0a16' : 'white'};
      color: ${themeName === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};

      border-bottom: var(--border);
    }

    .about-image {
      width: 100%;
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: var(--shadow);
      border: var(--border);
      aspect-ratio: 4/3;
      background-color: var(--light);
    }

    .about-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .about-image:hover img {
      transform: scale(1.06);
    }


    .about-content h2 {
      font-size: 2rem;
      color: ${themeName === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
      margin-bottom: 20px;
    }

    .about-content p {
      margin-bottom: 18px;
      font-size: 0.98rem;
      color: ${themeName === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
    }

    /* Serviços Section */
    .services-section {
      padding: 80px 0;
      background-color: ${themeName === 'elegant' ? '#0b0f19' : 'var(--light)'};
      border-bottom: var(--border);
    }

    .section-title {
      text-align: center;
      font-size: 2rem;
      color: ${themeName === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
      margin-bottom: 40px;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .service-card {
      background-color: ${themeName === 'elegant' ? '#111827' : 'white'};
      color: ${themeName === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
      padding: 30px 24px;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: var(--border);
      transition: all 0.3s ease;
      text-align: left;
    }

    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: ${themeName === 'bold' ? '6px 6px 0px var(--dark)' : '0 8px 25px rgba(0, 0, 0, 0.08)'};
    }

    .service-icon {
      width: 50px;
      height: 50px;
      background-color: color-mix(in srgb, var(--primary) 10%, transparent);
      color: var(--primary);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      margin-bottom: 20px;
    }

    .service-card h3 {
      font-size: 1.2rem;
      color: ${themeName === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
      margin-bottom: 10px;
    }

    .service-card p {
      font-size: 0.9rem;
      color: ${themeName === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
    }

    .target-result {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--secondary);
      margin-top: 8px;
      background: rgba(16, 185, 129, 0.08);
      padding: 2px 8px;
      border-radius: 4px;
    }

    /* Diferenciais / Benefícios */
    .benefits-section {
      padding: 80px 0;
      background-color: ${themeName === 'elegant' ? '#111827' : 'white'};
      color: ${themeName === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
      border-bottom: var(--border);
    }

    .benefits-content h2 {
      font-size: 2rem;
      color: ${themeName === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
      margin-bottom: 10px;
    }

    .benefits-content .intro {
      font-size: 0.98rem;
      margin-bottom: 24px;
      color: ${themeName === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
    }

    .benefits-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .benefit-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      text-align: left;
    }

    .benefit-icon {
      color: var(--secondary);
      font-size: 1.3rem;
      margin-top: 2px;
    }

    .benefit-content h4 {
      font-size: 1.05rem;
      color: ${themeName === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
      margin-bottom: 4px;
    }

    .benefit-content p {
      font-size: 0.88rem;
      color: ${themeName === 'elegant' ? 'var(--text-on-dark)' : '#475569'};
    }

    /* Como Funciona / Processo */
    .process-section {
      padding: 80px 0;
      background-color: ${themeName === 'elegant' ? '#0b0f19' : 'var(--light)'};
      border-bottom: var(--border);
    }

    .process-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    @media (max-width: 768px) {
      .process-grid {
        grid-template-columns: 1fr;
        gap: 30px;
      }
    }

    .process-card {
      background-color: ${themeName === 'elegant' ? '#111827' : 'white'};
      color: ${themeName === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
      padding: 35px 24px;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: var(--border);
      position: relative;
      text-align: center;
      transition: all 0.3s;
    }

    .process-card:hover {
      transform: translateY(-4px);
    }

    .process-badge {
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background-color: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.1rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .process-card h3 {
      font-size: 1.15rem;
      margin-top: 15px;
      margin-bottom: 10px;
      color: ${themeName === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
    }

    .process-card p {
      font-size: 0.88rem;
      color: ${themeName === 'elegant' ? 'var(--text-on-dark)' : '#475569'};
    }

    /* Depoimentos */
    .testimonials-section {
      padding: 80px 0;
      background-color: ${themeName === 'elegant' ? '#0b0f19' : 'var(--light)'};
      border-bottom: var(--border);
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .testimonial-card {
      background-color: ${themeName === 'elegant' ? '#111827' : 'white'};
      color: ${themeName === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
      padding: 30px 24px;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: var(--border);
      text-align: left;
    }

    .testimonial-card .rating {
      color: #fbbf24;
      margin-bottom: 12px;
      display: flex;
      gap: 2px;
    }

    .testimonial-card .quote {
      font-style: italic;
      font-size: 0.95rem;
      margin-bottom: 20px;
    }

    .testimonial-card .client-info {
      display: flex;
      flex-direction: column;
    }

    .testimonial-card .client-info strong {
      font-size: 0.95rem;
      color: ${themeName === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
    }

    .testimonial-card .client-info span {
      font-size: 0.8rem;
      color: ${themeName === 'elegant' ? '#94a3b8' : '#64748b'};
    }

    /* FAQ Seção */
    .faq-section {
      padding: 80px 0;
      background-color: ${themeName === 'elegant' ? '#111827' : 'white'};
      color: ${themeName === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
      border-bottom: var(--border);
    }

    .faq-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .faq-item {
      background-color: ${themeName === 'elegant' ? '#0b0f19' : 'var(--light)'};
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: var(--border);
      overflow: hidden;
      transition: all 0.3s ease;
      text-align: left;
    }

    .faq-question {
      width: 100%;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: none;
      border: none;
      font-size: 1.05rem;
      font-weight: 700;
      color: ${themeName === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
      text-align: left;
      cursor: pointer;
      gap: 15px;
      font-family: var(--font-family);
    }

    .faq-question:hover {
      opacity: 0.85;
    }

    .faq-toggle-icon {
      font-size: 0.9rem;
      color: var(--primary);
    }

    .faq-answer-wrapper {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s cubic-bezier(0, 1, 0, 1), opacity 0.3s;
      opacity: 0;
    }

    .faq-answer {
      padding: 0 24px 20px 24px;
      font-size: 0.92rem;
      line-height: 1.6;
      opacity: 0.9;
    }

    /* Galeria */
    .gallery-section {
      padding: 80px 0;
      background-color: ${themeName === 'elegant' ? '#111827' : 'white'};
      border-bottom: var(--border);
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .gallery-item {
      aspect-ratio: 1/1;
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: var(--shadow);
      border: var(--border);
      background-color: #e5e7eb;
      transition: all 0.3s ease;
    }

    .gallery-item:hover {
      transform: scale(1.03);
    }

    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Seção CTA Final */
    .cta-final-section {
      background-color: var(--dark);
      color: white;
      text-align: center;
      padding: 100px 0;
      border-bottom: var(--border);
    }

    .cta-final-section h2 {
      font-size: 2.5rem;
      margin-bottom: 16px;
    }

    .cta-final-section p {
      font-size: 1.15rem;
      margin-bottom: 35px;
      opacity: 0.8;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Rodapé */
    footer {
      background-color: #111827;
      color: rgba(255, 255, 255, 0.6);
      padding: 50px 0 30px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 30px;
      }
    }

    .footer-brand h3 {
      color: white;
      font-size: 1.4rem;
      font-weight: 800;
      margin-bottom: 15px;
    }

    .footer-links h4,
    .footer-contact h4 {
      color: white;
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .footer-links ul {
      list-style: none;
    }

    .footer-links ul li {
      margin-bottom: 10px;
    }

    .footer-links ul li a {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      transition: color 0.3s;
    }

    .footer-links ul li a:hover {
      color: var(--primary);
    }

    .footer-contact p {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.88rem;
    }

    .footer-contact p i {
      color: var(--primary);
    }

    .footer-social-icons {
      display: flex;
      gap: 15px;
      margin-top: 20px;
    }

    .footer-social-icons a {
      color: white;
      background-color: rgba(255, 255, 255, 0.08);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }

    .footer-social-icons a:hover {
      background-color: var(--primary);
      transform: translateY(-2px);
    }

    .footer-bottom {
      text-align: center;
      padding-top: 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.85rem;
    }
  </style>
</head>
<body>

  <!-- Cabeçalho -->
  <header class="fade-in">
    <div class="container nav-container">
      <div class="logo">${businessName}</div>
      <a href="${waUrl}" target="_blank" class="btn btn-sm">
        Falar no WhatsApp
      </a>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero-section fade-in">
    <div class="container">
      ${hero.trustBadge ? `<div class="trust-badge"><i class="fa-solid fa-award"></i> ${hero.trustBadge}</div>` : ''}
      <h1>${hero.headline}</h1>
      <p>${hero.subheadline}</p>
      <a href="${waUrl}" target="_blank" class="btn btn-lg">
        ${hero.ctaText}
        <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>
  </section>

  <!-- Ticker / Marquee Corrediço Infinito -->
  ${tickerWords && tickerWords.length > 0 ? `
  <div class="ticker-wrapper">
    <div class="ticker-track">
      ${Array.from({ length: 4 }).map(() => `
        <div class="ticker-group">
          ${tickerWords.map(word => `
            <span><span class="bullet">•</span> ${word.toUpperCase()}</span>
          `).join('')}
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}


  <!-- Dores do Cliente (Pain Points) -->
  ${painPoints && painPoints.length > 0 ? `
  <section class="pain-points-section fade-in">
    <div class="container">
      <h2 class="section-title">Você se identifica com algum destes problemas?</h2>
      <div class="pain-grid">
        ${painPoints.map(pain => `
          <div class="pain-card">
            <div class="pain-icon">
              <i class="fa-solid fa-circle-question"></i>
            </div>
            <p>${pain}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Seção Sobre -->
  <section class="about-section fade-in">
    <div class="container">
      <div class="grid">
        <div class="about-image">
          <img src="${resolveImage(images[0], 0)}" alt="Sobre ${businessName}" />
        </div>
        <div class="about-content">
          <h2>${about.title || 'Sobre Nós'}</h2>
          ${about.paragraphs?.map(p => `<p>${p}</p>`).join('')}
          <a href="${waUrl}" target="_blank" class="btn" style="margin-top: 15px;">
            Falar Conosco
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Serviços -->
  ${services.length > 0 ? `
  <section class="services-section fade-in">
    <div class="container">
      <h2 class="section-title">Nossos Serviços</h2>
      <div class="services-grid">
        ${servicesHTML}
      </div>
    </div>
  </section>` : ''}

  <!-- Benefícios / Diferenciais -->
  ${benefits.length > 0 ? `
  <section class="benefits-section fade-in">
    <div class="container">
      <div class="grid">
        <div class="benefits-content">
          <h2>Por que nos escolher?</h2>
          <p class="intro">Entregamos o melhor serviço focado nas suas necessidades reais.</p>
          <div class="benefits-list">
            ${benefitsHTML}
          </div>
        </div>
        <div class="about-image">
          <img src="${resolveImage(images[1], 1)}" alt="Por que escolher ${businessName}" />
        </div>
      </div>
    </div>
  </section>` : ''}

  <!-- Como Funciona / Processo -->
  ${processSteps.length > 0 ? `
  <section class="process-section fade-in">
    <div class="container">
      <h2 class="section-title">Como Funciona Nosso Atendimento</h2>
      <div class="process-grid">
        ${processHTML}
      </div>
    </div>
  </section>` : ''}

  <!-- Galeria de Fotos -->
  ${galleryHTML}

  <!-- Depoimentos -->
  ${testimonials.length > 0 ? `
  <section class="testimonials-section fade-in">
    <div class="container">
      <h2 class="section-title">O Que Dizem Nossos Clientes</h2>
      <div class="testimonials-grid">
        ${testimonialsHTML}
      </div>
    </div>
  </section>` : ''}

  <!-- FAQ Seção acordeão -->
  ${faq.length > 0 ? `
  <section class="faq-section fade-in">
    <div class="container faq-container">
      <h2 class="section-title">Dúvidas Frequentes</h2>
      <div class="faq-list">
        ${faqHTML}
      </div>
    </div>
  </section>` : ''}

  <!-- Seção CTA Final -->
  <section class="cta-final-section fade-in">
    <div class="container">
      <h2>${ctaSection.title}</h2>
      <p>${ctaSection.subtitle}</p>
      <a href="${waUrl}" target="_blank" class="btn btn-lg">
        ${ctaSection.buttonText}
        <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>
  </section>

  <!-- Rodapé -->
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <h3>${businessName}</h3>
          <p>${tagline}</p>
          <div class="footer-social-icons">
            <a href="${instaUrl}" target="_blank"><i class="fa-brands fa-instagram"></i></a>
            <a href="${waUrl}" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>
        <div class="footer-links">
          <h4>Navegação</h4>
          <ul>
            <li><a href="#">Início</a></li>
            <li><a href="#">Sobre</a></li>
            <li><a href="#">Serviços</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h4>Contato</h4>
          ${contacts?.phone ? `<p><i class="fa-solid fa-phone"></i> ${contacts.phone}</p>` : ''}
          ${contacts?.email ? `<p><i class="fa-solid fa-envelope"></i> ${contacts.email}</p>` : ''}
          ${contacts?.address ? `<p><i class="fa-solid fa-location-dot"></i> ${contacts.address}</p>` : ''}
          ${contacts?.openingHours ? `<p><i class="fa-solid fa-clock"></i> ${contacts.openingHours}</p>` : ''}
          ${contacts?.paymentMethods && contacts.paymentMethods.length > 0 ? `<p><i class="fa-solid fa-credit-card"></i> Pagamentos: ${contacts.paymentMethods.join(', ')}</p>` : ''}
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${businessName}. Todos os direitos reservados. Landing page gerada via IA.</p>
      </div>
    </div>
  </footer>

  <!-- Lógica do FAQ Acordeão -->
  <script>
    document.querySelectorAll('.faq-question').forEach(button => {
      button.addEventListener('click', () => {
        const item = button.parentElement;
        const wrapper = button.nextElementSibling;
        const icon = button.querySelector('.faq-toggle-icon');
        const isOpen = item.classList.contains('active');
        
        // Fechar todos os itens abertos
        document.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('active');
          const w = i.querySelector('.faq-answer-wrapper');
          if (w) w.style.maxHeight = null;
          const ic = i.querySelector('.faq-toggle-icon');
          if (ic) {
            ic.className = 'fa-solid fa-plus faq-toggle-icon';
          }
        });
        
        // Se o clicado não estava aberto, abra-o
        if (!isOpen) {
          item.classList.add('active');
          wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
          icon.className = 'fa-solid fa-minus faq-toggle-icon';
        }
      });
    });
  </script>
</body>
</html>`;
}

/**
 * Gera o código do componente React + Styled Components
 */
export function generateReactCode(data, images = []) {
  const { 
    businessName, 
    tagline, 
    theme = {}, 
    hero = {}, 
    about = {}, 
    services = [], 
    benefits = [], 
    painPoints = [],
    processSteps = [], 
    testimonials = [], 
    faq = [], 
    ctaSection = {}, 
    contacts = {}, 
    whatsappMessage,
    tickerWords = []
  } = data;

  const themeName = theme.themeName || 'minimalist';
  const primaryFont = theme.fontFamily || 'Inter';
  const secondaryFont = theme.secondaryFontFamily || 'Inter';

  const cleanData = {
    ...data,
    testimonials: (data.testimonials || []).filter(t => !t.isPlaceholder)
  };
  const serializedImages = JSON.stringify(images);
  const serializedData = JSON.stringify(cleanData, null, 2);

  const faIconsSet = new Set(['FaArrowRight', 'FaWhatsapp', 'FaInstagram', 'FaPhone', 'FaEnvelope', 'FaMapMarkerAlt', 'FaCheckCircle', 'FaStar', 'FaAward', 'FaPlus', 'FaMinus', 'FaQuestionCircle']);
  const giIconsSet = new Set();

  services.forEach(s => {
    if (s.icon) {
      if (s.icon.startsWith('Gi')) {
        giIconsSet.add(s.icon);
      } else {
        faIconsSet.add(s.icon);
      }
    }
  });

  const faImports = Array.from(faIconsSet).join(',\n  ');
  const giImports = giIconsSet.size > 0 
    ? `import { \n  ${Array.from(giIconsSet).join(',\n  ')} \n} from 'react-icons/gi';` 
    : '';

  return `import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  ${faImports} 
} from 'react-icons/fa';
${giImports}

// Dados embutidos gerados pela IA
const LP_DATA = ${serializedData};
const LP_IMAGES = ${serializedImages};

// Componente SafeIcon local
const SafeIcon = ({ name, className }) => {
  const icons = {
    FaArrowRight, FaWhatsapp, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheckCircle, FaStar, FaAward, FaPlus, FaMinus, FaQuestionCircle,
    ${Array.from(giIconsSet).map(i => `${i}: ${i}`).join(',\n    ')}${giIconsSet.size > 0 ? ',\n    ' : ''}${services.filter(s => s.icon && !s.icon.startsWith('Gi')).map(s => `${s.icon}: ${s.icon}`).join(',\n    ')}
  };
  
  const normalizedName = name ? name.trim() : '';
  const iconMap = {
    'GiScissors': 'GiScissors', 'FaScissors': 'FaCut', 'Scissors': 'GiScissors', 'Tesoura': 'GiScissors', 'Cut': 'FaCut',
    'GiComb': 'GiComb', 'Comb': 'GiComb', 'Pente': 'GiComb',
    'GiBeard': 'GiBeard', 'Beard': 'GiBeard', 'Barba': 'GiBeard',
    'GiRazor': 'GiRazor', 'Razor': 'GiRazor', 'Navalha': 'GiRazor',
    'GiMustache': 'GiMustache', 'Mustache': 'GiMustache', 'Bigode': 'GiMustache',
    'FaGem': 'FaGem', 'Gem': 'FaGem', 'Joia': 'FaGem',
    'FaSparkles': 'FaSparkles', 'Sparkles': 'FaSparkles', 'Brilho': 'FaSparkles',
    'FaHeart': 'FaHeart', 'Heart': 'FaHeart', 'Coração': 'FaHeart',
    'FaSmile': 'FaSmile', 'Smile': 'FaSmile', 'Sorriso': 'FaSmile',
    'FaHandshake': 'FaHandshake', 'Handshake': 'FaHandshake', 'Aperto de mão': 'FaHandshake',
    'FaUserCheck': 'FaUserCheck', 'UserCheck': 'FaUserCheck',
    'FaAward': 'FaAward', 'Award': 'FaAward', 'Prêmio': 'FaAward',
    'FaShieldAlt': 'FaShieldAlt', 'Shield': 'FaShieldAlt', 'Segurança': 'FaShieldAlt',
    'FaClock': 'FaClock', 'Clock': 'FaClock', 'Tempo': 'FaClock',
    'FaMapMarkerAlt': 'FaMapMarkerAlt', 'MapMarker': 'FaMapMarkerAlt',
    'FaCalendarCheck': 'FaCalendarCheck', 'Calendar': 'FaCalendarCheck',
    'FaStar': 'FaStar', 'Star': 'FaStar', 'Estrela': 'FaStar',
  };

  const resolvedName = iconMap[normalizedName] || normalizedName;
  const IconComponent = icons[resolvedName] || icons[name] || FaStar;
  return <IconComponent className={className} style={{ width: '1.5rem', height: '1.5rem', display: 'block' }} />;
};

export default function GeneratedLandingPage() {
  const { 
    businessName, 
    tagline, 
    theme = {}, 
    hero = {}, 
    about = {}, 
    services = [], 
    benefits = [], 
    painPoints = [],
    processSteps = [], 
    testimonials = [], 
    faq = [], 
    ctaSection = {}, 
    contacts = {}, 
    whatsappMessage 
  } = LP_DATA;

  const [activeIndex, setActiveIndex] = useState(null);

  const phoneFormatted = contacts?.phone ? contacts.phone.replace(/\\D/g, '') : '';
  const waUrl = \`https://wa.me/\${phoneFormatted}?text=\${encodeURIComponent(whatsappMessage || '')}\`;
  const instaUrl = contacts?.instagram ? (contacts.instagram.startsWith('http') ? contacts.instagram : \`https://instagram.com/\${contacts.instagram.replace('@', '')}\`) : '#';

  // Carregar fontes do Google dinamicamente
  useEffect(() => {
    const primaryFont = theme.fontFamily || 'Inter';
    const secondaryFont = theme.secondaryFontFamily || 'Inter';
    const fontsToLoad = [primaryFont];
    
    if (secondaryFont && secondaryFont !== primaryFont) {
      fontsToLoad.push(secondaryFont);
    }
    
    const linkId = 'dynamic-google-fonts';
    let linkElement = document.getElementById(linkId);
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.id = linkId;
      linkElement.rel = 'stylesheet';
      document.head.appendChild(linkElement);
    }
    
    const fontQuery = fontsToLoad.map(f => f.replace(/\\s+/g, '+')).join('&family=');
    linkElement.href = \`https://fonts.googleapis.com/css2?family=\${fontQuery}:wght@300;400;500;600;700;800&display=swap\`;
  }, []);

  const toggleFaq = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <Wrapper>
      {/* Cabeçalho */}
      <Header className="fade-in">
        <div className="container header-container">
          <Logo className="logo">\${businessName}</Logo>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
            Falar no WhatsApp
          </a>
        </div>
      </Header>

      {/* Hero Section */}
      <HeroSection className="fade-in">
        <div className="container">
          {hero.trustBadge && (
            <div className="trust-badge">
              <SafeIcon name="FaAward" /> {hero.trustBadge}
            </div>
          )}
          <h1 dangerouslySetInnerHTML={{ __html: hero.headline }} />
          <p>{hero.subheadline}</p>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg">
            {hero.ctaText}
            <SafeIcon name="FaArrowRight" />
          </a>
        </div>
      </HeroSection>

      {/* Ticker / Marquee Corrediço Infinito */}
      {LP_DATA.tickerWords && LP_DATA.tickerWords.length > 0 && (
        <TickerWrapper>
          <div className="ticker-track">
            {Array.from({ length: 4 }).map((_, rIdx) => (
              <div className="ticker-group" key={rIdx}>
                {LP_DATA.tickerWords.map((word, wIdx) => (
                  <span key={wIdx}>
                    <span className="bullet">•</span> {word.toUpperCase()}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </TickerWrapper>
      )}


      {/* Seção de Dores (Pain Points) */}
      {painPoints && painPoints.length > 0 && (
        <PainPointsSection className="fade-in">
          <div className="container">
            <h2 className="section-title">Você se identifica com algum destes problemas?</h2>
            <div className="pain-grid">
              {painPoints.map((pain, idx) => (
                <div className="pain-card" key={idx}>
                  <div className="pain-icon">
                    <SafeIcon name="FaQuestionCircle" />
                  </div>
                  <p>{pain}</p>
                </div>
              ))}
            </div>
          </div>
        </PainPointsSection>
      )}

      {/* Sobre Nós */}
      <AboutSection className="fade-in">
        <div className="container grid">
          <div className="about-image">
            <img src={LP_IMAGES[0] || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'} alt="Sobre nós" />
          </div>
          <div className="about-content">
            <h2>{about.title || 'Sobre Nós'}</h2>
            {about.paragraphs?.map((p, idx) => <p key={idx}>{p}</p>)}
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ marginTop: '15px' }}>
              Falar Conosco
            </a>
          </div>
        </div>
      </AboutSection>

      {/* Serviços */}
      {services.length > 0 && (
        <ServicesSection className="fade-in">
          <div className="container">
            <h2 className="section-title">Nossos Serviços</h2>
            <div className="services-grid">
              {services.map((s, idx) => (
                <div className="service-card" key={idx}>
                  <div className="service-icon">
                    <SafeIcon name={s.icon} />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  {s.targetResult && <span className="target-result">🎯 {s.targetResult}</span>}
                </div>
              ))}
            </div>
          </div>
        </ServicesSection>
      )}

      {/* Diferenciais */}
      {benefits.length > 0 && (
        <BenefitsSection className="fade-in">
          <div className="container grid">
            <div className="benefits-content">
              <h2>Por que nos escolher?</h2>
              <p className="intro">Entregamos o melhor serviço focado nas suas necessidades reais.</p>
              <div className="benefits-list">
                {benefits.map((b, idx) => (
                  <div className="benefit-item" key={idx}>
                    <div className="benefit-icon">
                      <SafeIcon name="FaCheckCircle" />
                    </div>
                    <div className="benefit-text">
                      <h4>{b.title}</h4>
                      <p>{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-image">
              <img src={LP_IMAGES[1] || 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'} alt="Diferenciais" />
            </div>
          </div>
        </BenefitsSection>
      )}

      {/* Como Funciona */}
      {processSteps.length > 0 && (
        <ProcessSection className="fade-in">
          <div className="container">
            <h2 className="section-title">Como Funciona Nosso Atendimento</h2>
            <div className="process-grid">
              {processSteps.map((step, idx) => (
                <div className="process-card" key={idx}>
                  <div className="process-badge">{step.step || \`0\${idx + 1}\`}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </ProcessSection>
      )}

      {/* Galeria de Fotos */}
      {LP_IMAGES.length > 0 && (
        <GallerySection className="fade-in">
          <div className="container">
            <h2 className="section-title">Galeria de Fotos</h2>
            <div className="gallery-grid">
              {LP_IMAGES.map((img, idx) => (
                <div className="gallery-item" key={idx}>
                  <img src={img} alt={\`Galeria \${idx + 1}\`} />
                </div>
              ))}
            </div>
          </div>
        </GallerySection>
      )}

      {/* Depoimentos */}
      {testimonials.length > 0 ? (
        <TestimonialsSection className="fade-in">
          <div className="container">
            <h2 className="section-title">O Que Dizem Nossos Clientes</h2>
            <div className="testimonials-grid">
              {testimonials.map((t, idx) => (
                <div className="testimonial-card" key={idx}>
                  <div className="rating">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => <SafeIcon name="FaStar" key={i} />)}
                  </div>
                  <p className="quote">"{t.text}"</p>
                  <div className="client-info">
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TestimonialsSection>
      ) : (
        <TestimonialsSection className="fade-in">
          <div className="container">
            {/* ATENÇÃO: adicione aqui depoimentos reais dos seus clientes */}
          </div>
        </TestimonialsSection>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <FaqSection className="fade-in">
          <div className="container faq-container">
            <h2 className="section-title">Dúvidas Frequentes</h2>
            <div className="faq-list">
              {faq.map((item, idx) => {
                const isOpen = activeIndex === idx;
                return (
                  <div className={\`faq-item \${isOpen ? 'active' : ''}\`} key={idx}>
                    <button className="faq-question" onClick={() => toggleFaq(idx)}>
                      <span>{item.question}</span>
                      <SafeIcon name={isOpen ? "FaMinus" : "FaPlus"} className="faq-toggle-icon" />
                    </button>
                    <div className="faq-answer-wrapper">
                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FaqSection>
      )}

      {/* CTA Final */}
      <CtaFinalSection className="fade-in">
        <div className="container">
          <h2 dangerouslySetInnerHTML={{ __html: ctaSection.title }} />
          <p>{ctaSection.subtitle}</p>

          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg">
            {ctaSection.buttonText}
            <SafeIcon name="FaArrowRight" />
          </a>
        </div>
      </CtaFinalSection>

      {/* Rodapé */}
      <Footer>
        <div className="container grid-footer">
          <div className="footer-brand">
            <h3>{businessName}</h3>
            <p>{tagline}</p>
            <div className="social-icons">
              <a href={instaUrl} target="_blank" rel="noopener noreferrer"><SafeIcon name="FaInstagram" /></a>
              <a href={waUrl} target="_blank" rel="noopener noreferrer"><SafeIcon name="FaWhatsapp" /></a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Navegação</h4>
            <ul>
              <li><a href="#">Início</a></li>
              <li><a href="#">Sobre</a></li>
              <li><a href="#">Serviços</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contato</h4>
            {contacts?.phone && <p><SafeIcon name="FaPhone" /> {contacts.phone}</p>}
            {contacts?.email && <p><SafeIcon name="FaEnvelope" /> {contacts.email}</p>}
            {contacts?.address && <p><SafeIcon name="FaMapMarkerAlt" /> {contacts.address}</p>}
            {contacts?.openingHours && <p><SafeIcon name="FaClock" /> {contacts.openingHours}</p>}
            {contacts?.paymentMethods && contacts.paymentMethods.length > 0 && <p><SafeIcon name="FaCreditCard" /> Pagamentos: {contacts.paymentMethods.join(', ')}</p>}
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {businessName}. Todos os direitos reservados.</p>
        </div>
      </Footer>
    </Wrapper>
  );
}

const fadeInUp = keyframes\`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
\`;

const tickerScroll = keyframes\`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
\`;


// Styled Components
const Wrapper = styled.div\`
  --primary: \${theme.primaryColor || '#3B82F6'};
  --secondary: \${theme.secondaryColor || '#10B981'};
  --dark: \${theme.darkColor || '#1F2937'};
  --light: \${theme.lightColor || '#F9FAFB'};
  --text: \${theme.textColor || '#374151'};
  --text-on-light: \${theme.textColor || '#334155'};
  --title-on-light: \${theme.textColor || '#0f172a'};
  --text-on-dark: \${theme.textColorOnDark || '#cbd5e1'};
  --title-on-dark: \${theme.textColorOnDark || '#ffffff'};
  
  font-family: '\${secondaryFont}', sans-serif;
  color: var(--text-on-light);
  background-color: var(--light);
  line-height: 1.6;
  text-align: left;

  /* Estilos específicos baseados no tema */
  \${'${themeName}' === 'minimalist' && \`
    --radius: 4px;
    --shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    --border: 1px solid rgba(0, 0, 0, 0.08);
    h1, h2, h3, .logo {
      font-family: '${primaryFont}', serif;
      font-weight: 700;
      letter-spacing: -0.2px;
    }
  \`}

  \${'${themeName}' === 'bold' && \`
    --radius: 0px;
    --shadow: 4px 4px 0px var(--dark);
    --border: 2px solid var(--dark);
    h1, h2, h3, .logo {
      font-family: '${primaryFont}', sans-serif;
      font-weight: 800;
      letter-spacing: -1px;
    }
    h1 {
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .btn {
      border: 2px solid var(--dark);
    }
    .btn:hover {
      box-shadow: 2px 2px 0px var(--dark);
    }
    .service-icon, .process-badge, .trust-badge {
      border: 2px solid var(--dark);
    }
  \`}

  \${'${themeName}' === 'elegant' && \`
    --radius: 8px;
    --shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
    --border: 1px solid rgba(197, 168, 128, 0.2);
    h1, h2, h3, .logo {
      font-family: '${primaryFont}', serif;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .hero-section, .about-section, .services-section, .benefits-section, .process-section, .gallery-section, .testimonials-section, .faq-section {
      border-bottom: var(--border);
    }
  \`}

  \${'${themeName}' === 'friendly' && \`
    --radius: 24px;
    --shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
    --border: 1px solid rgba(0, 0, 0, 0.05);
    h1, h2, h3, .logo {
      font-family: '${primaryFont}', sans-serif;
      font-weight: 700;
      letter-spacing: 0px;
    }
    .service-icon {
      border-radius: 16px;
    }
  \`}

  --radius: \${'${themeName}' === 'minimalist' ? '4px' : '${themeName}' === 'bold' ? '0px' : '${themeName}' === 'elegant' ? '8px' : '24px'};
  --shadow: \${'${themeName}' === 'minimalist' ? '0 2px 6px rgba(0, 0, 0, 0.03)' : '${themeName}' === 'bold' ? '4px 4px 0px var(--dark)' : '${themeName}' === 'elegant' ? '0 10px 30px rgba(0,0,0,0.05)' : '0 8px 24px rgba(0, 0, 0, 0.04)'};
  --border: \${'${themeName}' === 'bold' ? '2px solid var(--dark)' : '1px solid rgba(0, 0, 0, 0.06)'};

  .container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 30px;
    }
  }

  .fade-in {
    animation: \${fadeInUp} 0.8s ease forwards;
  }

  .destaque {
    color: var(--primary);
    font-weight: 800;
  }

  \${'${themeName}' === 'elegant' && \`
    .destaque {
      color: var(--secondary) !important;
      background: linear-gradient(135deg, #c5a880 0%, #e2d1b9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
    }
  \`}

  \${'${themeName}' === 'bold' && \`
    .destaque {
      background-color: var(--secondary);
      color: var(--dark) !important;
      padding: 0px 8px;
      transform: rotate(-1deg);
      display: inline-block;
      box-shadow: 2px 2px 0px var(--dark);
      -webkit-text-fill-color: var(--dark) !important;
      -webkit-background-clip: unset !important;
    }
  \`}

  \${'${themeName}' === 'minimalist' && \`
    .destaque {
      font-style: italic;
      color: var(--primary);
      font-family: serif;
      border-bottom: 2px solid var(--secondary);
    }
  \`}

  \${'${themeName}' === 'friendly' && \`
    .destaque {
      color: var(--primary);
      border-bottom: 3px dashed var(--secondary);
      border-radius: 4px;
      padding: 0 4px;
    }
  \`}


  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: var(--primary);
    color: white;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    padding: 12px 24px;
    border-radius: \${'${themeName}' === 'bold' ? '0px' : '50px'};
    box-shadow: var(--shadow);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    cursor: pointer;

    &:hover {
      background-color: var(--secondary);
      transform: translateY(-2px);
      box-shadow: \${'${themeName}' === 'bold' ? '2px 2px 0px var(--dark)' : '0 6px 15px rgba(0, 0, 0, 0.12)'};
    }
  }

  .btn-lg {
    padding: 14px 30px;
    font-size: 1.05rem;
  }

  .btn-sm {
    padding: 7px 15px;
    font-size: 0.85rem;
  }
\`;

const Header = styled.header\`
  background-color: \${'${themeName}' === 'elegant' ? 'rgba(10, 7, 18, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 14px 0;

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
\`;

const Logo = styled.div\`
  font-size: 1.35rem;
  font-weight: 800;
  color: \${'${themeName}' === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
  letter-spacing: -0.5px;
\`;

const HeroSection = styled.section\`
  background: \${'${themeName}' === 'elegant' 
    ? 'radial-gradient(circle at center, rgba(30, 20, 50, 0.95) 0%, rgba(6, 4, 10, 1) 100%)' 
    : 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(240,244,248,0.7) 100%)'};
  color: \${'${themeName}' === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
  padding: 100px 0;
  text-align: center;
  border-bottom: var(--border);

  h1 {
    font-size: 3.2rem;
    line-height: 1.2;
    margin-bottom: 20px;
    color: \${'${themeName}' === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};

    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
  }

  p {
    font-size: 1.2rem;
    max-width: 650px;
    margin: 0 auto 30px auto;
    opacity: 0.95;
  }

  .trust-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background-color: \${'${themeName}' === 'elegant' ? 'rgba(197, 168, 128, 0.15)' : 'color-mix(in srgb, var(--primary) 10%, transparent)'};
    color: \${'${themeName}' === 'elegant' ? '#c5a880' : 'var(--primary)'};
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 24px;
    border: \${'${themeName}' === 'bold' ? '2px solid var(--dark)' : 'none'};
  }
\`;

const TickerWrapper = styled.div\`
  background-color: var(--dark);
  color: white;
  padding: 16px 0;
  overflow: hidden;
  white-space: nowrap;
  border-bottom: var(--border);
  display: flex;

  .ticker-track {
    display: flex;
    width: max-content;
    animation: \${tickerScroll} 25s linear infinite;
  }

  .ticker-group {
    display: flex;
    align-items: center;
    gap: 40px;
    padding-right: 40px;
  }

  span {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 800;
    font-size: 1.1rem;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .bullet {
    color: var(--secondary);
    font-size: 1.5rem;
  }
\`;


const AboutSection = styled.section\`
  padding: 80px 0;
  background-color: \${'${themeName}' === 'elegant' ? '#0d0a16' : 'white'};
  color: \${'${themeName}' === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
  border-bottom: var(--border);

  .about-image {
    width: 100%;
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    border: var(--border);
    aspect-ratio: 4/3;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover img {
      transform: scale(1.06);
    }
  }

  .about-content {
    h2 {
      font-size: 2rem;
      color: \${'${themeName}' === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
      margin-bottom: 20px;
    }

    p {
      margin-bottom: 16px;
      font-size: 0.98rem;
      opacity: 0.95;
    }
  }
\`;

const PainPointsSection = styled.section\`
  padding: 80px 0;
  background-color: \${'${themeName}' === 'elegant' ? '#0a0712' : 'var(--light)'};
  border-bottom: var(--border);

  .section-title {
    text-align: center;
    font-size: 2rem;
    color: \${'${themeName}' === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
    margin-bottom: 40px;
  }

  .pain-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .pain-card {
    background-color: \${'${themeName}' === 'elegant' ? 'rgba(255, 255, 255, 0.03)' : 'white'};
    backdrop-filter: \${'${themeName}' === 'elegant' ? 'blur(10px)' : 'none'};
    color: \${'${themeName}' === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
    padding: 30px 24px;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    border: var(--border);
    display: flex;
    gap: 16px;
    align-items: flex-start;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-4px);
      box-shadow: \${'${themeName}' === 'bold' ? '6px 6px 0px var(--dark)' : '0 8px 25px rgba(0, 0, 0, 0.08)'};
    }

    p {
      font-size: 0.95rem;
      font-weight: 500;
      line-height: 1.5;
    }
  }

  .pain-icon {
    color: \${'${themeName}' === 'elegant' ? '#c5a880' : '#ef4444'};
    font-size: 1.5rem;
    flex-shrink: 0;
  }
\`;


const ServicesSection = styled.section\`
  padding: 80px 0;
  background-color: \${'${themeName}' === 'elegant' ? '#0b0f19' : 'var(--light)'};
  border-bottom: var(--border);

  .section-title {
    text-align: center;
    font-size: 2rem;
    color: \${'${themeName}' === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
    margin-bottom: 40px;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .service-card {
    background-color: \${'${themeName}' === 'elegant' ? '#111827' : 'white'};
    color: \${'${themeName}' === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
    padding: 30px 24px;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    border: var(--border);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: \${'${themeName}' === 'bold' ? '6px 6px 0px var(--dark)' : '0 8px 25px rgba(0, 0, 0, 0.08)'};
    }

    h3 {
      font-size: 1.2rem;
      color: \${'${themeName}' === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
      margin-bottom: 10px;
    }

    p {
      font-size: 0.9rem;
      opacity: 0.85;
    }

    .target-result {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--secondary);
      margin-top: 8px;
      background: rgba(16, 185, 129, 0.08);
      padding: 2px 8px;
      border-radius: 4px;
    }
  }

  .service-icon {
    width: 50px;
    height: 50px;
    background-color: color-mix(in srgb, var(--primary) 10%, transparent);
    color: var(--primary);
    border-radius: \${'${themeName}' === 'friendly' ? '16px' : '8px'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    margin-bottom: 20px;
  }
\`;

const BenefitsSection = styled.section\`
  padding: 80px 0;
  background-color: \${'${themeName}' === 'elegant' ? '#111827' : 'white'};
  color: \${'${themeName}' === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
  border-bottom: var(--border);

  .about-image {
    width: 100%;
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    border: var(--border);
    aspect-ratio: 4/3;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 768px) {
      order: -1;
    }
  }

  .benefits-content {
    h2 {
      font-size: 2rem;
      color: \${'${themeName}' === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
      margin-bottom: 10px;
    }

    .intro {
      font-size: 0.98rem;
      margin-bottom: 24px;
      opacity: 0.85;
    }
  }

  .benefits-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .benefit-item {
    display: flex;
    gap: 16px;
  }

  .benefit-icon {
    color: var(--secondary);
    font-size: 1.3rem;
    margin-top: 2px;
  }

  .benefit-text {
    h4 {
      font-size: 1.05rem;
      color: \${'${themeName}' === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
      margin-bottom: 4px;
    }

    p {
      font-size: 0.88rem;
      opacity: 0.8;
    }
  }
\`;

const ProcessSection = styled.section\`
  padding: 80px 0;
  background-color: \${'${themeName}' === 'elegant' ? '#0b0f19' : 'var(--light)'};
  border-bottom: var(--border);

  .section-title {
    text-align: center;
    font-size: 2rem;
    color: \${'${themeName}' === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
    margin-bottom: 40px;
  }

  .process-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 30px;
    }
  }

  .process-card {
    background-color: \${'${themeName}' === 'elegant' ? '#111827' : 'white'};
    color: \${'${themeName}' === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
    padding: 35px 24px;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    border: var(--border);
    position: relative;
    text-align: center;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
    }

    h3 {
      font-size: 1.15rem;
      margin-top: 15px;
      margin-bottom: 10px;
      color: \${'${themeName}' === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
    }

    p {
      font-size: 0.88rem;
      opacity: 0.85;
    }
  }

  .process-badge {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.1rem;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  }
\`;

const GallerySection = styled.section\`
  padding: 80px 0;
  background-color: \${'${themeName}' === 'elegant' ? '#111827' : 'white'};
  border-bottom: var(--border);

  .section-title {
    text-align: center;
    font-size: 2rem;
    color: \${'${themeName}' === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
    margin-bottom: 40px;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }

  .gallery-item {
    aspect-ratio: 1/1;
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    border: var(--border);
    background-color: #e5e7eb;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
\`;

const TestimonialsSection = styled.section\`
  padding: 80px 0;
  background-color: \${'${themeName}' === 'elegant' ? '#0b0f19' : 'var(--light)'};
  border-bottom: var(--border);

  .section-title {
    text-align: center;
    font-size: 2rem;
    color: \${'${themeName}' === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
    margin-bottom: 40px;
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .testimonial-card {
    background-color: \${'${themeName}' === 'elegant' ? '#111827' : 'white'};
    color: \${'${themeName}' === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
    padding: 30px 24px;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    border: var(--border);
    position: relative;

    .quote {
      font-style: italic;
      font-size: 0.95rem;
      margin-bottom: 20px;
    }

    .rating {
      color: #fbbf24;
      margin-bottom: 12px;
      display: flex;
      gap: 2px;
    }

    .client-info {
      display: flex;
      flex-direction: column;

      strong {
        font-size: 0.95rem;
        color: \${'${themeName}' === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
      }

      span {
        font-size: 0.8rem;
        opacity: 0.7;
      }
    }
  }
\`;

const FaqSection = styled.section\`
  padding: 80px 0;
  background-color: \${'${themeName}' === 'elegant' ? '#111827' : 'white'};
  color: \${'${themeName}' === 'elegant' ? 'var(--text-on-dark)' : 'var(--text-on-light)'};
  border-bottom: var(--border);

  .section-title {
    text-align: center;
    font-size: 2rem;
    color: \${'${themeName}' === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
    margin-bottom: 40px;
  }

  .faq-container {
    max-width: 800px;
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .faq-item {
    background-color: \${'${themeName}' === 'elegant' ? '#0b0f19' : 'var(--light)'};
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    border: var(--border);
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .faq-question {
    width: 100%;
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: none;
    border: none;
    font-size: 1.05rem;
    font-weight: 700;
    color: \${'${themeName}' === 'elegant' ? 'var(--title-on-dark)' : 'var(--title-on-light)'};
    text-align: left;
    cursor: pointer;
    gap: 15px;
  }

  .faq-toggle-icon {
    font-size: 0.9rem;
    color: var(--primary);
  }

  .faq-answer-wrapper {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s cubic-bezier(0, 1, 0, 1), opacity 0.3s;
    opacity: 0;
  }

  .faq-item.active .faq-answer-wrapper {
    max-height: 1000px;
    transition: max-height 0.3s cubic-bezier(1, 0, 1, 0), opacity 0.3s;
    opacity: 1;
  }

  .faq-answer {
    padding: 0 24px 20px 24px;
    font-size: 0.92rem;
    line-height: 1.6;
    opacity: 0.9;
  }
\`;

const CtaFinalSection = styled.section\`
  background-color: var(--dark);
  color: white;
  text-align: center;
  padding: 100px 0;
  border-bottom: var(--border);

  h2 {
    font-size: 2.2rem;
    margin-bottom: 12px;
  }

  p {
    font-size: 1.05rem;
    margin-bottom: 30px;
    opacity: 0.8;
    max-width: 550px;
    margin: 0 auto 30px auto;
  }
\`;

const Footer = styled.footer\`
  background-color: #111827;
  color: rgba(255, 255, 255, 0.6);
  padding: 50px 0 30px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  .grid-footer {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 30px;
    }
  }

  .footer-brand {
    h3 {
      color: white;
      font-size: 1.4rem;
      margin-bottom: 15px;
    }
  }

  .social-icons {
    display: flex;
    gap: 15px;
    margin-top: 20px;

    a {
      color: white;
      background-color: rgba(255, 255, 255, 0.08);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;

      &:hover {
        background-color: var(--primary);
        transform: translateY(-2px);
      }
    }
  }

  .footer-links, .footer-contact {
    h4 {
      color: white;
      font-size: 1rem;
      margin-bottom: 20px;
    }
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 10px;
      
      a {
        color: rgba(255, 255, 255, 0.6);
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
          color: var(--primary);
        }
      }
    }
  }

  .footer-contact {
    p {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 10px;

      svg {
        color: var(--primary);
      }
    }
  }

  .footer-bottom {
    text-align: center;
    padding-top: 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.85rem;
  }
\`;
`;
}
