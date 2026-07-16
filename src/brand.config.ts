/**
 * Central brand configuration for this template.
 *
 * Change these values to re-skin the app for a new client. Every
 * component that used to hardcode a brand color, the brand name, the
 * tagline, or the logo monogram now reads from here instead.
 *
 * Caveat: the font FAMILY choice (which Google Font actually loads) is
 * wired via `next/font/google` calls in `src/app/layout.tsx` and
 * `src/app/(public)/layout.tsx`. Next.js requires those calls to
 * reference a statically-imported font function, so swapping from
 * Bricolage Grotesque/Inter to a different family still needs a
 * one-line import change in those two files. The WEIGHTS loaded for
 * each font, on the other hand, are fully driven by this file.
 */
export const brand = {
  name: "Cero es tres",
  tagline: "el sabor de la experiencia",
  businessType: "cafetería mexicana",
  logoMonogram: "C",
  headerEyebrow: "MENÚ DIGITAL",
  colors: {
    cream: "#F6F0E6",
    carbon: "#17130F",
    orange: "#EF7C1B",
    border: "#D8D3C9",
    muted: "#8C8073",
    taupe: "#B9AF9E",
  },
  fonts: {
    display: { weights: ["400", "600", "800"] as const },
    body: { weights: ["400", "500", "600"] as const },
  },
} as const;
