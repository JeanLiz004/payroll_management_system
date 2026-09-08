import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ReporteNomina } from './components/ReporteNomina';
import Usuario from './components/Usuario';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
  const [vistaActual, setVistaActual] = useState<'dashboard' | 'nomina' | 'usuarios'>('dashboard');

  useEffect(() => {
    const tokenGuardado = localStorage.getItem('jwt_token');
    setToken(tokenGuardado);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
  };

  // Si no hay token, renderiza el formulario de acceso
  if (!token) {
    return <Login onLoginSuccess={(newToken: string) => setToken(newToken)} />;
  }

  return (
    <div className="app-container">
      <nav style={{ padding: '10px 20px', backgroundColor: '#0d3048', color: '#fff', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <button onClick={() => setVistaActual('dashboard')} style={btnStyle(vistaActual === 'dashboard')}>
          Dashboard
        </button>
        <button onClick={() => setVistaActual('nomina')} style={btnStyle(vistaActual === 'nomina')}>
          Reporte de Nómina
        </button>
        <button onClick={() => setVistaActual('usuarios')} style={btnStyle(vistaActual === 'usuarios')}>
          Gestión Usuarios
        </button>
        <button onClick={cerrarSesion} style={{ marginLeft: 'auto', backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}>
          Cerrar Sesión
        </button>
      </nav>

      <main>
        {vistaActual === 'dashboard' && <Dashboard />}
        {vistaActual === 'nomina' && <ReporteNomina />}
        {vistaActual === 'usuarios' && <Usuario />}
      </main>
    </div>
  );
};

const btnStyle = (active: boolean) => ({
  background: active ? '#1e517b' : 'transparent',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  cursor: 'pointer',
  borderRadius: '4px'
});

export default App;