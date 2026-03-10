export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  role: {
    id?: string;
    name: string;
    description?: string;
    permissions?: string[] | null;
  };
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface SetPasswordPayload {
  token: string;
  password: string;
}
