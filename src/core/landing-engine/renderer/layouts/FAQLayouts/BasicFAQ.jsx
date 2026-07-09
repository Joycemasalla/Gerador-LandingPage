import React, { useState } from 'react';
import styled from 'styled-components';
import { Container } from '../../components/Container';
import { Heading } from '../../components/Heading';
import { Paragraph } from '../../components/Paragraph';
import { FaPlus } from 'react-icons/fa';

const Wrapper = styled.section`
  padding: clamp(72px, 10vh, 120px) 0;
  background-color: var(--color-background);

  .head { text-align: center; max-width: 720px; margin: 0 auto clamp(40px, 6vh, 64px); }
  .list { max-width: 780px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }

  .item {
    background: color-mix(in srgb, var(--color-muted) 55%, var(--color-background));
    border: 1px solid color-mix(in srgb, var(--color-foreground) 8%, transparent);
    border-radius: 16px;
    overflow: hidden;
    transition: border-color .25s ease, background .25s ease;
  }
  .item.open {
    border-color: color-mix(in srgb, var(--color-primary) 40%, transparent);
    background: var(--color-background);
    box-shadow: 0 12px 30px -18px rgba(0,0,0,0.18);
  }
  button.q {
    all: unset; cursor: pointer;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    padding: 22px 26px; width: 100%;
    font-weight: 700; color: var(--color-foreground); font-family: var(--font-display);
    font-size: 1.05rem;
  }
  .plus {
    width: 32px; height: 32px; border-radius: 999px;
    background: color-mix(in srgb, var(--color-primary) 14%, transparent);
    color: var(--color-primary);
    display: flex; align-items: center; justify-content: center;
    transition: transform .3s ease;
    flex-shrink: 0;
  }
  .item.open .plus { transform: rotate(45deg); }
  .a {
    max-height: 0; overflow: hidden; padding: 0 26px;
    transition: max-height .35s ease, padding .35s ease;
  }
  .item.open .a { max-height: 500px; padding: 0 26px 22px; }
`;

export function BasicFAQ({ data }) {
  const { headline, subheadline, items = [] } = data || {};
  const [open, setOpen] = useState(0);
  const list = items.length ? items : [
    { title: 'Como faço para agendar?', description: 'Basta clicar no botão principal e escolher o melhor horário.' },
    { title: 'Onde vocês ficam?', description: 'Estamos em local de fácil acesso, com endereço enviado após confirmação.' },
  ];

  return (
    <Wrapper>
      <Container>
        <div className="head">
          <Heading as="h2" align="center">{headline || 'Perguntas frequentes'}</Heading>
          {subheadline && <div style={{ marginTop: 12 }}><Paragraph size="lg" align="center" muted>{subheadline}</Paragraph></div>}
        </div>
        <div className="list">
          {list.map((item, idx) => (
            <div className={`item ${open === idx ? 'open' : ''}`} key={idx}>
              <button className="q" onClick={() => setOpen(open === idx ? -1 : idx)}>
                <span>{item.title}</span>
                <span className="plus"><FaPlus size={12} /></span>
              </button>
              <div className="a">
                <Paragraph muted noMargin>{item.description}</Paragraph>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Wrapper>
  );
}
