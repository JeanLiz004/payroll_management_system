import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'rgba(237, 240, 247, 1)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: 'rgba(13, 48, 72, .9)',
        color: '#ffffff',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Logo Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img src="/sb-logo.png" alt="Superintendencia de Bancos" style={{ width: '180px', objectFit: 'contain' }} />
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '6px',
            color: '#ffffff',
            textDecoration: 'none',
            backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.15)' : 'transparent',
            fontWeight: location.pathname === '/' ? '600' : '400'
          }}>
            Inicio
          </Link>

          <Link to="/consulta" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '6px',
            color: '#ffffff',
            textDecoration: 'none',
            backgroundColor: location.pathname === '/consulta' ? 'rgba(255,255,255,0.15)' : 'transparent',
            fontWeight: location.pathname === '/consulta' ? '600' : '400'
          }}>
            Consulta
          </Link>

          <Link to="/crear" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '6px',
            color: '#ffffff',
            textDecoration: 'none',
            backgroundColor: location.pathname === '/crear' ? 'rgba(255,255,255,0.15)' : 'transparent',
            fontWeight: location.pathname === '/crear' ? '600' : '400'
          }}>
            Crear registro
          </Link>
        </nav>
      </aside>

      {/* Main Content Card Wrapper Area */}
      <main style={{ flex: 1, padding: '32px 40px' }}>
        <h2 style={{ color: '#0d3048', marginBottom: '24px', fontSize: '24px' }}>
          {location.pathname === '/' ? 'Inicio' : location.pathname === '/consulta' ? 'Consulta de Pagos' : 'Crear Registro de Empleado'}
        </h2>
        
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          minHeight: 'calc(100vh - 140px)'
        }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};