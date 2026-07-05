import { CheckCircle2 } from "lucide-react";

interface SaleSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

export function SaleSuccessModal({ isOpen, onClose, totalAmount }: SaleSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Ícone de sucesso */}
        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-5">
          <CheckCircle2 className="h-16 w-16 text-green-500 dark:text-green-400" />
        </div>

        {/* Texto */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Venda Finalizada!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-1">
          Venda realizada com sucesso.
        </p>
        <p className="text-3xl font-black text-green-600 dark:text-green-400 my-4">
          R$ {totalAmount.toFixed(2)}
        </p>

        {/* Botão */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 mt-2"
        >
          Nova Venda
        </button>
      </div>
    </div>
  );
}
