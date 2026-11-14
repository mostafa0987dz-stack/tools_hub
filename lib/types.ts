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

export type AdType = "banner" | "adsense" | "code";
export type AdPlacement = "top" | "sidebar" | "grid" | "tool_bottom";

export type Ad = {
  id: string;
  name: string;
  type: AdType;
  placement: AdPlacement;
  locale: "all" | "ar" | "en";
  priority: number;
  image_url: string | null;
  link_url: string | null;
  adsense_client: string | null;
  adsense_slot: string | null;
  code: string | null;
  height: number | null;
  is_active: boolean;
  created_at?: string;
};
