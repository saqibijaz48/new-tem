import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useTranslation } from "@/lib/translations";

export default function HeroSection() {
  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {language === "en" ? (
                  <>
                    Discover Your
                    <span className="text-primary-600"> Perfect</span>
                    <br />
                    Style Today
                  </>
                ) : (
                  <>
                    Atraskite savo
                    <span className="text-primary-600"> tobulą</span>
                    <br />
                    stilių šiandien
                  </>
                )}
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                {language === "en"
                  ? "Shop the latest trends in fashion, electronics, and lifestyle products. Free shipping on orders over €50."
                  : "Pirkite naujausius mados, elektronikos ir gyvensenos produktų sprendimus. Nemokamas pristatymas užsakymams nuo 50 €."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors group"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {t("shop")}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                {language === "en" ? "Learn More" : "Sužinoti daugiau"}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">10K+</div>
                <div className="text-sm text-gray-600">
                  {language === "en" ? "Happy Customers" : "Patenkintų klientų"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">500+</div>
                <div className="text-sm text-gray-600">
                  {language === "en" ? "Products" : "Produktų"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">24/7</div>
                <div className="text-sm text-gray-600">
                  {language === "en" ? "Support" : "Palaikymas"}
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=center"
                alt="E-commerce hero"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {language === "en"
                      ? "Free Shipping"
                      : "Nemokamas pristatymas"}
                  </div>
                  <div className="text-xs text-gray-500">€50+</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {language === "en" ? "Secure Payment" : "Saugus mokėjimas"}
                  </div>
                  <div className="text-xs text-gray-500">SSL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
