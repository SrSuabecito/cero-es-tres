import { createClient } from "@/lib/supabase/server";
import { SocialComposer } from "@/components/admin/social-composer";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { togglePublished, deleteSocialPost } from "./actions";

export default async function SocialPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, description")
    .order("name");

  const { data: posts, error } = await supabase
    .from("social_post")
    .select("id, network, tone, content, published, product_id")
    .order("created_at", { ascending: false });

  const productName = new Map((products ?? []).map((p) => [p.id, p.name]));

  return (
    <div>
      <h1 className="font-semibold text-2xl">Contenido para redes</h1>
      <p className="mt-2 text-sm text-[#8E8A82]">
        Genera publicaciones a partir de tu menú real, con ayuda de IA. Revisa
        y edita el texto antes de guardar — nada se publica automáticamente.
      </p>

      <div className="mt-6">
        <SocialComposer products={products ?? []} />
      </div>

      <h2 className="mt-10 font-semibold text-lg">Publicaciones guardadas</h2>

      {error && (
        <p className="mt-4 text-sm text-red-400">
          No se pudieron cargar las publicaciones.
        </p>
      )}

      <div className="mt-4 flex max-w-xl flex-col gap-2">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="rounded-xl border border-white/5 bg-[#1C1B22] p-4"
          >
            <div className="flex items-center justify-between gap-2 text-xs text-[#8E8A82]">
              <span>
                {post.network} · {post.tone}
                {post.product_id && productName.get(post.product_id)
                  ? ` · ${productName.get(post.product_id)}`
                  : ""}
              </span>
              <span
                className={
                  post.published ? "text-[#6FCF97]" : "text-[#F0B77C]"
                }
              >
                {post.published ? "Publicado" : "Borrador"}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-[#ECEAE4]">
              {post.content}
            </p>
            <div className="mt-3 flex gap-2">
              <form
                action={togglePublished.bind(
                  null,
                  post.id,
                  post.published ?? false
                )}
              >
                <button
                  type="submit"
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-[#B4B0A8]"
                >
                  {post.published ? "Marcar como borrador" : "Marcar como publicado"}
                </button>
              </form>
              <form action={deleteSocialPost.bind(null, post.id)}>
                <ConfirmSubmitButton
                  confirmMessage="¿Eliminar esta publicación?"
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-red-400"
                >
                  Eliminar
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
        {!error && posts?.length === 0 && (
          <p className="text-sm text-[#8E8A82]">
            Aún no hay publicaciones guardadas.
          </p>
        )}
      </div>
    </div>
  );
}
