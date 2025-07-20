import { Fragment } from "react";
import { Link } from "react-router-dom";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  closeCart,
  removeFromCart,
  updateQuantity,
} from "@/app/lib/features/cartSlice";
import { useTranslation } from "@/app/lib/translations";
import { formatPrice, getImageUrl } from "@/app/lib/utils";

export default function CartSidebar() {
  const dispatch = useAppDispatch();
  const { items, isOpen, total } = useAppSelector((state) => state.cart);
  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => dispatch(closeCart())}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">{t("cart")}</h2>
          <button
            onClick={() => dispatch(closeCart())}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t("cartEmpty")}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === "en"
                  ? "Add some products to get started!"
                  : "Pridėkite produktų, kad pradėtumėte!"}
              </p>
              <Link
                href="/shop"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                onClick={() => dispatch(closeCart())}
              >
                {t("shop")}
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => {
                const product = item.product!;
                const title =
                  language === "en" ? product.title_en : product.title_lt;

                return (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3"
                  >
                    <div className="relative w-16 h-16 bg-white rounded-md overflow-hidden">
                      <Image
                        src={getImageUrl(product.image_url, 100, 100)}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formatPrice(product.price)}
                      </p>
                      {item.size && (
                        <p className="text-xs text-gray-500">
                          {t("size")}: {item.size}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-white rounded transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-white rounded transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>{t("cartTotal")}:</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              onClick={() => dispatch(closeCart())}
            >
              {t("proceedToCheckout")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
