import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { brand } from "@/brand.config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: brand.name,
  description: `Menú digital y panel del negocio de ${brand.name}`,
};

// Injects the brand palette as CSS custom properties so every Tailwind
// `bg-brand-*` / `text-brand-*` / `border-brand-*` utility (registered in
// globals.css) resolves to the values in brand.config.ts.
const brandStyle = {
  "--brand-cream": brand.colors.cream,
  "--brand-carbon": brand.colors.carbon,
  "--brand-orange": brand.colors.orange,
  "--brand-border": brand.colors.border,
  "--brand-muted": brand.colors.muted,
  "--brand-taupe": brand.colors.taupe,
} as React.CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={brandStyle}>
        {children}
      </body>
    </html>
  );
}
