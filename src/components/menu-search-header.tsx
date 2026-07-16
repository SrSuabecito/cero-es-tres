import { brand } from "@/brand.config";

export function MenuSearchHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-brand-carbon flex h-10 w-10 items-center justify-center rounded-full">
        <span className="font-menu-display text-brand-cream text-sm font-bold">
          {brand.logoMonogram}
        </span>
      </div>
      <div>
        <div className="font-menu-display text-brand-carbon text-[17px] font-extrabold tracking-wide">
          {brand.name.toUpperCase()}
        </div>
        <div className="text-brand-muted text-[10px] tracking-widest">
          {brand.headerEyebrow}
        </div>
      </div>
    </div>
  );
}
