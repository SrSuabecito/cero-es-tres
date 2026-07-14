import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { updateProduct, deleteProduct } from "../../actions";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order");

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, name, description, price, note, photo_url, available, category_id, product_variants(label, price, sort_order)"
    )
    .eq("id", id)
    .single();

  if (!product) notFound();

  const variants = (product.product_variants ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((v) => ({ label: v.label, price: v.price }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl">Editar producto</h1>
        <form action={deleteProduct.bind(null, product.id)}>
          <ConfirmSubmitButton
            confirmMessage="¿Eliminar este producto? Esta acción no se puede deshacer."
            className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm font-semibold text-red-400"
          >
            Eliminar producto
          </ConfirmSubmitButton>
        </form>
      </div>
      <div className="mt-6">
        <ProductForm
          categories={categories ?? []}
          action={updateProduct.bind(null, product.id)}
          product={product}
          variants={variants}
          error={error}
        />
      </div>
    </div>
  );
}
