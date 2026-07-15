import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { priceLabel } from "@/lib/menu";
import { ProductPhoto } from "@/components/product-photo";
import { ScrollReveal } from "@/components/menu/scroll-reveal";
import { StickyFadeBar } from "@/components/menu/sticky-fade-bar";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id, name")
    .eq("id", categoria)
    .single();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, name, description, price, note, photo_url, available, product_variants(id, price)"
    )
    .eq("category_id", categoria)
    .order("sort_order");

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8">
      <StickyFadeBar
        className="-mx-5 -mt-8 px-5 pt-8 pb-2"
        activeClassName="bg-[#F6F0E6]/95 shadow-[0_4px_14px_rgba(0,0,0,0.07)] backdrop-blur"
      >
        <Link href="/menu" className="text-sm text-[#8C8073]">
          ‹ Menú
        </Link>
        <h1 className="font-menu-display mt-2 text-2xl font-semibold text-[#17130F]">
          {category?.name ?? "Categoría"}
        </h1>
        <div className="mt-1 text-xs tracking-widest text-[#8C8073]">
          {products?.length ?? 0} OPCIONES
        </div>
      </StickyFadeBar>

      {error && (
        <p className="mt-6 text-sm text-red-600">
          No se pudo cargar esta categoría.
        </p>
      )}

      <ul className="mt-4 flex flex-col divide-y divide-[#D8D3C9]">
        {products?.map((p) => (
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
                    <span className="font-menu-display font-semibold text-[#17130F]">
                      {p.name}
                    </span>
                    <span className="font-menu-display whitespace-nowrap font-semibold text-[#EF7C1B]">
                      {priceLabel(p)}
                    </span>
                  </div>
                  {p.description && (
                    <p className="mt-1 line-clamp-2 text-[13px] text-[#8C8073]">
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
    </div>
  );
}
