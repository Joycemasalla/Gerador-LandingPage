# Diretrizes para Landing Pages Profissionais

Sempre que atuar no desenvolvimento ou geração de Landing Pages (LP), aplique as seguintes diretrizes avançadas de Motion e Interatividade:

## Extensão do UPLF — Módulo de Motion Avançado, Vídeo e Interações Cinemáticas

Sempre utilize este add-on ao criar uma landing page com camada de motion "agência premium" (tipo Apple, Linear, Vercel, Awwwards).

### 1. Como usar
No escopo da landing page, siga as regras de NÍVEL DE MOTION: [Estático | Sutil | Cinemático | Imersivo].

### 2. Os 4 Níveis de Motion
**Nível 1 — Estático**
Fade/slide de entrada em seções via `whileInView`. É o default do UPLF.

**Nível 2 — Sutil (recomendado para serviços locais)**
- Parallax leve em imagens de hero (`useScroll` + `useTransform`)
- Hover states com micro-interações (scale, glow, underline animado)
- Stagger children em listas (`staggerChildren: 0.08`)
- Cursor customizado opcional em áreas premium
- Loading skeleton em imagens (blur-up)

**Nível 3 — Cinemático (SaaS, infoproduto, marca premium)**
Inclui tudo do Sutil, mais:
- Scroll-driven storytelling: seções que se transformam conforme o scroll (`useScroll({ target, offset })`)
- Vídeo de fundo no hero (`muted`, `autoplay`, `loop`, `playsInline`, `poster` obrigatório, `<source>` webm + mp4)
- Sticky sections com conteúdo que muda enquanto a imagem/vídeo fica fixo
- Reveal em texto por palavra/letra (SplitText manual com `motion.span`)
- Números animados (count-up com animate + `useInView`)
- Marquee infinito para logos/depoimentos
- Magnetic buttons (botão que "puxa" o cursor)
- Image comparison slider (antes/depois) quando aplicável
- Transições entre seções com clip-path ou masks

**Nível 4 — Imersivo (lançamentos, marcas de luxo, portfolios)**
Inclui tudo do Cinemático, mais:
- WebGL / Three.js via `@react-three/fiber` para hero 3D, partículas ou distorção de imagem
- Lenis para smooth scroll global (`@studio-freight/lenis`)
- GSAP + ScrollTrigger para timelines complexas (pinning, scrubbing frame-a-frame)
- Vídeo scrubado pelo scroll (canvas + sequência de frames ou currentTime controlado)
- Cursor com trail e estados contextuais (muda ao hover em CTA, imagem, texto)
- Page transitions com overlay animado
- Sound design opcional (hover sfx, toggle mute)

### 3. Regras Técnicas Obrigatórias (todos os níveis)
**Performance é lei:**
- Toda animação em transform e opacity (nunca width, height, top, left)
- `will-change` apenas durante a animação, remover depois
- `prefers-reduced-motion` respeitado sempre (`useReducedMotion` do Framer)
- Vídeos: `<video muted autoplay loop playsInline preload="metadata" poster="...">`, sempre com fallback de imagem
- Vídeo hero ≤ 3MB, resolução máxima 1920×1080, codec h264 + webm/vp9
- Lazy-load em tudo abaixo da dobra (`loading="lazy"`, IntersectionObserver)
- Three.js só carregado via dynamic import quando a seção entra na viewport
- FPS alvo: 60fps em desktop mid-range, 30fps mínimo em mobile
- Lighthouse Performance ≥ 85 mesmo com motion cinemático

**Acessibilidade:**
- Vídeo de fundo é decorativo → `aria-hidden`, sem áudio
- Vídeo com conteúdo → controles nativos + legendas
- Animações não podem bloquear scroll ou leitura
- Fallback estático quando `prefers-reduced-motion: reduce`

### 4. Requisitos Atuais (Aplicar sempre na LP)
- **CTAs (WhatsApp)**: Adicionar botões magnéticos e microinterações de hover no CTA de agendamento pelo WhatsApp, mantendo a acessibilidade e respeitando `prefers-reduced-motion`.
- **Hero**: Adicionar um vídeo de fundo mudo no hero da landing, com poster e fallback para imagem para garantir carregamento rápido.
- **Nível de Motion**: Aplicar o nível de motion Cinemático na landing, incluindo reveals, parallax e storytelling por scroll sem prejudicar a performance.
