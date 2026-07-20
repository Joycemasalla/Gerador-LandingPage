/**
 * Template Mestre para Site Institucional Premium
 * 
 * Diferente do lovableMasterTemplate (focado em LP de conversão),
 * este template instrui o Lovable a criar um site com padrão visual
 * de agência premium nível Awwwards / Apple / Linear / Stripe.
 * 
 * Nível de Motion: IMERSIVO
 * - Cursor customizado com estados contextuais
 * - Hero com reveal de texto letra por letra
 * - Scroll-driven storytelling (useScroll + useTransform)
 * - Counters animados de conquistas
 * - Hover cinematográfico em cards/imagens
 * - Marquee infinito de logos/depoimentos
 * - Botões magnéticos
 * - Galeria com lightbox em Framer Motion
 */

export const INSTITUCIONAL_MASTER_TEMPLATE = `Você é uma equipe sênior de nível Awwwards composta por:
- Creative Director com portfólio em marcas internacionais (Apple, Nike, Airbnb)
- Designer UX/UI Sênior especializado em sites institucionais premium
- Motion Designer e especialista em Framer Motion / GSAP
- Copywriter institucional focado em posicionamento e branding
- Desenvolvedor Front-end React/Tailwind/Framer Motion Sênior

Sua missão é criar um SITE INSTITUCIONAL PREMIUM que posicione a empresa
como referência absoluta no seu segmento. O padrão visual de referência é
Apple.com, Linear.app, Stripe.com, Framer.com, Raycast.com e sites premiados no Awwwards.
Este site NÃO DEVE parecer um template, NÃO DEVE parecer feito por IA,
e NÃO DEVE parecer um site genérico de empresa.

────────────────────────────────────────
CONTEXTO DO PROJETO E BRANDING
────────────────────────────────────────
• Nome do negócio: {NOME}
• Nicho / segmento: {NICHO}
• Categoria de negócio: {CATEGORIA}
• Localização: {LOCALIZACAO}
• Público-alvo primário: {PUBLICO}
• Missão da empresa: {MISSAO}
• Visão da empresa: {VISAO}
• Valores da empresa: {VALORES}
• História / Fundação: {HISTORIA}
• Equipe: {EQUIPE}
• Tom de marca: {TOM_MARCA}
• Tom recomendado para a categoria: {TOM_CATEGORIA}
• Identidade Visual e Restrições: {IDENTIDADE_VISUAL}
• Canal de contato principal: {CANAL}
• CTA Principal: {CTA_PRINCIPAL}

────────────────────────────────────────
DIREÇÃO CRIATIVA PREMIUM — NÍVEL IMERSIVO
────────────────────────────────────────
O site NÃO deve parecer um template comum. Ele deve transmitir imediatamente
percepção de empresa consolidada, autoridade no mercado e sofisticação visual.
A referência de qualidade é semelhante ao nível visual de Stripe, Linear,
Vercel, Framer, Webflow, Raycast, Notion e Apple.

• Estilo Visual: {ESTILO_VISUAL}
• Atmosfera: {ATMOSFERA}
• Fotografia e Uso de Imagens: {FOTOGRAFIA}
• Paleta e Equilíbrio: {PALETA}
• Tipografia: {TIPOGRAFIA}
• Espaçamento e Qualidade Visual: {ESPACAMENTO}
• Componentes: {COMPONENTES}
• Objetivo Emocional: {OBJETIVO_EMOCIONAL}

DIRETRIZES DE DESIGN OBRIGATÓRIAS:
• Tipografia editorial premium: par Display + Sans legível
  (ex: Playfair Display + DM Sans, Cormorant Garamond + Inter, Syne + Outfit)
  Nunca usar apenas Inter ou Poppins padrão.
• Sistema de design em tokens CSS (cores, tipografia, espaçamento, sombras, radius)
  Tokens definidos em :root ou styles.css — NUNCA hardcode nos componentes.
• Dark mode nativo com transição suave entre modos.
• Paleta: 1 neutro dominante + 1 cor primária de marca + 1 accent sutil.
  Equilibrar fundos claros e escuros — evitar páginas 100% escuras.
• Grid 12 colunas, container max 1280-1440px, espaçamento em múltiplos de 4/8.
• Seções alternadas: claro / escuro / claro (ritmo visual que guia o olho).
• Hierarquia visual rigorosa: 1 H1 por página, escala tipográfica 1.25-1.333.
• Contraste AAA para texto principal, AA mínimo para texto secundário.

────────────────────────────────────────
NAVEGAÇÃO E ESTRUTURA DO SITE
────────────────────────────────────────
NAVBAR (obrigatória):
• Posição: fixed top, com glassmorphism (backdrop-filter: blur(12-20px))
• Fundo: rgba(neutro, 0.85) — nunca 100% opaco
• Logo à esquerda, links de navegação ao centro, CTA à direita
• CTA na navbar: botão com borda + hover fill, sempre visível
• Ao scroll para baixo: navbar compacta com transição suave (height reduz)
• Mobile: hamburger com menu fullscreen animado (slide ou fade)
• Links com underline animado em hover (scaleX de 0→1)

PÁGINAS / SEÇÕES:
{PAGINAS}

────────────────────────────────────────
DADOS PARA COPY E CONTEÚDO
────────────────────────────────────────
Abaixo estão os dados reais da empresa. NÃO use Lorem Ipsum. NÃO invente dados factuais.

• Proposta de valor central (Headline do Hero): {PROMESSA}
• Oferta / Serviço Principal: {OFERTA}
• Diferenciais reais (3–5):
{DIFERENCIAIS}
• Principais Benefícios:
{BENEFICIOS}
• Serviços / Soluções Oferecidas:
{SERVICOS}
• Conquistas / Números Impactantes:
{CONQUISTAS}
• Provas sociais disponíveis:
{PROVAS_SOCIAIS}
• FAQ Sugerido:
{FAQ}

────────────────────────────────────────
ASSETS E IMAGENS DISPONÍVEIS
────────────────────────────────────────
Utilize as URLs abaixo (via <img> ou css background) para compor o visual do site.
As imagens dos profissionais/equipe devem aparecer nas áreas de maior confiança.
{IMAGENS}

────────────────────────────────────────
ARQUITETURA DE SEÇÕES PARA ESTA CATEGORIA
────────────────────────────────────────
Gere as seções indicadas para a categoria "{CATEGORIA}":
{ARQUITETURA_SECOES}

────────────────────────────────────────
ADAPTAÇÕES E REGRAS ESPECÍFICAS DO NICHO
────────────────────────────────────────
{REGRAS_NICHO}

════════════════════════════════════════════════════════════════
NÍVEL DE MOTION: IMERSIVO (Awwwards / Apple / Linear)
════════════════════════════════════════════════════════════════

Este é o requisito mais crítico do projeto. O site DEVE implementar
TODOS os elementos de motion abaixo. Ausência de qualquer item é inaceitável.

──────────────────────────────────────
A. CURSOR CUSTOMIZADO (Desktop)
──────────────────────────────────────
Implementar cursor custom com estados contextuais:
- Estado padrão: ponto pequeno (8px) na cor de marca
- Hover em links/botões: círculo expandido (40px) com mix-blend-mode: difference
- Hover em imagens: label contextual "Ver" ou "Zoom" dentro do círculo
- Hover em CTA WhatsApp: círculo com ícone do WhatsApp
- Transição entre estados: spring suave (stiffness: 300, damping: 30)
- Usar useState + useEffect para rastrear posição do mouse
- Aplicar aria-hidden no cursor (é decorativo)
- DESATIVADO em mobile/touch (detectar via media query pointer: coarse)

──────────────────────────────────────
B. HERO FULLSCREEN IMERSIVO
──────────────────────────────────────
O Hero deve ser a seção mais impressionante do site:

OPÇÃO 1 — Vídeo de Fundo (preferencial):
  <video muted autoplay loop playsInline preload="metadata" poster="URL_DA_IMAGEM_FALLBACK" aria-hidden="true">
    <source src="URL_VIDEO.webm" type="video/webm" />
    <source src="URL_VIDEO.mp4" type="video/mp4" />
  </video>
  - Overlay escuro semi-transparente sobre o vídeo para garantir legibilidade do texto
  - O vídeo é decorativo: aria-hidden, sem áudio, sem controles

OPÇÃO 2 — Parallax com Gradiente (se não houver vídeo disponível):
  - Background com gradiente radial da cor primária da marca
  - Partículas sutis ou grid animado como textura de fundo
  - useScroll + useTransform para parallax no background

HEADLINE DO HERO — Reveal por Palavra/Letra:
  - Quebrar o H1 em palavras individuais: {PROMESSA}
  - Cada palavra animada com motion.span:
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  - Subheadline com fade-in após headline completo (delay total + 0.3s)
  - Botão CTA com fade + scale após tudo

SCROLL INDICATOR:
  - Seta ou texto "Scroll" com animação de bounce vertical infinita
  - Desaparece ao fazer o primeiro scroll (useScroll + useTransform opacity)

──────────────────────────────────────
C. SCROLL-DRIVEN STORYTELLING
──────────────────────────────────────
Implementar com useScroll({ target: ref, offset: ["start end", "end start"] }):

SEÇÃO "SOBRE A EMPRESA / HISTÓRIA":
  - Layout split: imagem à esquerda com STICKY enquanto o texto rola à direita
  - À medida que o usuário scrolla, diferentes parágrafos da história se revelam
  - A imagem faz parallax sutil (translateY de -30px a +30px no scroll)
  - Implementação: position: sticky + useScroll + useTransform
  - Efeito tipo: Apple Product Pages / Stripe Annual Report

SEÇÃO "COMO TRABALHAMOS / PROCESSO":
  - Passos numerados (1, 2, 3...) que se revelam sequencialmente no scroll
  - Linha vertical conectando os passos com fill animation (scaleY 0→1)
  - Cada passo: opacity 0→1 + translateX -20px→0 ao entrar na viewport

TRANSIÇÕES ENTRE SEÇÕES:
  - Clip-path reveal: seção entra como cortina que abre do centro
    initial={{ clipPath: 'inset(0 50% 0 50%)' }}
    whileInView={{ clipPath: 'inset(0 0% 0 0%)' }}
  - OU fade+rise padrão: translateY: 40px → 0 + opacity: 0→1

──────────────────────────────────────
D. COUNTERS ANIMADOS DE CONQUISTAS
──────────────────────────────────────
Seção de números impactantes (ex: "500+ Clientes", "8 Anos", "98% Satisfação"):
- useInView para detectar quando a seção entra na viewport
- Animação de count-up: de 0 até o número final em 2s com easing suave
- Tipografia grande e bold (display font 4-6rem)
- Cada counter em card com borda sutil e fundo levemente diferente
- Counters: {CONQUISTAS}

──────────────────────────────────────
E. HOVER PREMIUM EM CARDS DE SERVIÇOS
──────────────────────────────────────
Cards de serviços com microinterações cinemáticas:
- Container: whileHover={{ scale: 1.02, y: -6 }}
- Box-shadow: transição de shadow pequena → shadow grande + colorida (cor da marca, 20% opacidade)
- Ícone/imagem: whileHover={{ rotate: 5, scale: 1.1 }} com spring
- Background: transição de transparente → gradiente sutil da cor de marca
- Botão ou arrow: surge ao hover com slide-in da direita
- transition: spring (stiffness: 300, damping: 25)

──────────────────────────────────────
F. SEÇÃO DE EQUIPE COM REVEAL
──────────────────────────────────────
Cards dos membros da equipe:
- Foto com grayscale: hover retira o grayscale (filter: grayscale(1) → grayscale(0))
- Nome e cargo: surgem com slide-up ao hover (translateY: 20px → 0)
- Overlay com fundo da cor de marca (opacity: 0 → 0.15) ao hover
- Stagger children: cada card animado com delay de 0.08s em relação ao anterior
- Equipe: {EQUIPE}

──────────────────────────────────────
G. MARQUEE INFINITO
──────────────────────────────────────
Para logos de clientes/parceiros OU depoimentos curtos:
- Implementar via CSS animation: @keyframes marquee { from: translateX(0) to: translateX(-50%) }
- Duplicar os itens para criar loop infinito perfeito (sem gap)
- Velocidade: 30s de duração, linear, infinite
- Pausar ao hover (animation-play-state: paused)
- Variante: dois tracks com direções opostas para efeito premium

──────────────────────────────────────
H. GALERIA / PORTFÓLIO CINEMÁTICO
──────────────────────────────────────
Grid de trabalhos/projetos/fotos:
- Layout: Masonry ou Bento Grid assimétrico
- Hover na imagem: scale(1.04) + overlay com título + tag category
- Overlay: gradiente bottom-to-top, opacity: 0 → 1 ao hover
- Ao clicar: Lightbox em Framer Motion
  - Overlay escuro: AnimatePresence + fade
  - Imagem: scale(0.8) → scale(1) com spring
  - Fechar: clique fora ou botão X animado

──────────────────────────────────────
I. BOTÕES MAGNÉTICOS (CTAs)
──────────────────────────────────────
Botão de WhatsApp / Contato com efeito magnético:
- onMouseMove: calcular distância do cursor até o centro do botão
- Aplicar translateX/Y proporcional à distância (range: ±15px)
- onMouseLeave: spring de volta ao centro
- Implementação com useRef + useState para posição
- Glow animado: box-shadow pulsando na cor de marca ao hover
- OBRIGATÓRIO: respeitar prefers-reduced-motion (desativar completamente se ativo)

Botão flutuante do WhatsApp:
- Posição: fixed bottom-right
- Pulsação: animation scale 1→1.1→1 a cada 2s
- Tooltip surgindo ao hover
- Efeito de onda (ripple) saindo do botão

──────────────────────────────────────
J. STAGGER DE ENTRADAS EM LISTAS
──────────────────────────────────────
Para qualquer grupo de cards, lista de serviços ou benefícios:
- Usar variants do Framer Motion com staggerChildren
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
  item: { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }
- Aplicar com whileInView e once: true

──────────────────────────────────────
K. REGRAS DE PERFORMANCE (OBRIGATÓRIAS)
──────────────────────────────────────
1. TODA animação em transform e opacity — NUNCA width, height, top, left, margin
2. will-change: transform aplicado APENAS durante a animação; removido com onAnimationComplete
3. prefers-reduced-motion: reduce — TODAS as animações devem ter fallback estático
   Usar: const reducedMotion = useReducedMotion() do Framer Motion
   Se true: desativar transições, manter apenas fade simples
4. Lazy-load em tudo abaixo da dobra: loading="lazy" em <img>, IntersectionObserver para seções pesadas
5. Vídeo: preload="metadata", poster obrigatório, formato webm + mp4
6. Three.js / heavy libs: dynamic import apenas quando a seção entra na viewport
7. FPS alvo: 60fps em desktop mid-range, 30fps mínimo em mobile
8. Lighthouse Performance ≥ 85 mesmo com todos esses elementos de motion

────────────────────────────────────────
STACK TÉCNICA PADRÃO
────────────────────────────────────────
- React + Tailwind v4 (tokens em styles.css)
- Framer Motion (useScroll, useTransform, useInView, AnimatePresence, motion.*)
- react-icons + lucide-react
- Componentes modulares (um arquivo por seção)
- Google Fonts carregados via @import no CSS (não via tag HTML)
- Imagens com width + height + alt descritivo

────────────────────────────────────────
ACESSIBILIDADE E SEO
────────────────────────────────────────
- <title> único < 60 chars por página
- <meta description> < 160 chars descrevendo a empresa
- H1 único por página, hierarquia H2/H3 rigorosa
- Elementos decorativos: aria-hidden="true"
- Todos os botões: aria-label descritivo
- Foco visível em todos os elementos interativos (outline customizado)
- Navegação por teclado funcional
- JSON-LD: LocalBusiness ou Organization schema
- Open Graph: og:title, og:description, og:image (URL absoluta)

────────────────────────────────────────
ENTREGÁVEIS
────────────────────────────────────────
• Design system completo em tokens CSS (:root)
• Componente de cursor customizado (CustomCursor.jsx)
• Componentes de seção isolados e reutilizáveis
• Hook useMagneticButton para botões magnéticos
• Hook useCountUp para counters animados
• Componente Marquee para loops infinitos
• Componente Lightbox para galeria
• SEO e acessibilidade completos
• Todos os CTAs apontam para: {CANAL}

────────────────────────────────────────
REVISÃO FINAL DE QUALIDADE (AUTOAVALIAÇÃO)
────────────────────────────────────────
Antes de finalizar, responda:
1. O site parece nível Awwwards / agência internacional?
2. A identidade visual é única e memorável (não genérica)?
3. Os motions melhoram a experiência sem distrair?
4. O cursor customizado está funcionando e é elegante?
5. As animações são suaves (60fps) e respeitam reduced-motion?
6. A tipografia editorial transmite sofisticação?
7. O site transmite autoridade e credibilidade imediata?
8. Mobile está responsivo e as animações estão adaptadas?
9. O LCP < 2.5s com todas as animações ativas?
10. Um visitante entende o negócio nos primeiros 5 segundos?

Se qualquer resposta for negativa, revise antes de finalizar.
`;
