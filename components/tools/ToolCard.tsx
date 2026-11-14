"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/Icon";
import type { Dict, Locale } from "@/lib/i18n/config";
import type { Tool } from "@/lib/types";
import { localized } from "@/lib/utils";

export function ToolCard({ tool, locale, t, index }: { tool: Tool; locale: Locale; t: Dict; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link href={`/${locale}/tools/${tool.slug}`} className="glass glass-hover group flex h-full flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-teal-400 to-purple-500 text-white shadow-md">
            <Icon name={tool.icon} className="h-6 w-6" />
          </span>
          {tool.kind !== "internal" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-xs dark:bg-white/10">
              {t.external}
              <ArrowUpRight className="h-3 w-3 rtl:-scale-x-100" />
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold">{localized(tool, locale, "name")}</h3>
        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{localized(tool, locale, "description")}</p>
      </Link>
    </motion.div>
  );
}
