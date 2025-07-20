"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { setUser, setLoading } from "@/app/lib/features/authSlice";
import { useTranslation } from "@/app/lib/translations";
import { supabase } from "@/app/lib/supabase";
import { isSupabaseConfigured } from "@/app/lib/mockData";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email =
        language === "en" ? "Email is required" : "El. paštas privalomas";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email =
        language === "en" ? "Email is invalid" : "Neteisingas el. paštas";
    }

    if (!formData.password) {
      newErrors.password =
        language === "en" ? "Password is required" : "Slaptažodis privalomas";
    } else if (formData.password.length < 6) {
      newErrors.password =
        language === "en"
          ? "Password must be at least 6 characters"
          : "Slaptažodis turi būti bent 6 simbolių";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormLoading(true);
    dispatch(setLoading(true));

    try {
      if (!isSupabaseConfigured()) {
        // Mock login for development
        const mockUser = {
          id: "1",
          email: formData.email,
          role: formData.email.includes("admin")
            ? ("admin" as const)
            : ("user" as const),
          language_preference: language,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        dispatch(setUser(mockUser));
        toast.success(
          language === "en" ? "Login successful!" : "Prisijungimas sėkmingas!",
        );
        router.push("/");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        // Fetch user profile from users table
        const { data: userProfile } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        const user = {
          id: data.user.id,
          email: data.user.email!,
          role: userProfile?.role || ("user" as const),
          language_preference: userProfile?.language_preference || language,
          created_at: userProfile?.created_at || new Date().toISOString(),
          updated_at: userProfile?.updated_at || new Date().toISOString(),
        };

        dispatch(setUser(user));
        toast.success(
          language === "en" ? "Login successful!" : "Prisijungimas sėkmingas!",
        );
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        language === "en" ? "Login failed" : "Prisijungimas nepavyko",
      );
    } finally {
      setFormLoading(false);
      dispatch(setLoading(false));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-soft p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Store</span>
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === "en" ? "Welcome back" : "Sveiki sugrįžę"}
            </h1>
            <p className="text-gray-600">
              {language === "en"
                ? "Sign in to your account to continue shopping"
                : "Prisijunkite prie savo paskyros ir tęskite pirkinius"}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("email")}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`input-field pl-10 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                  placeholder={
                    language === "en"
                      ? "Enter your email"
                      : "Įveskite el. paštą"
                  }
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "en" ? "Password" : "Slaptažodis"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`input-field pl-10 pr-10 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                  placeholder={
                    language === "en"
                      ? "Enter your password"
                      : "Įveskite slaptažodį"
                  }
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {language === "en" ? "Remember me" : "Prisiminti mane"}
                </span>
              </label>

              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                {language === "en"
                  ? "Forgot password?"
                  : "Pamiršote slaptažodį?"}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>
                {loading
                  ? language === "en"
                    ? "Signing in..."
                    : "Prisijungiama..."
                  : t("login")}
              </span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Demo Credentials */}
          {!isSupabaseConfigured() && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">
                {language === "en"
                  ? "Demo Mode - Use any email/password:"
                  : "Demo režimas - naudokite bet kokį el. paštą/slaptažodį:"}
              </p>
              <p className="text-xs text-blue-600">
                {language === "en"
                  ? 'Use "admin@example.com" for admin access'
                  : 'Naudokite "admin@example.com" administratoriaus prieigai'}
              </p>
            </div>
          )}

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {language === "en"
                ? "Don't have an account?"
                : "Neturite paskyros?"}{" "}
              <Link
                href="/auth/register"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {t("signup")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
