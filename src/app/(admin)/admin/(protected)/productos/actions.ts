"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic/client";
import { uploadImageFromUrl } from "@/lib/supabase/upload-image";
import { brand } from "@/brand.config";

export async function generateProductDescription(input: {
  name: string;
  category: string;
  currentDescription: string;
}): Promise<{ description: string } | { error: string }> {
  if (!input.name.trim()) {
    return { error: "Escribe primero el nombre del platillo." };
  }

  const prompt = `Eres el redactor de menú de la ${brand.businessType} '${brand.name}'. Escribe UNA sola descripción apetitosa y natural en español, de máximo 22 palabras, para el platillo '${input.name}' (categoría: ${input.category || "sin categoría"}). Base actual: '${input.currentDescription.trim() || "sin descripción"}'. Devuelve solo la descripción, sin comillas ni prefijos.`;

  try {
    const message = await getAnthropicClient().messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 120,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content.find((b) => b.type === "text")?.text.trim();
    if (!text) {
      return { error: "La IA no devolvió una descripción." };
    }
    return { description: text };
  } catch {
    return { error: "No se pudo generar la descripción con IA." };
  }
}

export async function setGeneratedImageAsProductPhoto(
  productId: number,
  imageUrl: string
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("photo_url")
    .eq("id", productId)
    .single();

  if (product?.photo_url) {
    return { error: "Este platillo ya tiene una foto." };
  }

  const uploaded = await uploadImageFromUrl(
    supabase,
    "product-photos",
    `${productId}-${randomUUID()}.jpg`,
    imageUrl
  );
  if ("error" in uploaded) {
    return uploaded;
  }

  const { error } = await supabase
    .from("products")
    .update({ photo_url: uploaded.publicUrl })
    .eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/productos");
  revalidatePath("/menu", "layout");
  return { success: true as const };
}

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
