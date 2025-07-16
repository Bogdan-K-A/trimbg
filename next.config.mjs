import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./src/app/i18n.js");
/** @type {import('next').NextConfig} */

const nextConfig = {
  // env: {
  // NEXT_PUBLIC_API_URL: "http://localhost:4000",
  // NEXT_PUBLIC_API_URL: "https://trimbg.pro",
  // },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/api/download/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
