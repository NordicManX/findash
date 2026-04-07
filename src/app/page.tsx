import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redireciona quem acessar a raiz do site direto para o login!
  redirect('/login');
}
