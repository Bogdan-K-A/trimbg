"use server";
import { cookies } from "next/headers";
import { defaultLocale } from "../../i18nConfig.js";

const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale() {
  const allCookies = await cookies();
  const locale = allCookies.get(COOKIE_NAME);
  return locale?.value || defaultLocale;
}

export async function setUserLocale(locale) {
  const allCookies = await cookies();
  allCookies.set(COOKIE_NAME, locale);
}
