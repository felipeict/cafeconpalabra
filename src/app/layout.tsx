import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Café con Palabra - Sistema POS",
  description: "Sistema de punto de venta para cafetería de iglesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
