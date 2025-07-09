"use client";
import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Генерирую случайный номер для "обновления" кеша
// const cacheBuster = Date.now();

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: typeof window !== 'undefined' ? localStorage.getItem("leng") || "ua" : "ua",
    // fallbackLng: localStorage.getItem("leng") || "ua",
    supportedLngs: ["ua", "ru", "us"],
    // debug: true,
    debug: false,
    detection: {
      order: ["localStorage", "cookie"],
      caches: ["localStorage", "cookie"],
    },
    interpolation: {
      escapeValue: false,
    },
    // backend: {
    //   loadPath: `/locales/{{lng}}/{{ns}}.json?v=${cacheBuster}`, // Уникальный параметр
    // },
  });

export default i18n;
