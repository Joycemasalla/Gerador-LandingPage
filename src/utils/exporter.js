/**
 * Utilitário para exportar a Landing Page gerada pelo usuário.
 * Gera tanto um HTML único autônomo com estilos embutidos e CDN FontAwesome,
 * quanto o código fonte de componente React funcional com Styled Components.
 */

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
  const { businessName, tagline, theme, hero, about, services, benefits, ctaSection, contacts, whatsappMessage } = data;

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
        </div>
  `).join('');

  // Montar benefícios/diferenciais em HTML
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

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName} - ${tagline}</title>
  
  <!-- Fontes do Google -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${(theme.fontFamily || 'Inter').replace(/\s+/g, '+')}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- FontAwesome Ícones -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <style>
    :root {
      --primary: ${theme.primaryColor || '#3B82F6'};
      --secondary: ${theme.secondaryColor || '#10B981'};
      --dark: ${theme.darkColor || '#1F2937'};
      --light: ${theme.lightColor || '#F9FAFB'};
      --text: ${theme.textColor || '#374151'};
      --font-family: '${theme.fontFamily || 'Inter'}', sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-family);
      color: var(--text);
      background-color: var(--light);
      line-height: 1.6;
      overflow-x: hidden;
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Botão CTA Geral */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background-color: var(--primary);
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.05rem;
      padding: 14px 28px;
      border-radius: 50px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn:hover {
      background-color: var(--secondary);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    .btn i {
      font-size: 1.2rem;
    }

    /* Cabeçalho */
    header {
      background-color: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 16px 0;
    }

    header .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    header .logo {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--dark);
      letter-spacing: -0.5px;
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(240,244,248,1) 100%);
      padding: 80px 0 100px 0;
      text-align: center;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      width: 300px;
      height: 300px;
      background: var(--primary);
      opacity: 0.04;
      border-radius: 50%;
      top: -100px;
      left: -100px;
    }

    .hero-section::after {
      content: '';
      position: absolute;
      width: 400px;
      height: 400px;
      background: var(--secondary);
      opacity: 0.03;
      border-radius: 50%;
      bottom: -150px;
      right: -150px;
    }

    .hero-section h1 {
      font-size: 3rem;
      font-weight: 800;
      color: var(--dark);
      line-height: 1.2;
      margin-bottom: 20px;
      letter-spacing: -1px;
    }

    .hero-section p {
      font-size: 1.25rem;
      color: var(--text);
      max-width: 700px;
      margin: 0 auto 35px auto;
      opacity: 0.9;
    }

    /* Seção Sobre */
    .about-section {
      padding: 80px 0;
      background-color: white;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
      align-items: center;
    }

    .about-image {
      width: 100%;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      position: relative;
      aspect-ratio: 4/3;
      background-color: var(--light);
    }

    .about-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .about-image::after {
      content: '';
      position: absolute;
      inset: 0;
      border: 8px solid rgba(255,255,255,0.2);
      pointer-events: none;
      border-radius: 20px;
    }

    .about-content h2 {
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--dark);
      margin-bottom: 24px;
      letter-spacing: -0.5px;
    }

    .about-content p {
      margin-bottom: 18px;
      color: var(--text);
      font-size: 1.05rem;
    }

    /* Serviços Section */
    .services-section {
      padding: 80px 0;
      background-color: var(--light);
    }

    .section-title {
      text-align: center;
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--dark);
      margin-bottom: 48px;
      letter-spacing: -0.5px;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }

    .service-card {
      background-color: white;
      padding: 40px 30px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
      transition: all 0.3s ease;
      border: 1px solid rgba(0,0,0,0.02);
      text-align: left;
    }

    .service-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      border-color: rgba(var(--primary), 0.1);
    }

    .service-icon {
      width: 60px;
      height: 60px;
      background-color: rgba(59, 130, 246, 0.08); /* Fallback */
      background-color: color-mix(in srgb, var(--primary) 10%, transparent);
      color: var(--primary);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 24px;
    }

    .service-card h3 {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--dark);
      margin-bottom: 12px;
    }

    .service-card p {
      color: var(--text);
      font-size: 0.95rem;
      opacity: 0.85;
    }

    /* Diferenciais / Benefícios */
    .benefits-section {
      padding: 80px 0;
      background-color: white;
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
      align-items: center;
    }

    .benefits-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .benefit-item {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .benefit-icon {
      color: var(--secondary);
      font-size: 1.5rem;
      margin-top: 4px;
    }

    .benefit-content h4 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--dark);
      margin-bottom: 4px;
    }

    .benefit-content p {
      color: var(--text);
      font-size: 0.95rem;
      opacity: 0.85;
    }

    /* Galeria */
    .gallery-section {
      padding: 80px 0;
      background-color: var(--light);
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .gallery-item {
      aspect-ratio: 1/1;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      background-color: #e5e7eb;
      transition: all 0.3s ease;
    }

    .gallery-item:hover {
      transform: scale(1.03);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
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
      position: relative;
    }

    .cta-final-section h2 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 16px;
      letter-spacing: -0.5px;
    }

    .cta-final-section p {
      font-size: 1.15rem;
      margin-bottom: 35px;
      opacity: 0.8;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta-final-section .btn {
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
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
    }

    .footer-contact p i {
      color: var(--primary);
      width: 20px;
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

    /* Responsividade */
    @media (max-width: 992px) {
      .about-grid, .benefits-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }
      .about-image {
        order: -1;
      }
      .hero-section h1 {
        font-size: 2.3rem;
      }
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 30px;
      }
    }
  </style>
</head>
<body>

  <!-- Cabeçalho -->
  <header>
    <div class="container nav-container">
      <div class="logo">${businessName}</div>
      <a href="${waUrl}" target="_blank" class="btn btn-sm" style="padding: 8px 18px; font-size: 0.9rem;">
        Falar no WhatsApp
      </a>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero-section">
    <div class="container">
      <h1>${hero.headline}</h1>
      <p>${hero.subheadline}</p>
      <a href="${waUrl}" target="_blank" class="btn">
        ${hero.ctaText}
        <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>
  </section>

  <!-- Seção Sobre -->
  <section class="about-section">
    <div class="container">
      <div class="about-grid">
        <div class="about-image">
          <img src="${images[0] || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'}" alt="Sobre ${businessName}" />
        </div>
        <div class="about-content">
          <h2>${about.title || 'Sobre Nós'}</h2>
          ${about.paragraphs.map(p => `<p>${p}</p>`).join('')}
          <a href="${waUrl}" target="_blank" class="btn" style="margin-top: 15px;">
            Falar Conosco
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Serviços -->
  <section class="services-section">
    <div class="container">
      <h2 class="section-title">Nossos Serviços</h2>
      <div class="services-grid">
        ${servicesHTML}
      </div>
    </div>
  </section>

  <!-- Benefícios / Diferenciais -->
  <section class="benefits-section">
    <div class="container">
      <div class="benefits-grid">
        <div class="benefits-content">
          <h2 style="font-size: 2.25rem; font-weight: 800; color: var(--dark); margin-bottom: 10px;">Por que nos escolher?</h2>
          <p style="color: var(--text); font-size: 1.05rem; margin-bottom: 15px;">Entregamos o melhor serviço focado nas suas necessidades reais.</p>
          ${benefitsHTML}
        </div>
        <div class="about-image">
          <img src="${images[1] || 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'}" alt="Por que escolher ${businessName}" />
        </div>
      </div>
    </div>
  </section>

  <!-- Galeria de Fotos -->
  ${galleryHTML}

  <!-- Seção CTA Final -->
  <section class="cta-final-section">
    <div class="container">
      <h2>${ctaSection.title}</h2>
      <p>${ctaSection.subtitle}</p>
      <a href="${waUrl}" target="_blank" class="btn">
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
            <li><a href="#">Contato</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h4>Contato</h4>
          ${contacts?.phone ? `<p><i class="fa-solid fa-phone"></i> ${contacts.phone}</p>` : ''}
          ${contacts?.email ? `<p><i class="fa-solid fa-envelope"></i> ${contacts.email}</p>` : ''}
          ${contacts?.address ? `<p><i class="fa-solid fa-location-dot"></i> ${contacts.address}</p>` : ''}
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${businessName}. Todos os direitos reservados. Landing page gerada via IA.</p>
      </div>
    </div>
  </footer>

</body>
</html>`;
}

