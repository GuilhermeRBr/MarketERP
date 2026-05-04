export interface User {
  id: number;
  email: string;
  role: "owner" | "operator";
  active: boolean;
}

export interface UserListResponse {
  id: number;
  email: string;
  role: string;
  active: boolean;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  confirm_password?: string;
  role: "OWNER" | "OPERATOR";
  active?: boolean;
}

export interface UpdateUserDTO {
  active: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
