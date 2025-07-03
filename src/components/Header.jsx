"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Image as ImageIcon,
  Zap,
  FileImage,
  Target,
  Menu,
  Home,
  Video,
  ImageIcon as Gallery,
  Globe,
  ChevronDown,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleScrollLinkClick } from "@/utils/navRoutScroll";

const Header = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [language, setLanguage] = useState("ru");
  const [isMobile, setIsMobile] = useState(false);

  const languages = [
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  // const isHome = router.pathname === "/";

  const menuItems = [
    { type: "scroll", to: "home", label: "Главная", icon: Home },
    { type: "scroll", to: "formats", label: "Форматы", icon: FileImage },
    { type: "scroll", to: "use-cases", label: "Применение", icon: Target },
    { type: "scroll", to: "demo", label: "Демо", icon: Video },
    { type: "scroll", to: "examples", label: "Примеры", icon: Gallery },
    {
      type: "link",
      to: "price",
      label: "Цены",
      icon: DollarSign,
    },
  ];

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageDropdown && !event.target.closest(".language-dropdown")) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showLanguageDropdown]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    setShowLanguageDropdown(false);
  };

  useEffect(() => {
    setIsMobile(window.innerWidth <= 992);
    const onResize = () => setIsMobile(window.innerWidth <= 992);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="min-h-full">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-purple-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>

              <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                TrimBg.pro
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                const href =
                  item.type === "link" ? `/${item.to}` : `#${item.to}`;
                return (
                  <div key={i}>
                    {item.type === "link" ? (
                      <Link
                        href={href}
                        className="cursor-pointer flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-purple-600/20 rounded-lg transition-all duration-200"
                      >
                        <Icon className="w-4 h-4" />

                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleScrollLinkClick(item.to, router)}
                        className="cursor-pointer flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-purple-600/20 rounded-lg transition-all duration-200"
                      >
                        <Icon className="w-4 h-4" />

                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Language Selector */}
              <div className="relative language-dropdown">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-purple-600/20 rounded-lg transition-all duration-200"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {languages.find((lang) => lang.code === language)?.flag}
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
                          language === lang.code
                            ? "bg-purple-600/30 text-purple-300"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                        {language === lang.code && (
                          <Check className="w-4 h-4 ml-auto text-purple-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-purple-600/20 rounded-lg transition-all duration-200"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-purple-800/30">
            <div className="px-6 py-4 space-y-2">
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                const href =
                  item.type === "link" ? `/${item.to}` : `#${item.to}`;
                return (
                  <div key={i}>
                    {item.type === "link" ? (
                      <Link
                        href={href}
                        className="cursor-pointer flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-purple-600/20 rounded-lg transition-all duration-200"
                        onClick={() => setMenuOpen(!menuOpen)}
                      >
                        <Icon className="w-4 h-4" />

                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          setMenuOpen(!menuOpen);
                          handleScrollLinkClick(item.to, router);
                        }}
                        className="cursor-pointer flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-purple-600/20 rounded-lg transition-all duration-200"
                      >
                        <Icon className="w-4 h-4" />

                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Mobile Language Selector */}
              <div className="border-t border-purple-800/30 pt-2 mt-2">
                <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {language === "ru" ? "Язык" : "Language"}
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-3 py-3 text-left hover:bg-purple-600/20 rounded-lg transition-all duration-200 ${
                      language === lang.code
                        ? "bg-purple-600/30 text-purple-300"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                    {language === lang.code && (
                      <Check className="w-4 h-4 ml-auto text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;
