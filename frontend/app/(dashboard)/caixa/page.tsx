"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCreateSale } from "@/hooks/useSales";
import { useCreatePayment } from "@/hooks/usePayments";
import { Product } from "@/types/Product";
import { PaymentModal, PaymentLine } from "@/components/caixa/PaymentModal";
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Tag } from "lucide-react";
import toast from "react-hot-toast";

interface CartItem extends Product {
  cartId: string;
  quantity: number;
}

export default function CaixaPage() {
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const createSaleMutation = useCreateSale();
  const createPaymentMutation = useCreatePayment();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessingSale, setIsProcessingSale] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input on load
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const activeProducts = useMemo(() => products.filter((p) => p.active), [products]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return activeProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.barcode && p.barcode.includes(term))
    ).slice(0, 5); // Limit results for fast UI
  }, [activeProducts, searchTerm]);

  const handleAddToCart = (product: Product) => {
    // Check if enough stock
    const existingInCart = cart.find(item => item.id === product.id);
    const currentQty = existingInCart ? existingInCart.quantity : 0;
    
    if (currentQty >= product.stock) {
      toast.error(`Estoque insuficiente. Apenas ${product.stock} disponíveis.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, cartId: Math.random().toString(36).substring(7), quantity: 1 }];
    });
    setSearchTerm("");
    searchInputRef.current?.focus();
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchResults.length === 1) {
      handleAddToCart(searchResults[0]);
    } else if (e.key === "Enter" && searchResults.length === 0) {
      // Try to find exact match by barcode first
      const exactMatch = activeProducts.find(p => p.barcode === searchTerm.trim());
      if (exactMatch) {
        handleAddToCart(exactMatch);
      } else {
        toast.error("Produto não encontrado");
      }
    }
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          if (newQuantity > item.stock) {
            toast.error(`Estoque insuficiente. Apenas ${item.stock} disponíveis.`);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
    setSearchTerm("");
    searchInputRef.current?.focus();
  };

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleFinalizeSale = async (payments: PaymentLine[]) => {
    if (cart.length === 0) return;

    setIsProcessingSale(true);
    try {
      // 1. Create Sale
      const saleData = {
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const sale = await createSaleMutation.mutateAsync(saleData);

      // 2. Create Payments
      const paymentPromises = payments.map((payment) =>
        createPaymentMutation.mutateAsync({
          sale_id: sale.id,
          type: payment.type,
          amount: payment.amount,
        })
      );

      await Promise.all(paymentPromises);

      toast.success("Venda finalizada com sucesso!");
      setIsPaymentModalOpen(false);
      clearCart();
    } catch (error) {
      console.error("Error finalizing sale:", error);
      toast.error("Erro ao finalizar a venda. Tente novamente.");
    } finally {
      setIsProcessingSale(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-6 p-4">
      {/* Left Area: Product Search & Cart List */}
      <div className="flex-1 flex flex-col gap-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Search Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="block w-full pl-11 pr-4 py-3.5 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm text-lg"
              placeholder="Buscar por nome ou código de barras (Enter para adicionar)"
            />
            {/* Search Results Dropdown */}
            {searchTerm && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <ul className="max-h-60 overflow-auto">
                  {searchResults.map((product) => (
                    <li
                      key={product.id}
                      onClick={() => handleAddToCart(product)}
                      className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                        {product.barcode && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {product.barcode}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        R$ {product.price.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-4">
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-full">
                <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-lg font-medium">O carrinho está vazio</p>
              <p className="text-sm">Busque produtos acima para adicionar à venda.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold">
                <tr>
                  <th className="pb-3 px-2">Produto</th>
                  <th className="pb-3 px-2 text-center">Qtd</th>
                  <th className="pb-3 px-2 text-right">Preço Unit.</th>
                  <th className="pb-3 px-2 text-right">Subtotal</th>
                  <th className="pb-3 px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {cart.map((item, index) => (
                  <tr key={item.cartId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center font-bold text-xs border border-blue-100 dark:border-blue-800/30">
                          {index + 1}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 dark:text-white text-base">{item.name}</span>
                          {item.barcode && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono flex items-center gap-1">
                              <Tag size={10} /> {item.barcode}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.cartId, -1)}
                          className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartId, 1)}
                          className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right font-medium text-gray-600 dark:text-gray-300">
                      R$ {item.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-2 text-right font-bold text-gray-900 dark:text-white text-lg">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remover Item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Right Area: Checkout Summary */}
      <div className="w-[380px] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6 opacity-90">
            <ShoppingCart size={24} />
            Resumo do Pedido
          </h2>
          <div className="space-y-1">
            <p className="text-blue-200 text-sm font-medium uppercase tracking-wider">Total a Pagar</p>
            <p className="text-5xl font-black tracking-tight">
              R$ {totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between text-gray-600 dark:text-gray-400 font-medium">
              <span>Itens no Carrinho</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {cart.reduce((acc, item) => acc + item.quantity, 0)} un.
              </span>
            </div>
            {/* Adicionar mais resumos se necessário (ex: descontos) */}
          </div>

          <div className="space-y-3 mt-6">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={cart.length === 0}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all shadow-lg ${
                cart.length > 0
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none"
              }`}
            >
              <CreditCard size={24} />
              Finalizar Venda
            </button>
            <button
              onClick={clearCart}
              disabled={cart.length === 0}
              className="w-full py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Cancelar Pedido
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={totalAmount}
        onConfirm={handleFinalizeSale}
        isLoading={isProcessingSale}
      />
    </div>
  );
}
