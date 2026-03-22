import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Shell = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #ebedee 100%);
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  background: #fff;
  border-bottom: 1px solid #ececec;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Brand = styled(Link)`
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--color-secondary);
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;

  a {
    color: var(--color-primary);
    padding: 0.4rem 0.75rem;
    border-radius: 8px;
    transition: background 0.2s;
  }

  a.active, a:hover {
    background: rgba(126, 94, 242, 0.12);
    color: var(--color-third);
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: .75rem;
  color: var(--color-primary);
  font-weight: 700;

  button {
    background: var(--color-secondary);
    color: #fff;
    border: 0;
    padding: 0.4rem 0.7rem;
    border-radius: 8px;
    cursor: pointer;
  }
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <Shell>
      <Header>
        <Brand to="/">Survey App</Brand>
        <Nav>
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/">Kullanıcı Anketi</NavLink>
        </Nav>
        <Right>
          <span>{user?.email}</span>
          <button onClick={onLogout}>Çıkış</button>
        </Right>
      </Header>
      <Content>{children}</Content>
    </Shell>
  );
};

export default AdminLayout;