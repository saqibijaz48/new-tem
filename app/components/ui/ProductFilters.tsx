"use client";

import { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { Category } from "@/app/types";
import { getCategories } from "@/app/lib/database";
import { useAppSelector } from "@/app/lib/hooks";
import { useTranslation } from "@/app/lib/translations";
import { cn } from "@/app/lib/utils";

interface ProductFiltersProps {
  selectedCategory: string;
  selectedPriceRange: [number, number];
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ProductFilters({
  selectedCategory,
  selectedPriceRange,
  searchQuery,
  onCategoryChange,
  onPriceRangeChange,
  onSearchChange,
  onClearFilters,
  isOpen,
  onToggle,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  const priceRanges = [
    {
      label: language === "en" ? "All Prices" : "Visos kainos",
      value: [0, 1000] as [number, number],
    },
    { label: "€0 - €25", value: [0, 25] as [number, number] },
    { label: "€25 - €50", value: [25, 50] as [number, number] },
    { label: "€50 - €100", value: [50, 100] as [number, number] },
    { label: "€100 - €200", value: [100, 200] as [number, number] },
    { label: "€200+", value: [200, 1000] as [number, number] },
  ];

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedPriceRange[0] !== 0 ||
    selectedPriceRange[1] !== 1000 ||
    searchQuery !== "";

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Mobile Filter Toggle */}
      <button
        onClick={onToggle}
        className="lg:hidden w-full flex items-center justify-between p-4 text-left"
      >
        <span className="font-medium">{t("filter")}</span>
        <ChevronDown
          className={cn("w-5 h-5 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {/* Filter Content */}
      <div
        className={cn(
          "border-t border-gray-200 lg:border-t-0",
          !isOpen && "hidden lg:block",
        )}
      >
        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("search")}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                language === "en" ? "Search products..." : "Ieškoti produktų..."
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("category")}
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value="all"
                  checked={selectedCategory === "all"}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{t("all")}</span>
              </label>
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category.slug}
                    checked={selectedCategory === category.slug}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {language === "en" ? category.name_en : category.name_lt}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("price")}
            </label>
            <div className="space-y-2">
              {priceRanges.map((range, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    value={`${range.value[0]}-${range.value[1]}`}
                    checked={
                      selectedPriceRange[0] === range.value[0] &&
                      selectedPriceRange[1] === range.value[1]
                    }
                    onChange={() => onPriceRangeChange(range.value)}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              {language === "en" ? "Clear all filters" : "Išvalyti filtrus"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
