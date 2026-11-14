export type ToolKind = "internal" | "link" | "iframe";

export type Tool = {
  id?: string;
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  category: string;
  icon: string | null;
  kind: ToolKind;
  url: string | null;
  is_published?: boolean;
  created_at?: string;
};
