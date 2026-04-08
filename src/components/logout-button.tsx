'use client';

import { LogOut } from 'lucide-react';
import { useTransition } from 'react';
import { signOutUser } from '@/app/dashboard/actions';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => signOutUser())}
      disabled={isPending}
      className="flex items-center gap-2 border-2 border-black bg-red-500 px-3 py-1.5 text-xs font-black text-white uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
      title="Sair da conta"
    >
      <LogOut size={16} strokeWidth={3} />
      <span>{isPending ? 'Saindo...' : 'Sair'}</span>
    </button>
  );
}
