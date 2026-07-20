import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaPlus, FaTrash, FaInstagram, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaPalette, FaUpload, FaSmile, FaSearch, FaRocket, FaChevronDown, FaChevronUp, FaSpinner, FaCheckCircle, FaStar, FaQuestionCircle, FaComments } from 'react-icons/fa';
import { analyzeInstagramProfile } from '../services/aiService';

export default function GeneratorForm({ onSubmit, isGenerating, customApiKey }) {
  // ── Estado: Instagram Handle (campo principal) ──────────────────────────
  const [instagramHandle, setInstagramHandle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeSuccess, setAnalyzeSuccess] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');

  // ── Estado: Accordion de Ajustes Avançados ──────────────────────────────
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // ── Estado: Campos do formulário (pré-preenchíveis ou manuais) ──────────
  const [businessName, setBusinessName] = useState('');
  const [segment, setSegment] = useState('');
  const [bio, setBio] = useState('');
  const [tone, setTone] = useState('persuasivo');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [instagram, setInstagram] = useState('');

  const [services, setServices] = useState(['']);
  const [benefits, setBenefits] = useState(['']);

  // ── Estado: Depoimentos e FAQs (preenchimento manual) ───────────────────
  const [manualTestimonials, setManualTestimonials] = useState([]);
  const [manualFaqs, setManualFaqs] = useState([]);
  const [isTestimonialsOpen, setIsTestimonialsOpen] = useState(false);

  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState('#10B981');
  const [useAIColors, setUseAIColors] = useState(true);

  const [images, setImages] = useState([]);
  
  // ── Estado: Modal de Aprovação de Imagens do Instagram ──────────────────
  const [showImageApprovalModal, setShowImageApprovalModal] = useState(false);
  const [tempImages, setTempImages] = useState([]);
  const [tempProfileData, setTempProfileData] = useState(null);

  // ── Handlers: Listas dinâmicas ──────────────────────────────────────────
  const handleAddService = () => setServices([...services, '']);
  const handleRemoveService = (index) => {
    const next = services.filter((_, i) => i !== index);
    setServices(next.length ? next : ['']);
  };
  const handleServiceChange = (index, value) => {
    const next = [...services];
    next[index] = value;
    setServices(next);
  };

  const handleAddBenefit = () => setBenefits([...benefits, '']);
  const handleRemoveBenefit = (index) => {
    const next = benefits.filter((_, i) => i !== index);
    setBenefits(next.length ? next : ['']);
  };
  const handleBenefitChange = (index, value) => {
    const next = [...benefits];
    next[index] = value;
    setBenefits(next);
  };

  // ── Handlers: Depoimentos manuais ────────────────────────────────────────
  const emptyTestimonial = () => ({ name: '', role: '', rating: 5, text: '' });
  const handleAddTestimonial = () => setManualTestimonials([...manualTestimonials, emptyTestimonial()]);
  const handleRemoveTestimonial = (idx) => setManualTestimonials(manualTestimonials.filter((_, i) => i !== idx));
  const handleTestimonialChange = (idx, field, value) => {
    const next = [...manualTestimonials];
    next[idx] = { ...next[idx], [field]: field === 'rating' ? Number(value) : value };
    setManualTestimonials(next);
  };

  // ── Handlers: FAQs manuais ───────────────────────────────────────────────
  const emptyFaq = () => ({ question: '', answer: '' });
  const handleAddFaq = () => setManualFaqs([...manualFaqs, emptyFaq()]);
  const handleRemoveFaq = (idx) => setManualFaqs(manualFaqs.filter((_, i) => i !== idx));
  const handleFaqChange = (idx, field, value) => {
    const next = [...manualFaqs];
    next[idx] = { ...next[idx], [field]: value };
    setManualFaqs(next);
  };

  // ── Handler: Upload de imagens ──────────────────────────────────────────
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 6) {
      alert('Você pode selecionar no máximo 6 fotos para a galeria.');
      return;
    }
    const promises = files.map(file => new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    }));
    Promise.all(promises).then(base64Images => setImages(prev => [...prev, ...base64Images]));
  };
  const handleRemoveImage = (index) => setImages(images.filter((_, i) => i !== index));

  // ── Helper: Preenche os campos a partir dos dados da IA ─────────────────
  const fillFormWithProfileData = (data) => {
    if (data.businessName) setBusinessName(data.businessName);
    if (data.segment) setSegment(data.segment);
    if (data.bio) setBio(data.bio);
    if (data.services?.length) setServices(data.services.filter(Boolean));
    if (data.benefits?.length) setBenefits(data.benefits.filter(Boolean));
    if (data.contacts) {
      if (data.contacts.phone) setPhone(data.contacts.phone);
      if (data.contacts.email) setEmail(data.contacts.email);
      if (data.contacts.address) setAddress(data.contacts.address);
      if (data.contacts.instagram) setInstagram(data.contacts.instagram);
    }
    if (data.instagramImages?.length) {
      setImages(data.instagramImages);
    }
  };

  // ── Handler: Analisar Perfil (Modo de Revisão) ──────────────────────────
  const handleAnalyzeProfile = async () => {
    if (!instagramHandle.trim()) {
      setAnalyzeError('Por favor, insira um link ou @ do Instagram.');
      return;
    }
    setIsAnalyzing(true);
    setAnalyzeError('');
    setAnalyzeSuccess(false);

    try {
      const profileData = await analyzeInstagramProfile(instagramHandle, customApiKey || '');
      fillFormWithProfileData(profileData);
      setAnalyzeSuccess(true);
      setIsAdvancedOpen(true); // Abrir accordion automaticamente após análise
    } catch (err) {
      setAnalyzeError(err.message || 'Erro ao analisar o perfil. Tente novamente ou preencha manualmente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── Handler: Geração Instantânea (1 Clique) com Aprovação de Imagens ─────
  const handleInstantGenerate = async (e) => {
    e.preventDefault();
    if (!instagramHandle.trim()) {
      setAnalyzeError('Por favor, insira um link ou @ do Instagram.');
      return;
    }
    setIsAnalyzing(true);
    setAnalyzeError('');
    setAnalyzeSuccess(false);

    try {
      // 1. Executar análise rápida para puxar as imagens e dados sugeridos
      const profileData = await analyzeInstagramProfile(instagramHandle, customApiKey || '');
      setTempProfileData(profileData);
      
      // 2. Extrair fotos do Instagram para seleção no modal
      const detectedImages = profileData.instagramImages || [];
      if (detectedImages.length > 0) {
        setTempImages(detectedImages.map(url => ({ url, selected: true })));
        setShowImageApprovalModal(true);
      } else {
        // Se nenhuma imagem foi detectada (ou se falhou tudo), prosseguir direto
        // (o backend usará fallbacks automaticamente na geração)
        onSubmit({
          instagramHandle,
          businessName: profileData.businessName,
          segment: profileData.segment,
          bio: profileData.bio,
          services: profileData.services,
          benefits: profileData.benefits,
          contacts: profileData.contacts,
          images: []
        });
      }
    } catch (err) {
      setAnalyzeError(err.message || 'Erro ao analisar perfil antes da geração. Verifique sua chave API.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmImages = () => {
    setShowImageApprovalModal(false);
    const approvedImages = tempImages.filter(img => img.selected).map(img => img.url);
    
    // Dispara a geração final usando os dados já analisados e as fotos aprovadas
    onSubmit({
      instagramHandle,
      businessName: tempProfileData.businessName,
      segment: tempProfileData.segment,
      bio: tempProfileData.bio,
      services: tempProfileData.services,
      benefits: tempProfileData.benefits,
      contacts: tempProfileData.contacts,
      images: approvedImages,
    });
  };

  // ── Handler: Submit do formulário avançado (dados manuais) ───────────────
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!businessName || !segment || !bio) {
      alert('Por favor, preencha os campos obrigatórios: Nome do Negócio, Segmento e Bio.');
      return;
    }
    const filteredServices = services.filter(s => s.trim() !== '');
    const filteredBenefits = benefits.filter(b => b.trim() !== '');
    const filteredTestimonials = manualTestimonials.filter(t => t.name.trim() && t.text.trim());
    const filteredFaqs = manualFaqs.filter(f => f.question.trim() && f.answer.trim());
    onSubmit({
      businessName, segment, bio, tone,
      services: filteredServices,
      benefits: filteredBenefits,
      contacts: { phone, email, address, instagram },
      colors: useAIColors ? null : { primaryColor, secondaryColor },
      images,
      manualTestimonials: filteredTestimonials,
      manualFaqs: filteredFaqs,
    });
  };

  // ── Helper: Dados de teste rápido ────────────────────────────────────────
  const handleLoadMock = () => {
    setInstagramHandle('@studioglamour.beauty');
    setBusinessName('Studio Glamour Beauty');
    setSegment('Salão de Beleza e Estética');
    setBio('Especialistas em mechas, loiros perfeitos, tratamentos capilares de alta tecnologia e manicure. Realçando a sua beleza natural todos os dias!');
    setTone('persuasivo');
    setPhone('11999999999');
    setEmail('contato@studioglamour.com');
    setAddress('Av. Paulista, 1000 - Bela Vista, São Paulo - SP');
    setInstagram('@studioglamour.beauty');
    setServices(['Design de Sobrancelhas', 'Loiro Perfeito e Mechas', 'Hidratação de Luxo', 'Manicure e Nail Art']);
    setBenefits(['Produtos importados de alta linha', 'Atendimento VIP personalizado', 'Ambiente climatizado com Wi-Fi e café']);
    setIsAdvancedOpen(true);
  };

  return (
    <FormWrapper>
      <FormHeader>
        <h2>InstaPage AI</h2>
        <LoadMockBtn type="button" onClick={handleLoadMock}>Preencher Exemplo</LoadMockBtn>
      </FormHeader>

      {/* ── Campo Principal de Instagram ──────────────────────────────── */}
      <InstagramHero>
        <label htmlFor="instagram-input">
          <FaInstagram />
          <span>Link ou @ do Instagram</span>
        </label>
        <StyledInstagramInput>
          <FaInstagram />
          <input
            id="instagram-input"
            type="text"
            placeholder="instagram.com/seu-negocio  ou  @seu-negocio"
            value={instagramHandle}
            onChange={(e) => { setInstagramHandle(e.target.value); setAnalyzeError(''); setAnalyzeSuccess(false); }}
            disabled={isGenerating || isAnalyzing}
          />
        </StyledInstagramInput>

        {analyzeError && <ErrorMessage><span>⚠️ {analyzeError}</span></ErrorMessage>}
        {analyzeSuccess && <SuccessMessage><FaCheckCircle /> <span>Dados do perfil encontrados! Revise abaixo e gere sua landing page.</span></SuccessMessage>}

        {/* Botões de ação principais */}
        <ActionButtons>
          <AnalyzeBtn
            type="button"
            onClick={handleAnalyzeProfile}
            disabled={isGenerating || isAnalyzing || !instagramHandle.trim()}
          >
            {isAnalyzing ? <><FaSpinner className="spin" /> <span>Analisando...</span></> : <><FaSearch /> <span>Analisar Perfil</span></>}
          </AnalyzeBtn>

          <InstantBtn
            type="button"
            onClick={handleInstantGenerate}
            disabled={isGenerating || isAnalyzing || !instagramHandle.trim()}
          >
            {isGenerating ? <><FaSpinner className="spin" /> <span>Gerando...</span></> : <><FaRocket /> <span>Gerar em 1 Clique</span></>}
          </InstantBtn>
        </ActionButtons>

        <HintText>
          <strong>Gerar em 1 Clique:</strong> A IA pesquisa tudo automaticamente na web. &nbsp;|&nbsp;
          <strong>Analisar Perfil:</strong> Extrai os dados para você revisar antes de gerar.
        </HintText>
      </InstagramHero>

      {/* ── Divisor e Accordion de Ajustes Avançados ────────────────── */}
      <AccordionToggle
        type="button"
        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        $isOpen={isAdvancedOpen}
      >
        <span>
          {analyzeSuccess ? '✅ Dados Pré-Preenchidos — ' : ''}
          Ajustes Avançados (Preencher ou Editar Manualmente)
        </span>
        {isAdvancedOpen ? <FaChevronUp /> : <FaChevronDown />}
      </AccordionToggle>

      {isAdvancedOpen && (
        <AdvancedForm onSubmit={handleFormSubmit}>
          {/* Identidade */}
          <FormSection>
            <h3><FaSmile /> Identidade do Negócio</h3>
            <FormGroup>
              <label>Nome do Negócio *</label>
              <input type="text" placeholder="Ex: Studio Glamour Beauty" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
            </FormGroup>
            <FormGroup>
              <label>Segmento *</label>
              <input type="text" placeholder="Ex: Salão de Beleza, Hamburgueria, Clínica" value={segment} onChange={(e) => setSegment(e.target.value)} required />
            </FormGroup>
            <FormGroup>
              <label>Bio do Perfil *</label>
              <textarea rows="3" placeholder="Cole aqui a biografia do perfil do Instagram..." value={bio} onChange={(e) => setBio(e.target.value)} required />
            </FormGroup>
            <FormGroup>
              <label>Tom de Voz da Copy</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)}>
                <option value="persuasivo">Altamente Persuasivo &amp; Vendedor</option>
                <option value="profissional">Profissional &amp; Corporativo</option>
                <option value="descontraido">Descontraído &amp; Amigável</option>
                <option value="emocional">Emocional &amp; Inspirador</option>
              </select>
            </FormGroup>
          </FormSection>

          {/* Contatos */}
          <FormSection>
            <h3><FaInstagram /> Links e Contatos</h3>
            <FormGroup>
              <label><FaWhatsapp /> WhatsApp (Apenas números com DDD)</label>
              <input type="text" placeholder="Ex: 11999999999" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <label><FaInstagram /> Usuário do Instagram</label>
              <input type="text" placeholder="Ex: @studioglamour.beauty" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <label><FaEnvelope /> E-mail de Contato</label>
              <input type="email" placeholder="Ex: contato@negocio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <label><FaMapMarkerAlt /> Endereço Completo</label>
              <input type="text" placeholder="Ex: Rua das Flores, 123 - Centro" value={address} onChange={(e) => setAddress(e.target.value)} />
            </FormGroup>
          </FormSection>

          {/* Serviços */}
          <FormSection>
            <SectionHeader>
              <h3>Serviços / Produtos</h3>
              <IconButton type="button" onClick={handleAddService}><FaPlus /></IconButton>
            </SectionHeader>
            {services.map((service, index) => (
              <RowGroup key={index}>
                <input type="text" placeholder={`Serviço ${index + 1}`} value={service} onChange={(e) => handleServiceChange(index, e.target.value)} />
                {services.length > 1 && (
                  <TrashButton type="button" onClick={() => handleRemoveService(index)}><FaTrash /></TrashButton>
                )}
              </RowGroup>
            ))}
          </FormSection>

          {/* Diferenciais */}
          <FormSection>
            <SectionHeader>
              <h3>Diferenciais / Benefícios</h3>
              <IconButton type="button" onClick={handleAddBenefit}><FaPlus /></IconButton>
            </SectionHeader>
            {benefits.map((benefit, index) => (
              <RowGroup key={index}>
                <input type="text" placeholder={`Diferencial ${index + 1} (Ex: Frete Grátis, Garantia de 1 ano)`} value={benefit} onChange={(e) => handleBenefitChange(index, e.target.value)} />
                {benefits.length > 1 && (
                  <TrashButton type="button" onClick={() => handleRemoveBenefit(index)}><FaTrash /></TrashButton>
                )}
              </RowGroup>
            ))}
          </FormSection>

          {/* Cores */}
          <FormSection>
            <h3><FaPalette /> Design e Cores</h3>
            <CheckboxGroup>
              <input type="checkbox" id="useAIColors" checked={useAIColors} onChange={(e) => setUseAIColors(e.target.checked)} />
              <label htmlFor="useAIColors">Deixar a IA escolher as melhores cores</label>
            </CheckboxGroup>
            {!useAIColors && (
              <ColorsRow>
                <ColorPickerGroup>
                  <label>Cor Primária</label>
                  <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                </ColorPickerGroup>
                <ColorPickerGroup>
                  <label>Cor Secundária</label>
                  <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
                </ColorPickerGroup>
              </ColorsRow>
            )}
          </FormSection>

          {/* Fotos */}
          <FormSection>
            <h3><FaUpload /> Fotos do Negócio (Até 6 imagens)</h3>
            <UploadZone>
              <input type="file" id="gallery-upload" multiple accept="image/*" onChange={handleImageChange} disabled={images.length >= 6} />
              <label htmlFor="gallery-upload">
                <FaUpload />
                <span>Selecione fotos da galeria local</span>
              </label>
            </UploadZone>
            {images.length > 0 && (
              <ImagePreviewGrid>
                {images.map((img, idx) => (
                  <ImageBadge key={idx}>
                    <img src={img} alt={`Preview ${idx}`} />
                    <DeleteBadgeBtn type="button" onClick={() => handleRemoveImage(idx)}><FaTrash /></DeleteBadgeBtn>
                  </ImageBadge>
                ))}
              </ImagePreviewGrid>
            )}
          </FormSection>

          {/* Depoimentos e FAQs Manuais */}
          <TestimonialsAccordion>
            <TestimonialsToggle
              type="button"
              onClick={() => setIsTestimonialsOpen(!isTestimonialsOpen)}
            >
              <span><FaComments /> Depoimentos e Perguntas Frequentes (FAQ)</span>
              <span className="badge">
                {manualTestimonials.length + manualFaqs.length > 0
                  ? `${manualTestimonials.length} depoimentos · ${manualFaqs.length} FAQs`
                  : 'Opcional — IA gera automaticamente'}
              </span>
              {isTestimonialsOpen ? <FaChevronUp /> : <FaChevronDown />}
            </TestimonialsToggle>

            {isTestimonialsOpen && (
              <TestimonialsBody>
                {/* Depoimentos */}
                <FormSection>
                  <SectionHeader>
                    <h3><FaStar /> Depoimentos Reais dos Clientes</h3>
                    <IconButton type="button" onClick={handleAddTestimonial}><FaPlus /></IconButton>
                  </SectionHeader>
                  <HintText style={{ textAlign: 'left', marginBottom: 0 }}>
                    Cole avaliações reais do Google ou Instagram. Se deixar vazio, a IA gerará exemplos realistas para o segmento.
                  </HintText>
                  {manualTestimonials.map((t, idx) => (
                    <TestimonialCard key={idx}>
                      <TestimonialHeader>
                        <span>Depoimento {idx + 1}</span>
                        <TrashButton type="button" onClick={() => handleRemoveTestimonial(idx)}><FaTrash /></TrashButton>
                      </TestimonialHeader>
                      <FormGroup>
                        <label>Nome do Cliente</label>
                        <input type="text" placeholder="Ex: Maria Silva" value={t.name} onChange={e => handleTestimonialChange(idx, 'name', e.target.value)} />
                      </FormGroup>
                      <FormGroup>
                        <label>Profissão / Contexto</label>
                        <input type="text" placeholder="Ex: Cliente há 2 anos" value={t.role} onChange={e => handleTestimonialChange(idx, 'role', e.target.value)} />
                      </FormGroup>
                      <FormGroup>
                        <label><FaStar style={{ color: '#fbbf24' }} /> Avaliação (1-5 estrelas)</label>
                        <StarRatingInput>
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              className={star <= t.rating ? 'active' : ''}
                              onClick={() => handleTestimonialChange(idx, 'rating', star)}
                            >
                              <FaStar />
                            </button>
                          ))}
                        </StarRatingInput>
                      </FormGroup>
                      <FormGroup>
                        <label>Texto do Depoimento</label>
                        <textarea
                          rows="3"
                          placeholder="Cole aqui a avaliação real do cliente..."
                          value={t.text}
                          onChange={e => handleTestimonialChange(idx, 'text', e.target.value)}
                        />
                      </FormGroup>
                    </TestimonialCard>
                  ))}
                  {manualTestimonials.length === 0 && (
                    <EmptyState onClick={handleAddTestimonial}>
                      <FaPlus /> Adicionar primeiro depoimento real
                    </EmptyState>
                  )}
                </FormSection>

                {/* FAQs */}
                <FormSection>
                  <SectionHeader>
                    <h3><FaQuestionCircle /> Perguntas Frequentes (FAQ)</h3>
                    <IconButton type="button" onClick={handleAddFaq}><FaPlus /></IconButton>
                  </SectionHeader>
                  <HintText style={{ textAlign: 'left', marginBottom: 0 }}>
                    Adicione perguntas e respostas para contornar as objeções reais dos seus clientes.
                  </HintText>
                  {manualFaqs.map((f, idx) => (
                    <TestimonialCard key={idx}>
                      <TestimonialHeader>
                        <span>FAQ {idx + 1}</span>
                        <TrashButton type="button" onClick={() => handleRemoveFaq(idx)}><FaTrash /></TrashButton>
                      </TestimonialHeader>
                      <FormGroup>
                        <label>Pergunta</label>
                        <input type="text" placeholder="Ex: Vocês aceitam cartão de crédito?" value={f.question} onChange={e => handleFaqChange(idx, 'question', e.target.value)} />
                      </FormGroup>
                      <FormGroup>
                        <label>Resposta</label>
                        <textarea rows="2" placeholder="Ex: Sim! Aceitamos todas as bandeiras..." value={f.answer} onChange={e => handleFaqChange(idx, 'answer', e.target.value)} />
                      </FormGroup>
                    </TestimonialCard>
                  ))}
                  {manualFaqs.length === 0 && (
                    <EmptyState onClick={handleAddFaq}>
                      <FaPlus /> Adicionar primeira pergunta frequente
                    </EmptyState>
                  )}
                </FormSection>
              </TestimonialsBody>
            )}
          </TestimonialsAccordion>

          <SubmitBtn type="submit" disabled={isGenerating || isAnalyzing}>
            <span>{isGenerating ? 'Enviando ao Cérebro de IA...' : 'Gerar Landing Page com Dados Revisados'}</span>
          </SubmitBtn>
        </AdvancedForm>
      )}

      {/* Modal de Aprovação de Fotos */}
      {showImageApprovalModal && (
        <ModalOverlay>
          <ModalContent className="animate-fade-in">
            <ModalHeader>
              <h3><FaInstagram /> Aprovar Fotos do Instagram</h3>
            </ModalHeader>
            <ModalBody>
              <p>
                Encontramos as fotos públicas abaixo associadas ao perfil do negócio.
                Selecione apenas as melhores imagens que você deseja incluir na sua Landing Page.
              </p>
              <ModalGrid>
                {tempImages.map((img, idx) => (
                  <SelectableImageBadge
                    key={idx}
                    $selected={img.selected}
                    onClick={() => {
                      setTempImages(prev => prev.map((item, i) => i === idx ? { ...item, selected: !item.selected } : item));
                    }}
                  >
                    <img src={img.url} alt={`Instagram ${idx}`} />
                    <div className="checkbox">
                      {img.selected ? '✓' : ''}
                    </div>
                  </SelectableImageBadge>
                ))}
              </ModalGrid>
            </ModalBody>
            <ModalActions>
              <CancelBtn type="button" onClick={() => setShowImageApprovalModal(false)}>Cancelar</CancelBtn>
              <ConfirmBtn type="button" onClick={handleConfirmImages}>Confirmar e Criar Landing Page</ConfirmBtn>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </FormWrapper>
  );
}

