"use client";

import { useState } from "react";
import { CreateUserDTO } from "@/types/User";
import { Loader2, Save, X, Eye, EyeOff } from "lucide-react";

interface UserFormProps {
  onSubmit: (data: CreateUserDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function UserForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: UserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "OPERATOR" as "OWNER" | "OPERATOR",
    active: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Nome
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (formData.name.length < 3) {
      newErrors.name = "Nome deve ter no mínimo 3 caracteres";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Senha
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 8) {
      newErrors.password = "Senha deve ter no mínimo 8 caracteres";
    } else if (formData.password.length > 16) {
      newErrors.password = "Senha deve ter no máximo 16 caracteres";
    }

    // Confirmar senha
    if (!formData.confirm_password) {
      newErrors.confirm_password = "Confirmação de senha é obrigatória";
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao editar
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Nome Completo *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Nome do funcionário"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email *
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="funcionario@email.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Senha e Confirmar Senha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Senha */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Senha *
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
              minLength={8}
              maxLength={16}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">8 a 16 caracteres</p>
        </div>

        {/* Confirmar Senha */}
        <div>
          <label
            htmlFor="confirm_password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirmar Senha *
          </label>
          <div className="relative">
            <input
              id="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirm_password}
              onChange={(e) => handleChange("confirm_password", e.target.value)}
              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirm_password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
              minLength={8}
              maxLength={16}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.confirm_password}
            </p>
          )}
        </div>
      </div>

      {/* Role */}
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Função *
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) =>
            handleChange("role", e.target.value as "OWNER" | "OPERATOR")
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          disabled={isLoading}
        >
          <option value="OPERATOR">Funcionário</option>
          <option value="OWNER">Dono</option>
        </select>
        <p className="text-gray-500 text-xs mt-1">
          Funcionários têm acesso limitado
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <input
          id="active"
          type="checkbox"
          checked={formData.active}
          onChange={(e) => handleChange("active", e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          disabled={isLoading}
        />
        <label htmlFor="active" className="text-sm font-medium text-gray-700">
          Usuário ativo
        </label>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <X size={20} />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Cadastrando...
            </>
          ) : (
            <>
              <Save size={20} />
              Cadastrar Usuário
            </>
          )}
        </button>
      </div>
    </form>
  );
}
