import type { Metadata } from 'next';
import './globals.css';

import type { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#ffffff', // Força a barra do celular a ser branca
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Evita que o usuário dê zoom sem querer e quebre o layout
};

export const metadata: Metadata = {
  title: 'FinDash',
  description: 'Controle suas finanças com atitude',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      {/* Coloquei uma cor de fundo neutra para o nosso Neo-Brutalismo brilhar */}
      <body className="min-h-screen bg-[#f4f4f0] text-black antialiased">
        {children}
      </body>
    </html>
  );
}
