export const categories = [
  { id: "text", icon: "Type" },
  { id: "image", icon: "Image" },
  { id: "pdf", icon: "FileText" },
  { id: "dev", icon: "Code" },
  { id: "other", icon: "Sparkles" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];
