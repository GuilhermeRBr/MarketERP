import api from "./api";
import {
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  User,
} from "@/types/User";
import { STORAGE_KEYS } from "@/utils/constants";

class AuthService {
  private readonly basePath = "/auth";

  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      `${this.basePath}/login`,
      credentials
    );
    return response.data;
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>(
      `${this.basePath}/refresh-token`,
      { refresh_token: refreshToken }
    );
    return response.data;
  }

  // Logout
  async logout(refreshToken: string): Promise<void> {
    await api.post(`${this.basePath}/logout`, { refresh_token: refreshToken });
  }

  // Salvar tokens no localStorage
  saveTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  }

  // Salvar usuário no localStorage
  saveUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  }

  // Obter tokens do localStorage
  getTokens(): { accessToken: string | null; refreshToken: string | null } {
    if (typeof window !== "undefined") {
      return {
        accessToken: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
      };
    }
    return { accessToken: null, refreshToken: null };
  }

  // Obter usuário do localStorage
  getUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  // Limpar dados de autenticação
  clearAuth(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    const { accessToken } = this.getTokens();
    return !!accessToken;
  }

  // Decodificar JWT para obter dados do usuário
  decodeToken(token: string): User | null {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        active: true,
      };
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
