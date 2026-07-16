import { Bricolage_Grotesque, Inter } from "next/font/google";
import { ScrollFadeEdges } from "@/components/menu/scroll-fade-edges";

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
        backgroundColor: "#F6F0E6",
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
