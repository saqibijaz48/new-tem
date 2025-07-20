import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Eye,
  Plus,
} from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useTranslation } from "@/lib/translations";
import {
  getProducts,
  getCategories,
  getAllOrders,
  getUsers,
} from "@/lib/database";
import { formatPrice } from "@/lib/utils";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);

  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    if (user?.role !== "admin") {
      navigate("/");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [products, orders, users] = await Promise.all([
          getProducts(),
          getAllOrders(),
          getUsers(),
        ]);

        const totalRevenue = orders.reduce(
          (sum, order) => sum + order.total_amount,
          0,
        );
        const pendingOrders = orders.filter(
          (order) => order.status === "pending",
        ).length;

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalRevenue,
          pendingOrders,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set mock data for demo
        setStats({
          totalProducts: 8,
          totalOrders: 25,
          totalUsers: 15,
          totalRevenue: 2450.75,
          pendingOrders: 5,
        });
      } finally {
        setLoading(false);
      }
    }

    if (user?.role === "admin") {
      fetchDashboardData();
    }
  }, [user]);

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === "en" ? "Access Denied" : "Prieiga uždrausta"}
          </h1>
          <p className="text-gray-600 mb-6">
            {language === "en"
              ? "You need admin privileges to access this page."
              : "Jums reikia administratoriaus teisių, kad galėtumėte pasiekti šį puslapį."}
          </p>
          <Link href="/" className="btn-primary">
            {language === "en" ? "Go Home" : "Į pradžią"}
          </Link>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: language === "en" ? "Total Products" : "Viso produktų",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: language === "en" ? "Total Orders" : "Viso užsakymų",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: language === "en" ? "Total Users" : "Viso vartotojų",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: language === "en" ? "Total Revenue" : "Bendros pajamos",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: language === "en" ? "Pending Orders" : "Laukiantys užsakymai",
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const quickActions = [
    {
      title: language === "en" ? "Add Product" : "Pridėti produktą",
      description:
        language === "en"
          ? "Add a new product to your store"
          : "Pridėkite naują produktą į parduotuvę",
      href: "/admin/products/new",
      icon: Plus,
      color: "bg-blue-600",
    },
    {
      title: language === "en" ? "View Orders" : "Žiūrėti užsakymus",
      description:
        language === "en"
          ? "Manage customer orders"
          : "Valdyti klientų užsakymus",
      href: "/admin/orders",
      icon: Eye,
      color: "bg-green-600",
    },
    {
      title: language === "en" ? "Manage Products" : "Valdyti produktus",
      description:
        language === "en"
          ? "Edit existing products"
          : "Redaguoti esamus produktus",
      href: "/admin/products",
      icon: Package,
      color: "bg-purple-600",
    },
    {
      title: language === "en" ? "User Management" : "Vartotojų valdymas",
      description:
        language === "en"
          ? "Manage user accounts"
          : "Valdyti vartotojų paskyras",
      href: "/admin/users",
      icon: Users,
      color: "bg-yellow-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-soft"
                >
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
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
            {language === "en"
              ? "Admin Dashboard"
              : "Administratoriaus skydelis"}
          </h1>
          <p className="text-gray-600">
            {language === "en"
              ? "Welcome back! Here's what's happening with your store."
              : "Sveiki sugrįžę! Štai kas vyksta jūsų parduotuvėje."}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {language === "en" ? "Quick Actions" : "Greiti veiksmai"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="bg-white rounded-xl shadow-soft p-6 hover:shadow-md transition-shadow group"
              >
                <div
                  className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {language === "en" ? "Recent Activity" : "Paskutinė veikla"}
          </h2>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">
              {language === "en"
                ? "Recent activity will appear here once you start managing your store."
                : "Paskutinė veikla atsiras čia, kai pradėsite valdyti savo parduotuvę."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
