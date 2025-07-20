import { Link } from "react-router-dom";
import { useAppSelector } from "@/lib/hooks";
import { useTranslation } from "@/lib/translations";

export default function Footer() {
  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);

  const footerLinks = {
    company: [
      { name: t("about"), href: "/about" },
      { name: t("contact"), href: "/contact" },
      { name: t("blog"), href: "/blog" },
    ],
    shop: [
      { name: t("shop"), href: "/shop" },
      { name: "Categories", href: "/shop" },
      { name: "New Arrivals", href: "/shop?filter=new" },
      { name: "Best Sellers", href: "/shop?filter=bestsellers" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Returns", href: "/returns" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-semibold">Store</span>
            </Link>
            <p className="text-gray-400 text-sm leading-6">
              {language === "en"
                ? "Professional e-commerce platform with multi-language support. Shop with confidence."
                : "Profesionali e-komercijos platforma su daugiakalbės palaikymu. Pirkite su pasitikėjimu."}
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">
              {language === "en" ? "Company" : "Įmonė"}
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold mb-4">
              {language === "en" ? "Shop" : "Parduotuvė"}
            </h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">
              {language === "en" ? "Support" : "Pagalba"}
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 E-Commerce Store.{" "}
            {language === "en"
              ? "All rights reserved."
              : "Visos teisės saugomos."}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2c-2.236 0-2.516.01-3.39.048-.875.04-1.473.18-1.996.383a4.025 4.025 0 00-1.458.95 4.025 4.025 0 00-.95 1.458c-.203.523-.343 1.121-.383 1.996C2.01 7.484 2 7.764 2 10s.01 2.516.048 3.39c.04.875.18 1.473.383 1.996a4.025 4.025 0 00.95 1.458 4.025 4.025 0 001.458.95c.523.203 1.121.343 1.996.383.874.038 1.154.048 3.39.048s2.516-.01 3.39-.048c.875-.04 1.473-.18 1.996-.383a4.025 4.025 0 001.458-.95 4.025 4.025 0 00.95-1.458c.203-.523.343-1.121.383-1.996C17.99 12.516 18 12.236 18 10s-.01-2.516-.048-3.39c-.04-.875-.18-1.473-.383-1.996a4.025 4.025 0 00-.95-1.458 4.025 4.025 0 00-1.458-.95c-.523-.203-1.121-.343-1.996-.383C12.516 2.01 12.236 2 10 2zm0 1.8c2.2 0 2.463.008 3.333.046.804.037 1.24.172 1.53.286.385.15.66.328.948.616.288.288.466.563.616.948.114.29.249.726.286 1.53.038.87.046 1.133.046 3.333s-.008 2.463-.046 3.333c-.037.804-.172 1.24-.286 1.53-.15.385-.328.66-.616.948-.288.288-.563.466-.948.616-.29.114-.726.249-1.53.286-.87.038-1.133.046-3.333.046s-2.463-.008-3.333-.046c-.804-.037-1.24-.172-1.53-.286a2.548 2.548 0 01-.948-.616 2.548 2.548 0 01-.616-.948c-.114-.29-.249-.726-.286-1.53C3.808 12.463 3.8 12.2 3.8 10s.008-2.463.046-3.333c.037-.804.172-1.24.286-1.53.15-.385.328-.66.616-.948.288-.288.563-.466.948-.616.29-.114.726-.249 1.53-.286C7.537 3.808 7.8 3.8 10 3.8zm0 3.067a3.133 3.133 0 100 6.266 3.133 3.133 0 000-6.266zM10 12a2 2 0 110-4 2 2 0 010 4zm3.8-5.2a.733.733 0 11-1.466 0 .733.733 0 011.466 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