// ── Animações ───────────────────────────────────────────────────────────────
const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;
const gradientShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const slideDown = keyframes`from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); }`;
const pulse = keyframes`0%, 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); } 50% { box-shadow: 0 0 0 8px rgba(249, 115, 22, 0); }`;

// ── Styled Components ───────────────────────────────────────────────────────
const FormWrapper = styled.div`
  background: rgba(31, 41, 55, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 85vh;
  overflow-y: auto;

  .spin {
    animation: ${spin} 1s linear infinite;
  }
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 14px;

  h2 {
    font-size: 1.3rem;
    font-weight: 800;
    color: #a78bfa;
    letter-spacing: -0.5px;
  }
`;

const LoadMockBtn = styled.button`
  background: rgba(167, 139, 250, 0.1);
  border: 1px solid rgba(167, 139, 250, 0.4);
  color: #c084fc;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(167, 139, 250, 0.2); transform: translateY(-1px); }
`;

// ── Bloco Hero do Instagram ─────────────────────────────────────────────────
const InstagramHero = styled.div`
  background: linear-gradient(135deg, rgba(88, 28, 135, 0.25) 0%, rgba(67, 20, 70, 0.3) 50%, rgba(194, 65, 12, 0.2) 100%);
  border: 1px solid rgba(245, 114, 89, 0.25);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  > label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
    font-weight: 700;
    color: #f9a8d4;

    svg {
      font-size: 1.1rem;
      color: #f472b6;
    }
  }
`;

const StyledInstagramInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 14px;
    color: #f472b6;
    font-size: 1.1rem;
    pointer-events: none;
    z-index: 1;
  }

  input {
    width: 100%;
    background: rgba(17, 24, 39, 0.6);
    border: 1.5px solid rgba(244, 114, 182, 0.4);
    border-radius: 10px;
    padding: 12px 14px 12px 44px;
    color: #f9fafb;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;

    &:focus {
      border-color: #f472b6;
      box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.15);
    }

    &::placeholder { color: #6b7280; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 10px 14px;
  color: #fca5a5;
  font-size: 0.85rem;
`;

const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  padding: 10px 14px;
  color: #6ee7b7;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const AnalyzeBtn = styled.button`
  background: rgba(139, 92, 246, 0.15);
  border: 1.5px solid rgba(139, 92, 246, 0.5);
  color: #c4b5fd;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s;

  &:hover:not(:disabled) {
    background: rgba(139, 92, 246, 0.3);
    border-color: #a78bfa;
    transform: translateY(-1px);
  }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`;

const InstantBtn = styled.button`
  background: linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%);
  background-size: 200% 200%;
  animation: ${gradientShift} 3s ease infinite, ${pulse} 2.5s ease-in-out infinite;
  border: none;
  color: white;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.25s, opacity 0.25s;
  letter-spacing: 0.3px;

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    opacity: 0.95;
  }
  &:disabled { 
    animation: none;
    background: #4b5563;
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

const HintText = styled.p`
  font-size: 0.76rem;
  color: #9ca3af;
  line-height: 1.5;
  text-align: center;

  strong { color: #d1d5db; }
`;

// ── Accordion ───────────────────────────────────────────────────────────────
const AccordionToggle = styled.button`
  width: 100%;
  background: rgba(17, 24, 39, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 14px 18px;
  color: #e5e7eb;
  font-size: 0.88rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    background: rgba(139, 92, 246, 0.08);
    border-color: rgba(139, 92, 246, 0.3);
    color: #c4b5fd;
  }

  svg {
    color: #8b5cf6;
    font-size: 0.9rem;
    transition: transform 0.25s;
    transform: ${({ $isOpen }) => $isOpen ? 'rotate(0deg)' : 'rotate(0deg)'};
  }
`;

const AdvancedForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${slideDown} 0.3s ease forwards;
`;

// ── Formulário (seções internas) ────────────────────────────────────────────
const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: rgba(17, 24, 39, 0.3);
  padding: 18px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.02);

  h3 {
    font-size: 0.92rem;
    font-weight: 600;
    color: #e5e7eb;
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 4px;
    svg { color: #8b5cf6; }
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 0.82rem;
    font-weight: 500;
    color: #9ca3af;
    display: flex;
    align-items: center;
    gap: 5px;
    svg { font-size: 0.85rem; }
  }

  input, textarea, select {
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 7px;
    padding: 9px 13px;
    color: #f3f4f6;
    font-size: 0.88rem;
    outline: none;
    transition: all 0.25s;

    &:focus {
      border-color: #8b5cf6;
      box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.18);
    }
  }

  textarea { resize: vertical; }
`;

const RowGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  input {
    flex: 1;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 7px;
    padding: 9px 13px;
    color: #f3f4f6;
    font-size: 0.88rem;
    outline: none;
    transition: border-color 0.25s;
    &:focus { border-color: #8b5cf6; }
  }
`;

const IconButton = styled.button`
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #a78bfa;
  width: 28px; height: 28px;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(139, 92, 246, 0.25); }
`;

const TrashButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  width: 36px; height: 36px;
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(239, 68, 68, 0.25); }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #d1d5db;
  cursor: pointer;
  input[type="checkbox"] { width: 15px; height: 15px; accent-color: #8b5cf6; }
`;

const ColorsRow = styled.div`
  display: flex;
  gap: 18px;
`;

const ColorPickerGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  label { font-size: 0.78rem; color: #9ca3af; }
  input[type="color"] { background: none; border: none; width: 56px; height: 34px; cursor: pointer; outline: none; }
`;

const UploadZone = styled.div`
  input { display: none; }
  label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 2px dashed #4b5563;
    border-radius: 9px;
    padding: 18px;
    cursor: pointer;
    transition: all 0.25s;
    color: #9ca3af;
    &:hover { border-color: #8b5cf6; color: #f3f4f6; background: rgba(139, 92, 246, 0.03); }
    svg { font-size: 1.4rem; }
    span { font-size: 0.82rem; }
  }
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 8px;
`;

const ImageBadge = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 7px;
  overflow: hidden;
  border: 1px solid #374151;
  background: #111827;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const DeleteBadgeBtn = styled.button`
  position: absolute;
  top: 4px; right: 4px;
  background: rgba(239, 68, 68, 0.85);
  border: none; color: white;
  width: 22px; height: 22px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-size: 0.65rem;
  transition: background 0.2s;
  &:hover { background: rgba(239, 68, 68, 1); }
`;

const SubmitBtn = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
  }
  &:disabled {
    background: #4b5563;
    color: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// ── Styled Components: Seção Depoimentos e FAQs ────────────────────────────
const TestimonialsAccordion = styled.div`
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 10px;
  overflow: hidden;
`;

const TestimonialsToggle = styled.button`
  width: 100%;
  background: rgba(251, 191, 36, 0.05);
  border: none;
  padding: 14px 18px;
  color: #e5e7eb;
  font-size: 0.88rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background 0.25s;
  text-align: left;

  span:first-child {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    svg { color: #fbbf24; }
  }

  .badge {
    font-size: 0.72rem;
    background: rgba(251, 191, 36, 0.12);
    color: #fbbf24;
    border: 1px solid rgba(251, 191, 36, 0.25);
    border-radius: 50px;
    padding: 2px 10px;
    white-space: nowrap;
  }

  svg:last-child {
    color: #fbbf24;
    font-size: 0.85rem;
    flex-shrink: 0;
  }

  &:hover {
    background: rgba(251, 191, 36, 0.1);
  }
`;

const TestimonialsBody = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: ${slideDown} 0.3s ease forwards;
  border-top: 1px solid rgba(251, 191, 36, 0.15);
`;

const TestimonialCard = styled.div`
  background: rgba(17, 24, 39, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 9px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TestimonialHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 0.8rem;
    font-weight: 600;
    color: #9ca3af;
  }
`;

const StarRatingInput = styled.div`
  display: flex;
  gap: 4px;
  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    color: #4b5563;
    padding: 2px;
    transition: color 0.15s, transform 0.15s;
    &.active { color: #fbbf24; }
    &:hover { transform: scale(1.2); }
  }
`;

const EmptyState = styled.button`
  width: 100%;
  background: rgba(251, 191, 36, 0.04);
  border: 1.5px dashed rgba(251, 191, 36, 0.25);
  border-radius: 8px;
  padding: 14px;
  color: #9ca3af;
  font-size: 0.82rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  svg { color: #fbbf24; }
  &:hover {
    background: rgba(251, 191, 36, 0.08);
    color: #e5e7eb;
    border-color: rgba(251, 191, 36, 0.5);
  }
`;

// ── Styled Components: Modal de Aprovação de Imagens ────────────────────────
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(10, 10, 12, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${slideDown} 0.3s ease;
`;

const ModalContent = styled.div`
  background: #1f2937;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  width: 90%;
  max-width: 550px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 { font-size: 1.1rem; color: #f9fafb; display: flex; align-items: center; gap: 8px; margin: 0; }
  svg { color: #f472b6; }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  p { font-size: 0.85rem; color: #9ca3af; line-height: 1.4; margin: 0; }
`;

const ModalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 10px;
  max-height: 300px;
  overflow-y: auto;
  padding: 4px;
`;

const SelectableImageBadge = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${props => props.$selected ? '#f472b6' : '#374151'};
  cursor: pointer;
  transition: all 0.2s;
  
  img { width: 100%; height: 100%; object-fit: cover; opacity: ${props => props.$selected ? 1 : 0.45}; }
  
  .checkbox {
    position: absolute;
    top: 6px; right: 6px;
    background: ${props => props.$selected ? '#f472b6' : 'rgba(0, 0, 0, 0.6)'};
    color: white;
    width: 20px; height: 20px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem;
    font-weight: bold;
    border: 1px solid ${props => props.$selected ? '#f472b6' : '#4b5563'};
  }

  &:hover {
    transform: scale(1.02);
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const CancelBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d1d5db;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.1); }
`;

const ConfirmBtn = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  &:hover { opacity: 0.95; transform: translateY(-1px); }
`;

