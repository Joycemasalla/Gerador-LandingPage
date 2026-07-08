import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import * as FaIcons from 'react-icons/fa';
import * as GiIcons from 'react-icons/gi';
import { getImagesForSegment } from '../../../utils/imageCatalog';

const SafeIcon = ({ name, className }) => {
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
  const IconComponent = GiIcons[resolvedName] || FaIcons[resolvedName] || FaIcons[name] || GiIcons[name] || FaIcons.FaStar;
  
  return <IconComponent className={className} style={{ width: '1.5rem', height: '1.5rem', display: 'block' }} />;
};


export default function BoldTemplate({ data, images = [] }) {
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
    whatsappMessage = '',
    segment = '',
    bio = '',
    tickerWords = []
  } = data;

  const [activeIndex, setActiveIndex] = useState(null);

  const phoneFormatted = contacts.phone ? contacts.phone.replace(/\D/g, '') : '';
  const waUrl = `https://wa.me/${phoneFormatted}?text=${encodeURIComponent(whatsappMessage || '')}`;
  
  const instaUrl = contacts.instagram 
    ? (contacts.instagram.startsWith('http') ? contacts.instagram : `https://instagram.com/${contacts.instagram.replace('@', '')}`) 
    : '#';

  const catalogImages = getImagesForSegment(segment, bio);
  const resolveImage = (uploadedImg, fallbackIndex) =>
    uploadedImg || catalogImages[fallbackIndex] || catalogImages[0];

  const words = tickerWords.length > 0 ? tickerWords : ['+ ESTILO', '+ ATITUDE', '+ QUALIDADE', '+ CONFIANÇA'];

  return (
    <BoldWrapper $theme={theme}>
      {/* Cabeçalho Brutalista */}
      <Header>
        <div className="container header-container">
          <Logo className="logo">{businessName}</Logo>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
            Falar no WhatsApp
          </a>
        </div>
      </Header>

      {/* Hero Assimétrico */}
      <HeroSection>
        <div className="container hero-grid">
          <div className="hero-content">
            {hero.trustBadge && (
              <div className="trust-badge">
                <SafeIcon name="FaAward" /> {hero.trustBadge}
              </div>
            )}
            <h1 dangerouslySetInnerHTML={{ __html: hero.headline }} />
            <p>{hero.subheadline}</p>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-highlight">
              {hero.ctaText}
              <SafeIcon name="FaArrowRight" />
            </a>
          </div>
          <div className="hero-visual-frame">
            <img src={resolveImage(images[0], 0)} alt={businessName} />
            <div className="visual-badge">{segment.toUpperCase()}</div>
          </div>
        </div>
      </HeroSection>

      {/* Ticker / Marquee Deslizante Infinito */}
      <TickerWrapper>
        <div className="ticker-track">
          {Array.from({ length: 4 }).map((_, rIdx) => (
            <div className="ticker-group" key={rIdx}>
              {words.map((word, wIdx) => (
                <span key={wIdx}>
                  <span className="bullet">•</span> {word.toUpperCase()}
                </span>
              ))}
            </div>
          ))}
        </div>
      </TickerWrapper>

      {/* Seção de Dores (Pain Points) — Dupla Coluna */}
      {painPoints && painPoints.length > 0 && (
        <PainSection>
          <div className="container grid-pain">
            <div className="pain-intro">
              <span className="tag-pre">O QUE TE INCOMODA?</span>
              <h2>Cansado de lidar com estes <span className="destaque">problemas</span>?</h2>
              <p>Sabemos exatamente como resolver esses obstáculos que afetam sua experiência.</p>
            </div>
            <div className="pain-list">
              {painPoints.map((pain, idx) => (
                <div className="pain-card" key={idx}>
                  <p>{pain}</p>
                  <div className="pain-arrow">→</div>
                </div>
              ))}
            </div>
          </div>
        </PainSection>
      )}

      {/* Sobre Nós */}
      <AboutSection>
        <div className="container grid">
          <div className="about-image">
            <img src={resolveImage(images[0], 0)} alt={`Sobre ${businessName}`} />
          </div>
          <div className="about-content">
            <h2>Quem Somos</h2>
            {about.paragraphs?.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ marginTop: '15px' }}>
              Conhecer Mais
            </a>
          </div>
        </div>
      </AboutSection>

      {/* Serviços — Grid Brutalista com Comedimento */}
      {services.length > 0 && (
        <ServicesSection>
          <div className="container">
            <h2 className="section-title">Nossos Serviços</h2>
            <div className="services-grid">
              {services.map((s, idx) => {
                // Apenas o primeiro card de serviço recebe destaque brutalista premium
                const isHighlight = idx === 0;
                return (
                  <div className={`service-card ${isHighlight ? 'highlight-card' : ''}`} key={idx}>
                    <div className="service-icon">
                      <SafeIcon name={s.icon} />
                    </div>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </ServicesSection>
      )}

      {/* Diferenciais */}
      {benefits.length > 0 && (
        <BenefitsSection>
          <div className="container grid">
            <div className="benefits-content">
              <h2>Por que nos escolher?</h2>
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
              <img src={resolveImage(images[1], 1)} alt="Diferenciais" />
            </div>
          </div>
        </BenefitsSection>
      )}

      {/* Passo a Passo */}
      {processSteps.length > 0 && (
        <ProcessSection>
          <div className="container">
            <h2 className="section-title">Como Funciona</h2>
            <div className="process-grid">
              {processSteps.map((step, idx) => (
                <div className="process-card" key={idx}>
                  <div className="process-badge">{step.step || `0${idx + 1}`}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </ProcessSection>
      )}

      {/* Depoimentos */}
      {testimonials.length > 0 && (
        <TestimonialsSection>
          <div className="container">
            <h2 className="section-title">O que dizem os clientes</h2>
            <div className="testimonials-grid">
              {testimonials.map((t, idx) => (
                <div className="testimonial-card" key={idx}>
                  {t.isPlaceholder && (
                    <PlaceholderBadge>
                      ⚠️ Exemplo — substitua por depoimento real antes de publicar
                    </PlaceholderBadge>
                  )}
                  <div className="rating">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <SafeIcon name="FaStar" key={i} />
                    ))}
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
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <FaqSection>
          <div className="container faq-container">
            <h2 className="section-title">Dúvidas Frequentes</h2>
            <div className="faq-list">
              {faq.map((item, idx) => {
                const isOpen = activeIndex === idx;
                return (
                  <div className={`faq-item ${isOpen ? 'active' : ''}`} key={idx}>
                    <button className="faq-question" onClick={() => setActiveIndex(isOpen ? null : idx)}>
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
      <CtaFinalSection>
        <div className="container">
          <h2 dangerouslySetInnerHTML={{ __html: ctaSection.title }} />
          <p>{ctaSection.subtitle}</p>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-highlight">
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
          <p>&copy; {new Date().getFullYear()} {businessName}. Landing page premium.</p>
        </div>
      </Footer>
    </BoldWrapper>
  );
}

// ── Animações e Estilos Bold ───────────────────────────────────────────────
const tickerScroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const BoldWrapper = styled.div`
  --primary: ${props => props.$theme.primaryColor || '#ff0055'};
  --secondary: ${props => props.$theme.secondaryColor || '#00f0ff'};
  --dark: ${props => props.$theme.darkColor || '#0a0a0c'};
  --light: ${props => props.$theme.lightColor || '#f3f4f6'};
  --text-on-light: ${props => props.$theme.textColor || '#0f172a'};
  --text-on-dark: ${props => props.$theme.textColorOnDark || '#f3f4f6'};
  --border-color: var(--dark);
  
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--text-on-light);
  background-color: var(--light);
  line-height: 1.6;
  width: 100%;
  text-align: left;
  overflow-x: hidden;

  h1, h2, h3, h4, .logo {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 800;
    letter-spacing: -1px;
    color: var(--border-color);
  }

  .destaque {
    background-color: var(--secondary);
    color: var(--dark) !important;
    padding: 0px 8px;
    transform: rotate(-1deg);
    display: inline-block;
    box-shadow: 2px 2px 0px var(--dark);
    font-weight: 800;
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
    @media (max-width: 768px) { grid-template-columns: 1fr; gap: 30px; }
  }

  .fade-in {
    animation: ${fadeInUp} 0.6s ease forwards;
  }

  /* Botão brutalista padrão */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: var(--light);
    color: var(--dark);
    text-decoration: none;
    font-weight: 800;
    font-size: 0.95rem;
    padding: 12px 24px;
    border-radius: 0px;
    border: 2px solid var(--dark);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--primary);
      color: white;
      transform: translate(-2px, -2px);
      box-shadow: 4px 4px 0px var(--dark);
    }
  }

  .btn-highlight {
    background-color: var(--primary);
    color: white;
    box-shadow: 4px 4px 0px var(--dark);

    &:hover {
      background-color: var(--secondary);
      color: var(--dark);
      transform: translate(-3px, -3px);
      box-shadow: 6px 6px 0px var(--dark);
    }
  }

  .btn-lg { padding: 14px 30px; font-size: 1.05rem; }
  .btn-sm { padding: 7px 15px; font-size: 0.85rem; }
`;

const Header = styled.header`
  background-color: var(--light);
  border-bottom: 2px solid var(--dark);
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 14px 0;

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const Logo = styled.div`
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -1.5px;
`;

const HeroSection = styled.section`
  padding: 100px 0;
  border-bottom: 2px solid var(--dark);
  background-color: white;

  .hero-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 40px;
    align-items: center;
    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }

  .hero-content {
    h1 {
      font-size: 3.2rem;
      line-height: 1.1;
      margin-bottom: 20px;
      @media (max-width: 768px) { font-size: 2.3rem; }
    }

    p {
      font-size: 1.15rem;
      margin-bottom: 30px;
      color: #374151;
    }
  }

  .trust-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background-color: var(--primary);
    color: white;
    font-size: 0.8rem;
    font-weight: 800;
    margin-bottom: 24px;
    border: 2px solid var(--dark);
    box-shadow: 2px 2px 0px var(--dark);
  }

  .hero-visual-frame {
    position: relative;
    border: 2px solid var(--dark);
    aspect-ratio: 1/1;
    background-color: var(--secondary);
    box-shadow: 6px 6px 0px var(--dark);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .visual-badge {
      position: absolute;
      bottom: 12px;
      left: 12px;
      background-color: var(--dark);
      color: white;
      padding: 4px 10px;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 1px;
    }
  }
`;

const TickerWrapper = styled.div`
  background-color: var(--dark);
  color: white;
  padding: 14px 0;
  overflow: hidden;
  white-space: nowrap;
  border-bottom: 2px solid var(--dark);
  display: flex;

  .ticker-track {
    display: flex;
    width: max-content;
    animation: ${tickerScroll} 20s linear infinite;
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
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .bullet {
    color: var(--primary);
    font-size: 1.5rem;
  }
`;

const PainSection = styled.section`
  padding: 80px 0;
  background-color: var(--light);
  border-bottom: 2px solid var(--dark);

  .grid-pain {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 40px;
    align-items: center;
    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }

  .tag-pre {
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--primary);
    letter-spacing: 2px;
    display: block;
    margin-bottom: 10px;
  }

  .pain-intro h2 {
    font-size: 2.3rem;
    line-height: 1.2;
    margin-bottom: 16px;
  }

  .pain-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .pain-card {
    background-color: white;
    border: 2px solid var(--dark);
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s ease;

    p {
      font-weight: 700;
      font-size: 0.95rem;
    }

    .pain-arrow {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--primary);
      transition: transform 0.2s;
    }

    &:hover {
      transform: translate(-3px, -3px);
      box-shadow: 4px 4px 0px var(--dark);
      border-color: var(--primary);
      .pain-arrow { transform: translateX(4px); }
    }
  }
`;

const AboutSection = styled.section`
  padding: 80px 0;
  background-color: white;
  border-bottom: 2px solid var(--dark);

  .about-image {
    width: 100%;
    border: 2px solid var(--dark);
    box-shadow: 6px 6px 0px var(--dark);
    overflow: hidden;
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
      margin-bottom: 20px;
    }

    p {
      margin-bottom: 16px;
      font-size: 0.98rem;
    }
  }
`;

const ServicesSection = styled.section`
  padding: 80px 0;
  background-color: var(--light);
  border-bottom: 2px solid var(--dark);

  .section-title {
    text-align: center;
    font-size: 2.2rem;
    margin-bottom: 40px;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .service-card {
    background-color: white;
    padding: 30px 24px;
    /* COMEDIMENTO BRUTALISTA: Cards normais usam borda fina e sem sombra estática */
    border: 1px solid #94a3b8;
    transition: all 0.2s ease;

    h3 {
      font-size: 1.25rem;
      margin-bottom: 10px;
    }

    p {
      font-size: 0.9rem;
      color: #4b5563;
    }

    &:hover {
      transform: translate(-2px, -2px);
      border: 2px solid var(--dark);
      box-shadow: 4px 4px 0px var(--dark);
    }
  }

  /* COMEDIMENTO BRUTALISTA: Apenas o card em destaque principal recebe borda grossa e sombra dura */
  .highlight-card {
    border: 2px solid var(--dark);
    box-shadow: 4px 4px 0px var(--dark);
    background-color: #fafdfc;
  }

  .service-icon {
    width: 48px;
    height: 48px;
    background-color: var(--secondary);
    border: 2px solid var(--dark);
    color: var(--dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    margin-bottom: 20px;
  }
`;

const BenefitsSection = styled.section`
  padding: 80px 0;
  background-color: white;
  border-bottom: 2px solid var(--dark);

  .about-image {
    width: 100%;
    border: 2px solid var(--dark);
    box-shadow: 6px 6px 0px var(--dark);
    aspect-ratio: 4/3;
    img { width: 100%; height: 100%; object-fit: cover; }
  }

  .benefits-content {
    h2 { font-size: 2rem; margin-bottom: 24px; }
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
    color: var(--primary);
    font-size: 1.3rem;
  }

  .benefit-text {
    h4 { font-size: 1.1rem; margin-bottom: 4px; }
    p { font-size: 0.88rem; color: #4b5563; }
  }
`;

const ProcessSection = styled.section`
  padding: 80px 0;
  background-color: var(--light);
  border-bottom: 2px solid var(--dark);

  .section-title { text-align: center; font-size: 2.2rem; margin-bottom: 50px; }

  .process-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    @media (max-width: 768px) { grid-template-columns: 1fr; gap: 30px; }
  }

  .process-card {
    background-color: white;
    padding: 35px 24px;
    border: 2px solid var(--dark);
    position: relative;
    text-align: center;
    transition: transform 0.2s;

    h3 { font-size: 1.2rem; margin-top: 15px; margin-bottom: 10px; }
    p { font-size: 0.88rem; color: #4b5563; }

    &:hover {
      transform: translate(-3px, -3px);
      box-shadow: 4px 4px 0px var(--dark);
    }
  }

  .process-badge {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 40px;
    background-color: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1rem;
    border: 2px solid var(--dark);
    box-shadow: 2px 2px 0px var(--dark);
  }
`;

const TestimonialsSection = styled.section`
  padding: 80px 0;
  background-color: white;
  border-bottom: 2px solid var(--dark);

  .section-title { text-align: center; font-size: 2.2rem; margin-bottom: 40px; }
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .testimonial-card {
    background-color: var(--light);
    padding: 30px 24px;
    border: 1px solid #94a3b8;
    position: relative;

    .quote {
      font-style: italic;
      font-size: 0.95rem;
      margin-bottom: 20px;
    }

    .rating {
      color: #f59e0b;
      margin-bottom: 12px;
      display: flex;
      gap: 2px;
    }

    .client-info {
      display: flex;
      flex-direction: column;
      strong { font-size: 0.95rem; }
      span { font-size: 0.8rem; color: #6b7280; }
    }

    &:hover {
      border: 2px solid var(--dark);
      transform: translate(-2px, -2px);
      box-shadow: 4px 4px 0px var(--dark);
    }
  }
`;

const FaqSection = styled.section`
  padding: 80px 0;
  background-color: var(--light);
  border-bottom: 2px solid var(--dark);

  .section-title { text-align: center; font-size: 2.2rem; margin-bottom: 40px; }
  .faq-container { max-width: 800px; }
  .faq-list { display: flex; flex-direction: column; gap: 16px; }

  .faq-item {
    background-color: white;
    border: 2px solid var(--dark);
    overflow: hidden;
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
    font-weight: 800;
    text-align: left;
    cursor: pointer;
    gap: 15px;
    font-family: 'Space Grotesk', sans-serif;
  }

  .faq-toggle-icon {
    font-size: 0.9rem;
    color: var(--primary);
  }

  .faq-answer-wrapper {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out, opacity 0.2s ease-in-out;
    opacity: 0;
  }

  .faq-item.active .faq-answer-wrapper {
    max-height: 500px;
    opacity: 1;
  }

  .faq-answer {
    padding: 0 24px 20px 24px;
    font-size: 0.92rem;
    color: #4b5563;
  }
`;

const CtaFinalSection = styled.section`
  background-color: var(--dark);
  color: white;
  text-align: center;
  padding: 100px 0;
  border-bottom: 2px solid var(--dark);

  h2 {
    font-size: 2.5rem;
    margin-bottom: 16px;
    color: white;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 30px;
    color: var(--text-on-dark);
    max-width: 550px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const Footer = styled.footer`
  background-color: var(--dark);
  color: #9ca3af;
  padding: 60px 0 30px 0;

  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
    @media (max-width: 768px) { grid-template-columns: 1fr; gap: 20px; }
  }

  .footer-brand {
    h3 { color: white; font-size: 1.3rem; margin-bottom: 12px; }
  }

  .social-icons {
    display: flex;
    gap: 12px;
    margin-top: 15px;

    a {
      color: white;
      background-color: rgba(255, 255, 255, 0.08);
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid white;
      transition: all 0.2s;

      &:hover {
        background-color: var(--primary);
        transform: translate(-2px, -2px);
        box-shadow: 2px 2px 0px white;
      }
    }
  }

  .footer-links, .footer-contact {
    h4 { color: white; font-size: 0.95rem; margin-bottom: 16px; }
  }

  ul {
    list-style: none;
    li {
      margin-bottom: 8px;
      a {
        color: #9ca3af;
        text-decoration: none;
        font-size: 0.88rem;
        transition: color 0.2s;
        &:hover { color: var(--primary); }
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
      svg { color: var(--primary); }
    }
  }

  .footer-bottom {
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.8rem;
  }
`;

const PlaceholderBadge = styled.div`
  background-color: #fef3c7;
  border: 1px dashed #d97706;
  color: #b45309;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
`;
