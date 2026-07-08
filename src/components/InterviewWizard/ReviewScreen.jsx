import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCheckCircle, FaExclamationCircle, FaEdit, FaSave, FaArrowLeft, FaRocket, FaTrash, FaPalette, FaSearch, FaSpinner } from 'react-icons/fa';
import { fetchInstagramImagesOnly } from '../../services/aiService';

export default function ReviewScreen({ clientJson, onUpdate, onGenerate }) {
  const { identity = {}, targetAudience = {}, contacts = {}, services = [], differentials = [], branding = {} } = clientJson;

  // Controle de edição para cada card
  const [editingCard, setEditingCard] = useState(null); // 'identity' | 'audience' | 'contacts' | 'images'

  // Estados locais para edição dos formulários
  const [identityForm, setIdentityForm] = useState({
    businessName: identity.businessName || '',
    segment: identity.segment || '',
    bio: identity.bio || '',
    yearsInBusiness: identity.yearsInBusiness || ''
  });

  const [audienceForm, setAudienceForm] = useState({
    idealClient: targetAudience.idealClient || '',
    primaryPain: targetAudience.primaryPain || '',
    mainObjection: targetAudience.mainObjection || ''
  });

  const [contactsForm, setContactsForm] = useState({
    whatsapp: contacts.whatsapp || '',
    instagram: contacts.instagram || '',
    email: contacts.email || ''
  });

  // Estados locais para edição das imagens
  const [imagesList, setImagesList] = useState(clientJson.instagramImages || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isFetchingInsta, setIsFetchingInsta] = useState(false);
  const [instaFetchError, setInstaFetchError] = useState('');

  const handleFetchFromInstagram = async () => {
    const handle = contactsForm.instagram || contacts.instagram || identity.businessName;
    if (!handle) {
      setInstaFetchError('Por favor, defina um usuário/link do Instagram no card de Contatos primeiro.');
      return;
    }
    
    setIsFetchingInsta(true);
    setInstaFetchError('');
    try {
      console.log('Fetching Instagram images for:', handle);
      const segment = identityForm.segment || identity.segment || '';
      const images = await fetchInstagramImagesOnly(handle, segment);
      
      if (images && images.length > 0) {
        setImagesList(images);
      } else {
        setInstaFetchError('Nenhuma imagem pública encontrada para este perfil.');
      }
    } catch (err) {
      console.error(err);
      setInstaFetchError('Erro ao buscar fotos. Verifique a conexão ou se o perfil é público.');
    } finally {
      setIsFetchingInsta(false);
    }
  };

  // Verificar se há campos críticos vazios
  const isCriticalMissing = (path) => {
    if (path === 'identity.businessName') return !identity.businessName;
    if (path === 'identity.segment') return !identity.segment;
    if (path === 'targetAudience.idealClient') return !targetAudience.idealClient;
    if (path === 'targetAudience.primaryPain') return !targetAudience.primaryPain;
    if (path === 'contacts.whatsapp') return !contacts.whatsapp;
    return false;
  };

  const missingCriticalFields = [
    isCriticalMissing('identity.businessName'),
    isCriticalMissing('identity.segment'),
    isCriticalMissing('targetAudience.idealClient'),
    isCriticalMissing('targetAudience.primaryPain'),
    isCriticalMissing('contacts.whatsapp')
  ].filter(Boolean);

  const canGenerate = missingCriticalFields.length === 0;

  // Ativar edição de um card
  const startEditing = (card) => {
    setEditingCard(card);
    if (card === 'identity') {
      setIdentityForm({
        businessName: identity.businessName || '',
        segment: identity.segment || '',
        bio: identity.bio || '',
        yearsInBusiness: identity.yearsInBusiness || ''
      });
    } else if (card === 'audience') {
      setAudienceForm({
        idealClient: targetAudience.idealClient || '',
        primaryPain: targetAudience.primaryPain || '',
        mainObjection: targetAudience.mainObjection || ''
      });
    } else if (card === 'contacts') {
      setContactsForm({
        whatsapp: contacts.whatsapp || '',
        instagram: contacts.instagram || '',
        email: contacts.email || ''
      });
    } else if (card === 'images') {
      setImagesList(clientJson.instagramImages || []);
      setNewImageUrl('');
    }
  };

  // Salvar edições
  const saveCard = (card) => {
    const updated = JSON.parse(JSON.stringify(clientJson));
    if (card === 'identity') {
      updated.identity = { ...updated.identity, ...identityForm };
    } else if (card === 'audience') {
      updated.targetAudience = { ...updated.targetAudience, ...audienceForm };
    } else if (card === 'contacts') {
      updated.contacts = { ...updated.contacts, ...contactsForm };
    } else if (card === 'images') {
      updated.instagramImages = imagesList;
    }
    onUpdate(updated);
    setEditingCard(null);
  };

  return (
    <Container className="animate-fade-in">
      <HeaderSection>
        <h2>Revisão dos Dados do Negócio</h2>
        <p>Confirme os dados antes de gerar a Landing Page. Dados em vermelho são essenciais e precisam ser preenchidos.</p>
      </HeaderSection>

      <CardsGrid>
        {/* CARD: Identidade */}
        <ReviewCard $hasError={isCriticalMissing('identity.businessName') || isCriticalMissing('identity.segment')}>
          <CardHeader>
            <span>📍 Identidade</span>
            {editingCard === 'identity' ? (
              <SaveBtn onClick={() => saveCard('identity')}><FaSave /> Salvar</SaveBtn>
            ) : (
              <EditBtn onClick={() => startEditing('identity')}><FaEdit /> Editar</EditBtn>
            )}
          </CardHeader>

          {editingCard === 'identity' ? (
            <FormFields>
              <div className="input-group">
                <label>Nome do Negócio *</label>
                <input 
                  type="text" 
                  value={identityForm.businessName} 
                  onChange={(e) => setIdentityForm({ ...identityForm, businessName: e.target.value })} 
                />
              </div>
              <div className="input-group">
                <label>Segmento *</label>
                <input 
                  type="text" 
                  value={identityForm.segment} 
                  onChange={(e) => setIdentityForm({ ...identityForm, segment: e.target.value })} 
                />
              </div>
              <div className="input-group">
                <label>Biografia / Descrição</label>
                <textarea 
                  value={identityForm.bio} 
                  onChange={(e) => setIdentityForm({ ...identityForm, bio: e.target.value })} 
                />
              </div>
            </FormFields>
          ) : (
            <CardBody>
              <DataRow $error={isCriticalMissing('identity.businessName')}>
                <strong>Nome do Negócio:</strong>
                <span>{identity.businessName || 'Não informado'}</span>
              </DataRow>
              <DataRow $error={isCriticalMissing('identity.segment')}>
                <strong>Segmento:</strong>
                <span>{identity.segment || 'Não informado'}</span>
              </DataRow>
              <DataRow>
                <strong>Biografia:</strong>
                <span className="multiline">{identity.bio || 'Não informado (a IA criará de forma genérica)'}</span>
              </DataRow>
            </CardBody>
          )}
        </ReviewCard>

        {/* CARD: Cliente e Dores */}
        <ReviewCard $hasError={isCriticalMissing('targetAudience.idealClient') || isCriticalMissing('targetAudience.primaryPain')}>
          <CardHeader>
            <span>👤 Cliente Ideal e Dores</span>
            {editingCard === 'audience' ? (
              <SaveBtn onClick={() => saveCard('audience')}><FaSave /> Salvar</SaveBtn>
            ) : (
              <EditBtn onClick={() => startEditing('audience')}><FaEdit /> Editar</EditBtn>
            )}
          </CardHeader>

          {editingCard === 'audience' ? (
            <FormFields>
              <div className="input-group">
                <label>Cliente Ideal *</label>
                <textarea 
                  value={audienceForm.idealClient} 
                  onChange={(e) => setAudienceForm({ ...audienceForm, idealClient: e.target.value })} 
                />
              </div>
              <div className="input-group">
                <label>Dor Principal *</label>
                <textarea 
                  value={audienceForm.primaryPain} 
                  onChange={(e) => setAudienceForm({ ...audienceForm, primaryPain: e.target.value })} 
                />
              </div>
              <div className="input-group">
                <label>Objeção Comum</label>
                <textarea 
                  value={audienceForm.mainObjection} 
                  onChange={(e) => setAudienceForm({ ...audienceForm, mainObjection: e.target.value })} 
                />
              </div>
            </FormFields>
          ) : (
            <CardBody>
              <DataRow $error={isCriticalMissing('targetAudience.idealClient')}>
                <strong>Cliente Ideal:</strong>
                <span>{targetAudience.idealClient || 'Não informado'}</span>
              </DataRow>
              <DataRow $error={isCriticalMissing('targetAudience.primaryPain')}>
                <strong>Dor Principal:</strong>
                <span>{targetAudience.primaryPain || 'Não informado'}</span>
              </DataRow>
              <DataRow>
                <strong>Objeção Comum:</strong>
                <span>{targetAudience.mainObjection || 'Nenhuma (a IA contornará dores genéricas)'}</span>
              </DataRow>
            </CardBody>
          )}
        </ReviewCard>

        {/* CARD: Contatos */}
        <ReviewCard $hasError={isCriticalMissing('contacts.whatsapp')}>
          <CardHeader>
            <span>📞 Canais de Contato</span>
            {editingCard === 'contacts' ? (
              <SaveBtn onClick={() => saveCard('contacts')}><FaSave /> Salvar</SaveBtn>
            ) : (
              <EditBtn onClick={() => startEditing('contacts')}><FaEdit /> Editar</EditBtn>
            )}
          </CardHeader>

          {editingCard === 'contacts' ? (
            <FormFields>
              <div className="input-group">
                <label>WhatsApp *</label>
                <input 
                  type="text" 
                  value={contactsForm.whatsapp} 
                  onChange={(e) => setContactsForm({ ...contactsForm, whatsapp: e.target.value })} 
                />
              </div>
              <div className="input-group">
                <label>Instagram (@username ou link)</label>
                <input 
                  type="text" 
                  value={contactsForm.instagram} 
                  onChange={(e) => setContactsForm({ ...contactsForm, instagram: e.target.value })} 
                />
              </div>
              <div className="input-group">
                <label>E-mail público</label>
                <input 
                  type="email" 
                  value={contactsForm.email} 
                  onChange={(e) => setContactsForm({ ...contactsForm, email: e.target.value })} 
                />
              </div>
            </FormFields>
          ) : (
            <CardBody>
              <DataRow $error={isCriticalMissing('contacts.whatsapp')}>
                <strong>WhatsApp:</strong>
                <span>{contacts.whatsapp || 'Não informado'}</span>
              </DataRow>
              <DataRow>
                <strong>Instagram:</strong>
                <span>{contacts.instagram || 'Não informado'}</span>
              </DataRow>
              <DataRow>
                <strong>E-mail:</strong>
                <span>{contacts.email || 'Não informado'}</span>
              </DataRow>
            </CardBody>
          )}
        </ReviewCard>

        {/* CARD: Imagens do Site */}
        <ReviewCard>
          <CardHeader>
            <span>🖼️ Imagens do Site ({clientJson.instagramImages?.length || 0})</span>
            {editingCard === 'images' ? (
              <SaveBtn onClick={() => saveCard('images')}><FaSave /> Salvar</SaveBtn>
            ) : (
              <EditBtn onClick={() => startEditing('images')}><FaEdit /> Editar</EditBtn>
            )}
          </CardHeader>

          {editingCard === 'images' ? (
            <FormFields>
              <ImageGridEdit>
                {imagesList.map((img, idx) => (
                  <ImageThumbEdit key={idx}>
                    <img src={img} alt={`Visual ${idx + 1}`} />
                    <RemoveImageBtn type="button" onClick={() => setImagesList(prev => prev.filter((_, i) => i !== idx))}>
                      <FaTrash />
                    </RemoveImageBtn>
                  </ImageThumbEdit>
                ))}
              </ImageGridEdit>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Captura automática do Instagram</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    placeholder="@perfil ou link do Instagram" 
                    value={contactsForm.instagram} 
                    onChange={(e) => setContactsForm({ ...contactsForm, instagram: e.target.value })}
                    style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                  />
                  <FetchInstaBtn type="button" disabled={isFetchingInsta} onClick={handleFetchFromInstagram}>
                    {isFetchingInsta ? (
                      <><FaSpinner className="spin" /> Buscando...</>
                    ) : (
                      <><FaSearch /> Buscar fotos</>
                    )}
                  </FetchInstaBtn>
                </div>
                {instaFetchError && (
                  <span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: '500' }}>{instaFetchError}</span>
                )}
              </div>

              <div className="input-group">
                <label>Fazer upload de fotos reais do seu negócio (Computador/Celular)</label>
                <UploadInputWrapper>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(file => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagesList(prev => [...prev, reader.result]);
                        };
                        reader.readAsDataURL(file);
                      });
                    }}
                  />
                </UploadInputWrapper>
              </div>

              <div className="input-group" style={{ flexDirection: 'row', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label>Ou colar link de imagem da internet</label>
                  <input 
                    type="text" 
                    placeholder="https://exemplo.com/foto.jpg" 
                    value={newImageUrl} 
                    onChange={(e) => setNewImageUrl(e.target.value)} 
                  />
                </div>
                <AddUrlBtn type="button" onClick={() => {
                  if (newImageUrl.trim()) {
                    setImagesList(prev => [...prev, newImageUrl.trim()]);
                    setNewImageUrl('');
                  }
                }}>
                  Adicionar
                </AddUrlBtn>
              </div>
            </FormFields>
          ) : (
            <CardBody>
              <ImageGrid>
                {(clientJson.instagramImages || []).length > 0 ? (
                  (clientJson.instagramImages || []).map((img, idx) => (
                    <ImageThumb key={idx}>
                      <img src={img} alt={`Visual ${idx + 1}`} />
                    </ImageThumb>
                  ))
                ) : (
                  <NoImagesWarning>
                    ⚠️ Nenhuma foto do Instagram importada (usando imagens padrão). 
                    Clique em "Editar" para fazer upload de fotos reais do seu negócio!
                  </NoImagesWarning>
                )}
              </ImageGrid>
            </CardBody>
          )}
        </ReviewCard>

        {/* CARD: Status da Análise */}
        <ReviewCard>
          <CardHeader>
            <span>📊 Status do Setup</span>
          </CardHeader>
          <CardBody>
            <StatusList>
              <StatusItem $success={canGenerate}>
                {canGenerate ? <FaCheckCircle className="icon" /> : <FaExclamationCircle className="icon" />}
                <span>
                  {canGenerate 
                    ? "Pronto para Geração: Todos os requisitos críticos preenchidos!" 
                    : `Dados críticos ausentes (${missingCriticalFields.length} pendentes). Por favor, preencha-os antes de gerar.`
                  }
                </span>
              </StatusItem>
              <StatusItem $success={services.length > 0}>
                {services.length > 0 ? <FaCheckCircle className="icon" /> : <FaCheckCircle style={{ color: '#64748b' }} className="icon" />}
                <span>{services.length > 0 ? `${services.length} serviços importados.` : 'Sem serviços cadastrados (a IA criará sugestões baseadas no segmento).'}</span>
              </StatusItem>
              <StatusItem $success={differentials.length > 0}>
                {differentials.length > 0 ? <FaCheckCircle className="icon" /> : <FaCheckCircle style={{ color: '#64748b' }} className="icon" />}
                <span>{differentials.length > 0 ? `${differentials.length} diferenciais importados.` : 'Sem diferenciais cadastrados (a seção de diferenciais será omitida).'}</span>
              </StatusItem>
            </StatusList>
          </CardBody>
        </ReviewCard>
      </CardsGrid>

      <FooterSection>
        {canGenerate ? (
          <GenerateBtn onClick={onGenerate} className="btn-generate">
            <FaRocket /> Gerar Landing Page CRO
          </GenerateBtn>
        ) : (
          <DisabledGenerateBtn title="Preencha os campos vermelhos para liberar">
            Preencha os Campos Críticos
          </DisabledGenerateBtn>
        )}
      </FooterSection>
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 8px;

  h2 {
    font-size: 1.5rem;
    color: white;
    font-weight: 800;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 0.9rem;
    color: #94a3b8;
    margin: 0;
    line-height: 1.5;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ReviewCard = styled.div`
  background: rgba(30, 41, 59, 0.45);
  backdrop-filter: blur(16px);
  border: 1px solid ${props => props.$hasError ? 'rgba(239, 68, 68, 0.35)' : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding-bottom: 10px;

  span {
    font-weight: 700;
    font-size: 0.95rem;
    color: #cbd5e1;
  }
`;

const EditBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #94a3b8;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: white;
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const SaveBtn = styled.button`
  background: #8b5cf6;
  border: none;
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;

  &:hover {
    background: #7c3aed;
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DataRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;

  strong {
    color: ${props => props.$error ? '#f87171' : '#64748b'};
    font-weight: 600;
  }

  span {
    color: ${props => props.$error ? '#ef4444' : '#cbd5e1'};
    background: ${props => props.$error ? 'rgba(239, 68, 68, 0.1)' : 'transparent'};
    padding: ${props => props.$error ? '4px 8px' : '0'};
    border-radius: ${props => props.$error ? '6px' : '0'};
    border: ${props => props.$error ? '1px dashed rgba(239, 68, 68, 0.25)' : 'none'};
    font-weight: ${props => props.$error ? '600' : '400'};
    
    &.multiline {
      line-height: 1.5;
    }
  }
`;

const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    label {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 600;
    }

    input, textarea {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 8px 12px;
      color: white;
      font-size: 0.85rem;
      outline: none;
      
      &:focus {
        border-color: #8b5cf6;
      }
    }

    textarea {
      min-height: 50px;
      resize: vertical;
      line-height: 1.4;
    }
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
  width: 100%;
`;

const ImageGridEdit = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 10px;
  max-height: 160px;
  overflow-y: auto;
  padding: 8px;
  background: #0f172a;
  border-radius: 8px;
  border: 1px solid #334155;
`;

const ImageThumb = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageThumbEdit = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.02);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveImageBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 55%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #ef4444;
    transform: scale(1.1);
  }
