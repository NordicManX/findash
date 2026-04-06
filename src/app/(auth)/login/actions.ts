'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect('/login?error=true');
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  console.log('🚀 Iniciando tentativa de cadastro...');
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('📧 Email capturado no formulário:', email);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('❌ ERRO DO SUPABASE:', error.message);
    redirect('/login?error=true');
  }

  console.log('✅ Usuário criado com sucesso no banco!', data);
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}
