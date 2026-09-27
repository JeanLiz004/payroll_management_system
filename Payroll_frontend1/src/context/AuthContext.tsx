import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthContextType, UserClaims } from '../features/auth/types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función auxiliar para decodificar la carga útil (payload) del JWT
const parseJwt = (token: string): UserClaims | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);

    return {
      nameIdentifier: parsed['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || parsed.sub,
      name: parsed['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || parsed.unique_name,
      role: parsed['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || parsed.role,
      exp: parsed.exp,
    };
  } catch (error) {
    console.error('Error al decodificar JWT:', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('jwt_token'));
  const [user, setUser] = useState<UserClaims | null>(() => (token ? parseJwt(token) : null));

  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);
      // Validar expiración del token
      if (decoded && decoded.exp * 1000 < Date.now()) {
        logout();
      } else {
        setUser(decoded);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('jwt_token', newToken);
    setToken(newToken);
    setUser(parseJwt(newToken));
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};