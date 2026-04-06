import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

// Importando e configurando a nova fonte
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'FinDash',
  description: 'Controle suas finanças com atitude.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {/* Aplicando a fonte no body para o projeto todo */}
      <body className={`${spaceGrotesk.className} bg-yellow-400 antialiased`}>
        {children}
      </body>
    </html>
  );
}
