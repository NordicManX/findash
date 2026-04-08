'use client';

import { useTransition } from 'react';
import { RefreshCw } from 'lucide-react';
import { processRecurrences } from '@/app/dashboard/actions';

export function ProcessRecurrencesButton() {
  const [isPending, startTransition] = useTransition();

  function handleProcess() {
    startTransition(async () => {
      try {
        await processRecurrences();
      } catch (error) {
        console.error(error);
        alert('Erro ao sincronizar recorrências.');
      }
    });
  }

  return (
    <button
      onClick={handleProcess}
      disabled={isPending}
      className="flex w-full flex-col items-center justify-center gap-1 border-[3px] border-black bg-purple-400 p-2 text-center text-[9px] leading-tight font-black text-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 sm:flex-row sm:gap-2 sm:border-4 sm:px-4 sm:py-2 sm:text-sm sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      title="Gerar transações recorrentes deste mês"
    >
      <RefreshCw
        size={16}
        strokeWidth={3}
        className={`shrink-0 sm:h-5 sm:w-5 ${isPending ? 'animate-spin' : ''}`}
      />
      <span>{isPending ? 'Sync...' : 'Sincronizar Mês'}</span>
    </button>
  );
}
