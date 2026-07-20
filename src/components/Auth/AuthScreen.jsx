import React, { useState } from 'react';
import styled from 'styled-components';
import { FaRobot, FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';
import { supabase } from '../../integrations/supabase/client';
import { lovable } from '../../integrations/lovable/index';

export default function AuthScreen() {
  const [mode, setMode] = useState('signin'); // signin | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin }
        });
        if (error) throw error;
        setInfo('Conta criada! Verifique seu email para confirmar (se necessário) e entre.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setInfo('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Erro no login com Google');
    }
  };

  return (
    <Wrapper>
      <Card>
        <Logo>
          <FaRobot />
        </Logo>
        <h1>InstaPage AI</h1>
        <p className="sub">Entre para salvar seu histórico e acessar de qualquer dispositivo.</p>

        <GoogleBtn onClick={handleGoogle} disabled={loading}>
          <FaGoogle /> Continuar com Google
        </GoogleBtn>

        <Divider><span>ou</span></Divider>

        <form onSubmit={handleEmailAuth}>
          <Field>
            <FaEnvelope />
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field>
            <FaLock />
            <input
              type="password"
              placeholder="Senha (mín. 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </Field>

          {error && <Msg className="err">{error}</Msg>}
          {info && <Msg className="ok">{info}</Msg>}

          <SubmitBtn type="submit" disabled={loading}>
            {loading ? 'Aguarde...' : mode === 'signup' ? 'Criar conta' : 'Entrar'}
          </SubmitBtn>
        </form>

        <Toggle>
          {mode === 'signup' ? 'Já tem conta?' : 'Não tem conta?'}
          <button type="button" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); setInfo(''); }}>
            {mode === 'signup' ? 'Entrar' : 'Criar conta'}
          </button>
        </Toggle>
      </Card>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: radial-gradient(circle at top right, #0f172a, #020617);
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 36px 32px;
  text-align: center;

  h1 {
    color: #fff;
    font-size: 1.6rem;
    margin: 8px 0 6px;
  }
  .sub {
    color: #94a3b8;
    font-size: 0.9rem;
    margin-bottom: 24px;
  }
  form { display: flex; flex-direction: column; gap: 12px; }
`;

const Logo = styled.div`
  width: 56px; height: 56px; margin: 0 auto 12px;
  border-radius: 14px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 1.6rem;
  box-shadow: 0 8px 20px rgba(99,102,241,0.35);
`;

const GoogleBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: #fff;
  color: #1f2937;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: transform .15s ease;
  &:hover { transform: translateY(-1px); }
  &:disabled { opacity: .6; cursor: not-allowed; }
`;

const Divider = styled.div`
  display: flex; align-items: center; gap: 12px;
  color: #64748b; font-size: 0.75rem;
  margin: 20px 0 16px;
  &::before, &::after {
    content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08);
  }
`;

const Field = styled.div`
  display: flex; align-items: center; gap: 10px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 0 14px;
  color: #64748b;
  &:focus-within { border-color: #8b5cf6; }
  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: white;
    padding: 12px 0;
    font-size: 0.95rem;
  }
`;

const SubmitBtn = styled.button`
  margin-top: 4px;
  padding: 12px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform .15s ease, opacity .2s;
  &:hover { transform: translateY(-1px); }
  &:disabled { opacity: .6; cursor: not-allowed; }
`;

const Toggle = styled.div`
  margin-top: 18px;
  color: #94a3b8;
  font-size: 0.85rem;
  button {
    background: none; border: none;
    color: #a78bfa; font-weight: 600; cursor: pointer;
    margin-left: 6px;
  }
`;

const Msg = styled.div`
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  text-align: left;
  &.err { background: rgba(239,68,68,0.1); color: #fca5a5; border: 1px solid rgba(239,68,68,0.2); }
  &.ok  { background: rgba(34,197,94,0.1); color: #86efac; border: 1px solid rgba(34,197,94,0.2); }
`;
