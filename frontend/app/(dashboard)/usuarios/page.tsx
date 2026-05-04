"use client";

import { useState } from "react";
import {
  useUsers,
  useCreateUser,
  useDeactivateUser,
  useActivateUser,
} from "@/hooks/useUsers";
import { useAuth } from "@/contexts/AuthContext";
import { CreateUserDTO, UserListResponse } from "@/types/User";
import { Loader2, Users as UsersIcon, Plus, AlertCircle } from "lucide-react";
import UserTable from "@/components/usuarios/UserTable";
import UserForm from "@/components/usuarios/UserForm";

export default function UsuariosPage() {
  const [showForm, setShowForm] = useState(false);
  const { user: currentUser } = useAuth();

  // Queries
  const { data: users, isLoading, error } = useUsers();

  // Mutations
  const createMutation = useCreateUser();
  const deactivateMutation = useDeactivateUser();
  const activateMutation = useActivateUser();

  // Handlers
  const handleCreate = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleSubmit = async (data: CreateUserDTO) => {
    try {
      await createMutation.mutateAsync(data);
      handleCancel();
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
    }
  };

  const handleToggleActive = async (user: UserListResponse) => {
    // Não permitir desativar o próprio usuário
    if (user.id === currentUser?.id) {
      alert("Você não pode desativar sua própria conta!");
      return;
    }

    const action = user.active ? "desativar" : "ativar";
    if (confirm(`Deseja ${action} o usuário "${user.email}"?`)) {
      try {
        if (user.active) {
          await deactivateMutation.mutateAsync(user.id);
        } else {
          await activateMutation.mutateAsync(user.id);
        }
      } catch (err) {
        console.error(`Erro ao ${action} usuário:`, err);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Usuários</h1>
          <p className="text-gray-600 mt-1">
            Gerencie funcionários e permissões
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Usuário
          </button>
        )}
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Cadastrar Novo Usuário
          </h2>
          <UserForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createMutation.isPending}
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Carregando usuários...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">
              Erro ao carregar usuários
            </h3>
            <p className="text-red-700 text-sm">
              {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
          </div>
        </div>
      )}

      {/* Tabela de Usuários */}
      {!isLoading && !error && !showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {!users || users.length === 0 ? (
            <div className="p-12 text-center">
              <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhum usuário cadastrado
              </h3>
              <p className="text-gray-500 mb-4">
                Comece adicionando funcionários ao sistema
              </p>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Adicionar Usuário
              </button>
            </div>
          ) : (
            <>
              <UserTable
                users={users}
                onToggleActive={handleToggleActive}
                currentUserId={currentUser?.id}
                isLoading={
                  deactivateMutation.isPending || activateMutation.isPending
                }
              />
              {/* Contador */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Total de {users.length} usuário(s) cadastrado(s)
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
