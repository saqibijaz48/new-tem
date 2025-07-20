import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { setUser, setLoading } from "@/app/lib/features/authSlice";
import { useTranslation } from "@/app/lib/translations";
import { supabase } from "@/app/lib/supabase";
import { isSupabaseConfigured } from "@/app/lib/mockData";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName =
        language === "en" ? "First name is required" : "Vardas privalomas";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName =
        language === "en" ? "Last name is required" : "Pavardė privaloma";
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        language === "en"
          ? "Please confirm your password"
          : "Prašome patvirtinti slaptažodį";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        language === "en"
          ? "Passwords do not match"
          : "Slaptažodžiai nesutampa";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms =
        language === "en"
          ? "You must agree to the terms and conditions"
          : "Turite sutikti su taisyklėmis ir sąlygomis";
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
        // Mock registration for development
        const mockUser = {
          id: Date.now().toString(),
          email: formData.email,
          role: "user" as const,
          language_preference: language,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        dispatch(setUser(mockUser));
        toast.success(t("accountCreated"));
       navigate("/");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            language_preference: language,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success(
          language === "en"
            ? "Account created! Please check your email to verify your account."
            : "Paskyra sukurta! Patikrinkite el. paštą, kad patvirtintumėte paskyrą.",
        );
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        language === "en" ? "Registration failed" : "Registracija nepavyko",
      );
    } finally {
      setFormLoading(false);
      dispatch(setLoading(false));
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
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
              {language === "en" ? "Create your account" : "Sukurkite paskyrą"}
            </h1>
            <p className="text-gray-600">
              {language === "en"
                ? "Join us and start your shopping journey"
                : "Prisijunkite prie mūsų ir pradėkite pirkinių kelionę"}
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("firstName")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={`input-field pl-10 ${errors.firstName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    placeholder={language === "en" ? "First name" : "Vardas"}
                  />
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("lastName")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`input-field pl-10 ${errors.lastName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    placeholder={language === "en" ? "Last name" : "Pavardė"}
                  />
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

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
                      ? "Create a password"
                      : "Sukurkite slaptažodį"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "en"
                  ? "Confirm Password"
                  : "Patvirtinti slaptažodį"}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={`input-field pl-10 pr-10 ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                  placeholder={
                    language === "en"
                      ? "Confirm your password"
                      : "Pakartokite slaptažodį"
                  }
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    handleInputChange("agreeToTerms", e.target.checked)
                  }
                  className={`w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1 ${errors.agreeToTerms ? "border-red-500" : ""}`}
                />
                <span className="ml-2 text-sm text-gray-600">
                  {language === "en" ? "I agree to the " : "Sutinku su "}
                  <Link
                    href="/terms"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {language === "en"
                      ? "Terms and Conditions"
                      : "taisyklėmis ir sąlygomis"}
                  </Link>
                  {language === "en" ? " and " : " ir "}
                  <Link
                    href="/privacy"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {language === "en"
                      ? "Privacy Policy"
                      : "privatumo politika"}
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>
                {loading
                  ? language === "en"
                    ? "Creating account..."
                    : "Kuriama paskyra..."
                  : language === "en"
                    ? "Create Account"
                    : "Sukurti paskyrą"}
              </span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Demo Notice */}
          {!isSupabaseConfigured() && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                {language === "en"
                  ? "Demo Mode - Registration will create a mock account"
                  : "Demo režimas - registracija sukurs demo paskyrą"}
              </p>
            </div>
          )}

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {language === "en"
                ? "Already have an account?"
                : "Jau turite paskyrą?"}{" "}
              <Link
                href="/auth/login"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {t("login")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
