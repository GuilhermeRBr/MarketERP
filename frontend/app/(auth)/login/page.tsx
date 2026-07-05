"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Loader2, AlertCircle } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      // Erro já tratado no contexto
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d5dce5]">
      <div className="w-full max-w-md px-4">
        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-10">
          {/* Logo e Título */}
          <div className="flex flex-col items-center mb-8">
            <Logo width={220} className="mb-3" />
            <p className="text-gray-500 text-base">Faça login para continuar</p>
          </div>

          {/* Erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-medium">
                  Erro ao fazer login
                </p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-[#e8edf3] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-500"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={16}
                className="w-full px-4 py-3.5 bg-[#e8edf3] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-500"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2563eb] text-white py-3.5 rounded-lg font-medium hover:bg-[#1d4ed8] transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Entrar
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Sistema de Gerenciamento v1.0.0
        </p>
      </div>
    </div>
  );
}
