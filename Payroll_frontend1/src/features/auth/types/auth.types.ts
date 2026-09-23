export interface UserClaims {
  nameIdentifier: string;
  name: string;
  role: string;
  exp: number;
}

export interface LoginResponse {
  token: string;
}

export interface AuthContextType {
  token: string | null;
  user: UserClaims | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}