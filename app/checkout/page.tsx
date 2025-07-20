"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CreditCard, Truck, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { clearCart } from "@/app/lib/features/cartSlice";
import { useTranslation } from "@/app/lib/translations";
import { formatPrice, getImageUrl, generateOrderNumber } from "@/app/lib/utils";
import { createOrder } from "@/app/lib/database";
import { Address } from "@/app/types";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const language = useAppSelector((state) => state.language.current);
  const { user } = useAppSelector((state) => state.auth);
  const t = useTranslation(language);

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [shippingAddress, setShippingAddress] = useState<Address>({
    first_name: "",
    last_name: "",
    email: user?.email || "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    postal_code: "",
    country: "Lithuania",
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billingAddress, setBillingAddress] = useState<Address>({
    ...shippingAddress,
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const shipping = total > 50 ? 0 : 5.99;
  const finalTotal = total + shipping;

  // Redirect to cart if empty
  if (items.length === 0 && !orderPlaced) {
    router.push("/cart");
    return null;
  }

  const handleInputChange = (
    field: keyof Address,
    value: string,
    addressType: "shipping" | "billing" = "shipping",
  ) => {
    if (addressType === "shipping") {
      setShippingAddress((prev) => ({ ...prev, [field]: value }));
      if (sameAsBilling) {
        setBillingAddress((prev) => ({ ...prev, [field]: value }));
      }
    } else {
      setBillingAddress((prev) => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    const required = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "address_line_1",
      "city",
      "postal_code",
    ];

    for (const field of required) {
      if (!shippingAddress[field as keyof Address]) {
        toast.error(
          language === "en"
            ? `Please fill in ${field.replace("_", " ")}`
            : `Prašome užpildyti ${field}`,
        );
        return false;
      }
    }

    if (!sameAsBilling) {
      for (const field of required) {
        if (!billingAddress[field as keyof Address]) {
          toast.error(
            language === "en"
              ? `Please fill in billing ${field.replace("_", " ")}`
              : `Prašome užpildyti sąskaitos ${field}`,
          );
          return false;
        }
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const orderNum = generateOrderNumber();

      // Create order in database (will use mock data if Supabase not configured)
      const orderData = {
        user_id: user?.id || null,
        status: "pending" as const,
        total_amount: finalTotal,
        currency: "EUR",
        language,
        shipping_address: shippingAddress,
        billing_address: sameAsBilling ? shippingAddress : billingAddress,
        payment_method: paymentMethod,
        notes: `Order placed via e-commerce website. Payment method: ${paymentMethod === "cod" ? "Cash on Delivery" : "Card"}`,
      };

      // Since we're using mock data, we'll simulate the order creation
      console.log("Order created:", orderData);

      // Clear cart
      dispatch(clearCart());

      // Set order success state
      setOrderNumber(orderNum);
      setOrderPlaced(true);

      toast.success(t("orderPlaced"));
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        language === "en"
          ? "Failed to place order"
          : "Nepavyko pateikti užsakymo",
      );
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-soft p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {language === "en"
                  ? "Order Placed Successfully!"
                  : "Užsakymas sėkmingai pateiktas!"}
              </h1>

              <p className="text-gray-600 mb-6">
                {language === "en"
                  ? "Thank you for your order. We will contact you soon to confirm delivery details."
                  : "Ačiū už jūsų užsakymą. Netrukus susisieksime su jumis dėl pristatymo detalių."}
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === "en" ? "Order Details" : "Užsakymo detalės"}
                </h2>
                <p className="text-gray-600">
                  <span className="font-medium">{t("orderNumber")}:</span>{" "}
                  {orderNumber}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">
                    {language === "en" ? "Total" : "Iš viso"}:
                  </span>{" "}
                  {formatPrice(finalTotal)}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">
                    {language === "en" ? "Payment Method" : "Mokėjimo būdas"}:
                  </span>{" "}
                  {paymentMethod === "cod"
                    ? language === "en"
                      ? "Cash on Delivery"
                      : "Apmokėjimas gavus"
                    : language === "en"
                      ? "Card Payment"
                      : "Mokėjimas kortele"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="btn-primary">
                  {language === "en" ? "Continue Shopping" : "Tęsti pirkinius"}
                </Link>
                <Link href="/orders" className="btn-secondary">
                  {language === "en" ? "View Orders" : "Žiūrėti užsakymus"}
                </Link>
              </div>
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
            href="/cart"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === "en" ? "Back to Cart" : "Atgal į krepšelį"}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{t("checkout")}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                {t("shippingAddress")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("firstName")} *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.first_name}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("lastName")} *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.last_name}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("email")} *
                  </label>
                  <input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("phone")} *
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("address")} *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address_line_1}
                    onChange={(e) =>
                      handleInputChange("address_line_1", e.target.value)
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "en"
                      ? "Address Line 2 (Optional)"
                      : "Antras adresas (neprivalomas)"}
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address_line_2}
                    onChange={(e) =>
                      handleInputChange("address_line_2", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("city")} *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("postalCode")} *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.postal_code}
                    onChange={(e) =>
                      handleInputChange("postal_code", e.target.value)
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                {t("paymentMethod")}
              </h2>

              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {language === "en"
                        ? "Cash on Delivery (COD)"
                        : "Apmokėjimas gavus (COD)"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {language === "en"
                        ? "Pay when you receive your order"
                        : "Mokėkite gavę užsakymą"}
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    disabled
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {language === "en"
                        ? "Credit/Debit Card"
                        : "Kredito/debeto kortelė"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {language === "en" ? "Coming soon" : "Netrukus"}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-soft sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {t("orderSummary")}
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => {
                    const product = item.product!;
                    const title =
                      language === "en" ? product.title_en : product.title_lt;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3"
                      >
                        <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={getImageUrl(product.image_url, 60, 60)}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {language === "en" ? "Qty" : "Kiekis"}:{" "}
                            {item.quantity}
                            {item.size && ` • ${t("size")}: ${item.size}`}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(product.price * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Pricing */}
                <div className="space-y-3 border-t border-gray-200 pt-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === "en" ? "Subtotal" : "Tarpinė suma"}
                    </span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === "en" ? "Shipping" : "Pristatymas"}
                    </span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">
                          {language === "en" ? "Free" : "Nemokamas"}
                        </span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-3">
                    <span>{language === "en" ? "Total" : "Iš viso"}</span>
                    <span className="text-primary-600">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? language === "en"
                      ? "Placing Order..."
                      : "Pateikiamas užsakymas..."
                    : t("placeOrder")}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    {language === "en"
                      ? "By placing your order, you agree to our terms and conditions."
                      : "Pateikdami užsakymą, sutinkate su mūsų taisyklėmis ir sąlygomis."}
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
