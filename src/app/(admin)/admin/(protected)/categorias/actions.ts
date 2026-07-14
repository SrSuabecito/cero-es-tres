"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function categoryFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    group: String(formData.get("group") ?? "comer"),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };
}

export async function createCategory(formData: FormData) {
  const fields = categoryFields(formData);

  if (!fields.name) {
    redirect(
      `/admin/categorias?error=${encodeURIComponent("El nombre es obligatorio")}`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert(fields);

  if (error) {
    redirect(`/admin/categorias?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/productos");
  revalidatePath("/menu", "layout");
  redirect("/admin/categorias");
}

export async function updateCategory(id: number, formData: FormData) {
  const fields = categoryFields(formData);
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update(fields)
    .eq("id", id);

  if (error) {
    redirect(`/admin/categorias?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/productos");
  revalidatePath("/menu", "layout");
  redirect("/admin/categorias");
}

export async function deleteCategory(id: number) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    redirect(
      `/admin/categorias?error=${encodeURIComponent(
        "No puedes borrar una categoría con productos. Muévelos o bórralos primero."
      )}`
    );
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    redirect(`/admin/categorias?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/menu", "layout");
  redirect("/admin/categorias");
}