`;

const UploadInputWrapper = styled.div`
  input[type="file"] {
    background: #0f172a;
    border: 1px dashed #334155;
    border-radius: 8px;
    padding: 8px;
    color: #94a3b8;
    width: 100%;
    font-size: 0.8rem;
    cursor: pointer;
  }
`;

const AddUrlBtn = styled.button`
  background: #334155;
  color: white;
  border: 1px solid #475569;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  height: 38px;
  transition: all 0.2s;
  
  &:hover {
    background: #475569;
    border-color: #64748b;
  }
`;

const NoImagesWarning = styled.div`
  grid-column: 1 / -1;
  font-size: 0.8rem;
  color: #fbbf24;
  line-height: 1.5;
  background: rgba(251, 191, 36, 0.08);
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px dashed rgba(251, 191, 36, 0.25);
  text-align: center;
`;

const StatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.8rem;
  line-height: 1.4;

  .icon {
    color: ${props => props.$success ? '#10b981' : '#ef4444'};
    font-size: 0.95rem;
    flex-shrink: 0;
    margin-top: 1px;
  }

  span {
    color: ${props => props.$success ? '#a7f3d0' : '#fca5a5'};
  }
`;

const FooterSection = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
`;

const GenerateBtn = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 36px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(99, 102, 241, 0.5);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const DisabledGenerateBtn = styled.button`
  background: #334155;
  color: #64748b;
  border: 1px solid #475569;
  border-radius: 12px;
  padding: 16px 36px;
  font-size: 1rem;
  font-weight: 700;
  cursor: not-allowed;
`;

const FetchInstaBtn = styled.button`
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #059669;
  }
  
  &:disabled {
    background: #334155;
    color: #64748b;
    cursor: not-allowed;
  }
  
  .spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;
