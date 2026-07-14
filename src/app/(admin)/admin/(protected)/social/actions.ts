"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic/client";

export async function generateSocialPost(input: {
  network: string;
  tone: string;
  productName: string;
  productDescription: string;
}): Promise<{ content: string } | { error: string }> {
  if (!input.productName.trim()) {
    return { error: "Selecciona un platillo primero." };
  }

  const prompt = `Eres community manager de la cafetería mexicana 'Cero es tres' (identidad naranja y negro, lema 'el sabor de la experiencia'). Tono: ${input.tone}. Crea una publicación para ${input.network} sobre '${input.productName}' (${input.productDescription.trim() || "sin descripción"}). Devuelve 2 o 3 líneas atractivas con 1-2 emojis y una última línea con 4-6 hashtags en español. Sin explicaciones ni comillas.`;

  try {
    const message = await getAnthropicClient().messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content.find((b) => b.type === "text")?.text.trim();
    if (!text) {
      return { error: "La IA no devolvió contenido." };
    }
    return { content: text };
  } catch {
    return { error: "No se pudo generar la publicación con IA." };
  }
}

export async function saveSocialPost(input: {
  network: string;
  tone: string;
  content: string;
  productId: number | null;
  published: boolean;
}): Promise<{ success: true } | { error: string }> {
  const content = input.content.trim();
  if (!content) {
    return { error: "No hay contenido para guardar." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("social_post").insert({
    network: input.network,
    tone: input.tone,
    content,
    product_id: input.productId,
    published: input.published,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/social");
  return { success: true as const };
}

export async function togglePublished(id: number, published: boolean) {
  const supabase = await createClient();
  await supabase
    .from("social_post")
    .update({ published: !published })
    .eq("id", id);

  revalidatePath("/admin/social");
}

export async function deleteSocialPost(id: number) {
  const supabase = await createClient();
  await supabase.from("social_post").delete().eq("id", id);
  revalidatePath("/admin/social");
}
