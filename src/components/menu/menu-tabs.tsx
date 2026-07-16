import Link from "next/link";

export function MenuTabs({ group }: { group: "comer" | "beber" }) {
  return (
    <div className="mt-3 flex gap-2">
      <Link
        href="/menu?tab=comer"
        className={`flex-1 rounded-xl py-2 text-center text-sm font-medium ${
          group === "comer"
            ? "bg-[#17130F] text-[#F6F0E6]"
            : "border border-[#D8D3C9] bg-white text-[#8C8073]"
        }`}
      >
        Para comer
      </Link>
      <Link
        href="/menu?tab=beber"
        className={`flex-1 rounded-xl py-2 text-center text-sm font-medium ${
          group === "beber"
            ? "bg-[#17130F] text-[#F6F0E6]"
            : "border border-[#D8D3C9] bg-white text-[#8C8073]"
        }`}
      >
        Para beber
      </Link>
    </div>
  );
}
