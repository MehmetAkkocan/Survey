import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, refresh } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login', { replace: true, state: { from: location.pathname } });
    }
  }, [user, loading, navigate, location]);

  // Attempt to refresh if first load
  useEffect(() => {
    if (loading) {
      refresh().catch(() => {});
    }
  }, [loading, refresh]);

  if (loading) return <div style={{ padding: '2rem' }}>Yükleniyor...</div>;
  if (!user) return null;

  return <>{children}</>;
};

export default RequireAdmin;