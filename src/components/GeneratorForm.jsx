import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPlus, FaTrash, FaInstagram, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaPalette, FaUpload, FaSmile } from 'react-icons/fa';

export default function GeneratorForm({ onSubmit, isGenerating }) {
  const [businessName, setBusinessName] = useState('');
  const [segment, setSegment] = useState('');
  const [bio, setBio] = useState('');
  const [tone, setTone] = useState('persuasivo');
  
  // Contatos
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [instagram, setInstagram] = useState('');

  // Listas dinâmicas
  const [services, setServices] = useState(['']);
  const [benefits, setBenefits] = useState(['']);
  
  // Cores
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState('#10B981');
  const [useAIColors, setUseAIColors] = useState(true);

  // Imagens locais em Base64
  const [images, setImages] = useState([]);

  // Adicionar/remover serviços
  const handleAddService = () => setServices([...services, '']);
  const handleRemoveService = (index) => {
    const newServices = services.filter((_, i) => i !== index);
    setServices(newServices.length ? newServices : ['']);
  };
  const handleServiceChange = (index, value) => {
    const newServices = [...services];
    newServices[index] = value;
    setServices(newServices);
  };

  // Adicionar/remover diferenciais
  const handleAddBenefit = () => setBenefits([...benefits, '']);
  const handleRemoveBenefit = (index) => {
    const newBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(newBenefits.length ? newBenefits : ['']);
  };
  const handleBenefitChange = (index, value) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  // Upload e conversão de imagens para Base64
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Permitir no máximo 6 fotos
    if (images.length + files.length > 6) {
      alert('Você pode selecionar no máximo 6 fotos para a galeria.');
      return;
    }

    const promises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(base64Images => {
      setImages(prev => [...prev, ...base64Images]);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!businessName || !segment || !bio) {
      alert('Por favor, preencha os campos obrigatórios (Nome do Negócio, Segmento e Bio).');
      return;
    }

    // Filtrar vazios
    const filteredServices = services.filter(s => s.trim() !== '');
    const filteredBenefits = benefits.filter(b => b.trim() !== '');

    onSubmit({
      businessName,
      segment,
      bio,
      tone,
      services: filteredServices,
      benefits: filteredBenefits,
      contacts: { phone, email, address, instagram },
      colors: useAIColors ? null : { primaryColor, secondaryColor },
      images
    });
  };

  // Preenchimento de dados de teste rápido (Helper UX)
  const handleLoadMock = () => {
    setBusinessName('Studio Glamour Beauty');
    setSegment('Salão de Beleza e Estética');
    setBio('Especialistas em mechas, loiros perfeitos, tratamentos capilares de alta tecnologia e manicure. Realçando a sua beleza natural todos os dias!');
    setTone('persuasivo');
    setPhone('11999999999');
    setEmail('contato@studioglamour.com');
    setAddress('Av. Paulista, 1000 - Bela Vista, São Paulo - SP');
    setInstagram('@studioglamour.beauty');
    setServices(['Design de Sobrancelhas', 'Loiro Perfeito e Mechas', 'Hidratação de Luxo', 'Manicure e Nail Art']);
    setBenefits(['Produtos importados de alta linha', 'Atendimento vip personalizado', 'Ambiente climatizado com Wi-Fi e café']);
  };

  return (
    <FormCard onSubmit={handleSubmit} className="animate-fade-in">
      <FormHeader>
        <h2>Dados do Instagram</h2>
        <LoadMockBtn type="button" onClick={handleLoadMock}>Preencher Exemplo</LoadMockBtn>
      </FormHeader>

      {/* Identidade */}
      <FormSection>
        <h3><FaSmile /> Identidade do Negócio</h3>
        
        <FormGroup>
          <label>Nome do Negócio *</label>
          <input 
            type="text" 
            placeholder="Ex: Studio Glamour Beauty" 
            value={businessName} 
            onChange={(e) => setBusinessName(e.target.value)} 
            required 
          />
        </FormGroup>

        <FormGroup>
          <label>Segmento *</label>
          <input 
            type="text" 
            placeholder="Ex: Salão de Beleza, Hamburgueria, Clínicas" 
            value={segment} 
            onChange={(e) => setSegment(e.target.value)} 
            required 
          />
        </FormGroup>

        <FormGroup>
          <label>Bio do Perfil (Copiar e colar) *</label>
          <textarea 
            rows="3" 
            placeholder="Cole aqui a biografia do perfil do Instagram..." 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            required 
          />
        </FormGroup>

        <FormGroup>
          <label>Tom de Voz da Copy</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="persuasivo">Altamente Persuasivo & Vendedor</option>
            <option value="profissional">Profissional & Corporativo</option>
            <option value="descontraido">Descontraído & Amigável</option>
            <option value="emocional">Emocional & Inspirador</option>
          </select>
        </FormGroup>
      </FormSection>

      {/* Contatos */}
      <FormSection>
        <h3><FaInstagram /> Links e Contatos</h3>
        
        <FormGroup>
          <label><FaWhatsapp /> WhatsApp (Apenas números com DDD)</label>
          <input 
            type="text" 
            placeholder="Ex: 11999999999" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />
        </FormGroup>

        <FormGroup>
          <label><FaInstagram /> Usuário do Instagram</label>
          <input 
            type="text" 
            placeholder="Ex: @studioglamour.beauty" 
            value={instagram} 
            onChange={(e) => setInstagram(e.target.value)} 
          />
        </FormGroup>

        <FormGroup>
          <label><FaEnvelope /> E-mail de Contato</label>
          <input 
            type="email" 
            placeholder="Ex: contato@negocio.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </FormGroup>

        <FormGroup>
          <label><FaMapMarkerAlt /> Endereço Completo</label>
          <input 
            type="text" 
            placeholder="Ex: Rua das Flores, 123 - Centro" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
          />
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
            <input 
              type="text" 
              placeholder={`Serviço ${index + 1}`} 
              value={service} 
              onChange={(e) => handleServiceChange(index, e.target.value)} 
            />
            {services.length > 1 && (
              <TrashButton type="button" onClick={() => handleRemoveService(index)}>
                <FaTrash />
              </TrashButton>
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
            <input 
              type="text" 
              placeholder={`Diferencial ${index + 1} (Ex: Frete Grátis, Garantia de 1 ano)`} 
              value={benefit} 
              onChange={(e) => handleBenefitChange(index, e.target.value)} 
            />
            {benefits.length > 1 && (
              <TrashButton type="button" onClick={() => handleRemoveBenefit(index)}>
                <FaTrash />
              </TrashButton>
            )}
          </RowGroup>
        ))}
      </FormSection>

      {/* Cores */}
      <FormSection>
        <h3><FaPalette /> Design e Cores</h3>
        <CheckboxGroup>
          <input 
            type="checkbox" 
            id="useAIColors" 
            checked={useAIColors} 
            onChange={(e) => setUseAIColors(e.target.checked)} 
          />
          <label htmlFor="useAIColors">Deixar a IA escolher as melhores cores</label>
        </CheckboxGroup>

        {!useAIColors && (
          <ColorsRow>
            <ColorPickerGroup>
              <label>Cor Primária</label>
              <input 
                type="color" 
                value={primaryColor} 
                onChange={(e) => setPrimaryColor(e.target.value)} 
              />
            </ColorPickerGroup>
            <ColorPickerGroup>
              <label>Cor Secundária</label>
              <input 
                type="color" 
                value={secondaryColor} 
                onChange={(e) => setSecondaryColor(e.target.value)} 
              />
            </ColorPickerGroup>
          </ColorsRow>
        )}
      </FormSection>

      {/* Fotos Galeria */}
      <FormSection>
        <h3><FaUpload /> Fotos do Negócio (Até 6 imagens)</h3>
        <UploadZone>
          <input 
            type="file" 
            id="gallery-upload" 
            multiple 
            accept="image/*" 
            onChange={handleImageChange} 
            disabled={images.length >= 6}
          />
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
                <DeleteBadgeBtn type="button" onClick={() => handleRemoveImage(idx)}>
                  <FaTrash />
                </DeleteBadgeBtn>
              </ImageBadge>
            ))}
          </ImagePreviewGrid>
        )}
      </FormSection>

      <SubmitBtn type="submit" disabled={isGenerating}>
        {isGenerating ? 'Enviando ao Cérebro de IA...' : 'Gerar Landing Page'}
      </SubmitBtn>
    </FormCard>
  );
}

