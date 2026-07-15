import type { createClient } from "@/lib/supabase/server";

export async function uploadImageFromUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bucket: string,
  path: string,
  imageUrl: string
): Promise<{ publicUrl: string } | { error: string }> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    return { error: "No se pudo descargar la imagen generada." };
  }

  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const buffer = Buffer.from(await response.arrayBuffer());

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, { contentType, upsert: true });

  if (error) {
    return { error: error.message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { publicUrl: data.publicUrl };
}
