import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSave, FaPlus, FaTimes } from 'react-icons/fa';

export default function MyProfile({ profile, onUpdate }) {
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    service: '',
    differentials: [],
    priceRange: '',
    tone: 'Profissional',
    cases: ''
  });

  const [newDiff, setNewDiff] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddDiff = (e) => {
    e.preventDefault();
    if (newDiff.trim() && !formData.differentials.includes(newDiff.trim())) {
      setFormData({
        ...formData,
        differentials: [...formData.differentials, newDiff.trim()]
      });
      setNewDiff('');
    }
  };

  const handleAddSuggestedDiff = (diff) => {
    if (!formData.differentials.includes(diff)) {
      setFormData({
        ...formData,
        differentials: [...formData.differentials, diff]
      });
    }
  };

  const handleRemoveDiff = (diffToRemove) => {
    setFormData({
      ...formData,
      differentials: formData.differentials.filter(d => d !== diffToRemove)
    });
  };

  const handleSave = () => {
    localStorage.setItem('salesagent_profile', JSON.stringify(formData));
    onUpdate(formData);
    alert('Perfil salvo com sucesso! Estas informações serão usadas pela IA.');
  };

  const suggestedDiffs = ["Protótipos grátis", "Entrega em 7 dias", "Suporte pós-entrega", "100% dedicação", "Foco em Conversão", "Design Exclusivo"];

  return (
    <Container className="animate-fade-in">
      <Header>
        <h2>Configuração do Freelancer</h2>
        <p>Estes dados serão injetados nos prompts para personalizar suas abordagens de vendas.</p>
      </Header>

      <Form>
        <Row>
          <FormGroup>
            <label>Seu Nome Completo</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Ex: João Silva" 
            />
          </FormGroup>
          <FormGroup>
            <label>@ Instagram Profissional</label>
            <input 
              type="text" 
              name="handle" 
              value={formData.handle} 
              onChange={handleChange} 
              placeholder="Ex: @joaosilva.web" 
            />
          </FormGroup>
        </Row>

        <FormGroup>
          <label>Serviço Principal</label>
          <input 
            type="text" 
            name="service" 
            value={formData.service} 
            onChange={handleChange} 
            placeholder="Ex: Landing Pages de alta conversão para negócios locais" 
          />
        </FormGroup>

        <FormGroup>
          <label>Seus Diferenciais</label>
          <div className="diff-input-group">
            <input 
              type="text" 
              value={newDiff} 
              onChange={(e) => setNewDiff(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleAddDiff(e)}
              placeholder="Digite um diferencial e aperte Enter" 
            />
            <button type="button" onClick={handleAddDiff}><FaPlus /></button>
          </div>
          
          <div className="tags-container">
            {formData.differentials.map((diff, idx) => (
              <span key={idx} className="tag">
                {diff} <button type="button" onClick={() => handleRemoveDiff(diff)}><FaTimes /></button>
              </span>
            ))}
          </div>
          
          <div className="suggested-tags">
            <span className="label">Sugestões:</span>
            {suggestedDiffs.map((diff, idx) => (
              <span 
                key={idx} 
                className="suggested-tag"
                onClick={() => handleAddSuggestedDiff(diff)}
              >
                + {diff}
              </span>
            ))}
          </div>
        </FormGroup>

        <Row>
          <FormGroup>
            <label>Faixa de Preço</label>
            <input 
              type="text" 
              name="priceRange" 
              value={formData.priceRange} 
              onChange={handleChange} 
              placeholder="Ex: R$ 800 a R$ 2.000" 
            />
          </FormGroup>

          <FormGroup>
            <label>Tom de Voz Preferido</label>
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="tone" 
                  value="Profissional" 
                  checked={formData.tone === 'Profissional'} 
                  onChange={handleChange} 
                /> Profissional
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="tone" 
                  value="Descontraído" 
                  checked={formData.tone === 'Descontraído'} 
                  onChange={handleChange} 
                /> Descontraído
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="tone" 
                  value="Direto" 
                  checked={formData.tone === 'Direto'} 
                  onChange={handleChange} 
                /> Direto
              </label>
            </div>
          </FormGroup>
        </Row>

        <FormGroup>
          <label>Cases de Sucesso / Provas Sociais</label>
          <textarea 
            name="cases" 
            value={formData.cases} 
            onChange={handleChange} 
            placeholder="Descreva resultados que você já gerou. Ex: Criei a LP da Hamburgueria X e as vendas via delivery aumentaram 30%..."
            rows={4}
          />
        </FormGroup>

        <SaveButton type="button" onClick={handleSave}>
          <FaSave /> Salvar Perfil
        </SaveButton>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 32px;
`;

const Header = styled.div`
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 16px;

  h2 {
    margin: 0 0 8px 0;
    color: #f1f5f9;
    font-size: 1.4rem;
  }
  p {
    margin: 0;
    color: #94a3b8;
    font-size: 0.95rem;
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #cbd5e1;
  }

  input[type="text"], textarea {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px 16px;
    color: white;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s;
    font-family: 'Inter', sans-serif;

    &:focus {
      border-color: #10b981;
    }
  }

  .diff-input-group {
    display: flex;
    gap: 8px;

    input {
      flex: 1;
    }

    button {
      background: #334155;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0 16px;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #475569;
      }
    }
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
  }

  .tag {
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 6px;

    button {
      background: none;
      border: none;
      color: #34d399;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0;
      font-size: 0.8rem;
      opacity: 0.7;

      &:hover {
        opacity: 1;
      }
    }
  }

  .suggested-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
    align-items: center;

    .label {
      font-size: 0.8rem;
      color: #64748b;
    }

    .suggested-tag {
      font-size: 0.8rem;
      color: #94a3b8;
      background: rgba(255, 255, 255, 0.05);
      padding: 4px 10px;
      border-radius: 12px;
      cursor: pointer;
      border: 1px dashed rgba(255, 255, 255, 0.1);
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }
    }
  }

  .radio-group {
    display: flex;
    gap: 16px;
    padding: 12px 0;
  }

  .radio-label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #e2e8f0;
    font-weight: 400;

    input[type="radio"] {
      accent-color: #10b981;
      width: 16px;
      height: 16px;
    }
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
`;
