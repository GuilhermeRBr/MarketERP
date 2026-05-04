"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCreateSale } from "@/hooks/useSales";
import { useCreatePayment } from "@/hooks/usePayments";
import { useRouter } from "next/navigation";
import { CartItem } from "@/types/Sale";
import { Product } from "@/types/Product";
import { PaymentType } from "@/types/Payment";
import { formatCurrency } from "@/utils/formatters";
import PaymentMethodSelector from "@/components/pagamentos/PaymentMethodSelector";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Check,
  Search,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function CaixaPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentType | null>(null);

  const { data: products, isLoading } = useProducts();
  const createSaleMutation = useCreateSale();
  const createPaymentMutation = useCreatePayment();

  // Filtrar produtos ativos e por busca
  const filteredProducts = products?.filter(
    (p) =>
      p.active &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.barcode?.includes(searchQuery))
  );

  // Adicionar produto ao carrinho
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product_id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert("Estoque insuficiente!");
        return;
      }
      setCart(
        cart.map((item) =>
          item.product_id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.unit_price,
              }
            : item
        )
      );
    } else {
      if (product.stock === 0) {
        alert("Produto sem estoque!");
        return;
      }
      setCart([
        ...cart,
        {
          product_id: product.id,
          product_name: product.name,
          unit_price: product.price,
          quantity: 1,
          subtotal: product.price,
        },
      ]);
    }
  };

  const incrementQuantity = (productId: number) => {
    const product = products?.find((p) => p.id === productId);
    const cartItem = cart.find((item) => item.product_id === productId);

    if (product && cartItem && cartItem.quantity >= product.stock) {
      alert("Estoque insuficiente!");
      return;
    }

    setCart(
      cart.map((item) =>
        item.product_id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * item.unit_price,
            }
          : item
      )
    );
  };

  const decrementQuantity = (productId: number) => {
    setCart(
      cart.map((item) =>
        item.product_id === productId && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
              subtotal: (item.quantity - 1) * item.unit_price,
            }
          : item
      )
    );
  };

  const removeItem = (productId: number) => {
    setCart(cart.filter((item) => item.product_id !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleContinueToPayment = () => {
    if (cart.length === 0) {
      alert("Adicione produtos ao carrinho!");
      return;
    }
    setShowPayment(true);
  };

  const handleBackToCart = () => {
    setShowPayment(false);
    setSelectedPaymentMethod(null);
  };

  const handleFinalizeSale = async () => {
    if (!selectedPaymentMethod) {
      alert("Selecione uma forma de pagamento!");
      return;
    }

    try {
      // 1. Criar venda
      const sale = await createSaleMutation.mutateAsync({
        items: cart.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      });

      // 2. Registrar pagamento
      await createPaymentMutation.mutateAsync({
        sale_id: sale.id,
        type: selectedPaymentMethod,
        amount: total,
      });

      alert("Venda realizada com sucesso!");
      setCart([]);
      setShowPayment(false);
      setSelectedPaymentMethod(null);
      router.push("/vendas");
    } catch (err) {
      console.error("Erro ao finalizar venda:", err);
      alert("Erro ao finalizar venda. Tente novamente.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Produtos */}
      {!showPayment && (
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Produtos
            </h2>

            <div className="mb-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar produto..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                {filteredProducts?.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {formatCurrency(product.price)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Estoque: {product.stock}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagamento */}
      {showPayment && (
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleBackToCart}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                Forma de Pagamento
              </h2>
            </div>

            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onSelect={setSelectedPaymentMethod}
            />
          </div>
        </div>
      )}

      {/* Carrinho */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart size={24} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Carrinho</h2>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Carrinho vazio</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.product_id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">
                          {item.product_name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {formatCurrency(item.unit_price)} x {item.quantity}
                        </div>
                      </div>
                      {!showPayment && (
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {!showPayment && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decrementQuantity(item.product_id)}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => incrementQuantity(item.product_id)}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(item.subtotal)}
                        </div>
                      </div>
                    )}

                    {showPayment && (
                      <div className="text-right font-semibold text-gray-900">
                        {formatCurrency(item.subtotal)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {!showPayment ? (
                <button
                  onClick={handleContinueToPayment}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  Continuar para Pagamento
                </button>
              ) : (
                <button
                  onClick={handleFinalizeSale}
                  disabled={
                    createSaleMutation.isPending ||
                    createPaymentMutation.isPending ||
                    !selectedPaymentMethod
                  }
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                >
                  {createSaleMutation.isPending ||
                  createPaymentMutation.isPending ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Finalizando...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Finalizar Venda
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
