import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/lib/features/cartSlice";
import { useTranslation } from "@/lib/translations";
import { formatPrice, getImageUrl } from "@/lib/utils";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-soft p-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {t("cartEmpty")}
              </h1>
              <p className="text-gray-600 mb-8">
                {language === "en"
                  ? "Your cart is empty. Add some products to get started!"
                  : "Jūsų krepšelis tuščias. Pridėkite produktų, kad pradėtumėte!"}
              </p>
              <Link to="/shop" className="btn-primary">
                {language === "en" ? "Continue Shopping" : "Tęsti pirkinius"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("cart")}
            </h1>
            <p className="text-gray-600">
              {language === "en"
                ? "Review your items and proceed to checkout"
                : "Peržiūrėkite savo prekes ir pereikite prie atsiskaitymo"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {language === "en" ? "Cart Items" : "Krepšelio prekės"} (
                    {items.length})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    {language === "en" ? "Clear Cart" : "Išvalyti krepšelį"}
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item) => {
                    const product = item.product!;
                    const title =
                      language === "en" ? product.title_en : product.title_lt;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={getImageUrl(product.image_url, 80, 80)}
                            alt={title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatPrice(product.price)}
                          </p>
                          {item.size && (
                            <p className="text-xs text-gray-500">
                              {t("size")}: {item.size}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(product.price * item.quantity)}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 text-sm transition-colors mt-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-soft p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {language === "en" ? "Order Summary" : "Užsakymo santrauka"}
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>
                      {language === "en" ? "Subtotal" : "Tarpinė suma"}
                    </span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>
                      {language === "en" ? "Shipping" : "Pristatymas"}
                    </span>
                    <span className="text-green-600">
                      {language === "en" ? "Free" : "Nemokamas"}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>{t("cartTotal")}</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    className="btn-primary w-full text-center"
                  >
                    {t("proceedToCheckout")}
                  </Link>
                  <Link
                    to="/shop"
                    className="btn-secondary w-full text-center"
                  >
                    {language === "en" ? "Continue Shopping" : "Tęsti pirkinius"}
                  </Link>
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    {language === "en"
                      ? "🔒 Secure checkout with SSL encryption"
                      : "🔒 Saugus atsiskaitymas su SSL šifravimu"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}