import Link from "next/link";

export function MenuSearchHeader({
  query,
  group,
}: {
  query: string;
  group: "comer" | "beber";
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17130F]">
          <span className="text-sm font-bold text-[#F6F0E6]">C</span>
        </div>
        <div>
          <div className="text-[17px] font-bold tracking-wide text-[#17130F]">
            CERO ES TRES
          </div>
          <div className="text-[10px] tracking-widest text-[#9A8E7C]">
            MENÚ DIGITAL
          </div>
        </div>
      </div>

      <form
        action="/menu"
        method="GET"
        className="mt-4 flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 shadow-sm"
      >
        <input type="hidden" name="tab" value={group} />
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Busca un platillo o bebida"
          className="w-full bg-transparent text-sm text-[#17130F] outline-none placeholder:text-[#B4A794]"
        />
      </form>

      <div className="mt-3 flex gap-2">
        <Link
          href="/menu?tab=comer"
          className={`flex-1 rounded-xl py-2 text-center text-sm font-medium ${
            group === "comer"
              ? "bg-[#17130F] text-[#F6F0E6]"
              : "border border-black/10 bg-white text-[#6B6259]"
          }`}
        >
          Para comer
        </Link>
        <Link
          href="/menu?tab=beber"
          className={`flex-1 rounded-xl py-2 text-center text-sm font-medium ${
            group === "beber"
              ? "bg-[#17130F] text-[#F6F0E6]"
              : "border border-black/10 bg-white text-[#6B6259]"
          }`}
        >
          Para beber
        </Link>
      </div>
    </div>
  );
}
