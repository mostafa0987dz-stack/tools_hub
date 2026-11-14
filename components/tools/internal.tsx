"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Dict } from "@/lib/i18n/config";
import { CopyButton } from "./CopyButton";

type P = { t: Dict };
const area = "glass-input min-h-[140px] resize-y font-mono text-sm";

function Result({ value, t }: { value: string; t: Dict }) {
  return (
    <div className="grid gap-3">
      <label className="text-sm font-medium">{t.tool.output}</label>
      <textarea readOnly value={value} className={area} dir="auto" />
      <div><CopyButton text={value} label={t.copy} doneLabel={t.copied} /></div>
    </div>
  );
}

const Err = ({ msg }: { msg: string }) => <p className="text-sm text-red-500">{msg}</p>;

/** Generic input -> output tool with a list of transform buttons */
function Transformer({ t, actions, primary = 0 }: P & { actions: { label: string; run: (s: string) => string }[]; primary?: number }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const go = (run: (s: string) => string) => {
    try { setOutput(run(input)); setError(""); }
    catch { setOutput(""); setError(t.tool.invalid); }
  };

  return (
    <div className="grid gap-4">
      <label className="text-sm font-medium">{t.tool.input}</label>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} className={area} dir="auto" placeholder={t.tool.typeHere} />
      <div className="flex flex-wrap gap-2">
        {actions.map((a, i) => (
          <Button key={a.label} variant={i === primary ? "default" : "glass"} onClick={() => go(a.run)}>{a.label}</Button>
        ))}
        <Button variant="ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }}>{t.tool.clear}</Button>
      </div>
      {error && <Err msg={error} />}
      <Result value={output} t={t} />
    </div>
  );
}

const utf8ToB64 = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
};
const b64ToUtf8 = (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.trim()), (c) => c.charCodeAt(0)));

function Base64Tool({ t }: P) {
  return <Transformer t={t} actions={[{ label: t.tool.encode, run: utf8ToB64 }, { label: t.tool.decode, run: b64ToUtf8 }]} />;
}

function JsonTool({ t }: P) {
  return (
    <Transformer
      t={t}
      actions={[
        { label: t.tool.format, run: (s) => JSON.stringify(JSON.parse(s), null, 2) },
        { label: t.tool.minify, run: (s) => JSON.stringify(JSON.parse(s)) },
      ]}
    />
  );
}

function UrlTool({ t }: P) {
  return <Transformer t={t} actions={[{ label: t.tool.encode, run: encodeURIComponent }, { label: t.tool.decode, run: decodeURIComponent }]} />;
}

function CaseTool({ t }: P) {
  return (
    <Transformer
      t={t}
      primary={-1}
      actions={[
        { label: t.tool.upper, run: (s) => s.toUpperCase() },
        { label: t.tool.lower, run: (s) => s.toLowerCase() },
        { label: t.tool.title, run: (s) => s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()) },
      ]}
    />
  );
}

function WordTool({ t }: P) {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const stats = [
    [t.tool.chars, text.length],
    [t.tool.words, words],
    [t.tool.lines, text ? text.split(/\n/).length : 0],
    [t.tool.reading, Math.max(words ? 1 : 0, Math.round(words / 200))],
  ] as const;
  return (
    <div className="grid gap-4">
      <textarea value={text} onChange={(e) => setText(e.target.value)} className={area} dir="auto" placeholder={t.tool.typeHere} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(([label, n]) => (
          <div key={label} className="glass p-4 text-center">
            <p className="text-2xl font-bold">{n}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function UuidTool({ t }: P) {
  const [n, setN] = useState(5);
  const [out, setOut] = useState("");
  const gen = () => setOut(Array.from({ length: n }, () => crypto.randomUUID()).join("\n"));
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-sm font-medium">
          {t.tool.count}
          <input type="number" min={1} max={100} value={n} onChange={(e) => setN(Math.min(100, Math.max(1, Number(e.target.value) || 1)))} className="glass-input w-28" />
        </label>
        <Button onClick={gen}>{t.tool.generate}</Button>
      </div>
      <Result value={out} t={t} />
    </div>
  );
}

function ImageB64Tool({ t }: P) {
  const [out, setOut] = useState("");
  const onFile = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setOut(String(r.result));
    r.readAsDataURL(f);
  };
  return (
    <div className="grid gap-4">
      <label className="glass-btn inline-flex w-fit cursor-pointer items-center rounded-xl px-5 py-2.5 text-sm font-medium">
        {t.tool.chooseImage}
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>
      {out && /* eslint-disable-next-line @next/next/no-img-element */ <img src={out} alt="" className="max-h-56 w-fit rounded-xl" />}
      <Result value={out} t={t} />
    </div>
  );
}

const registry: Record<string, React.ComponentType<P>> = {
  base64: Base64Tool,
  "json-formatter": JsonTool,
  "url-encoder": UrlTool,
  "uuid-generator": UuidTool,
  "word-counter": WordTool,
  "case-converter": CaseTool,
  "image-to-base64": ImageB64Tool,
};

export function InternalTool({ slug, t }: { slug: string; t: Dict }) {
  const Cmp = registry[slug];
  return Cmp ? <Cmp t={t} /> : <p className="text-slate-500">{t.comingSoon}</p>;
}
