"use client";

import { useState, useTransition } from "react";
import { generateProductDescription } from "@/app/(admin)/admin/(protected)/productos/actions";

type Category = { id: number; name: string };
type Variant = { label: string; price: number };

export function ProductForm({
  categories,
  action,
  product,
  variants,
  error,
}: {
  categories: Category[];
  action: (formData: FormData) => void;
  product?: {
    name: string;
    description: string | null;
    note: string | null;
    photo_url: string | null;
    available: boolean;
    category_id: number;
    price: number | null;
  };
  variants?: Variant[];
  error?: string;
}) {
  const [priceMode, setPriceMode] = useState<"single" | "variants">(
    variants && variants.length > 0 ? "variants" : "single"
  );
  const [variantRows, setVariantRows] = useState<Variant[]>(
    variants && variants.length > 0 ? variants : [{ label: "", price: 0 }]
  );

  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(
    String(product?.category_id ?? categories[0]?.id ?? "")
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [aiError, setAiError] = useState<string | null>(null);
  const [isGenerating, startGenerating] = useTransition();

  const categoryName = categories.find((c) => String(c.id) === categoryId)?.name ?? "";

  function handleGenerateDescription() {
    setAiError(null);
    startGenerating(async () => {
      const result = await generateProductDescription({
        name,
        category: categoryName,
        currentDescription: description,
      });
      if ("error" in result) {
        setAiError(result.error);
        return;
      }
      setDescription(result.description);
    });
  }

  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <input type="hidden" name="price_mode" value={priceMode} />

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div>
        <label className="block text-xs uppercase tracking-widest text-[#8E8A82]">
          Nombre
        </label>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-[#ECEAE4] outline-none"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-[#8E8A82]">
          Categoría
        </label>
        <select
          name="category_id"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-[#ECEAE4]"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-xs uppercase tracking-widest text-[#8E8A82]">
            Descripción
          </label>
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={isGenerating || !name.trim()}
            className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-[#B4B0A8] disabled:opacity-40"
          >
            {isGenerating ? "Generando…" : "✨ Generar con IA"}
          </button>
        </div>
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-[#ECEAE4] outline-none"
        />
        <p className="mt-1 text-xs text-[#6B6862]">
          La IA propone un texto; revísalo o edítalo antes de guardar.
        </p>
        {aiError && <p className="mt-1 text-xs text-red-400">{aiError}</p>}
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-[#8E8A82]">
          Foto (URL) <span className="normal-case text-[#6B6862]">— opcional por ahora</span>
        </label>
        <input
          name="photo_url"
          defaultValue={product?.photo_url ?? ""}
          placeholder="https://..."
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-[#ECEAE4] outline-none"
        />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <label className="text-xs uppercase tracking-widest text-[#8E8A82]">
            Precio
          </label>
          <div className="ml-auto flex gap-1 rounded-lg bg-[#201F27] p-1">
            <button
              type="button"
              onClick={() => setPriceMode("single")}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${
                priceMode === "single"
                  ? "bg-brand-orange text-brand-carbon"
                  : "text-[#8E8A82]"
              }`}
            >
              Único
            </button>
            <button
              type="button"
              onClick={() => setPriceMode("variants")}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${
                priceMode === "variants"
                  ? "bg-brand-orange text-brand-carbon"
                  : "text-[#8E8A82]"
              }`}
            >
              Por opción
            </button>
          </div>
        </div>

        {priceMode === "single" ? (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-[#201F27] px-3 py-2">
            <span className="text-[#8E8A82]">$</span>
            <input
              name="price"
              type="number"
              defaultValue={product?.price ?? ""}
              className="w-full bg-transparent text-[#ECEAE4] outline-none"
            />
          </div>
        ) : (
          <div className="mt-2 flex flex-col gap-2">
            {variantRows.map((v, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  name="variant_label"
                  defaultValue={v.label}
                  placeholder="Ej. Con jamón · 3 pz"
                  className="flex-1 rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-[#ECEAE4] outline-none"
                />
                <span className="text-[#8E8A82]">$</span>
                <input
                  name="variant_price"
                  type="number"
                  defaultValue={v.price}
                  className="w-24 rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-[#ECEAE4] outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setVariantRows((rows) => rows.filter((_, i) => i !== idx))
                  }
                  className="rounded-lg px-2 py-2 text-[#8E8A82] hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setVariantRows((rows) => [...rows, { label: "", price: 0 }])
              }
              className="self-start rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-[#B4B0A8]"
            >
              + Agregar opción
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-[#201F27] px-4 py-3">
        <span className="text-sm font-medium text-[#ECEAE4]">
          Disponible en el menú
        </span>
        <input
          type="checkbox"
          name="available"
          defaultChecked={product?.available ?? true}
          className="accent-brand-orange h-5 w-5"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-[#8E8A82]">
          Nota de disponibilidad (opcional)
        </label>
        <input
          name="note"
          defaultValue={product?.note ?? ""}
          placeholder="Ej. Solo en comedor"
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-[#ECEAE4] outline-none"
        />
      </div>

      <button
        type="submit"
        className="bg-brand-orange text-brand-carbon mt-2 rounded-lg py-3 font-bold"
      >
        Guardar
      </button>
    </form>
  );
}
