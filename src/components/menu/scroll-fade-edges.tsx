"use client";

import { useEffect, useState } from "react";

export function ScrollFadeEdges() {
  const [topOpacity, setTopOpacity] = useState(0);
  const [bottomOpacity, setBottomOpacity] = useState(0);

  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const bottomDistance = doc.scrollHeight - (scrollTop + doc.clientHeight);
      setTopOpacity(Math.min(scrollTop / 40, 1));
      setBottomOpacity(Math.min(bottomDistance / 40, 1));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-1/2 z-20 h-7 w-full max-w-md -translate-x-1/2 transition-opacity duration-[250ms] ease-out"
        style={{
          opacity: topOpacity,
          background:
            "linear-gradient(to bottom, var(--brand-cream), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-1/2 z-20 h-7 w-full max-w-md -translate-x-1/2 transition-opacity duration-[250ms] ease-out"
        style={{
          opacity: bottomOpacity,
          background:
            "linear-gradient(to top, var(--brand-cream), transparent)",
        }}
      />
    </>
  );
}