// Styled Components
const FormCard = styled.form`
  background: rgba(31, 41, 55, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  max-height: 85vh;
  overflow-y: auto;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 15px;

  h2 {
    font-size: 1.4rem;
    font-weight: 700;
    color: #a78bfa;
  }
`;

const LoadMockBtn = styled.button`
  background: rgba(167, 139, 250, 0.1);
  border: 1px solid rgba(167, 139, 250, 0.4);
  color: #c084fc;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(167, 139, 250, 0.2);
    transform: translateY(-1px);
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: rgba(17, 24, 39, 0.3);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.02);

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #e5e7eb;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 5px;

    svg {
      color: #8b5cf6;
    }
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
  gap: 6px;

  label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #9ca3af;
  }

  input, textarea, select {
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 8px;
    padding: 10px 14px;
    color: #f3f4f6;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.3s;

    &:focus {
      border-color: #8b5cf6;
      box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
    }
  }

  textarea {
    resize: vertical;
  }
`;

const RowGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  input {
    flex: 1;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 8px;
    padding: 10px 14px;
    color: #f3f4f6;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.3s;

    &:focus {
      border-color: #8b5cf6;
    }
  }
`;

const IconButton = styled.button`
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #a78bfa;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(139, 92, 246, 0.25);
  }
`;

const TrashButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(239, 68, 68, 0.25);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  color: #d1d5db;
  cursor: pointer;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #8b5cf6;
  }
`;

const ColorsRow = styled.div`
  display: flex;
  gap: 20px;
`;

const ColorPickerGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  
  label {
    font-size: 0.8rem;
    color: #9ca3af;
  }

  input[type="color"] {
    background: none;
    border: none;
    width: 60px;
    height: 36px;
    cursor: pointer;
    outline: none;
  }
`;

const UploadZone = styled.div`
  input {
    display: none;
  }

  label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 2px dashed #4b5563;
    border-radius: 10px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s;
    color: #9ca3af;

    &:hover {
      border-color: #8b5cf6;
      color: #f3f4f6;
      background: rgba(139, 92, 246, 0.02);
    }

    svg {
      font-size: 1.5rem;
    }

    span {
      font-size: 0.85rem;
    }
  }
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 10px;
`;

const ImageBadge = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #374151;
  background: #111827;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DeleteBadgeBtn = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(239, 68, 68, 0.8);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.7rem;
  transition: background 0.3s;

  &:hover {
    background: rgba(239, 68, 68, 1);
  }
`;

const SubmitBtn = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);

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
