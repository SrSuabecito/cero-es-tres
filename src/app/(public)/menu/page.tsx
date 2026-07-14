import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { priceLabel } from "@/lib/menu";
import { ProductPhoto } from "@/components/product-photo";
import { MenuSearchHeader } from "@/components/menu-search-header";

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
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#F6F0E6] px-5 py-8">
        <MenuSearchHeader query={query} group={group} />

        {error && (
          <p className="mt-6 text-sm text-red-600">No se pudo buscar.</p>
        )}

        <p className="mt-5 text-xs text-[#9A8E7C]">
          {results?.length ?? 0}{" "}
          {results?.length === 1 ? "resultado" : "resultados"}
        </p>

        <ul className="mt-1 flex flex-col divide-y divide-black/5">
          {results?.map((p) => (
            <li key={p.id}>
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
                    <span className="font-medium text-[#17130F]">
                      {p.name}
                    </span>
                    <span className="whitespace-nowrap font-semibold text-[#D9660A]">
                      {priceLabel(p)}
                    </span>
                  </div>
                  <div className="text-xs text-[#9A8E7C]">
                    {categoryName.get(p.category_id)}
                  </div>
                </div>
              </Link>
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
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#F6F0E6] px-5 py-8">
      <MenuSearchHeader query="" group={group} />

      {populares && populares.length > 0 && (
        <div className="mt-6">
          <div className="text-[11px] font-semibold tracking-widest text-[#9A8E7C]">
            LOS FAVORITOS
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {populares.map((p) => (
              <Link
                key={p.id}
                href={`/menu/producto/${p.id}`}
                className="w-36 shrink-0 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
              >
                <ProductPhoto
                  url={p.photo_url}
                  alt={p.name}
                  className="h-24 w-full object-cover"
                />
                <div className="px-3 py-2">
                  <div className="truncate text-sm font-semibold text-[#17130F]">
                    {p.name}
                  </div>
                  <div className="text-sm font-semibold text-[#D9660A]">
                    {priceLabel(p)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-[11px] font-semibold tracking-widest text-[#9A8E7C]">
        {group === "comer" ? "PARA COMER" : "PARA BEBER"}
      </div>

      {categories.length === 0 && (
        <p className="mt-4 text-sm text-[#9A8E7C]">
          Aún no hay categorías en esta sección.
        </p>
      )}

      <ul className="mt-3 flex flex-col gap-2">
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              href={`/menu/${c.id}`}
              className="block rounded-xl border border-black/5 bg-white px-4 py-3 font-medium text-[#17130F] shadow-sm"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
