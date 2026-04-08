import Link from 'next/link';
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  TrendingUp,
  FileText,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/logout-button';

export const menuItems = [
  { name: 'Início', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Transações', icon: Receipt, href: '/dashboard/transactions' },
  { name: 'Cartões', icon: CreditCard, href: '/dashboard/cards' },
  { name: 'Investimentos', icon: TrendingUp, href: '/dashboard/investments' },
  { name: 'IR', icon: FileText, href: '/dashboard/taxes' },
];

export async function Sidebar() {
  const signOut = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
  };

  return (
    <aside className="fixed top-0 left-0 hidden h-screen w-64 border-r-4 border-black bg-white p-6 md:flex md:flex-col">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center border-4 border-black bg-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-2xl font-black text-white">$</span>
        </div>
        <span className="text-2xl font-black tracking-tighter uppercase">
          FinDash
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 border-2 border-transparent p-3 font-bold uppercase transition-all hover:border-black hover:bg-yellow-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <item.icon size={22} strokeWidth={3} />
            {item.name}
          </Link>
        ))}
      </nav>

      <form action={signOut} className="mt-auto border-t-4 border-black pt-6">
        <LogoutButton />
      </form>
    </aside>
  );
}
