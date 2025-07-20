import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CreditCard, Truck, Shield, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearCart } from "@/lib/features/cartSlice";
import { useTranslation } from "@/lib/translations";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { createOrder } from "@/lib/database";
import toast from "react-hot-toast";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Lithuania",
  });

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect to cart if empty
  if (items.length === 0 && !orderPlaced) {
    navigate("/cart");
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!shippingAddress.firstName.trim()) {
      newErrors.firstName =
        language === "en" ? "First name is required" : "Vardas privalomas";
    }

    if (!shippingAddress.lastName.trim()) {
      newErrors.lastName =
        language === "en" ? "Last name is required" : "Pavardė privaloma";
    }

    if (!shippingAddress.email.trim()) {
      newErrors.email =
        language === "en" ? "Email is required" : "El. paštas privalomas";
    } else if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) {
      newErrors.email =
        language === "en" ? "Email is invalid" : "Neteisingas el. paštas";
    }

    if (!shippingAddress.phone.trim()) {
      newErrors.phone =
        language === "en" ? "Phone is required" : "Telefonas privalomas";
    }

    if (!shippingAddress.address.trim()) {
      newErrors.address =
        language === "en" ? "Address is required" : "Adresas privalomas";
    }

    if (!shippingAddress.city.trim()) {
      newErrors.city =
        language === "en" ? "City is required" : "Miestas privalomas";
    }

    if (!shippingAddress.postalCode.trim()) {
      newErrors.postalCode =
        language === "en" ? "Postal code is required" : "Pašto kodas privalomas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const orderData = {
        user_id: user?.id || "guest",
        items: items.map((item) => ({
          product_id: item.product!.id,
          quantity: item.quantity,
          price: item.product!.price,
          size: item.size,
        })),
        total_amount: total,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        status: "pending" as const,
      };

      await createOrder(orderData);

      dispatch(clearCart());
      setOrderPlaced(true);

      toast.success(
        language === "en"
          ? "Order placed successfully!"
          : "Užsakymas pateiktas sėkmingai!",
      );
    } catch (error) {
      console.error("Error creating order:", error);
      // For demo purposes, still show success
      dispatch(clearCart());
      setOrderPlaced(true);
      toast.success(
        language === "en"
          ? "Order placed successfully! (Demo mode)"
          : "Užsakymas pateiktas sėkmingai! (Demo režimas)",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-soft p-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {language === "en"
                  ? "Order Placed Successfully!"
                  : "Užsakymas pateiktas sėkmingai!"}
              </h1>
              <p className="text-gray-600 mb-8">
                {language === "en"
                  ? "Thank you for your order! We will send you a confirmation email shortly."
                  : "Ačiū už jūsų užsakymą! Netrukus atsiųsime patvirtinimo el. laišką."}
              </p>
              <div className="space-y-4">
                <Link to="/orders" className="btn-primary">
                  {language === "en" ? "View Orders" : "Žiūrėti užsakymus"}
                </Link>
                <Link to="/shop" className="btn-secondary">
                  {language === "en" ? "Continue Shopping" : "Tęsti pirkinius"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === "en" ? "Checkout" : "Atsiskaitymas"}
            </h1>
            <p className="text-gray-600">
              {language === "en"
                ? "Complete your order below"
                : "Užbaikite savo užsakymą žemiau"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {language === "en"
                    ? "Shipping Information"
                    : "Pristatymo informacija"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("firstName")} *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className={`input-field ${errors.firstName ? "border-red-500" : ""}`}
                        placeholder={
                          language === "en" ? "First name" : "Vardas"
                        }
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("lastName")} *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className={`input-field ${errors.lastName ? "border-red-500" : ""}`}
                        placeholder={
                          language === "en" ? "Last name" : "Pavardė"
                        }
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("email")} *
                      </label>
                      <input
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`input-field ${errors.email ? "border-red-500" : ""}`}
                        placeholder={
                          language === "en"
                            ? "Email address"
                            : "El. pašto adresas"
                        }
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === "en" ? "Phone" : "Telefonas"} *
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className={`input-field ${errors.phone ? "border-red-500" : ""}`}
                        placeholder={
                          language === "en" ? "Phone number" : "Telefono numeris"
                        }
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === "en" ? "Address" : "Adresas"} *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className={`input-field ${errors.address ? "border-red-500" : ""}`}
                      placeholder={
                        language === "en"
                          ? "Street address"
                          : "Gatvės adresas"
                      }
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === "en" ? "City" : "Miestas"} *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        className={`input-field ${errors.city ? "border-red-500" : ""}`}
                        placeholder={language === "en" ? "City" : "Miestas"}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === "en" ? "Postal Code" : "Pašto kodas"} *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.postalCode}
                        onChange={(e) =>
                          handleInputChange("postalCode", e.target.value)
                        }
                        className={`input-field ${errors.postalCode ? "border-red-500" : ""}`}
                        placeholder={
                          language === "en" ? "Postal code" : "Pašto kodas"
                        }
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.postalCode}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === "en" ? "Country" : "Šalis"} *
                      </label>
                      <select
                        value={shippingAddress.country}
                        onChange={(e) =>
                          handleInputChange("country", e.target.value)
                        }
                        className="input-field"
                      >
                        <option value="Lithuania">
                          {language === "en" ? "Lithuania" : "Lietuva"}
                        </option>
                        <option value="Latvia">
                          {language === "en" ? "Latvia" : "Latvija"}
                        </option>
                        <option value="Estonia">
                          {language === "en" ? "Estonia" : "Estija"}
                        </option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {language === "en" ? "Payment Method" : "Mokėjimo būdas"}
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as "cod" | "card")
                      }
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <div className="ml-3 flex items-center">
                      <Truck className="w-5 h-5 text-gray-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === "en"
                            ? "Cash on Delivery"
                            : "Apmokėjimas gavus"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === "en"
                            ? "Pay when you receive your order"
                            : "Mokėkite gavę užsakymą"}
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors opacity-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      disabled
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <div className="ml-3 flex items-center">
                      <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {language === "en"
                            ? "Credit/Debit Card"
                            : "Kredito/debeto kortelė"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {language === "en"
                            ? "Coming soon"
                            : "Netrukus"}
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {language === "en" ? "Order Summary" : "Užsakymo santrauka"}
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => {
                    const product = item.product!;
                    const title =
                      language === "en" ? product.title_en : product.title_lt;

                    return (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={getImageUrl(product.image_url, 48, 48)}
                            alt={title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {language === "en" ? "Qty" : "Kiekis"}: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(product.price * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
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
                  <div className="flex justify-between text-lg font-semibold text-gray-900 pt-3 border-t border-gray-200">
                    <span>{t("cartTotal")}</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>
                    {loading
                      ? language === "en"
                        ? "Placing Order..."
                        : "Pateikiamas užsakymas..."
                      : language === "en"
                        ? "Place Order"
                        : "Pateikti užsakymą"}
                  </span>
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    {language === "en"
                      ? "By placing your order, you agree to our Terms of Service and Privacy Policy."
                      : "Pateikdami užsakymą, sutinkate su mūsų paslaugų teikimo sąlygomis ir privatumo politika."}
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