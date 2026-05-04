import { useState, useEffect } from "react";
import { X, Plus, Trash2, CreditCard, Banknote, QrCode } from "lucide-react";

export type PaymentType = "pix" | "credit" | "debit" | "cash" | "other";

export interface PaymentLine {
  type: PaymentType;
  amount: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onConfirm: (payments: PaymentLine[]) => void;
  isLoading?: boolean;
}

const paymentTypes = [
  { value: "cash", label: "Dinheiro", icon: Banknote },
  { value: "pix", label: "Pix", icon: QrCode },
  { value: "credit", label: "Cartão de Crédito", icon: CreditCard },
  { value: "debit", label: "Cartão de Débito", icon: CreditCard },
  { value: "other", label: "Outros", icon: Banknote },
];

export function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  onConfirm,
  isLoading,
}: PaymentModalProps) {
  const [payments, setPayments] = useState<PaymentLine[]>([]);
  const [selectedType, setSelectedType] = useState<PaymentType>("cash");
  const [currentAmount, setCurrentAmount] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setPayments([]);
      setSelectedType("cash");
      setCurrentAmount(totalAmount.toString());
    }
  }, [isOpen, totalAmount]);

  if (!isOpen) return null;

  const totalPaid = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = Math.max(0, totalAmount - totalPaid);
  
  // Update the currentAmount to the remaining amount automatically
  useEffect(() => {
    if (remaining > 0 && payments.length > 0) {
      setCurrentAmount(remaining.toFixed(2));
    }
  }, [payments, remaining]);

  const handleAddPayment = () => {
    const amountVal = parseFloat(currentAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    setPayments([...payments, { type: selectedType, amount: amountVal }]);
    setCurrentAmount("");
  };

  const handleRemovePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (totalPaid >= totalAmount) {
      onConfirm(payments);
    }
  };

  const getPaymentLabel = (type: string) => {
    return paymentTypes.find((pt) => pt.value === type)?.label || type;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pagamento</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total da Venda</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ {totalAmount.toFixed(2)}</p>
            </div>
            <div className={`p-4 rounded-xl border ${remaining === 0 ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50'}`}>
              <p className={`text-sm font-medium ${remaining === 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {remaining === 0 ? 'Troco / Restante' : 'Falta Pagar'}
              </p>
              <p className={`text-2xl font-bold ${remaining === 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                R$ {remaining === 0 ? (totalPaid - totalAmount).toFixed(2) : remaining.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Add Payment Form */}
          {remaining > 0 && (
            <div className="flex gap-3 items-end mb-6 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Método
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as PaymentType)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                >
                  {paymentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="0.00"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPayment();
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleAddPayment}
                disabled={!currentAmount || parseFloat(currentAmount) <= 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center h-[46px] w-[46px]"
              >
                <Plus size={20} />
              </button>
            </div>
          )}

          {/* Payments List */}
          {payments.length > 0 && (
            <div className="space-y-3 mt-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Pagamentos Adicionados</h3>
              <ul className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {payments.map((payment, index) => {
                  const typeInfo = paymentTypes.find(t => t.value === payment.type);
                  const Icon = typeInfo?.icon || Banknote;
                  return (
                    <li key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg group hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm text-gray-500 dark:text-gray-400">
                          <Icon size={18} />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {typeInfo?.label || payment.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900 dark:text-white">
                          R$ {payment.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleRemovePayment(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Remover"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
          <button
            onClick={handleConfirm}
            disabled={totalPaid < totalAmount || isLoading}
            className={`w-full py-3.5 rounded-xl text-white font-bold text-lg transition-all shadow-md ${
              totalPaid >= totalAmount
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-500/20 hover:shadow-green-500/40"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Processando..." : totalPaid >= totalAmount ? "Finalizar Venda" : "Aguardando Pagamento Total"}
          </button>
        </div>

      </div>
    </div>
  );
}
