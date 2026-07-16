import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { priceLabel } from "@/lib/menu";
import { toggleAvailable } from "./actions";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const { q, cat } = await searchParams;
  const query = (q ?? "").trim();

  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order");

  let productsQuery = supabase
    .from("products")
    .select(
      "id, name, price, note, available, category_id, product_variants(price)"
    )
    .order("sort_order");

  if (cat) productsQuery = productsQuery.eq("category_id", cat);
  if (query) productsQuery = productsQuery.ilike("name", `%${query}%`);

  const { data: products, error } = await productsQuery;
  const categoryName = new Map((categories ?? []).map((c) => [c.id, c.name]));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-semibold text-2xl">Menú y productos</h1>
          <p className="mt-1 text-sm text-[#8E8A82]">
            {products?.length ?? 0} productos · {categories?.length ?? 0}{" "}
            categorías
          </p>
        </div>

        <form
          action="/admin/productos"
          method="GET"
          className="flex flex-wrap items-center gap-2"
        >
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Buscar producto"
            className="rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-sm text-[#ECEAE4] outline-none"
          />
          <select
            name="cat"
            defaultValue={cat ?? ""}
            className="rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-sm text-[#ECEAE4]"
          >
            <option value="">Todas las categorías</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-brand-orange text-brand-carbon rounded-lg px-4 py-2 text-sm font-bold"
          >
            Filtrar
          </button>
        </form>

        <Link
          href="/admin/productos/nuevo"
          className="bg-brand-orange text-brand-carbon rounded-lg px-4 py-2 text-sm font-bold"
        >
          + Nuevo producto
        </Link>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-400">
          No se pudo cargar el catálogo.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-2">
        {products?.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 rounded-xl border border-white/5 bg-[#1C1B22] px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-[#F2F0EA]">{p.name}</div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-[#8E8A82]">
                <span>{categoryName.get(p.category_id)}</span>
                {p.available && p.note && (
                  <span className="bg-brand-orange/15 rounded-full px-2 py-0.5 font-bold text-[#F0B77C]">
                    {p.note}
                  </span>
                )}
              </div>
            </div>
            <div className="font-semibold text-[#EF9B4E]">
              {priceLabel(p)}
            </div>
            <form action={toggleAvailable.bind(null, p.id, p.available)}>
              <button
                type="submit"
                title={p.available ? "Disponible" : "Agotado"}
                className={`relative h-[26px] w-[46px] shrink-0 rounded-full ${
                  p.available ? "bg-[#2FA968]" : "bg-[#3A3842]"
                }`}
              >
                <span
                  className={`absolute top-[2.5px] h-[21px] w-[21px] rounded-full ${
                    p.available
                      ? "right-[2.5px] bg-white"
                      : "left-[2.5px] bg-[#9A968F]"
                  }`}
                />
              </button>
            </form>
            <Link
              href={`/admin/productos/${p.id}/editar`}
              className="border-brand-orange/40 shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold text-[#F0B77C]"
            >
              Editar
            </Link>
          </div>
        ))}
      </div>

      {!error && products?.length === 0 && (
        <p className="mt-6 text-sm text-[#8E8A82]">
          No se encontraron productos.
        </p>
      )}
    </div>
  );
}
