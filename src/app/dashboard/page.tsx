import { createClient } from '@/lib/supabase/server';
import { AddAccountModal } from '@/components/add-account-modal';
import { EditAccountModal } from '@/components/edit-account-modal';

// Função auxiliar para formatar dinheiro no padrão brasileiro
function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Busca as contas do usuário logado direto do Supabase
  const { data: accounts, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar contas:', error);
  }

  // 2. Calcula o saldo total somando o balance de todas as contas
  const totalBalance =
    accounts?.reduce((acc, account) => acc + Number(account.balance), 0) || 0;

  // (Mock) Por enquanto, receitas e despesas estão zeradas
  const totalIncomes = 0;
  const totalExpenses = 0;

  return (
    <div className="space-y-8">
      {/* Header Responsivo com o Botão */}
      <div className="flex flex-col justify-between gap-4 border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:flex-row sm:items-center md:p-6">
        <div>
          <h2 className="text-2xl font-black text-black uppercase md:text-3xl">
            Visão Geral
          </h2>
          <p className="text-sm font-bold text-zinc-600 md:text-base">
            Controle suas finanças com atitude.
          </p>
        </div>

        <AddAccountModal />
      </div>

      {/* Grid de Cards Principais */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <div className="border-4 border-black bg-green-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
          <p className="text-xs font-black text-black uppercase">Saldo Total</p>
          <p className="mt-2 truncate text-3xl font-black text-black md:text-4xl">
            {formatCurrency(totalBalance)}
          </p>
        </div>

        <div className="border-4 border-black bg-blue-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
          <p className="text-xs font-black text-black uppercase">
            Receitas (Mês)
          </p>
          <p className="mt-2 truncate text-3xl font-black text-black md:text-4xl">
            {formatCurrency(totalIncomes)}
          </p>
        </div>

        <div className="border-4 border-black bg-red-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
          <p className="text-xs font-black text-black uppercase">
            Despesas (Mês)
          </p>
          <p className="mt-2 truncate text-3xl font-black text-black md:text-4xl">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
      </div>

      {/* Seção de Contas Bancárias */}
      <div className="space-y-4 pt-4">
        <h3 className="inline-block border-b-4 border-black pb-2 text-xl font-black text-black uppercase">
          Minhas Contas
        </h3>

        {accounts && accounts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex h-32 flex-col justify-between border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1"
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

                  {/* Botão de Edição da Conta */}
                  <div className="flex items-center gap-1">
                    <EditAccountModal account={account} />
                  </div>
                </div>
                <p className="truncate text-xl font-black">
                  {formatCurrency(account.balance)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-4 border-dashed border-black bg-white p-8 text-center">
            <p className="font-bold text-zinc-500 uppercase">
              Nenhuma conta cadastrada ainda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
