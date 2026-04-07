'use client';

import { useState } from 'react';
import { AnalyticsChart } from '@/components/analytics-chart';
import { EditTransactionModal } from '@/components/edit-transaction-modal';
import {
  Tv,
  Music,
  PlaySquare,
  ShoppingCart,
  Droplets,
  Pill,
  Fuel,
  Bus,
  Utensils,
  Shirt,
  Briefcase,
  Zap,
  DollarSign,
  Tag,
  Film,
  RefreshCw,
  Filter,
  ChevronDown,
} from 'lucide-react';

type Account = {
  id: string;
  name: string;
  color: string;
  balance: number;
  type: string;
};

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  account_id: string;
  is_recurring?: boolean;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function getCategoryDesign(category: string) {
  switch (category) {
    case 'Netflix':
      return { icon: Film, bg: 'bg-[#E50914]', text: 'text-white' };
    case 'Spotify':
      return { icon: Music, bg: 'bg-[#1DB954]', text: 'text-white' };
    case 'YouTube Premium':
      return { icon: PlaySquare, bg: 'bg-[#FF0000]', text: 'text-white' };
    case 'Disney+':
      return { icon: Tv, bg: 'bg-[#113CCF]', text: 'text-white' };
    case 'HBO Max':
      return { icon: Tv, bg: 'bg-[#5A0FA0]', text: 'text-white' };
    case 'Apple TV':
      return { icon: Tv, bg: 'bg-[#000000]', text: 'text-white' };
    case 'Amazon Prime':
      return { icon: Tv, bg: 'bg-[#00A8E1]', text: 'text-white' };
    case 'Mercado':
      return { icon: ShoppingCart, bg: 'bg-orange-400', text: 'text-black' };
    case 'Água/Luz/Internet':
      return { icon: Droplets, bg: 'bg-blue-400', text: 'text-black' };
    case 'Farmácia':
      return { icon: Pill, bg: 'bg-teal-400', text: 'text-black' };
    case 'Combustível':
      return { icon: Fuel, bg: 'bg-zinc-400', text: 'text-black' };
    case 'Uber/99':
      return { icon: Bus, bg: 'bg-black', text: 'text-white' };
    case 'Ônibus/Metrô':
      return { icon: Bus, bg: 'bg-yellow-400', text: 'text-black' };
    case 'Ifood/Delivery':
      return { icon: Utensils, bg: 'bg-[#EA1D2C]', text: 'text-white' };
    case 'Restaurantes/Bares':
      return { icon: Utensils, bg: 'bg-pink-400', text: 'text-black' };
    case 'Roupas':
      return { icon: Shirt, bg: 'bg-purple-400', text: 'text-black' };
    case 'Salário':
      return { icon: Briefcase, bg: 'bg-green-500', text: 'text-black' };
    case 'Pix Recebido':
      return { icon: Zap, bg: 'bg-[#32BCAD]', text: 'text-white' };
    case 'Freelance':
      return { icon: DollarSign, bg: 'bg-blue-300', text: 'text-black' };
    default:
      return { icon: Tag, bg: 'bg-yellow-400', text: 'text-black' };
  }
}

function getCategoryGroup(category: string) {
  const streaming = [
    'Netflix',
    'Spotify',
    'YouTube Premium',
    'Disney+',
    'HBO Max',
    'Apple TV',
    'Amazon Prime',
    'Assinaturas Gerais',
  ];
  const essenciais = [
    'Mercado',
    'Padaria',
    'Aluguel',
    'Água/Luz/Internet',
    'Farmácia',
  ];
  const transporte = ['Combustível', 'Uber/99', 'Ônibus/Metrô'];
  const estilo = ['Ifood/Delivery', 'Restaurantes/Bares', 'Roupas'];
  const entradas = [
    'Salário',
    'Freelance',
    'Investimentos',
    'Pix Recebido',
    'Outras Entradas',
  ];

  if (streaming.includes(category))
    return { title: '📺 Streaming & Assinaturas', color: 'bg-purple-300' };
  if (essenciais.includes(category))
    return { title: '🛒 Essenciais', color: 'bg-blue-300' };
  if (transporte.includes(category))
    return { title: '🚗 Transporte', color: 'bg-zinc-300' };
  if (estilo.includes(category))
    return { title: '🍔 Estilo de Vida', color: 'bg-pink-300' };
  if (entradas.includes(category))
    return { title: '💰 Entradas de Dinheiro', color: 'bg-green-300' };

  return { title: '📦 Outros', color: 'bg-yellow-300' };
}

const FILTER_OPTIONS = [
  'Todos',
  '📺 Streaming & Assinaturas',
  '🛒 Essenciais',
  '🚗 Transporte',
  '🍔 Estilo de Vida',
  '💰 Entradas de Dinheiro',
  '📦 Outros',
];

