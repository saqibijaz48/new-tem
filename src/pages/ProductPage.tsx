import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import { Product } from "../types";
import { getProduct } from "../lib/database";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { addToCart } from "../lib/features/cartSlice";
import { useTranslation } from "../lib/translations";
import { formatPrice } from "../lib/utils";
import ProductImageGallery from "../components/ui/ProductImageGallery";
import Loading from "../components/ui/Loading";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        navigate('/404');
        return;
      }

      try {
        const data = await getProduct(id);
        setProduct(data);

        // Set default size if available
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate('/404');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    navigate('/404');
    return null;
  }

  const title = language === "en" ? product.title_en : product.title_lt;
  const description =
    language === "en" ? product.description_en : product.description_lt;
  const categoryName = product.category
    ? language === "en"
      ? product.category.name_en
      : product.category.name_lt
    : "";

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error(
        language === "en" ? "Please select a size" : "Prašome pasirinkti dydį",
      );
      return;
    }

    if (product.stock <= 0) {
      toast.error(t("outOfStock"));
      return;
    }

    if (quantity > product.stock) {
      toast.error(language === "en" ? "Not enough stock" : "Nepakanka atsargų");
      return;
    }

    dispatch(
      addToCart({
        product,
        quantity,
        size: selectedSize || undefined,
      }),
    );

    toast.success(t("itemAddedToCart"));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success(
        language === "en" ? "Link copied to clipboard" : "Nuoroda nukopijuota",
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900 transition-colors">
              {t("home")}
            </Link>
            <span>/</span>
            <Link
              to="/shop"
              className="hover:text-gray-900 transition-colors"
            >
              {t("shop")}
            </Link>
            {categoryName && (
              <>
                <span>/</span>
                <Link
                  to={`/shop?category=${product.category?.slug}`}
                  className="hover:text-gray-900 transition-colors"
                >
                  {categoryName}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900">{title}</span>
          </div>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === "en" ? "Back" : "Atgal"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <ProductImageGallery images={product.images} productName={title} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite
                        ? "bg-red-50 text-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {categoryName && (
                <p className="text-gray-600 mb-4">{categoryName}</p>
              )}

              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">
                    {t("inStock")} ({product.stock})
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    {t("outOfStock")}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {language === "en" ? "Description" : "Aprašymas"}
              </h3>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">{t("size")}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md transition-colors ${
                        selectedSize === size
                          ? "border-primary-600 bg-primary-50 text-primary-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t("quantity")}</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-medium w-16 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{t("addToCart")}</span>
            </button>

            {/* Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <Truck className="w-5 h-5" />
                <span>
                  {language === "en"
                    ? "Free shipping on orders over €50"
                    : "Nemokamas pristatymas užsakymams nuo 50 €"}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Shield className="w-5 h-5" />
                <span>
                  {language === "en"
                    ? "Secure payment with SSL encryption"
                    : "Saugus mokėjimas su SSL šifravimu"}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <RefreshCw className="w-5 h-5" />
                <span>
                  {language === "en"
                    ? "30-day return policy"
                    : "30 dienų grąžinimo politika"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}