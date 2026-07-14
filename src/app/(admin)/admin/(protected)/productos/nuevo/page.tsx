import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "../actions";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order");

  return (
    <div>
      <h1 className="font-semibold text-2xl">Nuevo producto</h1>
      <div className="mt-6">
        <ProductForm
          categories={categories ?? []}
          action={createProduct}
          error={error}
        />
      </div>
    </div>
  );
}
