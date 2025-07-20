import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useTranslation } from "@/lib/translations";
import LanguageSwitcher from "./LanguageSwitcher";
import CartButton from "./CartButton";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const language = useAppSelector((state) => state.language.current);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const t = useTranslation(language);

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("shop"), href: "/shop" },
    { name: t("about"), href: "/about" },
    { name: t("contact"), href: "/contact" },
    { name: t("blog"), href: "/blog" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Store</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/orders"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("orders")}
                </Link>
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {t("admin")}
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.email?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {user?.email?.split("@")[0]}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {t("signup")}
                </Link>
              </div>
            )}

            <CartButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <CartButton />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200">
                <LanguageSwitcher />
              </div>

              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/orders"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("orders")}
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("admin")}
                    </Link>
                  )}
                  <div className="flex items-center space-x-2 pt-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user?.email?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {user?.email?.split("@")[0]}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/auth/login"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("signup")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
