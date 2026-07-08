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


export default function FriendlyTemplate({ data, images = [] }) {
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

  const words = tickerWords.length > 0 ? tickerWords : ['+ AMOR', '+ CUIDADO', '+ CARINHO', '+ FELICIDADE'];

  return (
    <FriendlyWrapper $theme={theme}>
      {/* Cabeçalho */}
      <Header>
        <div className="container header-container">
          <Logo className="logo">{businessName}</Logo>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
            Falar no WhatsApp
          </a>
        </div>
      </Header>

      {/* Hero Amigável */}
      <HeroSection>
        <div className="container hero-content">
          {hero.trustBadge && (
            <div className="trust-badge">
              <SafeIcon name="FaAward" /> {hero.trustBadge}
            </div>
          )}
          <h1 dangerouslySetInnerHTML={{ __html: hero.headline }} />
          <p className="hero-subheadline">{hero.subheadline}</p>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lg">
            {hero.ctaText}
            <SafeIcon name="FaArrowRight" />
          </a>
        </div>
      </HeroSection>

      {/* Ticker Amigável */}
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

      {/* Dores (Pain Points) — Dupla Coluna */}
      {painPoints && painPoints.length > 0 && (
        <PainSection>
          <div className="container grid-pain">
            <div className="pain-intro">
              <span className="tag-pre">VOCÊ NÃO ESTÁ SÓ</span>
              <h2>Entendemos as suas <span className="destaque">preocupações</span>...</h2>
              <p>Cuidamos para que esses problemas não atrapalhem a sua rotina e tragam tranquilidade.</p>
            </div>
            <div className="pain-list">
              {painPoints.map((pain, idx) => (
                <div className="pain-card" key={idx}>
                  <div className="pain-icon-circle">
                    <SafeIcon name="FaSmile" />
                  </div>
                  <p>{pain}</p>
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
            <h2>Nossa Família</h2>
            {about.paragraphs?.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ marginTop: '15px' }}>
              Falar Conosco
            </a>
          </div>
        </div>
      </AboutSection>

      {/* Serviços — Muito arredondado */}
      {services.length > 0 && (
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

      {/* Como Funciona */}
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
            <h2 className="section-title">Depoimentos de Carinho</h2>
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
            <h2 className="section-title">Perguntas Comuns</h2>
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
          <p>&copy; {new Date().getFullYear()} {businessName}. Landing page feita com amor.</p>
        </div>
      </Footer>
    </FriendlyWrapper>
  );
}

// ── Animações e Estilos Friendly ────────────────────────────────────────────
const tickerScroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FriendlyWrapper = styled.div`
  --primary: ${props => props.$theme.primaryColor || '#ff7a59'};
  --secondary: ${props => props.$theme.secondaryColor || '#ffc53d'};
  --dark: ${props => props.$theme.darkColor || '#1e293b'};
  --light: ${props => props.$theme.lightColor || '#fdfbf7'};
  --text-on-light: ${props => props.$theme.textColor || '#334155'};
  --text-on-dark: ${props => props.$theme.textColorOnDark || '#fdfbf7'};
  --radius: 24px;
  
  font-family: 'Quicksand', sans-serif;
  color: var(--text-on-light);
  background-color: var(--light);
  line-height: 1.7;
  width: 100%;
  text-align: left;
  overflow-x: hidden;

  h1, h2, h3, h4, .logo {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    color: var(--dark);
    letter-spacing: -0.2px;
  }

  .destaque {
    color: var(--primary);
    border-bottom: 3px dashed var(--secondary);
    border-radius: 4px;
    padding: 0 4px;
    font-weight: 700;
  }

  .container {
    width: 100%;
    max-width: 1020px;
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
    animation: ${fadeInUp} 0.7s ease forwards;
  }

  /* Botão amigável e arredondado */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: var(--primary);
    color: white;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.95rem;
    padding: 12px 26px;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(255, 122, 89, 0.15);
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background-color: var(--secondary);
      color: var(--dark);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 122, 89, 0.25);
    }
  }

  .btn-lg { padding: 14px 30px; font-size: 1.05rem; }
  .btn-sm { padding: 8px 18px; font-size: 0.82rem; }
`;

const Header = styled.header`
  background-color: rgba(253, 251, 247, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 16px 0;

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const Logo = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
`;

const HeroSection = styled.section`
  padding: 100px 0;
  text-align: center;
  background-color: white;

  h1 {
    font-size: 3.2rem;
    line-height: 1.2;
    margin-bottom: 24px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    @media (max-width: 768px) { font-size: 2.2rem; }
  }

  .hero-subheadline {
    font-size: 1.15rem;
    max-width: 600px;
    margin: 0 auto 30px auto;
    color: #4b5563;
  }

  .trust-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    background-color: #fffbeb;
    color: #d97706;
    font-size: 0.8rem;
    font-weight: 700;
    margin-bottom: 20px;
    border-radius: 50px;
  }
`;

const TickerWrapper = styled.div`
  background-color: var(--dark);
  color: var(--secondary);
  padding: 14px 0;
  overflow: hidden;
  white-space: nowrap;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;

  .ticker-track {
    display: flex;
    width: max-content;
    animation: ${tickerScroll} 25s linear infinite;
  }

  .ticker-group {
    display: flex;
    align-items: center;
    gap: 40px;
    padding-right: 40px;
  }

  span {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .bullet {
    color: var(--primary);
    font-size: 1.4rem;
  }
`;

const PainSection = styled.section`
  padding: 80px 0;
  background-color: var(--light);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);

  .grid-pain {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 40px;
    align-items: center;
    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }

  .tag-pre {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--primary);
    letter-spacing: 1.5px;
    display: block;
    margin-bottom: 10px;
  }

  .pain-intro h2 {
    font-size: 2.2rem;
    line-height: 1.25;
    margin-bottom: 16px;
  }

  .pain-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .pain-card {
    background-color: white;
    border-radius: var(--radius);
    padding: 18px 22px;
    display: flex;
    gap: 16px;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
    border: 1px solid rgba(0, 0, 0, 0.03);

    p {
      font-size: 0.95rem;
      font-weight: 600;
    }
  }

  .pain-icon-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #fee2e2;
    color: #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }
`;

const AboutSection = styled.section`
  padding: 80px 0;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);

  .about-image {
    width: 100%;
    border-radius: var(--radius);
    overflow: hidden;
    aspect-ratio: 4/3;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .about-content {
    h2 { font-size: 2rem; margin-bottom: 20px; }
    p { margin-bottom: 16px; font-size: 1rem; }
  }
`;

const ServicesSection = styled.section`
  padding: 80px 0;
  background-color: var(--light);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);

  .section-title { text-align: center; font-size: 2.2rem; margin-bottom: 40px; }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .service-card {
    background-color: white;
    padding: 35px 24px;
    border-radius: var(--radius);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.02);
    transition: all 0.25s ease;

    h3 { font-size: 1.25rem; margin-bottom: 10px; }
    p { font-size: 0.92rem; color: #4b5563; }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(255, 122, 89, 0.1);
    }
  }

  .service-icon {
    width: 46px;
    height: 46px;
    background-color: #fff5f2;
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    margin-bottom: 20px;
    border-radius: 50%;
  }
`;

const BenefitsSection = styled.section`
  padding: 80px 0;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);

  .about-image {
    width: 100%;
    border-radius: var(--radius);
    overflow: hidden;
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
    font-size: 1.2rem;
  }

  .benefit-text {
    h4 { font-size: 1.1rem; margin-bottom: 4px; }
    p { font-size: 0.9rem; color: #4b5563; }
  }
`;

const ProcessSection = styled.section`
  padding: 80px 0;
  background-color: var(--light);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);

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
    border-radius: var(--radius);
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.01);
    transition: transform 0.25s;

    h3 { font-size: 1.2rem; margin-top: 15px; margin-bottom: 10px; }
    p { font-size: 0.9rem; color: #4b5563; }

    &:hover {
      transform: translateY(-3px);
    }
  }

  .process-badge {
    width: 36px;
    height: 36px;
    margin: 0 auto;
    border-radius: 50%;
    background-color: var(--secondary);
    color: var(--dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.95rem;
  }
`;

const TestimonialsSection = styled.section`
  padding: 80px 0;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);

  .section-title { text-align: center; font-size: 2.2rem; margin-bottom: 40px; }
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .testimonial-card {
    background-color: var(--light);
    padding: 30px 24px;
    border-radius: var(--radius);
    border: 1px solid rgba(0, 0, 0, 0.01);

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
      strong { font-size: 0.95rem; }
      span { font-size: 0.8rem; color: #6b7280; }
    }
  }
`;

const FaqSection = styled.section`
  padding: 80px 0;
  background-color: var(--light);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);

  .section-title { text-align: center; font-size: 2.2rem; margin-bottom: 40px; }
  .faq-container { max-width: 800px; }
  .faq-list { display: flex; flex-direction: column; gap: 16px; }

  .faq-item {
    background-color: white;
    border-radius: var(--radius);
    border: 1px solid rgba(0, 0, 0, 0.02);
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
    font-weight: 700;
    text-align: left;
    cursor: pointer;
    gap: 15px;
    font-family: 'Poppins', sans-serif;
  }

  .faq-toggle-icon {
    font-size: 0.9rem;
    color: var(--primary);
  }

  .faq-answer-wrapper {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease-in-out, opacity 0.25s ease-in-out;
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

  h2 { font-size: 2.5rem; margin-bottom: 16px; color: white; }
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
  background-color: #111827;
  color: rgba(255, 255, 255, 0.6);
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
      background-color: rgba(255, 255, 255, 0.05);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      &:hover {
        background-color: var(--primary);
        color: white;
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
        color: rgba(255, 255, 255, 0.6);
        text-decoration: none;
        font-size: 0.88rem;
        transition: color 0.3s;
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
