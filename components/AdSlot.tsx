"use client";
import { useEffect } from "react";
import Script from "next/script";
import type { Ad } from "@/lib/types";
import { cn } from "@/lib/utils";

const isHttps = (u?: string | null) => !!u && /^https:\/\//i.test(u);

export function AdSlot({ ad, label, className }: { ad: Ad | null | undefined; label: string; className?: string }) {
  useEffect(() => {
    if (ad?.type !== "adsense") return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {}
  }, [ad?.id, ad?.type]);

  if (!ad) return null;
  let body: React.ReactNode = null;

  if (ad.type === "banner" && isHttps(ad.image_url) && isHttps(ad.link_url)) {
    body = (
      <a href={ad.link_url!} target="_blank" rel="sponsored noopener noreferrer" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ad.image_url!} alt={ad.name} loading="lazy" className="mx-auto h-auto max-h-60 w-full rounded-lg object-contain" />
      </a>
    );
  } else if (ad.type === "adsense" && ad.adsense_client && ad.adsense_slot) {
    body = (
      <>
        <Script
          id={`adsense-${ad.adsense_client}`}
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ad.adsense_client}`}
        />
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ad.adsense_client}
          data-ad-slot={ad.adsense_slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </>
    );
  } else if (ad.type === "code" && ad.code) {
    // Custom ad code runs inside an isolated sandboxed iframe (no access to our cookies / DOM)
    body = (
      <iframe
        title={ad.name}
        loading="lazy"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        srcDoc={`<!doctype html><html><head><meta charset="utf-8"><base target="_blank"></head><body style="margin:0;display:flex;justify-content:center">${ad.code}</body></html>`}
        style={{ height: ad.height ?? 250 }}
        className="w-full rounded-lg border-0"
      />
    );
  }

  if (!body) return null;
  return (
    <aside aria-label={label} className={cn("glass overflow-hidden p-2", className)}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
      {body}
    </aside>
  );
}
