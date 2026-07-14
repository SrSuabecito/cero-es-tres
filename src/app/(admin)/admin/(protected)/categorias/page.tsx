import { createClient } from "@/lib/supabase/server";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { createCategory, updateCategory, deleteCategory } from "./actions";

export default async function CategoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, group, sort_order")
    .order("sort_order");

  return (
    <div>
      <h1 className="font-semibold text-2xl">Categorías</h1>
      <p className="mt-1 text-sm text-[#8E8A82]">
        {categories?.length ?? 0} categorías
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-2">
        {categories?.map((c) => (
          <form
            key={c.id}
            action={updateCategory.bind(null, c.id)}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-white/5 bg-[#1C1B22] px-4 py-3"
          >
            <input
              name="name"
              defaultValue={c.name}
              className="flex-1 rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-sm text-[#ECEAE4] outline-none"
            />
            <select
              name="group"
              defaultValue={c.group}
              className="rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-sm text-[#ECEAE4]"
            >
              <option value="comer">Comer</option>
              <option value="beber">Beber</option>
            </select>
            <input
              name="sort_order"
              type="number"
              defaultValue={c.sort_order}
              className="w-20 rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-sm text-[#ECEAE4] outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#EF7C1B] px-3 py-2 text-sm font-bold text-[#17130F]"
            >
              Guardar
            </button>
            <ConfirmSubmitButton
              formAction={deleteCategory.bind(null, c.id)}
              confirmMessage={`¿Borrar la categoría "${c.name}"? Solo se puede si no tiene productos.`}
              className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-400"
            >
              Borrar
            </ConfirmSubmitButton>
          </form>
        ))}
      </div>

      <div className="mt-8 border-t border-white/5 pt-6">
        <h2 className="text-sm font-semibold text-[#B4B0A8]">
          Nueva categoría
        </h2>
        <form
          action={createCategory}
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          <input
            name="name"
            placeholder="Nombre"
            required
            className="flex-1 rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-sm text-[#ECEAE4] outline-none"
          />
          <select
            name="group"
            defaultValue="comer"
            className="rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-sm text-[#ECEAE4]"
          >
            <option value="comer">Comer</option>
            <option value="beber">Beber</option>
          </select>
          <input
            name="sort_order"
            type="number"
            defaultValue={(categories?.length ?? 0) + 1}
            className="w-20 rounded-lg border border-white/10 bg-[#201F27] px-3 py-2 text-sm text-[#ECEAE4] outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#EF7C1B] px-4 py-2 text-sm font-bold text-[#17130F]"
          >
            Crear
          </button>
        </form>
      </div>
    </div>
  );
}
