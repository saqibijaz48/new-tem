import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
import { Product } from "../types";
import { getProducts, searchProducts } from "../lib/database";
import { useAppSelector } from "../lib/hooks";
import { useTranslation } from "../lib/translations";
import { debounce } from "../lib/utils";
import ProductCard, {
  ProductCardSkeleton,
} from "../components/ui/ProductCard";
import ProductFilters from "../components/ui/ProductFilters";
import SortDropdown, { SortOption } from "../components/ui/SortDropdown";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([0, 1000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);
  const [searchParams] = useSearchParams();

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category");
    const filter = searchParams.get("filter");

    if (category) {
      setSelectedCategory(category);
    }

    if (filter === "new") {
      setSortBy("newest");
    } else if (filter === "bestsellers") {
      setSortBy("newest"); // Could be a separate bestsellers sort in the future
    }
  }, [searchParams]);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let data: Product[];

        if (searchQuery.trim()) {
          data = await searchProducts(searchQuery, language);
        } else {
          data = await getProducts(language);
        }

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    const debouncedFetch = debounce(fetchProducts, 300);
    debouncedFetch();
  }, [language, searchQuery]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category?.slug === selectedCategory,
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.price >= selectedPriceRange[0] &&
        product.price <= selectedPriceRange[1],
    );

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      const titleA = language === "en" ? a.title_en : a.title_lt;
      const titleB = language === "en" ? b.title_en : b.title_lt;

      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-asc":
          return titleA.localeCompare(titleB);
        case "name-desc":
          return titleB.localeCompare(titleA);
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, selectedCategory, selectedPriceRange, sortBy, language]);

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedPriceRange([0, 1000]);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("shop")}</h1>
          <p className="text-gray-600">
            {language === "en"
              ? "Discover our complete collection of premium products"
              : "Atraskite mūsų išsamią aukščiausios kokybės produktų kolekciją"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <ProductFilters
              selectedCategory={selectedCategory}
              selectedPriceRange={selectedPriceRange}
              searchQuery={searchQuery}
              onCategoryChange={setSelectedCategory}
              onPriceRangeChange={setSelectedPriceRange}
              onSearchChange={setSearchQuery}
              onClearFilters={handleClearFilters}
              isOpen={filtersOpen}
              onToggle={() => setFiltersOpen(!filtersOpen)}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white p-4 rounded-lg border border-gray-200">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-600">
                  {loading
                    ? language === "en"
                      ? "Loading products..."
                      : "Kraunami produktai..."
                    : language === "en"
                      ? `Showing ${filteredAndSortedProducts.length} product${filteredAndSortedProducts.length === 1 ? "" : "s"}`
                      : `Rodoma ${filteredAndSortedProducts.length} produktų`}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {t("filter")}
                </button>

                {/* Sort Dropdown */}
                <div className="w-48">
                  <SortDropdown value={sortBy} onChange={setSortBy} />
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {language === "en" ? "No products found" : "Produktų nerasta"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === "en"
                    ? "Try adjusting your filters or search terms"
                    : "Pabandykite keisti filtrus arba paieškos žodžius"}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {language === "en" ? "Clear Filters" : "Išvalyti filtrus"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}