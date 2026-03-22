import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/context/AuthContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Wrap = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #ebedee 100%);
`;

const Card = styled.form`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.08);
  padding: 2rem;
  width: 100%;
  max-width: 420px;
`;

const Title = styled.h1`
  font-weight: 800;
  color: var(--color-secondary);
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 0.9rem;
  border: 2px solid #eee;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s;
  &:focus { border-color: var(--color-secondary); }
`;

const Label = styled.label`
  display: block;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0.75rem 0 0.35rem;
`;

const Button = styled.button`
  width: 100%;
  margin-top: 1.25rem;
  background: var(--color-secondary);
  color: #fff;
  border: 0;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #6a4fd0; }
  &:disabled { opacity: .7; cursor: not-allowed; }
`;

const Error = styled.div`
  color: #e74c3c;
  margin-top: 0.75rem;
  font-weight: 700;
`;

const Back = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  color: var(--color-secondary);
  font-weight: 700;
`;

const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await login(email.trim(), password);
      const redirectTo = location.state?.from || '/admin';
      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      setErr(error?.response?.data?.message || 'Giriş başarısız');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Wrap>
      <Card onSubmit={onSubmit}>
        <Title>Admin Girişi</Title>
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" />
        <Label htmlFor="password">Parola</Label>
        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        <Button type="submit" disabled={busy}>{busy ? 'Giriş yapılıyor...' : 'Giriş Yap'}</Button>
        {err && <Error>{err}</Error>}
        <Back to="/">← Kullanıcı sayfasına dön</Back>
      </Card>
    </Wrap>
  );
};

export default AdminLogin;