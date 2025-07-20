"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useAppSelector } from "@/app/lib/hooks";
import { useTranslation } from "@/app/lib/translations";
import { cn } from "@/app/lib/utils";

export type SortOption =
  | "newest"
  | "oldest"
  | "price-low"
  | "price-high"
  | "name-asc"
  | "name-desc";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const language = useAppSelector((state) => state.language.current);
  const t = useTranslation(language);

  const sortOptions: { value: SortOption; label: string }[] = [
    {
      value: "newest",
      label: language === "en" ? "Newest First" : "Naujausi pirma",
    },
    {
      value: "oldest",
      label: language === "en" ? "Oldest First" : "Seniausi pirma",
    },
    {
      value: "price-low",
      label: language === "en" ? "Price: Low to High" : "Kaina: nuo žemos",
    },
    {
      value: "price-high",
      label: language === "en" ? "Price: High to Low" : "Kaina: nuo aukštos",
    },
    {
      value: "name-asc",
      label: language === "en" ? "Name: A to Z" : "Pavadinimas: A-Z",
    },
    {
      value: "name-desc",
      label: language === "en" ? "Name: Z to A" : "Pavadinimas: Z-A",
    },
  ];

  const selectedOption = sortOptions.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <span className="block truncate">
          {t("sort")}: {selectedOption?.label}
        </span>
        <ChevronDown
          className={cn("w-5 h-5 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="py-1" role="menu">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors",
                  value === option.value && "bg-primary-50 text-primary-600",
                )}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
