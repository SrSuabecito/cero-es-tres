"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic/client";
import { getFalClient } from "@/lib/fal/client";
import { uploadImageFromUrl } from "@/lib/supabase/upload-image";
import { ApiError as FalApiError } from "@fal-ai/client";

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

export async function generateProductImage(input: {
  name: string;
  description: string;
}): Promise<{ imageUrl: string } | { error: string }> {
  if (!input.name.trim()) {
    return { error: "Selecciona un platillo primero." };
  }

  const prompt = `Fotografía de comida profesional de '${input.name}'${
    input.description.trim() ? `, ${input.description.trim()}` : ""
  }, para el menú de la cafetería mexicana 'Cero es tres'. Foto realista, bien iluminada, de cerca, sobre una mesa de madera, estilo editorial de restaurante. Sin texto, sin logotipos, sin personas.`;

  try {
    const result = await getFalClient().subscribe(
      "fal-ai/bytedance/seedream/v4/text-to-image",
      {
        input: {
          prompt,
          image_size: "square_hd",
        },
      }
    );

    const imageUrl = result.data.images?.[0]?.url;
    if (!imageUrl) {
      return { error: "No se pudo generar la imagen." };
    }
    return { imageUrl };
  } catch (err) {
    console.error("generateProductImage failed:", err);
    if (err instanceof FalApiError && err.status === 403) {
      return {
        error:
          "La cuenta de Fal.ai no tiene créditos suficientes. Agrega saldo en fal.ai/dashboard/billing e inténtalo de nuevo.",
      };
    }
    return { error: "No se pudo generar la imagen con IA." };
  }
}

export async function saveSocialPost(input: {
  network: string;
  tone: string;
  content: string;
  productId: number | null;
  published: boolean;
  imageUrl: string | null;
}): Promise<{ success: true } | { error: string }> {
  const content = input.content.trim();
  if (!content) {
    return { error: "No hay contenido para guardar." };
  }

  const supabase = await createClient();

  let storedImageUrl: string | null = null;
  if (input.imageUrl) {
    const uploaded = await uploadImageFromUrl(
      supabase,
      "post-images",
      `social/${randomUUID()}.jpg`,
      input.imageUrl
    );
    if ("error" in uploaded) {
      return { error: uploaded.error };
    }
    storedImageUrl = uploaded.publicUrl;
  }

  const { error } = await supabase.from("social_post").insert({
    network: input.network,
    tone: input.tone,
    content,
    product_id: input.productId,
    published: input.published,
    image_url: storedImageUrl,
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
