import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCart } from "@/lib/features/cartSlice";
import { useTranslation } from "@/lib/translations";
import { formatPrice, getImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);

  const title = language === "en" ? product.title_en : product.title_lt;
  const description =
    language === "en" ? product.description_en : product.description_lt;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) {
      toast.error(t("outOfStock"));
      return;
    }

    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(t("itemAddedToCart"));
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={getImageUrl(product.image_url, 400, 400)}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {t("outOfStock")}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.stock > 0 && product.stock <= 10 && (
              <span className="text-xs text-orange-600">
                {language === "en"
                  ? `Only ${product.stock} left`
                  : `Liko tik ${product.stock}`}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            title={t("addToCart")}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {product.category && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {language === "en"
                ? product.category.name_en
                : product.category.name_lt}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
