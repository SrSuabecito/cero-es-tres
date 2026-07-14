"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function toggleAvailable(id: number, available: boolean) {
  const supabase = await createClient();
  await supabase
    .from("products")
    .update({ available: !available })
    .eq("id", id);

  revalidatePath("/admin/productos");
  revalidatePath("/menu", "layout");
}

function parseVariants(formData: FormData) {
  const labels = formData.getAll("variant_label").map((v) => String(v).trim());
  const prices = formData.getAll("variant_price").map((v) => Number(v));
  return labels
    .map((label, i) => ({ label, price: prices[i] }))
    .filter((v) => v.label && !Number.isNaN(v.price));
}

function productFields(formData: FormData) {
  const priceMode = formData.get("price_mode");
  const rawPrice = formData.get("price");

  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    note: String(formData.get("note") ?? "").trim() || null,
    photo_url: String(formData.get("photo_url") ?? "").trim() || null,
    available: formData.get("available") === "on",
    category_id: Number(formData.get("category_id")),
    price: priceMode === "single" && rawPrice ? Number(rawPrice) : null,
  };
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const fields = productFields(formData);
  const variants =
    formData.get("price_mode") === "variants" ? parseVariants(formData) : [];

  const { data: product, error } = await supabase
    .from("products")
    .insert({ ...fields, sort_order: 999 })
    .select("id")
    .single();

  if (error || !product) {
    redirect(
      `/admin/productos/nuevo?error=${encodeURIComponent(
        error?.message ?? "No se pudo crear el producto"
      )}`
    );
  }

  if (variants.length > 0) {
    await supabase.from("product_variants").insert(
      variants.map((v, i) => ({ ...v, sort_order: i + 1, product_id: product.id }))
    );
  }

  revalidatePath("/admin/productos");
  revalidatePath("/menu", "layout");
  redirect("/admin/productos");
}

export async function updateProduct(id: number, formData: FormData) {
  const supabase = await createClient();
  const fields = productFields(formData);
  const variants =
    formData.get("price_mode") === "variants" ? parseVariants(formData) : [];

  const { error } = await supabase.from("products").update(fields).eq("id", id);

  if (error) {
    redirect(
      `/admin/productos/${id}/editar?error=${encodeURIComponent(error.message)}`
    );
  }

  await supabase.from("product_variants").delete().eq("product_id", id);
  if (variants.length > 0) {
    await supabase.from("product_variants").insert(
      variants.map((v, i) => ({ ...v, sort_order: i + 1, product_id: id }))
    );
  }

  revalidatePath("/admin/productos");
  revalidatePath("/menu", "layout");
  redirect("/admin/productos");
}

export async function deleteProduct(id: number) {
  const supabase = await createClient();
  await supabase.from("product_variants").delete().eq("product_id", id);
  await supabase.from("products").delete().eq("id", id);

  revalidatePath("/admin/productos");
  revalidatePath("/menu", "layout");
  redirect("/admin/productos");
}
