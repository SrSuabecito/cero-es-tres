"use client";

import { useState } from "react";
import type { ProductVariant } from "@/lib/menu";

export function VariantPicker({ variants }: { variants: ProductVariant[] }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="mt-5">
      <div className="text-[11px] font-semibold tracking-widest text-[#9A8E7C]">
        ELIGE TU OPCIÓN
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {variants.map((v, idx) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setSelected(idx)}
            className={`flex items-center justify-between rounded-xl px-4 py-3 text-left ${
              idx === selected
                ? "border-2 border-[#EF7C1B] bg-[#FDEFE0]"
                : "border border-black/10 bg-white"
            }`}
          >
            <span
              className={`text-sm ${
                idx === selected
                  ? "font-bold text-[#17130F]"
                  : "font-semibold text-[#3F3830]"
              }`}
            >
              {v.label}
            </span>
            <span
              className={`font-semibold ${
                idx === selected ? "text-[#D9660A]" : "text-[#6B6259]"
              }`}
            >
              ${v.price}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
