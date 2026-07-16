import { Bricolage_Grotesque, Inter } from "next/font/google";
import { ScrollFadeEdges } from "@/components/menu/scroll-fade-edges";

// `next/font/google` is a build-time macro: it statically analyzes this
// exact call, so the font and its `weight` list must be literal here —
// neither can come from a variable or brand.config.ts. Keep these two
// weight arrays in sync with brand.fonts.display/body.weights by hand,
// and change the imported font itself here when re-skinning for a new
// client.
const bricolage = Bricolage_Grotesque({
  weight: ["400", "600", "800"],
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${bricolage.variable} ${inter.variable} font-menu-body min-h-screen`}
      style={{
        backgroundColor: "var(--brand-cream)",
        backgroundImage: "url(/menu-bg-lineas.webp)",
        backgroundRepeat: "repeat",
        backgroundSize: "300px 300px",
      }}
    >
      <ScrollFadeEdges />
      {children}
    </div>
  );
}
