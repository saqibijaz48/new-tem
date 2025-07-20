"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/app/lib/features/cartSlice";
import { useTranslation } from "@/app/lib/translations";
import { formatPrice, getImageUrl } from "@/app/lib/utils";
import toast from "react-hot-toast";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
    toast.success(t("itemRemovedFromCart"));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success(language === "en" ? "Cart cleared" : "Krepšelis išvalytas");
  };

  const shipping = total > 50 ? 0 : 5.99;
  const finalTotal = total + shipping;

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
                  ? "Add some amazing products to get started!"
                  : "Pridėkite nuostabių produktų, kad pradėtumėte!"}
              </p>
              <Link
                href="/shop"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>
                  {language === "en" ? "Start Shopping" : "Pradėti pirkti"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "en" ? "Continue Shopping" : "Tęsti pirkinius"}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("cart")} ({items.length} {language === "en" ? "items" : "prekės"}
            )
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-soft">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {language === "en" ? "Shopping Cart" : "Prekių krepšelis"}
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-600 transition-colors text-sm font-medium"
                  >
                    {language === "en" ? "Clear All" : "Išvalyti viską"}
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {items.map((item) => {
                  const product = item.product!;
                  const title =
                    language === "en" ? product.title_en : product.title_lt;
                  const itemTotal = product.price * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden">
                        <Image
                          src={getImageUrl(product.image_url, 100, 100)}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${product.id}`}
                          className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors"
                        >
                          {title}
                        </Link>
                        <p className="text-primary-600 font-semibold">
                          {formatPrice(product.price)}
                        </p>
                        {item.size && (
                          <p className="text-sm text-gray-500">
                            {t("size")}: {item.size}
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-medium w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= product.stock}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(itemTotal)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {language === "en" ? "Order Summary" : "Užsakymo santrauka"}
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === "en" ? "Subtotal" : "Tarpinė suma"}
                    </span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === "en" ? "Shipping" : "Pristatymas"}
                    </span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">
                          {language === "en" ? "Free" : "Nemokamas"}
                        </span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <p className="text-sm text-gray-500">
                      {language === "en"
                        ? `Add ${formatPrice(50 - total)} more for free shipping`
                        : `Pridėkite dar ${formatPrice(50 - total)} nemokamam pristatymui`}
                    </p>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        {language === "en" ? "Total" : "Iš viso"}
                      </span>
                      <span className="text-xl font-bold text-primary-600">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn-primary w-full mt-6 text-center block"
                >
                  {t("proceedToCheckout")}
                </Link>

                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      {language === "en"
                        ? "Secure checkout"
                        : "Saugus apmokėjimas"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
