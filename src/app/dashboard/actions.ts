'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createAccount(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Usuário não autenticado');

  const name = formData.get('name') as string;
  const type = formData.get('type') as string;
  const color = formData.get('color') as string; // Pegando a cor
  const balanceInput = formData.get('balance') as string;
  const balance = parseFloat(balanceInput.replace(',', '.')) || 0;

  const { error } = await supabase.from('accounts').insert([
    {
      name,
      type,
      color, // Salvando a cor
      balance,
      user_id: user.id,
    },
  ]);

  if (error) {
    console.error('Erro ao inserir conta:', error.message);
    throw new Error('Falha ao criar a conta.');
  }

  revalidatePath('/dashboard');
}

export async function updateAccount(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get('name') as string;
  const type = formData.get('type') as string;
  const color = formData.get('color') as string;
  const balance =
    parseFloat((formData.get('balance') as string).replace(',', '.')) || 0;

  const { error } = await supabase
    .from('accounts')
    .update({ name, type, color, balance })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard');
}

export async function deleteAccount(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('accounts').delete().eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard');
}

// ... mantenha o que já existe (createAccount, updateAccount, deleteAccount) e cole isso no final:

// Adicione a captura do is_recurring nas duas funções:

export async function createTransaction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Usuário não autenticado');

  const description = formData.get('description') as string;
  const type = formData.get('type') as string;
  const category = formData.get('category') as string;
  const date = formData.get('date') as string;
  const account_id = formData.get('account_id') as string;

  // NOVO: Captura se o checkbox foi marcado (o HTML envia 'on' quando marcado)
  const is_recurring = formData.get('is_recurring') === 'on';

  const amountInput = formData.get('amount') as string;
  const amount = parseFloat(amountInput.replace(',', '.')) || 0;

  const { error } = await supabase.from('transactions').insert([
    {
      user_id: user.id,
      account_id,
      description,
      type,
      category,
      amount,
      date,
      is_recurring, // Salvando no banco
    },
  ]);

  if (error) throw new Error('Falha ao criar a transação.');
  revalidatePath('/dashboard');
}

export async function updateTransaction(id: string, formData: FormData) {
  const supabase = await createClient();

  const description = formData.get('description') as string;
  const type = formData.get('type') as string;
  const category = formData.get('category') as string;
  const date = formData.get('date') as string;
  const account_id = formData.get('account_id') as string;

  // NOVO: Captura se o checkbox foi marcado
  const is_recurring = formData.get('is_recurring') === 'on';

  const amountInput = formData.get('amount') as string;
  const amount = parseFloat(amountInput.replace(',', '.')) || 0;

  const { error } = await supabase
    .from('transactions')
    .update({
      description,
      type,
      category,
      amount,
      date,
      account_id,
      is_recurring,
    }) // Atualizando no banco
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard');
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('transactions').delete().eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard');
}

export async function processRecurrences() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Usuário não autenticado');

  // 1. Pegamos o mês e o ano atual
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // 2. Buscamos TUDO que o usuário marcou como recorrente no banco
  const { data: recurringTransactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_recurring', true);

  if (!recurringTransactions) return;

  // Datas limite para saber se já lançamos algo neste mês
  const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString();
  const endOfMonth = new Date(
    currentYear,
    currentMonth + 1,
    0,
    23,
    59,
    59
  ).toISOString();

  // 3. Vamos olhar transação por transação
  for (const t of recurringTransactions) {
    const tDate = new Date(t.date);

    // Se a transação que ele achou JÁ É deste mês, a gente ignora
    if (
      tDate.getMonth() === currentMonth &&
      tDate.getFullYear() === currentYear
    ) {
      continue;
    }

    // Verifica no banco se JÁ EXISTE uma transação com o mesmo nome neste mês
    // (A trava de segurança para não duplicar boletos!)
    const { data: alreadyExists } = await supabase
      .from('transactions')
      .select('id')
      .eq('user_id', user.id)
      .eq('description', t.description)
      .gte('date', startOfMonth)
      .lte('date', endOfMonth)
      .limit(1)
      .single();

    // 4. Se não existe, a mágica acontece: nós criamos uma nova!
    if (!alreadyExists) {
      // Mantém o mesmo DIA da cobrança original, mas no MÊS atual
      const newDate = new Date(currentYear, currentMonth, tDate.getDate());

      await supabase.from('transactions').insert([
        {
          user_id: user.id,
          account_id: t.account_id,
          description: t.description,
          amount: t.amount,
          type: t.type,
          category: t.category,
          is_recurring: true,
          date: newDate.toISOString().split('T')[0], // Salva no formato YYYY-MM-DD
        },
      ]);
    }
  }

  // Atualiza a tela com os novos dados
  revalidatePath('/dashboard');
}

import { redirect } from 'next/navigation';

export async function signOutUser() {
  const supabase = await createClient(); // Usa o mesmo client que as outras funções já usam
  await supabase.auth.signOut();
  redirect('/login');
}
