"use server";

import { revalidatePath } from "next/cache";
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
