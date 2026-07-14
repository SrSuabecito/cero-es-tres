"use client";

import { useState } from "react";

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
          defaultValue={product?.name}
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
          defaultValue={product?.category_id}
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
        <label className="block text-xs uppercase tracking-widest text-[#8E8A82]">
          Descripción
        </label>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={3}
          className="mt-2 w-full rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-[#ECEAE4] outline-none"
        />
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
                  ? "bg-[#EF7C1B] text-[#17130F]"
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
                  ? "bg-[#EF7C1B] text-[#17130F]"
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
          className="h-5 w-5 accent-[#EF7C1B]"
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
        className="mt-2 rounded-lg bg-[#EF7C1B] py-3 font-bold text-[#17130F]"
      >
        Guardar
      </button>
    </form>
  );
}
