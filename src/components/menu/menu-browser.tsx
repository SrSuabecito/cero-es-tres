"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { priceLabel } from "@/lib/menu";
import { ProductPhoto } from "@/components/product-photo";
import { ScrollReveal } from "@/components/menu/scroll-reveal";
import { StickyFadeBar } from "@/components/menu/sticky-fade-bar";
import { brand } from "@/brand.config";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  note: string | null;
  photo_url: string | null;
  available: boolean;
  category_id: number;
  product_variants?: { price: number }[] | null;
};

type Category = { id: number; name: string };

export function MenuBrowser({
  categories,
  products,
  favorites,
}: {
  categories: Category[];
  products: Product[];
  favorites: Product[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const showFavorites = activeCategory === "todos" && normalizedSearch === "";

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "todos" || String(p.category_id) === activeCategory;
      const haystack = `${p.name} ${p.description ?? ""}`.toLowerCase();
      const matchesSearch =
        normalizedSearch === "" || haystack.includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, normalizedSearch]);

  return (
    <div>
      <div className="border-brand-border mt-4 mb-1 flex items-center gap-2.5 rounded-[14px] border bg-white px-4 py-3">
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke={brand.colors.muted}
          strokeWidth="2"
          className="shrink-0"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar en el menú"
          className="text-brand-carbon placeholder:text-brand-muted w-full bg-transparent text-[13.5px] outline-none"
        />
      </div>

      <StickyFadeBar
        className="-mx-5 mt-3 px-5 py-2"
        activeClassName="bg-brand-cream/95 shadow-[0_4px_14px_rgba(0,0,0,0.07)] backdrop-blur"
      >
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setActiveCategory("todos")}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
              activeCategory === "todos"
                ? "bg-brand-orange text-[#3A1B04]"
                : "border-brand-border text-brand-muted border"
            }`}
          >
            Todos
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(String(c.id))}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                activeCategory === String(c.id)
                  ? "bg-brand-orange text-[#3A1B04]"
                  : "border-brand-border text-brand-muted border"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </StickyFadeBar>

      {showFavorites && favorites.length > 0 && (
        <div className="mt-5">
          <div className="text-brand-muted text-[11px] font-semibold tracking-widest">
            LOS FAVORITOS
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {favorites.map((p) => (
              <ScrollReveal key={p.id} className="w-36 shrink-0">
                <Link
                  href={`/menu/producto/${p.id}`}
                  className="border-brand-border block overflow-hidden rounded-2xl border bg-white shadow-sm"
                >
                  <ProductPhoto
                    url={p.photo_url}
                    alt={p.name}
                    className="h-24 w-full object-cover"
                  />
                  <div className="px-3 py-2">
                    <div className="font-menu-display text-brand-carbon truncate text-sm font-semibold">
                      {p.name}
                    </div>
                    <div className="font-menu-display text-brand-orange text-sm font-semibold">
                      {priceLabel(p)}
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      <ul className="divide-brand-border mt-5 flex flex-col divide-y">
        {filtered.map((p) => (
          <li key={p.id}>
            <ScrollReveal>
              <Link
                href={`/menu/producto/${p.id}`}
                className="flex gap-3 py-4"
              >
                <ProductPhoto
                  url={p.photo_url}
                  alt={p.name}
                  className="h-[74px] w-[74px] shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-menu-display text-brand-carbon font-semibold">
                      {p.name}
                    </span>
                    <span className="font-menu-display text-brand-orange whitespace-nowrap font-semibold">
                      {priceLabel(p)}
                    </span>
                  </div>
                  {p.description && (
                    <p className="text-brand-muted mt-1 line-clamp-2 text-[13px]">
                      {p.description}
                    </p>
                  )}
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {!p.available && (
                      <span className="rounded-full bg-[#FBE4DC] px-2 py-0.5 text-[10px] font-bold text-[#B23A17]">
                        Agotado
                      </span>
                    )}
                    {p.available && p.note && (
                      <span className="rounded-full bg-[#FBEFD6] px-2 py-0.5 text-[10px] font-bold text-[#96650C]">
                        {p.note}
                      </span>
                    )}
                    {p.product_variants && p.product_variants.length > 0 && (
                      <span className="rounded-full bg-[#EAE1D2] px-2 py-0.5 text-[10px] font-bold text-[#6B6259]">
                        Varias opciones
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="text-brand-muted mt-6 text-center text-sm">
          No se encontraron productos.
        </p>
      )}
    </div>
  );
}
