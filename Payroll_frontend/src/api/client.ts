export const fetchAutenticado = async (url: string, options: RequestInit = {}) => {
  let token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response = await fetch(url, { ...options, headers });

  // Si el token expiró (401), intentar refrescar
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    const refreshRes = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenExpirado: token, refreshToken }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Reintentar la petición original con el nuevo token
      headers['Authorization'] = `Bearer ${data.token}`;
      response = await fetch(url, { ...options, headers });
    } else {
      localStorage.clear();
      window.location.href = '/login';
    }
  }

  return response;
};