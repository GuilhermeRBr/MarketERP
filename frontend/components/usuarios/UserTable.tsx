"use client";

import { UserListResponse } from "@/types/User";
import { Power, PowerOff, Shield, User } from "lucide-react";

interface UserTableProps {
  users: UserListResponse[];
  onToggleActive: (user: UserListResponse) => void;
  currentUserId?: number;
  isLoading?: boolean;
}

export default function UserTable({
  users,
  onToggleActive,
  currentUserId,
  isLoading = false,
}: UserTableProps) {
  const getRoleLabel = (role: string) => {
    return role.toUpperCase() === "OWNER" ? "Dono" : "Funcionário";
  };

  const getRoleIcon = (role: string) => {
    return role.toUpperCase() === "OWNER" ? (
      <Shield size={16} className="text-purple-600" />
    ) : (
      <User size={16} className="text-blue-600" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuário
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Função
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => {
            const isCurrentUser = user.id === currentUserId;

            return (
              <tr
                key={user.id}
                className={`hover:bg-gray-50 transition-colors ${
                  !user.active ? "opacity-60" : ""
                } ${isCurrentUser ? "bg-blue-50" : ""}`}
              >
                {/* Email */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-900">
                      {user.email}
                    </div>
                    {isCurrentUser && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        Você
                      </span>
                    )}
                  </div>
                </td>

                {/* Função */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <span className="text-sm text-gray-900">
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.active ? "Ativo" : "Inativo"}
                  </span>
                </td>

                {/* Ações */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {/* Ativar/Desativar */}
                    <button
                      onClick={() => onToggleActive(user)}
                      disabled={isLoading || isCurrentUser}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        user.active
                          ? "text-red-600 hover:bg-red-50"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                      title={
                        isCurrentUser
                          ? "Você não pode desativar sua própria conta"
                          : user.active
                          ? "Desativar"
                          : "Ativar"
                      }
                    >
                      {user.active ? (
                        <PowerOff size={18} />
                      ) : (
                        <Power size={18} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum usuário encontrado</p>
        </div>
      )}
    </div>
  );
}
