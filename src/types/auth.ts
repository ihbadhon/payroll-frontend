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

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string;
  address?: string;
  email?: string;
  alternatePhone?: string;
  notes?: string;
  createdAt?: string;
}

export interface EmergencyContactsResponse {
  total: number;
  contacts: EmergencyContact[];
}

export interface EmergencyContactPayload {
  name: string;
  phone: string;
  relationship: string;
  address?: string;
  email?: string;
  alternatePhone?: string;
  notes?: string;
}
