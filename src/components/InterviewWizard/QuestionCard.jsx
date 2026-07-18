import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCheck, FaPlus, FaTrash, FaPalette, FaMicrophone, FaClock } from 'react-icons/fa';

export default function QuestionCard({ question, segment, onAnswer, onSkip, onBack, showBack }) {
  const { id, type, question: title, hint, skipLabel } = question;
  const optionsList = question.optionsList || [];

  // Estado local para a resposta
  const [value, setValue] = useState(type === 'multi_choice' ? [] : '');

  // Sincronizar o estado local ao trocar de pergunta (somente quando id/type mudam)
  useEffect(() => {
    if (type === 'multi_choice') {
      setValue([]);
    } else if (type === 'color_picker') {
      setValue(optionsList[0] || { name: 'Padrão', colors: ['#3b82f6', '#10b981', '#f3f4f6', '#1e293b'] });
    } else if (type === 'scale') {
      setValue(50);
    } else if (type === 'list_builder') {
      if (id === 'testimonials') {
        setValue([{ name: '', role: '', rating: 5, text: '', isPlaceholder: false }]);
      } else if (id === 'faq') {
        setValue([{ question: '', answer: '' }]);
      } else if (id === 'process.steps') {
        setValue([{ order: 1, title: '', description: '' }]);
      }
    } else if (type === 'time_selector') {
      setValue({
        'Segunda-Sexta': { manha: true, tarde: true, noite: false },
        'Sábado': { manha: true, tarde: false, noite: false },
        'Domingo': { manha: false, tarde: false, noite: false }
      });
    } else {
      setValue('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  // Handler para single_choice
  const handleSingleChoice = (option) => {
    setValue(option);
    setTimeout(() => {
      onAnswer(option);
    }, 200);
  };

  // Handler para multi_choice (toggle checkbox)
  const toggleMultiChoice = (option) => {
    setValue(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      if (arr.includes(option)) {
        return arr.filter(item => item !== option);
      } else {
        if (arr.length >= 3) {
          alert('Por favor, escolha no máximo 3 diferenciais para garantir uma página limpa.');
          return arr;
        }
        return [...arr, option];
      }
    });
  };

  // Handler para list_builder: atualizar campo específico de um item
  const updateListItem = (index, field, val) => {
    setValue(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  // Handler para list_builder: adicionar item
  const addListItem = () => {
    setValue(prev => {
      if (id === 'testimonials') {
        return [...prev, { name: '', role: '', rating: 5, text: '', isPlaceholder: false }];
      } else if (id === 'faq') {
        return [...prev, { question: '', answer: '' }];
      } else if (id === 'process.steps') {
        return [...prev, { order: prev.length + 1, title: '', description: '' }];
      }
      return prev;
    });
  };

  // Handler para list_builder: remover item
  const removeListItem = (index) => {
    if (value.length <= 1) {
      alert('Mantenha pelo menos um item ou clique em "Pular" se não desejar preencher.');
      return;
    }
    setValue(prev => prev.filter((_, idx) => idx !== index));
  };

  // Handler para time_selector
  const toggleTimePeriod = (day, period) => {
    setValue(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [period]: !prev[day][period]
      }
    }));
  };

  // Enviar resposta no botão confirmar
  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'text_input' && !value.trim()) {
      alert('Por favor, preencha o campo ou pule a pergunta.');
      return;
    }
    if (type === 'multi_choice' && value.length === 0) {
      alert('Por favor, selecione pelo menos uma opção ou pule a pergunta.');
      return;
    }
    onAnswer(value);
  };

  // Renderizar o tom de voz dinâmico (perceived copywriting preview)
  const getScalePreview = (score) => {
    if (score < 30) {
      return "Super Formal: 'Nossa empresa disponibiliza serviços corporativos e soluções de alta precisão técnica com estrita pontualidade.'";
    } else if (score < 70) {
      return "Profissional e Seguro: 'Oferecemos o melhor atendimento focado em qualidade e dedicação para sua completa satisfação.'";
    } else {
      return "Descontraído e Persuasivo: 'Quer dar um upgrade no visual com quem mais entende do assunto? Cola com a gente que é sucesso garantido!'";
    }
  };

  return (
    <Card onSubmit={handleSubmit}>
      <HeaderSection>
        <PriorityBadge $priority={question.priority}>
          {question.priority === 'critical' ? '🔴 Crítica' : question.priority === 'important' ? '🟡 Importante' : '🟢 Enriquecimento'}
        </PriorityBadge>
        <Title>{title}</Title>
        {hint && <Hint>{hint}</Hint>}
      </HeaderSection>

      <ContentSection>
        {/* INPUT: single_choice */}
        {type === 'single_choice' && (
          <ChoiceGrid>
            {optionsList.map((opt, idx) => (
              <ChoiceCard 
                type="button" 
                key={idx} 
                $selected={value === opt} 
                onClick={() => handleSingleChoice(opt)}
              >
                <div className="radio-circle">
                  {value === opt && <FaCheck />}
                </div>
                <span>{opt}</span>
              </ChoiceCard>
            ))}
          </ChoiceGrid>
        )}

        {/* INPUT: multi_choice */}
        {type === 'multi_choice' && (
          <MultiChoiceList>
            {optionsList.map((opt, idx) => {
              const isSelected = Array.isArray(value) && value.includes(opt);
              return (
                <ChoiceCard 
                  type="button" 
                  key={idx} 
                  $selected={isSelected} 
                  onClick={() => toggleMultiChoice(opt)}
                >
                  <div className="checkbox-square">
                    {isSelected && <FaCheck />}
                  </div>
                  <span>{opt}</span>
                </ChoiceCard>
              );
            })}
          </MultiChoiceList>
        )}

        {/* INPUT: text_input */}
        {type === 'text_input' && (
          <InputGroup>
            {id === 'contacts.whatsapp' ? (
              <InputWrapper>
                <span className="prefix">+55</span>
                <input 
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={value}
                  onChange={(e) => {
                    // Máscara numérica simples
                    const raw = e.target.value.replace(/\D/g, '');
                    setValue(raw.substring(0, 11));
                  }}
                  autoFocus
                />
              </InputWrapper>
            ) : (
              <input 
                type="text"
                placeholder="Digite sua resposta..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
              />
            )}
          </InputGroup>
        )}

        {/* INPUT: scale */}
        {type === 'scale' && (
          <ScaleWrapper>
            <SliderLabels>
              <span>{optionsList[0] || 'Formal'}</span>
              <span>{optionsList[1] || 'Informal'}</span>
            </SliderLabels>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={value} 
              onChange={(e) => setValue(parseInt(e.target.value))}
            />
            <ScalePreview>
              <FaMicrophone /> {getScalePreview(value)}
            </ScalePreview>
          </ScaleWrapper>
        )}

        {/* INPUT: color_picker */}
        {type === 'color_picker' && (
          <ColorPickerWrapper>
            <PaletteGrid>
              {optionsList.map((palette, idx) => {
                const isSelected = value.name === palette.name;
                return (
                  <PaletteCard 
                    type="button"
                    key={idx} 
                    $selected={isSelected}
                    onClick={() => setValue(palette)}
                  >
                    <div className="palette-info">
                      <FaPalette className="pal-icon" />
                      <span>{palette.name}</span>
                    </div>
                    <div className="colors-row">
                      {palette.colors.slice(0, 4).map((c, cIdx) => (
                        <ColorDot key={cIdx} $color={c} title={c} />
                      ))}
                    </div>
                  </PaletteCard>
                );
              })}
            </PaletteGrid>
            
            <CustomColorSection>
              <h4>Customizar paleta manualmente</h4>
              <CustomColorsGrid>
                {['primaryColor', 'secondaryColor', 'lightColor', 'darkColor'].map((field, fIdx) => {
                  const label = field === 'primaryColor' ? 'Primária' : field === 'secondaryColor' ? 'Secundária' : field === 'lightColor' ? 'Fundo Claro' : 'Fundo Escuro';
                  const hexMap = {
                    primaryColor: value.colors ? value.colors[1] : '#3b82f6',
                    secondaryColor: value.colors ? value.colors[0] : '#10b981',
                    lightColor: value.colors ? value.colors[2] : '#f3f4f6',
                    darkColor: value.colors ? value.colors[3] : '#1e293b'
                  };
                  return (
                    <div className="color-field" key={fIdx}>
                      <label>{label}</label>
                      <div className="picker-input">
                        <input 
                          type="color" 
                          value={hexMap[field]}
                          onChange={(e) => {
                            const newColors = [...(value.colors || ['#10b981', '#3b82f6', '#f3f4f6', '#1e293b'])];
                            const idxMap = { secondaryColor: 0, primaryColor: 1, lightColor: 2, darkColor: 3 };
                            newColors[idxMap[field]] = e.target.value;
                            setValue({
                              name: 'Customizada',
                              colors: newColors
                            });
                          }}
                        />
                        <input 
                          type="text" 
                          value={hexMap[field].toUpperCase()} 
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length === 7 && val.startsWith('#')) {
                              const newColors = [...(value.colors || ['#10b981', '#3b82f6', '#f3f4f6', '#1e293b'])];
                              const idxMap = { secondaryColor: 0, primaryColor: 1, lightColor: 2, darkColor: 3 };
                              newColors[idxMap[field]] = val;
                              setValue({
                                name: 'Customizada',
                                colors: newColors
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CustomColorsGrid>
            </CustomColorSection>
          </ColorPickerWrapper>
        )}

        {/* INPUT: time_selector */}
        {type === 'time_selector' && (
          <TimeSelectorWrapper>
            <div className="table-header">
              <span>Período</span>
              <span>Manhã</span>
              <span>Tarde</span>
              <span>Noite</span>
            </div>
            {Object.keys(value || {}).map((day) => (
              <div className="table-row" key={day}>
                <span className="day-name">{day}</span>
                {['manha', 'tarde', 'noite'].map((period) => {
                  const active = value[day]?.[period];
                  return (
                    <button 
                      type="button" 
                      key={period} 
                      className={`period-btn ${active ? 'active' : ''}`}
                      onClick={() => toggleTimePeriod(day, period)}
                    >
                      <FaClock />
                    </button>
                  );
                })}
              </div>
            ))}
          </TimeSelectorWrapper>
        )}

        {/* INPUT: list_builder */}
        {type === 'list_builder' && (
          <ListBuilderWrapper>
            {id === 'testimonials' && Array.isArray(value) && value.map((item, idx) => (
              <ListCard key={idx}>
                <CardHeader>
                  <h4>Depoimento {idx + 1}</h4>
                  <DeleteBtn type="button" onClick={() => removeListItem(idx)}><TrashIcon /></DeleteBtn>
                </CardHeader>
                <div className="card-fields">
                  <div className="row-half">
                    <input 
                      type="text" 
                      placeholder="Nome do cliente" 
                      value={item.name || ''} 
                      onChange={(e) => updateListItem(idx, 'name', e.target.value)}
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Cargo/Relação (ex: Cliente há 1 ano)" 
                      value={item.role || ''} 
                      onChange={(e) => updateListItem(idx, 'role', e.target.value)}
                    />
                  </div>
                  <textarea 
                    placeholder="Texto do depoimento real..." 
                    value={item.text || ''} 
                    onChange={(e) => updateListItem(idx, 'text', e.target.value)}
                    required
                  />
                </div>
              </ListCard>
            ))}

            {id === 'faq' && Array.isArray(value) && value.map((item, idx) => (
              <ListCard key={idx}>
                <CardHeader>
                  <h4>Pergunta Frequente {idx + 1}</h4>
                  <DeleteBtn type="button" onClick={() => removeListItem(idx)}><TrashIcon /></DeleteBtn>
                </CardHeader>
                <div className="card-fields">
                  <input 
                    type="text" 
                    placeholder="Dúvida comum (ex: Vocês aceitam cartão?)" 
                    value={item.question || ''} 
                    onChange={(e) => updateListItem(idx, 'question', e.target.value)}
                    required
                  />
                  <textarea 
                    placeholder="Resposta oficial..." 
                    value={item.answer || ''} 
                    onChange={(e) => updateListItem(idx, 'answer', e.target.value)}
                    required
                  />
                </div>
              </ListCard>
            ))}

            {id === 'process.steps' && Array.isArray(value) && value.map((item, idx) => (
              <ListCard key={idx}>
                <CardHeader>
                  <h4>Passo {idx + 1}</h4>
                  <DeleteBtn type="button" onClick={() => removeListItem(idx)}><TrashIcon /></DeleteBtn>
                </CardHeader>
                <div className="card-fields">
                  <input 
                    type="text" 
                    placeholder="Título da etapa (ex: Escolha seu serviço)" 
                    value={item.title || ''} 
                    onChange={(e) => updateListItem(idx, 'title', e.target.value)}
                    required
                  />
                  <textarea 
                    placeholder="Breve descrição da etapa..." 
                    value={item.description || ''} 
                    onChange={(e) => updateListItem(idx, 'description', e.target.value)}
                    required
                  />
                </div>
              </ListCard>
            ))}

            <AddBtn type="button" onClick={addListItem}>
              <FaPlus /> Adicionar Item
            </AddBtn>
          </ListBuilderWrapper>
        )}
      </ContentSection>

      <FooterSection>
        <LeftActions>
          {showBack && (
            <ActionBtn type="button" onClick={onBack} className="btn-back">
              Voltar
            </ActionBtn>
          )}
        </LeftActions>
        <RightActions>
          <ActionBtn type="button" onClick={onSkip} className="btn-skip">
            {skipLabel || 'Pular'}
          </ActionBtn>
          {type !== 'single_choice' && (
            <ActionBtn type="submit" className="btn-submit">
              Confirmar
            </ActionBtn>
          )}
        </RightActions>
      </FooterSection>
    </Card>
  );
}

// Helpers
const TrashIcon = () => <FaTrash style={{ fontSize: '0.85rem' }} />;

// Styled Components
const Card = styled.form`
  display: flex;
  flex-direction: column;
  background: rgba(30, 41, 59, 0.45);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

const HeaderSection = styled.div`
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PriorityBadge = styled.span`
  align-self: flex-start;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 20px;
  background: ${props => {
    if (props.$priority === 'critical') return 'rgba(239, 68, 68, 0.15)';
    if (props.$priority === 'important') return 'rgba(245, 158, 11, 0.15)';
    return 'rgba(16, 185, 129, 0.15)';
  }};
  color: ${props => {
    if (props.$priority === 'critical') return '#f87171';
    if (props.$priority === 'important') return '#fbbf24';
    return '#34d399';
  }};
  border: 1px solid ${props => {
    if (props.$priority === 'critical') return 'rgba(239, 68, 68, 0.3)';
    if (props.$priority === 'important') return 'rgba(245, 158, 11, 0.3)';
    return 'rgba(16, 185, 129, 0.3)';
  }};
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.4;
`;

const Hint = styled.p`
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
`;

const ContentSection = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 250px;
  max-height: 480px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 3px;
  }
`;

const ChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

const MultiChoiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChoiceCard = styled.button`
  background: ${props => props.$selected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.$selected ? '#8b5cf6' : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  color: ${props => props.$selected ? 'white' : '#cbd5e1'};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.4;

  &:hover {
    background: ${props => props.$selected ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
    border-color: ${props => props.$selected ? '#a78bfa' : 'rgba(255, 255, 255, 0.15)'};
  }

  .radio-circle, .checkbox-square {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid ${props => props.$selected ? '#8b5cf6' : '#64748b'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    color: white;
    background: ${props => props.$selected ? '#8b5cf6' : 'transparent'};
    flex-shrink: 0;
  }

  .checkbox-square {
    border-radius: 4px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  flex: 1;

  input[type="text"] {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 10px;
    padding: 14px;
    color: white;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #8b5cf6;
    }
  }
`;

const InputWrapper = styled.div`
  display: flex;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  overflow: hidden;
  align-items: center;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: #8b5cf6;
  }

  .prefix {
    padding: 0 14px;
    color: #64748b;
    font-weight: 700;
    border-right: 1px solid #334155;
  }

  input {
    background: transparent;
    border: none;
    padding: 14px;
    color: white;
    font-size: 1rem;
    outline: none;
    width: 100%;
  }
`;

const ScaleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  flex: 1;

  input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #334155;
    outline: none;
    
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #8b5cf6;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: background 0.15s;

      &:hover {
        background: #a78bfa;
      }
    }
  }
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
`;

const ScalePreview = styled.div`
  background: rgba(15, 23, 42, 0.4);
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 14px;
  font-size: 0.85rem;
  color: #cbd5e1;
  display: flex;
  gap: 10px;
  line-height: 1.5;
  align-items: flex-start;
  
  svg {
    margin-top: 3px;
    color: #a78bfa;
    flex-shrink: 0;
  }
`;

const ColorPickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PaletteGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PaletteCard = styled.button`
  background: ${props => props.$selected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${props => props.$selected ? '#8b5cf6' : 'rgba(255, 255, 255, 0.06)'};
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  
  &:hover {
    background: ${props => props.$selected ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
    border-color: ${props => props.$selected ? '#a78bfa' : 'rgba(255, 255, 255, 0.15)'};
  }

  .palette-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${props => props.$selected ? 'white' : '#cbd5e1'};
    font-size: 0.8rem;
    font-weight: 600;
    
    .pal-icon {
      color: ${props => props.$selected ? '#a78bfa' : '#64748b'};
    }
  }

  .colors-row {
    display: flex;
    gap: 6px;
  }
`;

const ColorDot = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background-color: ${props => props.$color};
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

const CustomColorSection = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  h4 {
    font-size: 0.85rem;
    color: #cbd5e1;
    margin: 0;
    font-weight: 600;
  }
`;

const CustomColorsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }

  .color-field {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 600;
    }

    .picker-input {
      display: flex;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      overflow: hidden;
      align-items: center;
      height: 38px;

      input[type="color"] {
        border: none;
        background: transparent;
        width: 38px;
        height: 38px;
        cursor: pointer;
        padding: 0;
        
        &::-webkit-color-swatch-wrapper {
          padding: 0;
        }
        &::-webkit-color-swatch {
          border: none;
          border-right: 1px solid #334155;
        }
      }

      input[type="text"] {
        background: transparent;
        border: none;
        color: white;
        font-size: 0.8rem;
        padding: 0 10px;
        outline: none;
        width: 80px;
        font-family: monospace;
      }
    }
  }
`;

const TimeSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;

  .table-header {
    display: grid;
    grid-template-columns: 140px 1fr 1fr 1fr;
    background: rgba(255,255,255,0.02);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding: 10px 16px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    text-align: center;

    span:first-child {
      text-align: left;
    }
  }

  .table-row {
    display: grid;
    grid-template-columns: 140px 1fr 1fr 1fr;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    padding: 12px 16px;
    align-items: center;
    text-align: center;

    &:last-child {
      border-bottom: none;
    }

    .day-name {
      text-align: left;
      font-size: 0.85rem;
      font-weight: 600;
      color: #e2e8f0;
    }

    .period-btn {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255,255,255,0.05);
      color: #475569;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      margin: 0 auto;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #94a3b8;
      }

      &.active {
        background: rgba(139, 92, 246, 0.15);
        border-color: #8b5cf6;
        color: #a78bfa;
      }
    }
  }
`;

const ListBuilderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ListCard = styled.div`
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .card-fields {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .row-half {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 10px;
      
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }

    input, textarea {
      background: #090d16;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 10px;
      color: white;
      font-size: 0.85rem;
      outline: none;
      width: 100%;
      
      &:focus {
        border-color: #8b5cf6;
      }
    }

    textarea {
      resize: vertical;
      min-height: 60px;
      line-height: 1.4;
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  padding-bottom: 8px;

  h4 {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 700;
    color: #a78bfa;
  }
`;

const DeleteBtn = styled.button`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: #f87171;
  }
`;

const AddBtn = styled.button`
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: #8b5cf6;
    color: white;
  }
`;

const FooterSection = styled.div`
  padding: 16px 24px;
  background: rgba(15, 23, 42, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftActions = styled.div``;

const RightActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionBtn = styled.button`
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &.btn-back {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #94a3b8;

    &:hover {
      background: rgba(255, 255, 255, 0.04);
      color: white;
      border-color: rgba(255, 255, 255, 0.3);
    }
  }

  &.btn-skip {
    background: transparent;
    color: #64748b;

    &:hover {
      color: #94a3b8;
    }
  }

  &.btn-submit {
    background: #8b5cf6;
    color: white;
    box-shadow: 0 4px 10px rgba(139, 92, 246, 0.3);

    &:hover {
      background: #7c3aed;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
    }
  }
`;