export function DashboardFilteredView({
  transactions,
  accounts,
}: {
  transactions: Transaction[];
  accounts: Account[];
}) {
  const [filter, setFilter] = useState('Todos');

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'Todos') return true;
    return getCategoryGroup(t.category).title === filter;
  });

  const recentTransactions = filteredTransactions.slice(0, 30);
  const groupedTransactions = recentTransactions.reduce(
    (groups, t) => {
      const groupInfo = getCategoryGroup(t.category);
      if (!groups[groupInfo.title]) {
        groups[groupInfo.title] = { color: groupInfo.color, items: [] };
      }
      groups[groupInfo.title].items.push(t);
      return groups;
    },
    {} as Record<string, { color: string; items: Transaction[] }>
  );

  return (
    <div className="space-y-8">
      {/* --- NOVO PAINEL DE CONTROLE NEO-BRUTALISTA --- */}
      <div className="relative top-0 flex flex-col gap-4 border-4 border-black bg-[#c4b5fd] p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-top-1 md:flex-row md:items-center md:p-6">
        {/* Etiqueta de Filtro */}
        <div className="flex w-fit -rotate-1 transform items-center gap-2 border-4 border-black bg-white px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:rotate-0">
          <Filter size={24} strokeWidth={3} className="text-black" />
          <h3 className="text-lg font-black tracking-tight whitespace-nowrap text-black uppercase">
            Filtrar Análise
          </h3>
        </div>

        {/* Dropdown Customizado Super Grosso */}
        <div className="group relative mt-2 flex-1 md:mt-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            // appearance-none esconde a setinha feia padrão
            className="w-full cursor-pointer appearance-none border-4 border-black bg-white px-4 py-4 pr-16 text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:bg-yellow-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none md:text-base"
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === 'Todos' ? 'Visão Geral (Todos os Lançamentos)' : opt}
              </option>
            ))}
          </select>
          {/* Nossa setinha personalizada brutalista */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex w-14 items-center justify-center border-l-4 border-black bg-black text-white transition-all group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px]">
            <ChevronDown size={28} strokeWidth={4} />
          </div>
        </div>
      </div>

      <div>
        <AnalyticsChart transactions={filteredTransactions} />
      </div>

      <div className="space-y-10 pt-4 pb-10">
        {Object.entries(groupedTransactions).length > 0 ? (
          Object.entries(groupedTransactions).map(([groupTitle, groupData]) => (
            <div key={groupTitle} className="space-y-4">
              <div className="flex items-center gap-3">
                <h3
                  className={`border-4 border-black px-4 py-2 text-xl font-black text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${groupData.color}`}
                >
                  {groupTitle}
                </h3>
                {/* Tag de contagem agora com sombra pra parecer adesivo */}
                <span className="border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {groupData.items.length}{' '}
                  {groupData.items.length === 1 ? 'item' : 'itens'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {groupData.items.map((t) => {
                  const design = getCategoryDesign(t.category);
                  const Icon = design.icon;
                  const account = accounts?.find((a) => a.id === t.account_id);

                  return (
                    <div
                      key={t.id}
                      className="relative top-0 flex h-48 flex-col justify-between border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-top-1"
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`border-2 border-black p-2 ${design.bg} ${design.text} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                        >
                          <Icon size={24} strokeWidth={3} />
                        </div>
                        <div className="flex items-center gap-1">
                          {t.is_recurring && (
                            <span
                              className="border-2 border-black bg-purple-200 p-1 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              title="Despesa Recorrente"
                            >
                              <RefreshCw size={14} strokeWidth={3} />
                            </span>
                          )}
                          <span className="border-2 border-black bg-zinc-100 px-2 py-1 text-xs font-black text-black">
                            {new Date(t.date).toLocaleDateString('pt-BR', {
                              timeZone: 'UTC',
                            })}
                          </span>
                          <EditTransactionModal
                            transaction={t}
                            accounts={accounts}
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex-1">
                        <h4
                          className="truncate text-lg font-black text-black uppercase"
                          title={t.description}
                        >
                          {t.description}
                        </h4>
                        <p className="truncate text-xs font-bold text-zinc-500 uppercase">
                          {t.category}
                        </p>
                      </div>

                      <div className="mt-2 flex items-end justify-between border-t-2 border-dashed border-black pt-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-zinc-500 uppercase">
                            Banco
                          </span>
                          <span
                            className="max-w-[80px] truncate text-xs font-bold uppercase"
                            style={{ color: account?.color || 'black' }}
                          >
                            {account?.name || 'Excluída'}
                          </span>
                        </div>
                        <span
                          className={`text-xl font-black ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {t.type === 'income' ? '+' : '-'}{' '}
                          {formatCurrency(Number(t.amount))}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="border-4 border-dashed border-black bg-white p-8 text-center">
            <h3 className="mb-2 text-xl font-black text-black uppercase">
              Movimentações
            </h3>
            <p className="font-bold text-zinc-500 uppercase italic">
              Nenhuma movimentação encontrada para este filtro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
