import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../actions";
import { brand } from "@/brand.config";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#111016] text-[#ECEAE4]">
      <aside className="flex w-64 shrink-0 flex-col gap-1 border-r border-white/5 p-4">
        <div className="px-2 pb-4">
          <p className="font-semibold text-sm">{brand.name}</p>
          <p className="text-xs text-[#8E8A82]">Panel del negocio</p>
        </div>

        <Link
          href="/admin/productos"
          className="rounded-lg px-3 py-2 text-sm hover:bg-white/5"
        >
          Menú y productos
        </Link>
        <Link
          href="/admin/categorias"
          className="rounded-lg px-3 py-2 text-sm hover:bg-white/5"
        >
          Categorías
        </Link>
        <Link
          href="/admin/social"
          className="rounded-lg px-3 py-2 text-sm hover:bg-white/5"
        >
          Contenido para redes
        </Link>

        <div className="flex-1" />

        <form action={logout}>
          <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#8E8A82] hover:bg-white/5">
            Cerrar sesión
          </button>
        </form>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
