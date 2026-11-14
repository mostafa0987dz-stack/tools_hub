import { icons } from "lucide-react";

export function Icon({ name, className }: { name?: string | null; className?: string }) {
  const Cmp = icons[(name ?? "Wrench") as keyof typeof icons] ?? icons.Wrench;
  return <Cmp className={className} aria-hidden />;
}
