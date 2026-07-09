"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { MonitorPlay } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useSidebar } from "@/contexts/SidebarContext";

const menuItems = [
  {
    name: "Caixa (PDV)",
    href: "/caixa",
    icon: MonitorPlay,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Produtos",
    href: "/produtos",
    icon: Package,
  },
  {
    name: "Vendas",
    href: "/vendas",
    icon: ShoppingCart,
  },
  {
    name: "Usuários",
    href: "/usuarios",
    icon: Users,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { collapsed, toggleCollapsed } = useSidebar();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-gray-900 text-white h-screen sticky top-0 flex flex-col transition-all duration-300`}
    >
      {/* Logo */}
      <div
        className={`flex items-center justify-center border-b border-gray-800 h-[73px] ${
          collapsed ? "px-2" : "px-6"
        }`}
      >
        {!collapsed && (
          <div className="flex justify-center">
            <Logo width={160} marketColor="#ffffff" />
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
            M
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    collapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon size={20} className="shrink-0" />
                  {!collapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-800">
        <button
          onClick={handleLogout}
          title={collapsed ? "Sair" : undefined}
          className={`flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span className="font-medium">Sair</span>}
        </button>
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleCollapsed}
        title={collapsed ? "Expandir menu" : "Recolher menu"}
        className="absolute -right-3 top-[52px] w-6 h-6 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Sair da aplicação"
        message="Deseja realmente sair?"
        confirmLabel="Sair"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </aside>
  );
}
