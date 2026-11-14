import type { Tool } from "./types";

// Built-in tools: always available, even before Supabase is configured.
export const builtinTools: Tool[] = [
  { slug: "base64", name_ar: "محوّل Base64", name_en: "Base64 Converter", description_ar: "تشفير وفك تشفير النصوص بصيغة Base64 مع دعم العربية.", description_en: "Encode and decode text to Base64 with full Unicode support.", category: "dev", icon: "Binary", kind: "internal", url: null },
  { slug: "json-formatter", name_ar: "منسّق JSON", name_en: "JSON Formatter", description_ar: "نسّق ملفات JSON أو اضغطها وتحقق من صحتها.", description_en: "Format, minify and validate JSON.", category: "dev", icon: "Braces", kind: "internal", url: null },
  { slug: "url-encoder", name_ar: "ترميز الروابط", name_en: "URL Encoder", description_ar: "رمّز الروابط والنصوص أو فك ترميزها.", description_en: "Encode or decode URLs and query strings.", category: "dev", icon: "Link", kind: "internal", url: null },
  { slug: "uuid-generator", name_ar: "مولّد UUID", name_en: "UUID Generator", description_ar: "ولّد معرّفات UUID عشوائية بضغطة زر.", description_en: "Generate random UUIDs in one click.", category: "dev", icon: "Fingerprint", kind: "internal", url: null },
  { slug: "word-counter", name_ar: "عدّاد الكلمات", name_en: "Word Counter", description_ar: "احسب الأحرف والكلمات والأسطر ووقت القراءة.", description_en: "Count characters, words, lines and reading time.", category: "text", icon: "Type", kind: "internal", url: null },
  { slug: "case-converter", name_ar: "تحويل حالة الأحرف", name_en: "Case Converter", description_ar: "حوّل النص إلى أحرف كبيرة أو صغيرة أو عنوان.", description_en: "Switch text between upper, lower and title case.", category: "text", icon: "CaseSensitive", kind: "internal", url: null },
  { slug: "image-to-base64", name_ar: "صورة إلى Base64", name_en: "Image to Base64", description_ar: "حوّل أي صورة إلى رابط بيانات Base64.", description_en: "Turn any image into a Base64 data URL.", category: "image", icon: "Image", kind: "internal", url: null },
];
