import ar from "./ar.json";
import en from "./en.json";

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";
export type Dict = typeof ar;

const dicts: Record<Locale, Dict> = { ar, en };

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);
export const getDict = (l: Locale): Dict => dicts[l];
export const isRtl = (l: Locale) => l === "ar";
