import type { Metadata } from 'next';
import './globals.css';

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
