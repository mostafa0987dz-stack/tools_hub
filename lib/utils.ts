import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Tool } from "./types";
import type { Locale } from "./i18n/config";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function localized(tool: Tool, locale: Locale, field: "name" | "description"): string {
  const own = tool[`${field}_${locale}`];
  return own || tool[`${field}_en`] || tool[`${field}_ar`] || "";
}
