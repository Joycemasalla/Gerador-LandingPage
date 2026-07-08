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


export default function MinimalistTemplate({ data, images = [] }) {
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

  const words = tickerWords.length > 0 ? tickerWords : ['QUALIDADE', 'CONFIANÇA', 'EXCELÊNCIA', 'ATENDIMENTO'];

  return (
    <MinimalistWrapper $theme={theme}>
      {/* Cabeçalho */}
      <Header>
        <div className="container header-container">
          <Logo className="logo">{businessName}</Logo>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
            Falar no WhatsApp
          </a>
        </div>
      </Header>

      {/* Hero Centrado e Respirado */}
      <HeroSection>
        <div className="container">
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

      {/* Ticker / Marquee Delicado */}
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

      {/* Dores (Pain Points) — Dupla Coluna Minimalista */}
      {painPoints && painPoints.length > 0 && (
        <PainSection>
          <div className="container grid-pain">
            <div className="pain-intro">
              <span className="tag-pre">DORES COMUNS</span>
              <h2>Entendemos as suas <span className="destaque">dificuldades</span>.</h2>
              <p>Muitas pessoas enfrentam estes mesmos problemas diariamente. Deixe-nos te ajudar.</p>
            </div>
            <div className="pain-list">
              {painPoints.map((pain, idx) => (
                <div className="pain-card" key={idx}>
                  <div className="pain-dot" />
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
            <h2>Nossa Trajetória</h2>
            {about.paragraphs?.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ marginTop: '15px' }}>
              Falar Conosco
            </a>
          </div>
        </div>
      </AboutSection>

      {/* Serviços — Clean e Minimalista */}
      {services.length > 0 && (
        <ServicesSection>
          <div className="container">
            <h2 className="section-title">Serviços Disponíveis</h2>
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
              <h2>O que nos diferencia?</h2>
              <div className="benefits-list">
                {benefits.map((b, idx) => (
                  <div className="benefit-item" key={idx}>
                    <div className="benefit-icon">
                      <SafeIcon name="FaCheck" />
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
            <h2 className="section-title">Opiniões Reais</h2>
            <div className="testimonials-grid">
              {testimonials.map((t, idx) => (
                <div className="testimonial-card" key={idx}>
                  {t.isPlaceholder && (
                    <PlaceholderBadge>
                      ⚠️ Exemplo — substitua por depoimento real antes de publicar
                    </PlaceholderBadge>
                  )}
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
            <h2 className="section-title">Dúvidas Comuns</h2>
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
          <p>&copy; {new Date().getFullYear()} {businessName}. Landing page minimalista.</p>
        </div>
      </Footer>
    </MinimalistWrapper>
  );
}

// ── Animações e Estilos Minimalist ──────────────────────────────────────────
const tickerScroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MinimalistWrapper = styled.div`
  --primary: ${props => props.$theme.primaryColor || '#1e293b'};
  --secondary: ${props => props.$theme.secondaryColor || '#475569'};
  --dark: ${props => props.$theme.darkColor || '#1e293b'};
  --light: ${props => props.$theme.lightColor || '#f8fafc'};
  --text-on-light: ${props => props.$theme.textColor || '#334155'};
  --text-on-dark: ${props => props.$theme.textColorOnDark || '#f8fafc'};
  --radius: 4px;
  
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--text-on-light);
  background-color: var(--light);
  line-height: 1.7;
  width: 100%;
  text-align: left;
  overflow-x: hidden;

  h1, h2, h3, h4, .logo {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: var(--dark);
  }

  .destaque {
    font-style: italic;
    color: var(--primary);
    font-family: 'Playfair Display', serif;
    border-bottom: 2px solid var(--secondary);
    font-weight: 700;
  }

  .container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    align-items: center;
    @media (max-width: 768px) { grid-template-columns: 1fr; gap: 30px; }
  }

  .fade-in {
    animation: ${fadeInUp} 0.7s ease forwards;
  }

  /* Botão minimalista */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: var(--primary);
    color: white;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    padding: 10px 22px;
    border-radius: var(--radius);
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.2s ease;

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }

  .btn-lg { padding: 12px 28px; font-size: 1rem; }
  .btn-sm { padding: 6px 14px; font-size: 0.8rem; }
`;

const Header = styled.header`
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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
  padding: 120px 0;
  text-align: center;
  background-color: white;

  h1 {
    font-size: 3.4rem;
    line-height: 1.15;
    margin-bottom: 24px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    @media (max-width: 768px) { font-size: 2.3rem; }
  }

  .hero-subheadline {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto 36px auto;
    color: #475569;
  }

  .trust-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background-color: #f1f5f9;
    color: #475569;
    font-size: 0.78rem;
    font-weight: 600;
    margin-bottom: 20px;
    border-radius: 50px;
  }
`;

const TickerWrapper = styled.div`
  background-color: var(--light);
  color: var(--primary);
  padding: 12px 0;
  overflow: hidden;
  white-space: nowrap;
  border-y: 1px solid rgba(0, 0, 0, 0.05);
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
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 1.5px;
    display: flex;
    align-items: center;
    gap: 12px;
    opacity: 0.8;
  }

  .bullet {
    color: var(--secondary);
    font-size: 1.2rem;
  }
`;

const PainSection = styled.section`
  padding: 80px 0;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  .grid-pain {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 40px;
    align-items: center;
    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }

  .tag-pre {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--secondary);
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
    display: flex;
    gap: 12px;
    align-items: flex-start;

    .pain-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--primary);
      margin-top: 10px;
      flex-shrink: 0;
    }

    p {
      font-size: 1rem;
      color: var(--text-on-light);
    }
  }
`;

const AboutSection = styled.section`
  padding: 80px 0;
  background-color: var(--light);
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
    p { margin-bottom: 16px; font-size: 0.98rem; }
  }
`;

const ServicesSection = styled.section`
  padding: 80px 0;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  .section-title { text-align: center; font-size: 2rem; margin-bottom: 40px; }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
  }

  .service-card {
    background-color: var(--light);
    padding: 30px 24px;
    border-radius: var(--radius);
    border: 1px solid rgba(0, 0, 0, 0.04);

    h3 { font-size: 1.2rem; margin-bottom: 10px; }
    p { font-size: 0.9rem; color: #475569; }
  }

  .service-icon {
    width: 44px;
    height: 44px;
    background-color: white;
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    margin-bottom: 20px;
    border-radius: 50%;
  }
`;

const BenefitsSection = styled.section`
  padding: 80px 0;
  background-color: var(--light);
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
    gap: 16px;
  }

  .benefit-item {
    display: flex;
    gap: 14px;
  }

  .benefit-icon {
    color: var(--primary);
    font-size: 1.1rem;
    margin-top: 4px;
  }

  .benefit-text {
    h4 { font-size: 1.05rem; margin-bottom: 4px; }
    p { font-size: 0.88rem; color: #475569; }
  }
`;

const ProcessSection = styled.section`
  padding: 80px 0;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  .section-title { text-align: center; font-size: 2rem; margin-bottom: 50px; }

  .process-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    @media (max-width: 768px) { grid-template-columns: 1fr; gap: 30px; }
  }

  .process-card {
    text-align: center;

    h3 { font-size: 1.15rem; margin-top: 15px; margin-bottom: 10px; }
    p { font-size: 0.88rem; color: #475569; }
  }

  .process-badge {
    width: 36px;
    height: 36px;
    margin: 0 auto;
    border-radius: 50%;
    background-color: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
  }
`;

const TestimonialsSection = styled.section`
  padding: 80px 0;
  background-color: var(--light);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);

  .section-title { text-align: center; font-size: 2rem; margin-bottom: 40px; }
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .testimonial-card {
    background-color: white;
    padding: 30px 24px;
    border-radius: var(--radius);
    border: 1px solid rgba(0, 0, 0, 0.03);

    .quote {
      font-style: italic;
      font-size: 0.95rem;
      margin-bottom: 20px;
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
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  .section-title { text-align: center; font-size: 2rem; margin-bottom: 40px; }
  .faq-container { max-width: 750px; }
  .faq-list { display: flex; flex-direction: column; gap: 14px; }

  .faq-item {
    background-color: var(--light);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .faq-question {
    width: 100%;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: none;
    border: none;
    font-size: 1rem;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
    gap: 15px;
    font-family: 'Playfair Display', serif;
  }

  .faq-toggle-icon {
    font-size: 0.8rem;
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
    padding: 0 20px 16px 20px;
    font-size: 0.9rem;
    color: #475569;
  }
`;

const CtaFinalSection = styled.section`
  background-color: white;
  text-align: center;
  padding: 100px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  h2 {
    font-size: 2.3rem;
    margin-bottom: 16px;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 30px;
    color: #475569;
    max-width: 550px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const Footer = styled.footer`
  background-color: #0f172a;
  color: #94a3b8;
  padding: 60px 0 30px 0;

  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
    @media (max-width: 768px) { grid-template-columns: 1fr; gap: 20px; }
  }

  .footer-brand {
    h3 { color: white; font-size: 1.25rem; margin-bottom: 12px; }
  }

  .social-icons {
    display: flex;
    gap: 12px;
    margin-top: 15px;

    a {
      color: white;
      background-color: rgba(255, 255, 255, 0.05);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
      &:hover { opacity: 0.8; }
    }
  }

  .footer-links, .footer-contact {
    h4 { color: white; font-size: 0.9rem; margin-bottom: 16px; }
  }

  ul {
    list-style: none;
    li {
      margin-bottom: 8px;
      a {
        color: #94a3b8;
        text-decoration: none;
        font-size: 0.85rem;
        transition: color 0.2s;
        &:hover { color: white; }
      }
    }
  }

  .footer-contact {
    p {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      svg { color: var(--secondary); }
    }
  }

  .footer-bottom {
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.78rem;
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
