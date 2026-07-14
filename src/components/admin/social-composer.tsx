"use client";

import { useState, useTransition } from "react";
import {
  generateSocialPost,
  saveSocialPost,
} from "@/app/(admin)/admin/(protected)/social/actions";

type Product = { id: number; name: string; description: string | null };

const NETWORKS = ["Instagram", "Facebook", "TikTok"];
const TONES = ["Entusiasta", "Cercano y cálido", "Elegante", "Divertido"];

export function SocialComposer({ products }: { products: Product[] }) {
  const [productId, setProductId] = useState(String(products[0]?.id ?? ""));
  const [network, setNetwork] = useState(NETWORKS[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isGenerating, startGenerating] = useTransition();
  const [isSaving, startSaving] = useTransition();

  const product = products.find((p) => String(p.id) === productId);

  function handleGenerate() {
    setError(null);
    setNotice(null);
    startGenerating(async () => {
      const result = await generateSocialPost({
        network,
        tone,
        productName: product?.name ?? "",
        productDescription: product?.description ?? "",
      });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setContent(result.content);
    });
  }

  function handleSave(published: boolean) {
    setError(null);
    setNotice(null);
    startSaving(async () => {
      const result = await saveSocialPost({
        network,
        tone,
        content,
        productId: product?.id ?? null,
        published,
      });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setNotice(
        published ? "Guardado y marcado como publicado." : "Guardado como borrador."
      );
      setContent("");
    });
  }

  return (
    <div className="flex max-w-xl flex-col gap-4 rounded-xl border border-white/5 bg-[#1C1B22] p-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#8E8A82]">
            Platillo
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-[#ECEAE4]"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#8E8A82]">
            Red social
          </label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-[#ECEAE4]"
          >
            {NETWORKS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-[#8E8A82]">
          Tono
        </label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-[#ECEAE4]"
        >
          {TONES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating || !product}
        className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-[#B4B0A8] disabled:opacity-40"
      >
        {isGenerating ? "Generando…" : "✨ Generar publicación con IA"}
      </button>

      <div>
        <label className="block text-xs uppercase tracking-widest text-[#8E8A82]">
          Publicación (revisa y edita antes de guardar)
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          placeholder="Genera un borrador con IA o escribe el tuyo…"
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-[#ECEAE4] outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {notice && <p className="text-sm text-[#6FCF97]">{notice}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={isSaving || !content.trim()}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-[#ECEAE4] disabled:opacity-40"
        >
          Guardar borrador
        </button>
        <button
          type="button"
          onClick={() => handleSave(true)}
          disabled={isSaving || !content.trim()}
          className="rounded-lg bg-[#EF7C1B] px-4 py-2 text-sm font-bold text-[#17130F] disabled:opacity-40"
        >
          Guardar y marcar publicado
        </button>
      </div>
    </div>
  );
}
