import { createClient } from '@/lib/supabase/server';
import { AddAccountModal } from '@/components/add-account-modal';
import { EditAccountModal } from '@/components/edit-account-modal';
import { AddTransactionModal } from '@/components/add-transaction-modal';
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
} from 'lucide-react';

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  account_id: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Design individual do Card
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

// MÁGICA DO AGRUPAMENTO: Define qual é o "Bloco Pai" de cada gasto
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

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  const initialBalanceSum =
    accounts?.reduce((acc, accnt) => acc + Number(accnt.balance), 0) || 0;
  const totalIncomes =
    transactions
      ?.filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + Number(t.amount), 0) || 0;
  const totalExpenses =
    transactions
      ?.filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + Number(t.amount), 0) || 0;
  const currentTotalBalance = initialBalanceSum + totalIncomes - totalExpenses;

  // Pegamos as últimas 30 transações para não quebrar a tela e AGRUPAMOS
  const recentTransactions = transactions?.slice(0, 30) || [];

  // Organiza as transações dentro das suas "pastas"
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
      <div className="flex flex-col justify-between gap-4 border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-6 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-2xl font-black text-black uppercase md:text-3xl">
            Visão Geral
          </h2>
          <p className="text-sm font-bold text-zinc-600 md:text-base">
            Seu império financeiro começa aqui.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <AddTransactionModal accounts={accounts || []} />
          <AddAccountModal />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <div className="relative top-0 border-4 border-black bg-green-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-top-1">
          <p className="text-xs font-black text-black uppercase">
            Saldo Atual Líquido
          </p>
          <p className="mt-2 truncate text-3xl font-black text-black md:text-4xl">
            {formatCurrency(currentTotalBalance)}
          </p>
        </div>

        <div className="relative top-0 border-4 border-black bg-blue-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-top-1">
          <p className="text-xs font-black text-black uppercase">
            Total Recebido
          </p>
          <p className="mt-2 truncate text-3xl font-black text-black md:text-4xl">
            {formatCurrency(totalIncomes)}
          </p>
        </div>

        <div className="relative top-0 border-4 border-black bg-red-500 p-6 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-top-1">
          <p className="text-xs font-black uppercase">Total Gasto</p>
          <p className="mt-2 truncate text-3xl font-black md:text-4xl">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="inline-block border-b-4 border-black pb-2 text-xl font-black text-black uppercase">
          Minhas Instituições
        </h3>

        {accounts && accounts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {accounts.map((account) => {
              const accIncomes =
                transactions
                  ?.filter(
                    (t) => t.account_id === account.id && t.type === 'income'
                  )
                  .reduce((acc, t) => acc + Number(t.amount), 0) || 0;
              const accExpenses =
                transactions
                  ?.filter(
                    (t) => t.account_id === account.id && t.type === 'expense'
                  )
                  .reduce((acc, t) => acc + Number(t.amount), 0) || 0;
              const accCurrentBalance =
                Number(account.balance) + accIncomes - accExpenses;

              return (
                <div
                  key={account.id}
                  className="relative top-0 flex h-32 flex-col justify-between border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-top-1"
                  style={{
                    backgroundColor: account.color,
                    color:
                      account.color === '#FCEB00' ||
                      account.color === '#FF7A00' ||
                      account.color === '#F3F4F6'
                        ? 'black'
                        : 'white',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <p className="truncate pr-2 text-sm font-black uppercase">
                      {account.name}
                    </p>
                    <EditAccountModal account={account} />
                  </div>
                  <p className="truncate text-xl font-black">
                    {formatCurrency(accCurrentBalance)}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border-4 border-dashed border-black bg-white p-8 text-center">
            <p className="font-bold text-zinc-500 uppercase italic">
              Primeiro, adicione uma conta bancária acima.
            </p>
          </div>
        )}
      </div>

      {/* OS NOVOS BLOCOS DE GASTOS SEPARADOS */}
      <div className="space-y-10 pt-8 pb-10">
        {Object.entries(groupedTransactions).length > 0 ? (
          Object.entries(groupedTransactions).map(([groupTitle, groupData]) => (
            <div key={groupTitle} className="space-y-4">
              {/* Título do Bloco */}
              <div className="flex items-center gap-3">
                <h3
                  className={`border-4 border-black px-4 py-2 text-xl font-black text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${groupData.color}`}
                >
                  {groupTitle}
                </h3>
                {/* Mostra a quantidade de transações naquele bloco */}
                <span className="border-2 border-black bg-white px-2 py-1 text-xs font-bold text-black">
                  {groupData.items.length}{' '}
                  {groupData.items.length === 1 ? 'item' : 'itens'}
                </span>
              </div>

              {/* Grid de Quadradinhos Deste Bloco */}
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
                          <span className="border-2 border-black bg-zinc-100 px-2 py-1 text-xs font-black text-black">
                            {new Date(t.date).toLocaleDateString('pt-BR', {
                              timeZone: 'UTC',
                            })}
                          </span>
                          <EditTransactionModal
                            transaction={t as Transaction}
                            accounts={accounts || []}
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
              Nenhuma movimentação registrada ainda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
