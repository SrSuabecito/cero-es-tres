import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductPhoto } from "@/components/product-photo";
import { VariantPicker } from "@/components/variant-picker";
import { ScrollReveal } from "@/components/menu/scroll-reveal";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      "id, name, description, price, note, photo_url, available, category_id, product_variants(id, label, price, sort_order)"
    )
    .eq("id", id)
    .single();

  const { data: category } = product
    ? await supabase
        .from("categories")
        .select("name")
        .eq("id", product.category_id)
        .single()
    : { data: null };

  const variants = (product?.product_variants ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <div className="mx-auto min-h-screen w-full max-w-md">
      <div className="relative h-60 bg-[#E6DCC9]">
        <ProductPhoto
          url={product?.photo_url}
          alt={product?.name ?? ""}
          className="h-full w-full object-cover"
        />
        <Link
          href="/menu"
          className="absolute left-4 top-4 flex h-9 items-center gap-1 rounded-full bg-black/40 px-3 text-xs font-semibold text-white backdrop-blur"
        >
          ‹ Menú
        </Link>
      </div>

      <div className="px-5 py-6">
        {error && (
          <p className="text-sm text-red-600">Producto no encontrado.</p>
        )}

        {product && (
          <ScrollReveal>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-[#8C8073]">
              {category?.name}
            </div>
            <div className="mt-1 flex items-start justify-between gap-3">
              <h1 className="font-menu-display text-2xl font-bold leading-tight text-[#17130F]">
                {product.name}
              </h1>
              {!variants.length && product.price != null && (
                <span className="font-menu-display whitespace-nowrap text-xl font-bold text-[#EF7C1B]">
                  ${product.price}
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-2 text-sm leading-relaxed text-[#8C8073]">
                {product.description}
              </p>
            )}

            {!product.available && (
              <div className="mt-4 rounded-xl bg-[#FBE4DC] px-4 py-3 text-sm font-semibold text-[#B23A17]">
                Este platillo no está disponible por ahora.
              </div>
            )}

            {product.available && product.note && (
              <div className="mt-4 rounded-xl bg-[#FBEFD6] px-4 py-3 text-[12.5px] text-[#8A5D08]">
                <b className="font-extrabold">Disponibilidad:</b>{" "}
                {product.note}
              </div>
            )}

            {variants.length > 0 && <VariantPicker variants={variants} />}
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
