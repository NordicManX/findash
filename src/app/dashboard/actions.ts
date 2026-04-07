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
