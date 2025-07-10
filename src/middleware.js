import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["uk", "ru", "en"],
  defaultLocale: "uk",
  localePrefix: "as-needed", // ← важно!
  localeDetection: true,
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
