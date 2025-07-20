"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Calendar, CreditCard, Eye, X } from "lucide-react";
import { Order } from "@/app/types";
import { getOrders } from "@/app/lib/database";
import { useAppSelector } from "@/app/lib/hooks";
import { useTranslation } from "@/app/lib/translations";
import { formatPrice, formatDate } from "@/app/lib/utils";
import Link from "next/link";

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user?.id) return;

      try {
        const data = await getOrders(user.id);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Mock data for demo
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { en: string; lt: string }> = {
      pending: { en: "Pending", lt: "Laukiantis" },
      confirmed: { en: "Confirmed", lt: "Patvirtintas" },
      processing: { en: "Processing", lt: "Apdorojamas" },
      shipped: { en: "Shipped", lt: "Išsiųstas" },
      delivered: { en: "Delivered", lt: "Pristatytas" },
      cancelled: { en: "Cancelled", lt: "Atšauktas" },
    };

    return statusMap[status]?.[language] || status;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === "en" ? "Please Login" : "Prašome prisijungti"}
          </h1>
          <p className="text-gray-600 mb-6">
            {language === "en"
              ? "You need to be logged in to view your orders."
              : "Turite prisijungti, kad galėtumėte peržiūrėti savo užsakymus."}
          </p>
          <Link href="/auth/login" className="btn-primary">
            {t("login")}
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-soft"
                >
                  <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === "en" ? "My Orders" : "Mano užsakymai"}
          </h1>
          <p className="text-gray-600">
            {language === "en"
              ? "Track and manage your orders here."
              : "Sekite ir valdykite savo užsakymus čia."}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-soft p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {language === "en" ? "No orders yet" : "Kol kas nėra užsakymų"}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === "en"
                ? "When you place your first order, it will appear here."
                : "Kai pateiksite pirmą užsakymą, jis atsiras čia."}
            </p>
            <Link href="/shop" className="btn-primary">
              {language === "en" ? "Start Shopping" : "Pradėti pirkti"}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-soft p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {language === "en" ? "Order" : "Užsakymas"} #
                        {order.order_number}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(order.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {language === "en" ? "Payment Method" : "Mokėjimo būdas"}
                    </h4>
                    <div className="flex items-center text-gray-600">
                      <CreditCard className="w-4 h-4 mr-2" />
                      {order.payment_method === "cod"
                        ? language === "en"
                          ? "Cash on Delivery"
                          : "Apmokėjimas gavus"
                        : order.payment_method}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {language === "en" ? "Items" : "Prekės"}
                    </h4>
                    <p className="text-gray-600">
                      {order.order_items?.length || 0}{" "}
                      {language === "en" ? "items" : "prekės"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {language === "en"
                        ? "Shipping Address"
                        : "Pristatymo adresas"}
                    </h4>
                    <p className="text-gray-600">
                      {typeof order.shipping_address === "object"
                        ? `${order.shipping_address.city}, ${order.shipping_address.country}`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
                  <div className="mb-4 sm:mb-0">
                    {order.tracking_number && (
                      <p className="text-sm text-gray-600">
                        {language === "en" ? "Tracking" : "Sekimas"}:{" "}
                        <span className="font-medium">
                          {order.tracking_number}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4 mr-2" />
                      {language === "en" ? "View Details" : "Žiūrėti detales"}
                    </button>

                    {order.status === "pending" && (
                      <button className="flex items-center px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                        <X className="w-4 h-4 mr-2" />
                        {language === "en" ? "Cancel" : "Atšaukti"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
