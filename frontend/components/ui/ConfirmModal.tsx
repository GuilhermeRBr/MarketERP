"use client";

import { useEffect } from "react";
import { AlertTriangle, CheckCircle2, Info, Loader2, X } from "lucide-react";

export type ConfirmVariant = "danger" | "warning" | "info" | "success";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const variantStyles: Record<
  ConfirmVariant,
  {
    icon: typeof AlertTriangle;
    iconWrapper: string;
    confirmButton: string;
  }
> = {
  danger: {
    icon: AlertTriangle,
    iconWrapper: "bg-red-100 text-red-600",
    confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  },
  warning: {
    icon: AlertTriangle,
    iconWrapper: "bg-amber-100 text-amber-600",
    confirmButton: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-400",
  },
  info: {
    icon: Info,
    iconWrapper: "bg-blue-100 text-blue-600",
    confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  },
  success: {
    icon: CheckCircle2,
    iconWrapper: "bg-green-100 text-green-600",
    confirmButton: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
  },
};

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "warning",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  // Fecha com a tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4"
      onClick={() => !isLoading && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-6">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${styles.iconWrapper}`}
          >
            <Icon size={24} />
          </div>
          <div className="flex-1 pt-1">
            <h2
              id="confirm-modal-title"
              className="text-lg font-bold text-gray-900 dark:text-white"
            >
              {title}
            </h2>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {message}
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2.5 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 min-w-[110px] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 ${styles.confirmButton}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Aguarde...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
