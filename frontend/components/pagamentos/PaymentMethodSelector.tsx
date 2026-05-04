"use client";

import { PaymentType, PaymentMethod } from "@/types/Payment";
import {
  Smartphone,
  CreditCard,
  Banknote,
  Wallet,
  MoreHorizontal,
} from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentType | null;
  onSelect: (method: PaymentType) => void;
}

const paymentMethods: PaymentMethod[] = [
  {
    type: "pix",
    label: "PIX",
    icon: "smartphone",
    color: "bg-teal-500",
  },
  {
    type: "credit",
    label: "Cartão de Crédito",
    icon: "credit-card",
    color: "bg-blue-500",
  },
  {
    type: "debit",
    label: "Cartão de Débito",
    icon: "credit-card",
    color: "bg-purple-500",
  },
  {
    type: "cash",
    label: "Dinheiro",
    icon: "banknote",
    color: "bg-green-500",
  },
  {
    type: "other",
    label: "Outro",
    icon: "more",
    color: "bg-gray-500",
  },
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "smartphone":
      return Smartphone;
    case "credit-card":
      return CreditCard;
    case "banknote":
      return Banknote;
    case "wallet":
      return Wallet;
    case "more":
      return MoreHorizontal;
    default:
      return Wallet;
  }
};

export default function PaymentMethodSelector({
  selectedMethod,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {paymentMethods.map((method) => {
        const Icon = getIcon(method.icon);
        const isSelected = selectedMethod === method.type;

        return (
          <button
            key={method.type}
            onClick={() => onSelect(method.type)}
            className={`p-6 rounded-lg border-2 transition-all ${
              isSelected
                ? "border-blue-600 bg-blue-50 shadow-lg scale-105"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
          >
            <div
              className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center mx-auto mb-3`}
            >
              <Icon size={24} className="text-white" />
            </div>
            <div className="text-sm font-medium text-gray-900 text-center">
              {method.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
