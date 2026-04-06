import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se não tiver usuário, chuta de volta pro login (segurança dupla além do middleware)
  if (!user) {
    redirect('/login');
  }

  // Server Action para fazer Logout
  const signOut = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
  };

  return (
    <div className="min-h-screen bg-yellow-400 p-8 font-sans">
      <div className="mx-auto w-full max-w-4xl border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <header className="mb-8 flex items-center justify-between border-b-4 border-black pb-4">
          <h1 className="text-4xl font-black tracking-tighter text-black uppercase">
            FinDash
          </h1>
          <form action={signOut}>
            <button className="border-2 border-black bg-red-500 px-4 py-2 text-sm font-black text-white uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
              Sair
            </button>
          </form>
        </header>

        <div className="space-y-6">
          <div className="border-2 border-black bg-green-400 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-bold text-black">
              Bem-vindo(a) ao seu controle financeiro!
            </h2>
            <p className="mt-1 font-medium text-black/80">
              Você está logado com: {user.email}
            </p>
          </div>

          <p className="text-lg font-bold text-black">
            A infraestrutura está pronta. O próximo passo é construirmos o
            cadastro de contas e transações!
          </p>
        </div>
      </div>
    </div>
  );
}
