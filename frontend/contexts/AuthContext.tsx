"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { User, LoginCredentials } from "@/types/User";
import { getErrorMessage } from "@/utils/errorHandler";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Verificar autenticação ao carregar
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = authService.getUser();
      const { accessToken } = authService.getTokens();

      if (savedUser && accessToken) {
        setUser(savedUser);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login
  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.login(credentials);
      
      // Salvar tokens
      authService.saveTokens(response.access_token, response.refresh_token);

      // Decodificar token para obter dados do usuário
      const userData = authService.decodeToken(response.access_token);
      
      if (userData) {
        authService.saveUser(userData);
        setUser(userData);
        router.push("/dashboard");
      } else {
        throw new Error("Erro ao decodificar token");
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      const { refreshToken } = authService.getTokens();
      
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    } finally {
      authService.clearAuth();
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
