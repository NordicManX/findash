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
