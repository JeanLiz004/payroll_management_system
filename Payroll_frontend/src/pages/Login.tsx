import React, { useState } from 'react';
import { themeColors } from '../theme';

interface LoginProps {
  onLoginSuccess: (token: string, rol: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password }),
      });

      if (!res.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('rol', data.rol);
      
      onLoginSuccess(data.token, data.rol);
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    }
  };

  return (
    <div style={{ backgroundColor: themeColors.gray, height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '320px' }}>
        <h2 style={{ color: themeColors.blue, marginTop: 0 }}>Iniciar Sesión</h2>
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Usuario</label>
          <input 
            type="text" 
            value={usuario} 
            onChange={(e) => setUsuario(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button type="submit" style={{ backgroundColor: themeColors.blue, color: '#fff', border: 'none', width: '100%', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}>
          Ingresar
        </button>
      </form>
    </div>
  );
};