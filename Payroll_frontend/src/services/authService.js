import api from '../api/axios';

export const login = async (nombreUsuario, password) => {
  const response = await api.post('/Auth/login', {
    nombreUsuario,
    password,
  });

  if (response.data.token) {
    // Guarda el token en el almacenamiento local del navegador
    localStorage.setItem('jwtToken', response.data.token);
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
  }

  return response.data;
};

export const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('refreshToken');
};

export const getToken = () => {
  return localStorage.getItem('jwtToken');
};