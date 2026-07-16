"use client";

import { useState } from "react";

export function WelcomeGate({ children }: { children: React.ReactNode }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return <>{children}</>;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between px-7 pt-9 pb-8 text-center"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(23,19,15,0.18) 0%, rgba(23,19,15,0.2) 40%, rgba(23,19,15,0.92) 100%), url(/menu-bg-bienvenida.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="font-menu-display text-sm font-extrabold tracking-wide text-[#F6F0E6]/90">
        CERO ES TRES
      </div>

      <div className="flex flex-col gap-3.5">
        <h1 className="font-menu-display text-[30px] leading-[1.16] font-extrabold text-white">
          Bienvenido a
          <br />
          Cero es tres
        </h1>
        <p className="mx-auto max-w-[270px] text-[13px] leading-[1.55] text-[#F6F0E6]/80">
          Explora el menú, arma tu pedido y descubre el sabor de la
          experiencia — todo desde tu mesa.
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="mt-2 rounded-full bg-[#EF7C1B] py-[15px] text-[15px] font-semibold text-[#3A1B04] shadow-[0_10px_24px_rgba(239,124,27,0.28)]"
        >
          Ver el menú
        </button>
      </div>
    </div>
  );
}
