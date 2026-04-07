import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redireciona quem acessar localhost:3000 direto pro seu dashboard!
  redirect('/dashboard');
}
