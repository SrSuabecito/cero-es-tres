"use client";

import { useState } from "react";
import { brand } from "@/brand.config";
import { hexToRgba } from "@/lib/color";

export function WelcomeGate({ children }: { children: React.ReactNode }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return <>{children}</>;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between px-7 pt-9 pb-8 text-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, ${hexToRgba(brand.colors.carbon, 0.18)} 0%, ${hexToRgba(brand.colors.carbon, 0.2)} 40%, ${hexToRgba(brand.colors.carbon, 0.92)} 100%), url(/menu-bg-bienvenida.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="font-menu-display text-brand-cream/90 text-sm font-extrabold tracking-wide">
        {brand.name.toUpperCase()}
      </div>

      <div className="flex flex-col gap-3.5">
        <h1 className="font-menu-display text-[30px] leading-[1.16] font-extrabold text-white">
          Bienvenido a
          <br />
          {brand.name}
        </h1>
        <p className="text-brand-cream/80 mx-auto max-w-[270px] text-[13px] leading-[1.55]">
          Explora el menú, arma tu pedido y descubre {brand.tagline} — todo
          desde tu mesa.
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="bg-brand-orange mt-2 rounded-full py-[15px] text-[15px] font-semibold text-[#3A1B04]"
          style={{
            boxShadow: `0 10px 24px ${hexToRgba(brand.colors.orange, 0.28)}`,
          }}
        >
          Ver el menú
        </button>
      </div>
    </div>
  );
}
