import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { ToastProvider } from '@/context/toast-context';
import { ToastContainer } from '@/components/toast-container';
import { QueryProvider } from '@/lib/query-provider';

export const metadata: Metadata = {
  title: 'Gráfica - Sistema de Pedidos',
  description: 'Sistema de cotización y pedidos para imprenta',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
              <ToastContainer />
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
