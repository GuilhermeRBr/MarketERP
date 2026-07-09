"use client";

import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user } = useAuth();

  const getRoleLabel = (role: string) => {
    return role === "owner" ? "Dono" : "Funcionário";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Right side */}
        <div className="flex items-center gap-4 ml-auto">
          {/* User */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">
                {user?.email ?? "—"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role ? getRoleLabel(user.role) : "—"}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
