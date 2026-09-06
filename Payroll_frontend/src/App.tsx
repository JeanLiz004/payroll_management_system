import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ReporteNomina } from './components/ReporteNomina';
import Usuario from './components/Usuario';

const App: React.FC = () => {
  const [vistaActual, setVistaActual] = useState<'dashboard' | 'nomina' | 'usuarios'>('dashboard');

  return (
    <div className="app-container">
      {/* Navegación simple para alternar vistas */}
      <nav style={{ padding: '10px 20px', backgroundColor: '#0d3048', color: '#fff', display: 'flex', gap: '15px' }}>
        <button 
          onClick={() => setVistaActual('dashboard')}
          style={{ background: vistaActual === 'dashboard' ? '#1e517b' : 'transparent', color: '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setVistaActual('nomina')}
          style={{ background: vistaActual === 'nomina' ? '#1e517b' : 'transparent', color: '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}
        >
          Reporte de Nómina
        </button>
        <button 
          onClick={() => setVistaActual('usuarios')}
          style={{ background: vistaActual === 'usuarios' ? '#1e517b' : 'transparent', color: '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}
        >
          Gestión Usuarios
        </button>
      </nav>

      {/* Renderizado Condicional */}
      <main>
        {vistaActual === 'dashboard' && <Dashboard />}
        {vistaActual === 'nomina' && <ReporteNomina />}
        {vistaActual === 'usuarios' && <Usuario />}
      </main>
    </div>
  );
};

export default App;