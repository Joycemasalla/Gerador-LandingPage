import React from 'react';
import styled from 'styled-components';
import * as FaIcons from 'react-icons/fa';

// Componente de fallback se o ícone não existir no react-icons
const SafeIcon = ({ name, className }) => {
  const IconComponent = FaIcons[name] || FaIcons.FaCircleNotch;
  return <IconComponent className={className} />;
};

export default function ModernTemplate({ data, images = [] }) {
  if (!data) return null;

  const {
    businessName,
    tagline,
    theme = {},
    hero = {},
    about = {},
    services = [],
    benefits = [],
    ctaSection = {},
    contacts = {},
    whatsappMessage = ''
  } = data;

  const phoneFormatted = contacts.phone ? contacts.phone.replace(/\D/g, '') : '';
  const waUrl = `https://wa.me/${phoneFormatted}?text=${encodeURIComponent(whatsappMessage || '')}`;
  
  const instaUrl = contacts.instagram 
    ? (contacts.instagram.startsWith('http') ? contacts.instagram : `https://instagram.com/${contacts.instagram.replace('@', '')}`) 
    : '#';

  return (
    <Wrapper $theme={theme}>
      {/* Cabeçalho */}
      <Header>
        <div className="container header-container">
          <Logo>{businessName}</Logo>
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
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg">
            {hero.ctaText}
            <SafeIcon name="FaArrowRight" />
          </a>
        </div>
      </HeroSection>

      {/* Sobre Nós */}
      <AboutSection>
        <div className="container grid">
          <div className="about-image">
            <img 
              src={images[0] || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'} 
              alt={`Sobre ${businessName}`} 
            />
          </div>
          <div className="about-content">
            <h2>{about.title || 'Sobre Nós'}</h2>
            {about.paragraphs?.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
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
            {services.map((s, idx) => (
              <div className="service-card" key={idx}>
                <div className="service-icon">
                  <SafeIcon name={s.icon} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </ServicesSection>

      {/* Diferenciais */}
      <BenefitsSection>
        <div className="container grid">
          <div className="benefits-content">
            <h2>Por que nos escolher?</h2>
            <p className="intro">Compromisso com a qualidade, pontualidade e satisfação.</p>
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
            <img 
              src={images[1] || 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'} 
              alt="Diferenciais" 
            />
          </div>
        </div>
      </BenefitsSection>

      {/* Galeria de Fotos */}
      {images.length > 0 && (
        <GallerySection>
          <div className="container">
            <h2 className="section-title">Galeria de Fotos</h2>
            <div className="gallery-grid">
              {images.map((img, idx) => (
                <div className="gallery-item" key={idx}>
                  <img src={img} alt={`Fotos de ${businessName} - ${idx + 1}`} />
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
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg">
            {ctaSection.buttonText}
            <SafeIcon name="FaArrowRight" />
          </a>
        </div>
      </CtaFinalSection>

      {/* Rodapé */}
      <Footer>
        <div className="container footer-grid">
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
            {contacts.phone && <p><SafeIcon name="FaPhone" /> {contacts.phone}</p>}
            {contacts.email && <p><SafeIcon name="FaEnvelope" /> {contacts.email}</p>}
            {contacts.address && <p><SafeIcon name="FaMapMarkerAlt" /> {contacts.address}</p>}
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {businessName}. Todos os direitos reservados. Landing page criada via Inteligência Artificial.</p>
        </div>
      </Footer>
    </Wrapper>
  );
}

// Estilos isolados para o template dinâmico
const Wrapper = styled.div`
  --primary: ${props => props.$theme.primaryColor || '#3B82F6'};
  --secondary: ${props => props.$theme.secondaryColor || '#10B981'};
  --dark: ${props => props.$theme.darkColor || '#1F2937'};
  --light: ${props => props.$theme.lightColor || '#F9FAFB'};
  --text: ${props => props.$theme.textColor || '#374151'};
  
  font-family: ${props => props.$theme.fontFamily ? `'${props.$theme.fontFamily}', sans-serif` : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'};
  color: var(--text);
  background-color: var(--light);
  line-height: 1.6;
  width: 100%;
  text-align: left;

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
    border-radius: 50px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: var(--secondary);
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    }

    svg {
      font-size: 1rem;
    }
  }

  .btn-lg {
    padding: 14px 30px;
    font-size: 1.05rem;
  }
`;

const Header = styled.header`
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 14px 0;

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .btn-sm {
    padding: 7px 15px;
    font-size: 0.85rem;
  }
`;

const Logo = styled.div`
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--dark);
  letter-spacing: -0.5px;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(240,244,248,0.7) 100%);
  padding: 80px 0;
  text-align: center;

  h1 {
    font-size: 2.8rem;
    font-weight: 800;
    color: var(--dark);
    line-height: 1.25;
    margin-bottom: 20px;
    letter-spacing: -0.5px;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.15rem;
    color: var(--text);
    max-width: 650px;
    margin: 0 auto 30px auto;
    opacity: 0.9;
  }
`;

const AboutSection = styled.section`
  padding: 70px 0;
  background-color: white;

  .about-image {
    width: 100%;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
    aspect-ratio: 4/3;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .about-content {
    h2 {
      font-size: 2rem;
      font-weight: 800;
      color: var(--dark);
      margin-bottom: 20px;
      letter-spacing: -0.5px;
    }

    p {
      margin-bottom: 16px;
      font-size: 0.98rem;
      color: var(--text);
      opacity: 0.9;
    }
  }
`;

const ServicesSection = styled.section`
  padding: 70px 0;
  background-color: var(--light);

  .section-title {
    text-align: center;
    font-size: 2rem;
    font-weight: 800;
    color: var(--dark);
    margin-bottom: 40px;
    letter-spacing: -0.5px;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .service-card {
    background-color: white;
    padding: 30px 24px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.01);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
    }

    h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--dark);
      margin-bottom: 10px;
    }

    p {
      font-size: 0.9rem;
      color: var(--text);
      opacity: 0.85;
    }
  }

  .service-icon {
    width: 50px;
    height: 50px;
    background-color: rgba(59, 130, 246, 0.08); /* Fallback */
    background-color: color-mix(in srgb, var(--primary) 10%, transparent);
    color: var(--primary);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    margin-bottom: 20px;
  }
`;

const BenefitsSection = styled.section`
  padding: 70px 0;
  background-color: white;

  .about-image {
    width: 100%;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
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
      font-weight: 800;
      color: var(--dark);
      margin-bottom: 10px;
      letter-spacing: -0.5px;
    }

    .intro {
      font-size: 0.98rem;
      margin-bottom: 24px;
      color: var(--text);
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
      font-weight: 700;
      color: var(--dark);
      margin-bottom: 4px;
    }

    p {
      font-size: 0.88rem;
      color: var(--text);
      opacity: 0.8;
    }
  }
`;

const GallerySection = styled.section`
  padding: 70px 0;
  background-color: var(--light);

  .section-title {
    text-align: center;
    font-size: 2rem;
    font-weight: 800;
    color: var(--dark);
    margin-bottom: 40px;
    letter-spacing: -0.5px;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }

  .gallery-item {
    aspect-ratio: 1/1;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
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
`;

const CtaFinalSection = styled.section`
  background-color: var(--dark);
  color: white;
  text-align: center;
  padding: 80px 0;

  h2 {
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
  }

  p {
    font-size: 1.05rem;
    margin-bottom: 30px;
    opacity: 0.8;
    max-width: 550px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const Footer = styled.footer`
  background-color: #111827;
  color: rgba(255, 255, 255, 0.6);
  padding: 40px 0 24px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 30px;
    margin-bottom: 30px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  .footer-brand {
    h3 {
      color: white;
      font-size: 1.3rem;
      font-weight: 800;
      margin-bottom: 12px;
    }
  }

  .social-icons {
    display: flex;
    gap: 12px;
    margin-top: 15px;

    a {
      color: white;
      background-color: rgba(255, 255, 255, 0.06);
      width: 32px;
      height: 32px;
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
      font-size: 0.95rem;
      font-weight: 700;
      margin-bottom: 16px;
    }
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 8px;
      
      a {
        color: rgba(255, 255, 255, 0.6);
        text-decoration: none;
        font-size: 0.88rem;
        transition: color 0.3s;

        &:hover {
          color: var(--primary);
        }
      }
    }
  }

  .footer-contact {
    p {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.88rem;

      svg {
        color: var(--primary);
      }
    }
  }

  .footer-bottom {
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.8rem;
  }
`;
