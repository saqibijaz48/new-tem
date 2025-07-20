import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import { setLanguage } from "../../lib/features/languageSlice";
import { cn } from "../../lib/utils";

export default function LanguageSwitcher() {
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.language.current);

  const handleLanguageChange = (language: "en" | "lt") => {
    dispatch(setLanguage(language));
  };

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => handleLanguageChange("en")}
        className={cn(
          "px-3 py-1 text-sm font-medium rounded-md transition-all",
          currentLanguage === "en"
            ? "bg-white text-primary-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900",
        )}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange("lt")}
        className={cn(
          "px-3 py-1 text-sm font-medium rounded-md transition-all",
          currentLanguage === "lt"
            ? "bg-white text-primary-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900",
        )}
      >
        LT
      </button>
    </div>
  );
}
