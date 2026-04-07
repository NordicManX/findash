import { createClient } from '@/lib/supabase/server';
import { AddAccountModal } from '@/components/add-account-modal';
import { EditAccountModal } from '@/components/edit-account-modal';
import { AddTransactionModal } from '@/components/add-transaction-modal';
import { DashboardFilteredView } from '@/components/dashboard-filtered-view';

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

  // Cálculos Globais (Estes não mudam com o filtro!)
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

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
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

      {/* Cards Principais Intocáveis */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <div className="relative top-0 border-4 border-black bg-green-400 p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-top-1 lg:p-6">
          <p className="text-xs font-black text-black uppercase">
            Saldo Atual Líquido
          </p>
          {/* Removemos o truncate, mudamos md para lg, e adicionamos break-words e tracking-tighter */}
          <p className="mt-2 text-2xl font-black tracking-tighter break-words text-black lg:text-4xl">
            {formatCurrency(currentTotalBalance)}
          </p>
        </div>

        <div className="relative top-0 border-4 border-black bg-blue-400 p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-top-1 lg:p-6">
          <p className="text-xs font-black text-black uppercase">
            Total Recebido
          </p>
          <p className="mt-2 text-2xl font-black tracking-tighter break-words text-black lg:text-4xl">
            {formatCurrency(totalIncomes)}
          </p>
        </div>

        <div className="relative top-0 border-4 border-black bg-red-500 p-4 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-top-1 lg:p-6">
          <p className="text-xs font-black uppercase">Total Gasto</p>
          <p className="mt-2 text-2xl font-black tracking-tighter break-words lg:text-4xl">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
      </div>

      {/* Contas Bancárias */}
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

      {/* --- A MÁGICA ENTRA AQUI! --- */}
      <div className="pt-4">
        <DashboardFilteredView
          transactions={(transactions as Transaction[]) || []}
          accounts={accounts || []}
        />
      </div>
    </div>
  );
}
