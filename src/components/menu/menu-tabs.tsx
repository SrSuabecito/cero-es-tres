import Link from "next/link";

export function MenuTabs({ group }: { group: "comer" | "beber" }) {
  return (
    <div className="mt-3 flex gap-2">
      <Link
        href="/menu?tab=comer"
        className={`flex-1 rounded-xl py-2 text-center text-sm font-medium ${
          group === "comer"
            ? "bg-brand-carbon text-brand-cream"
            : "border-brand-border text-brand-muted border bg-white"
        }`}
      >
        Para comer
      </Link>
      <Link
        href="/menu?tab=beber"
        className={`flex-1 rounded-xl py-2 text-center text-sm font-medium ${
          group === "beber"
            ? "bg-brand-carbon text-brand-cream"
            : "border-brand-border text-brand-muted border bg-white"
        }`}
      >
        Para beber
      </Link>
    </div>
  );
}
