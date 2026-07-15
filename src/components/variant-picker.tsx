"use client";

import { useState } from "react";
import type { ProductVariant } from "@/lib/menu";

export function VariantPicker({ variants }: { variants: ProductVariant[] }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="mt-5">
      <div className="text-[11px] font-semibold tracking-widest text-[#8C8073]">
        ELIGE TU OPCIÓN
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {variants.map((v, idx) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setSelected(idx)}
            className={`flex items-center justify-between rounded-xl px-4 py-3 text-left transition-colors duration-200 ${
              idx === selected
                ? "border-2 border-[#EF7C1B] bg-[#FDEFE0]"
                : "border border-[#D8D3C9] bg-white"
            }`}
          >
            <span
              className={`text-sm ${
                idx === selected
                  ? "font-bold text-[#17130F]"
                  : "font-semibold text-[#8C8073]"
              }`}
            >
              {v.label}
            </span>
            <span
              className={`font-menu-display font-semibold ${
                idx === selected ? "text-[#EF7C1B]" : "text-[#8C8073]"
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
