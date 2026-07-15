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
          <span className="font-menu-display text-sm font-bold text-[#F6F0E6]">
            C
          </span>
        </div>
        <div>
          <div className="font-menu-display text-[17px] font-extrabold tracking-wide text-[#17130F]">
            CERO ES TRES
          </div>
          <div className="text-[10px] tracking-widest text-[#8C8073]">
            MENÚ DIGITAL
          </div>
        </div>
      </div>

      <form
        action="/menu"
        method="GET"
        className="mt-4 flex items-center gap-2 rounded-2xl border border-[#D8D3C9] bg-white px-3 py-2 shadow-sm"
      >
        <input type="hidden" name="tab" value={group} />
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Busca un platillo o bebida"
          className="w-full bg-transparent text-sm text-[#17130F] outline-none placeholder:text-[#8C8073]"
        />
      </form>
    </div>
  );
}