/**
 * Gera o código do componente React + Styled Components
 */
export function generateReactCode(data, images = []) {
  const { businessName, tagline, theme, hero, about, services, benefits, ctaSection, contacts, whatsappMessage } = data;

  const serializedImages = JSON.stringify(images);
  const serializedData = JSON.stringify(data, null, 2);

  return `import React from 'react';
import styled from 'styled-components';
import { 
  FaArrowRight, 
  FaWhatsapp, 
  FaInstagram, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCircleCheck,
  ${Array.from(new Set(services.map(s => s.icon))).join(',\n  ')} 
} from 'react-icons/fa';

// Dados embutidos gerados pela IA
const LP_DATA = ${serializedData};
const LP_IMAGES = ${serializedImages};

export default function GeneratedLandingPage() {
  const { businessName, tagline, hero, about, services, benefits, ctaSection, contacts, whatsappMessage } = LP_DATA;

  const phoneFormatted = contacts?.phone ? contacts.phone.replace(/\\D/g, '') : '';
  const waUrl = \`https://wa.me/\${phoneFormatted}?text=\${encodeURIComponent(whatsappMessage || '')}\`;
  const instaUrl = contacts?.instagram ? (contacts.instagram.startsWith('http') ? contacts.instagram : \`https://instagram.com/\${contacts.instagram.replace('@', '')}\`) : '#';

  // Dicionário dinâmico para renderizar os ícones corretos do react-icons
  const iconComponents = {
    ${services.map(s => `${s.icon}: ${s.icon}`).join(',\n    ')}
  };

  return (
    <Wrapper>
      {/* Cabeçalho */}
      <Header>
        <div className="container">
          <Logo>\${businessName}</Logo>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
            Falar no WhatsApp
          </a>
        </div>
      </Header>

      {/* Hero Section */}
      <HeroSection>
        <div className="container">
          <h1>{hero.headline}</h1>
          <p>{hero.subheadline}</p>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn">
            {hero.ctaText}
            <FaArrowRight />
          </a>
        </div>
      </HeroSection>

      {/* Sobre Nós */}
      <AboutSection>
        <div className="container grid">
          <div className="about-image">
            <img src={LP_IMAGES[0] || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'} alt="Sobre nós" />
          </div>
          <div className="about-content">
            <h2>{about.title || 'Sobre Nós'}</h2>
            {about.paragraphs.map((p, idx) => <p key={idx}>{p}</p>)}
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ marginTop: '15px' }}>
              Falar Conosco
            </a>
          </div>
        </div>
      </AboutSection>

      {/* Serviços */}
      <ServicesSection>
        <div className="container">
          <h2 className="section-title">Nossos Serviços</h2>
          <div className="services-grid">
            {services.map((s, idx) => {
              const IconComp = iconComponents[s.icon] || FaCircleCheck;
              return (
                <div className="service-card" key={idx}>
                  <div className="service-icon">
                    <IconComp />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </ServicesSection>

      {/* Diferenciais */}
      <BenefitsSection>
        <div className="container grid">
          <div className="benefits-content">
            <h2>Por que nos escolher?</h2>
            <p className="intro">Entregamos o melhor serviço focado nas suas necessidades reais.</p>
            <div className="benefits-list">
              {benefits.map((b, idx) => (
                <div className="benefit-item" key={idx}>
                  <div className="benefit-icon">
                    <FaCircleCheck />
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

      {/* Galeria de Fotos */}
      {LP_IMAGES.length > 0 && (
        <GallerySection>
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

      {/* CTA Final */}
      <CtaFinalSection>
        <div className="container">
          <h2>{ctaSection.title}</h2>
          <p>{ctaSection.subtitle}</p>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn">
            {ctaSection.buttonText}
            <FaArrowRight />
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
              <a href={instaUrl} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href={waUrl} target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
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
            {contacts?.phone && <p><FaPhone /> {contacts.phone}</p>}
            {contacts?.email && <p><FaEnvelope /> {contacts.email}</p>}
            {contacts?.address && <p><FaMapMarkerAlt /> {contacts.address}</p>}
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {businessName}. Todos os direitos reservados.</p>
        </div>
      </Footer>
    </Wrapper>
  );
}

// Styled Components
const Wrapper = styled.div\`
  --primary: \${theme.primaryColor || '#3B82F6'};
  --secondary: \${theme.secondaryColor || '#10B981'};
  --dark: \${theme.darkColor || '#1F2937'};
  --light: \${theme.lightColor || '#F9FAFB'};
  --text: \${theme.textColor || '#374151'};
  
  font-family: '\${theme.fontFamily || 'Inter'}', sans-serif;
  color: var(--text);
  background-color: var(--light);
  line-height: 1.6;

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    align-items: center;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background-color: var(--primary);
    color: white;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.05rem;
    padding: 14px 28px;
    border-radius: 50px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: var(--secondary);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }
    
    svg {
      font-size: 1.15rem;
    }
  }
\`;

const Header = styled.header\`
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px 0;

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .btn-sm {
    padding: 8px 18px;
    font-size: 0.9rem;
  }
\`;

const Logo = styled.div\`
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--dark);
  letter-spacing: -0.5px;
\`;

const HeroSection = styled.section\`
  background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(240,244,248,1) 100%);
  padding: 100px 0;
  text-align: center;

  h1 {
    font-size: 3.2rem;
    font-weight: 800;
    color: var(--dark);
    line-height: 1.2;
    margin-bottom: 20px;
    letter-spacing: -1px;

    @media (max-width: 768px) {
      font-size: 2.3rem;
    }
  }

  p {
    font-size: 1.3rem;
    color: var(--text);
    max-width: 700px;
    margin: 0 auto 35px auto;
    opacity: 0.9;
  }
\`;

const AboutSection = styled.section\`
  padding: 80px 0;
  background-color: white;

  .about-image {
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    aspect-ratio: 4/3;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .about-content {
    h2 {
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--dark);
      margin-bottom: 24px;
    }

    p {
      margin-bottom: 18px;
      font-size: 1.05rem;
    }
  }
\`;

const ServicesSection = styled.section\`
  padding: 80px 0;
  background-color: var(--light);

  .section-title {
    text-align: center;
    font-size: 2.25rem;
    font-weight: 800;
    color: var(--dark);
    margin-bottom: 48px;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }

  .service-card {
    background-color: white;
    padding: 40px 30px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.02);

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    }
  }

  .service-icon {
    width: 60px;
    height: 60px;
    background-color: color-mix(in srgb, var(--primary) 10%, transparent);
    color: var(--primary);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-bottom: 24px;
  }

  h3 {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 12px;
  }

  p {
    font-size: 0.95rem;
    opacity: 0.85;
  }
\`;

const BenefitsSection = styled.section\`
  padding: 80px 0;
  background-color: white;

  .about-image {
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    aspect-ratio: 4/3;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 992px) {
      order: -1;
    }
  }

  .benefits-content {
    h2 {
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--dark);
      margin-bottom: 10px;
    }

    .intro {
      font-size: 1.05rem;
      margin-bottom: 30px;
    }
  }

  .benefits-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .benefit-item {
    display: flex;
    gap: 20px;
  }

  .benefit-icon {
    color: var(--secondary);
    font-size: 1.5rem;
    margin-top: 4px;
  }

  .benefit-text {
    h4 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--dark);
      margin-bottom: 4px;
    }

    p {
      font-size: 0.95rem;
      opacity: 0.85;
    }
  }
\`;

const GallerySection = styled.section\`
  padding: 80px 0;
  background-color: var(--light);

  .section-title {
    text-align: center;
    font-size: 2.25rem;
    font-weight: 800;
    color: var(--dark);
    margin-bottom: 48px;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .gallery-item {
    aspect-ratio: 1/1;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    background-color: #e5e7eb;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.03);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
\`;

const CtaFinalSection = styled.section\`
  background-color: var(--dark);
  color: white;
  text-align: center;
  padding: 100px 0;

  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 16px;
  }

  p {
    font-size: 1.15rem;
    margin-bottom: 35px;
    opacity: 0.8;
    max-width: 600px;
    margin: 0 auto 35px auto;
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
      font-weight: 800;
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
      font-weight: 700;
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
