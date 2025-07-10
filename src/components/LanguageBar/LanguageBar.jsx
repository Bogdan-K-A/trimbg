"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Check, Globe, ChevronDown } from "lucide-react";
import Cookies from "js-cookie";

const LanguageBar = () => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [currentLocale, setCurrentLocale] = useState("uk");
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: "uk", name: "Українська", flag: "🇺🇦" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "en" },
  ];

  const changeLanguage = (newLocale) => {
    Cookies.set("NEXT_LOCALE", newLocale, { expires: 365 });

    const segments = pathname.split("/");
    const isDefault = newLocale === "uk";

    // удаляем флаг в роуте
    const withoutLocale = languages.some((l) => l.code === segments[1])
      ? segments.slice(2)
      : segments.slice(1);

    const newPath = isDefault
      ? `/${withoutLocale.join("/")}`
      : `/${newLocale}/${withoutLocale.join("/")}`;

    // дефолтный адрез без дефолтного префикса
    router.push(newPath || "/");

    setShowLanguageDropdown(false);
  };

  useEffect(() => {
    // сохраняем флаг в селекторе
    const segments = pathname.split("/");
    const urlLocale = languages.find((l) => l.code === segments[1])?.code;
    const cookieLocale = Cookies.get("NEXT_LOCALE");

    setCurrentLocale(urlLocale || cookieLocale || "uk");
  }, [pathname]);

  return (
    <div className="relative language-dropdown">
      <button
        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-purple-600/20 rounded-lg transition-all duration-200"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {languages.find((lang) => lang.code === currentLocale)?.flag}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            showLanguageDropdown ? "rotate-180" : ""
          }`}
        />
      </button>

      {showLanguageDropdown && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md border border-purple-800/30 rounded-lg shadow-xl overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-purple-600/20 transition-all duration-200 ${
                currentLocale === lang.code
                  ? "bg-purple-600/30 text-purple-300"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {currentLocale === lang.code && (
                <Check className="w-4 h-4 ml-auto text-purple-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageBar;
