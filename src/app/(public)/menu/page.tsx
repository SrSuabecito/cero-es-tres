import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { priceLabel } from "@/lib/menu";
import { ProductPhoto } from "@/components/product-photo";
import { MenuSearchHeader } from "@/components/menu-search-header";
import { MenuTabs } from "@/components/menu/menu-tabs";
import { ScrollReveal } from "@/components/menu/scroll-reveal";

export default async function MenuHomePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const { tab, q } = await searchParams;
  const group = tab === "beber" ? "beber" : "comer";
  const query = (q ?? "").trim();

  const supabase = await createClient();

  const { data: allCategories } = await supabase
    .from("categories")
    .select("id, name, group, sort_order")
    .order("sort_order");

  const categoryName = new Map((allCategories ?? []).map((c) => [c.id, c.name]));

  if (query) {
    const { data: results, error } = await supabase
      .from("products")
      .select("id, name, price, photo_url, category_id, product_variants(id, price)")
      .ilike("name", `%${query}%`)
      .order("name");

    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8">
        <MenuSearchHeader query={query} group={group} />
        <MenuTabs group={group} />

        {error && (
          <p className="mt-6 text-sm text-red-600">No se pudo buscar.</p>
        )}

        <p className="mt-5 text-xs text-[#8C8073]">
          {results?.length ?? 0}{" "}
          {results?.length === 1 ? "resultado" : "resultados"}
        </p>

        <ul className="mt-1 flex flex-col divide-y divide-[#D8D3C9]">
          {results?.map((p) => (
            <li key={p.id}>
              <ScrollReveal>
                <Link
                  href={`/menu/producto/${p.id}`}
                  className="flex items-center gap-3 py-3"
                >
                  <ProductPhoto
                    url={p.photo_url}
                    alt={p.name}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-menu-display font-semibold text-[#17130F]">
                        {p.name}
                      </span>
                      <span className="font-menu-display whitespace-nowrap font-semibold text-[#EF7C1B]">
                        {priceLabel(p)}
                      </span>
                    </div>
                    <div className="text-xs text-[#8C8073]">
                      {categoryName.get(p.category_id)}
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const categories = (allCategories ?? []).filter((c) => c.group === group);

  const { data: populares } = await supabase
    .from("products")
    .select("id, name, price, photo_url, product_variants(price)")
    .not("photo_url", "is", null)
    .eq("available", true)
    .limit(8);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8">
      <MenuSearchHeader query="" group={group} />
      <MenuTabs group={group} />

      {populares && populares.length > 0 && (
        <div className="mt-6">
          <div className="text-[11px] font-semibold tracking-widest text-[#8C8073]">
            LOS FAVORITOS
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {populares.map((p) => (
              <ScrollReveal key={p.id} className="w-36 shrink-0">
                <Link
                  href={`/menu/producto/${p.id}`}
                  className="block overflow-hidden rounded-2xl border border-[#D8D3C9] bg-white shadow-sm"
                >
                  <ProductPhoto
                    url={p.photo_url}
                    alt={p.name}
                    className="h-24 w-full object-cover"
                  />
                  <div className="px-3 py-2">
                    <div className="font-menu-display truncate text-sm font-semibold text-[#17130F]">
                      {p.name}
                    </div>
                    <div className="font-menu-display text-sm font-semibold text-[#EF7C1B]">
                      {priceLabel(p)}
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-[11px] font-semibold tracking-widest text-[#8C8073]">
        {group === "comer" ? "PARA COMER" : "PARA BEBER"}
      </div>

      {categories.length === 0 && (
        <p className="mt-4 text-sm text-[#8C8073]">
          Aún no hay categorías en esta sección.
        </p>
      )}

      <ul className="mt-3 flex flex-col gap-2">
        {categories.map((c) => (
          <li key={c.id}>
            <ScrollReveal>
              <Link
                href={`/menu/${c.id}`}
                className="font-menu-display block rounded-xl border border-[#D8D3C9] bg-white px-4 py-3 font-semibold text-[#17130F] shadow-sm"
              >
                {c.name}
              </Link>
            </ScrollReveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
