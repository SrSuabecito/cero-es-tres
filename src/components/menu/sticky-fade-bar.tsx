"use client";

import { useEffect, useState } from "react";

export function StickyFadeBar({
  children,
  className,
  activeClassName,
}: {
  children: React.ReactNode;
  className?: string;
  activeClassName: string;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-10 transition-[padding,background-color,box-shadow,border-color] duration-[250ms] ease-out ${
        className ?? ""
      } ${scrolled ? activeClassName : ""}`}
    >
      {children}
    </div>
  );
}
