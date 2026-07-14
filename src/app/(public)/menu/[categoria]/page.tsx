import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { priceLabel } from "@/lib/menu";
import { ProductPhoto } from "@/components/product-photo";

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
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#F6F0E6] px-5 py-8">
      <Link href="/menu" className="text-sm text-[#9A8E7C]">
        ‹ Menú
      </Link>
      <h1 className="mt-2 font-semibold text-2xl text-[#17130F]">
        {category?.name ?? "Categoría"}
      </h1>
      <div className="mt-1 text-xs tracking-widest text-[#9A8E7C]">
        {products?.length ?? 0} OPCIONES
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-600">
          No se pudo cargar esta categoría.
        </p>
      )}

      <ul className="mt-4 flex flex-col divide-y divide-black/5">
        {products?.map((p) => (
          <li key={p.id}>
            <Link href={`/menu/producto/${p.id}`} className="flex gap-3 py-4">
              <ProductPhoto
                url={p.photo_url}
                alt={p.name}
                className="h-[74px] w-[74px] shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-[#17130F]">
                    {p.name}
                  </span>
                  <span className="whitespace-nowrap font-semibold text-[#D9660A]">
                    {priceLabel(p)}
                  </span>
                </div>
                {p.description && (
                  <p className="mt-1 line-clamp-2 text-[13px] text-[#7A6F62]">
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
          </li>
        ))}
      </ul>
    </div>
  );
}
