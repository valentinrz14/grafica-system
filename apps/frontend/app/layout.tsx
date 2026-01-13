import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gráfica - Sistema de Pedidos",
  description: "Sistema de cotización y pedidos para imprenta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
