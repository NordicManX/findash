import { Sidebar } from '@/components/sidebar';
import { MobileNav } from '@/components/mobile-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-yellow-400 font-sans text-black">
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Conteúdo Principal */}
      <main className="pb-24 md:ml-64 md:pb-8">
        <div className="p-4 md:p-8">{children}</div>
      </main>

      {/* Navegação Mobile */}
      <MobileNav />
    </div>
  );
}
