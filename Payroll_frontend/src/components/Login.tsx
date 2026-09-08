import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  // ⚠️ Asegúrate de usar las mismas claves de la solicitud en Swagger
  const payload = {
    usuario: correo, // Si tu backend espera "usuario" o "correo"
    clave: clave      // O "password" / "clave" según Swagger
  };

  try {
    const response = await fetch('/api/autenticacion/validar', { // Confirma la ruta exacta de Swagger
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('jwt_token', data.token);
      onLoginSuccess(data.token);
    } else {
      setError('Credenciales incorrectas');
    }
  } catch (err) {
    setError('Error de conexión con la API');
  }
};

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '300px' }}>
        <h2>Iniciar Sesión</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: '15px' }}>
          <label>Correo:</label>
         <input type="text" name="usuario" placeholder="Usuario o Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}/>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Contraseña:</label>
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0d3048', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;