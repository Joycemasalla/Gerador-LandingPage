import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Save, Plus, X, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const Container = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #f8fafc;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #cbd5e1;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid #475569;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #f8fafc;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid #475569;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #f8fafc;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  background: ${props => props.$active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.6)'};
  border: 1px solid ${props => props.$active ? '#10b981' : '#475569'};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;
  color: ${props => props.$active ? '#10b981' : '#cbd5e1'};

  input {
    display: none;
  }

  &:hover {
    border-color: ${props => props.$active ? '#10b981' : '#64748b'};
  }
`;

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Chip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  padding: 0.4rem 0.8rem;
  border-radius: 99px;
  font-size: 0.85rem;
  border: 1px solid rgba(16, 185, 129, 0.3);

  button {
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0;
    opacity: 0.7;
    &:hover { opacity: 1; }
  }
`;

const SuggestionChip = styled.button`
  background: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
  border: 1px dashed #64748b;
  padding: 0.4rem 0.8rem;
  border-radius: 99px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background: rgba(148, 163, 184, 0.2);
    color: #f8fafc;
    border-color: #94a3b8;
  }
`;

const DiffInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const AddButton = styled.button`
  background: #334155;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s;

  &:hover {
    background: #475569;
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  width: 100%;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const defaultSuggestions = [
  "Protótipos grátis",
  "Entrega em 7 dias",
  "Suporte pós-entrega",
  "100% dedicação",
  "Design autoral"
];

export default function MyProfile() {
  const [profile, setProfile] = useState({
    name: '',
    instagram: '',
    service: '',
    differentials: [],
    priceRange: '',
    tone: 'Profissional',
    cases: ''
  });

  const [newDiff, setNewDiff] = useState('');
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('salesagent_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAddDiff = (diff) => {
    const value = diff.trim();
    if (value && !profile.differentials.includes(value)) {
      setProfile(prev => ({
        ...prev,
        differentials: [...prev.differentials, value]
      }));
      setNewDiff('');
    }
  };

  const handleRemoveDiff = (diffToRemove) => {
    setProfile(prev => ({
      ...prev,
      differentials: prev.differentials.filter(d => d !== diffToRemove)
    }));
  };

  const handleSave = () => {
    localStorage.setItem('salesagent_profile', JSON.stringify(profile));
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const tones = ['Profissional', 'Descontraído', 'Direto'];

  return (
    <Container>
      <Title>Seu Perfil Comercial</Title>
      <p style={{ color: '#94a3b8', marginBottom: '2rem', marginTop: '-1.5rem', fontSize: '0.9rem' }}>
        Preencha seus dados para que a IA personalize suas mensagens de abordagem com seus serviços e diferenciais.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <FormGroup>
          <Label>Seu Nome</Label>
          <Input 
            placeholder="Ex: João Silva" 
            value={profile.name} 
            onChange={(e) => handleChange('name', e.target.value)} 
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Seu @Instagram</Label>
          <Input 
            placeholder="Ex: @joaosilva.web" 
            value={profile.instagram} 
            onChange={(e) => handleChange('instagram', e.target.value)} 
          />
        </FormGroup>
      </div>

      <FormGroup>
        <Label>Serviço Principal</Label>
        <Input 
          placeholder="Ex: Landing Pages de alta conversão" 
          value={profile.service} 
          onChange={(e) => handleChange('service', e.target.value)} 
        />
      </FormGroup>

      <FormGroup>
        <Label>Seus Diferenciais</Label>
        
        <DiffInputGroup>
          <Input 
            placeholder="Digite um diferencial e pressione Adicionar" 
            value={newDiff}
            onChange={(e) => setNewDiff(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddDiff(newDiff)}
          />
          <AddButton onClick={() => handleAddDiff(newDiff)}>
            <Plus size={18} />
          </AddButton>
        </DiffInputGroup>

        <ChipContainer>
          <AnimatePresence>
            {profile.differentials.map((diff) => (
              <motion.div
                key={diff}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Chip>
                  {diff}
                  <button onClick={() => handleRemoveDiff(diff)}><X size={14} /></button>
                </Chip>
              </motion.div>
            ))}
          </AnimatePresence>
        </ChipContainer>

        <Label style={{ fontSize: '0.8rem', marginTop: '1rem' }}>Sugestões:</Label>
        <ChipContainer>
          {defaultSuggestions.filter(s => !profile.differentials.includes(s)).map(sugg => (
            <SuggestionChip key={sugg} onClick={() => handleAddDiff(sugg)}>
              <Plus size={14} /> {sugg}
            </SuggestionChip>
          ))}
        </ChipContainer>
      </FormGroup>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <FormGroup>
          <Label>Faixa de Preço (Opcional)</Label>
          <Input 
            placeholder="Ex: R$ 800 a R$ 2.000" 
            value={profile.priceRange} 
            onChange={(e) => handleChange('priceRange', e.target.value)} 
          />
        </FormGroup>

        <FormGroup>
          <Label>Tom de Voz da Abordagem</Label>
          <RadioGroup>
            {tones.map(t => (
              <RadioLabel key={t} $active={profile.tone === t}>
                <input 
                  type="radio" 
                  name="tone" 
                  checked={profile.tone === t}
                  onChange={() => handleChange('tone', t)}
                />
                {t}
              </RadioLabel>
            ))}
          </RadioGroup>
        </FormGroup>
      </div>

      <FormGroup>
        <Label>Cases / Provas Sociais (Como você já ajudou outros?)</Label>
        <Textarea 
          placeholder="Ex: Aumentei as vendas da Hamburgueria X em 30% com uma página de pedidos direta..."
          value={profile.cases} 
          onChange={(e) => handleChange('cases', e.target.value)} 
        />
      </FormGroup>

      <SaveButton onClick={handleSave}>
        {savedStatus ? (
          <>
            <Check size={20} /> Salvo com Sucesso!
          </>
        ) : (
          <>
            <Save size={20} /> Salvar Perfil
          </>
        )}
      </SaveButton>
    </Container>
  );
}
