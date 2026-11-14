import { getActiveAds } from "@/lib/ads";

export const dynamic = "force-dynamic";

export async function GET() {
  const ads = await getActiveAds();
  const pubs = [...new Set(ads.filter((a) => a.type === "adsense" && a.adsense_client).map((a) => a.adsense_client!.replace(/^ca-/, "")))];
  const body = pubs.length
    ? pubs.map((p) => `google.com, ${p}, DIRECT, f08c47fec0942fa0`).join("\n") + "\n"
    : "# no ad networks configured\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
