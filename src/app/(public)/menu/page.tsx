import { createClient } from "@/lib/supabase/server";
import { MenuSearchHeader } from "@/components/menu-search-header";
import { MenuTabs } from "@/components/menu/menu-tabs";
import { MenuBrowser } from "@/components/menu/menu-browser";
import { WelcomeGate } from "@/components/menu/welcome-gate";

export default async function MenuHomePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const group = tab === "beber" ? "beber" : "comer";

  const supabase = await createClient();

  const { data: allCategories } = await supabase
    .from("categories")
    .select("id, name, group, sort_order")
    .order("sort_order");

  const categories = (allCategories ?? []).filter((c) => c.group === group);
  const categoryIds = categories.map((c) => c.id);

  const { data: products } = categoryIds.length
    ? await supabase
        .from("products")
        .select(
          "id, name, description, price, note, photo_url, available, category_id, product_variants(id, price)"
        )
        .in("category_id", categoryIds)
        .order("sort_order")
    : { data: [] };

  const { data: favorites } = categoryIds.length
    ? await supabase
        .from("products")
        .select(
          "id, name, description, price, note, photo_url, available, category_id, product_variants(id, price)"
        )
        .in("category_id", categoryIds)
        .not("photo_url", "is", null)
        .eq("available", true)
        .limit(8)
    : { data: [] };

  return (
    <WelcomeGate>
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8">
        <MenuSearchHeader />
        <MenuTabs group={group} />

        <MenuBrowser
          categories={categories}
          products={products ?? []}
          favorites={favorites ?? []}
        />
      </div>
    </WelcomeGate>
  );
}
