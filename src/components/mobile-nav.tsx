import Link from 'next/link';
import { menuItems } from './sidebar';

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full border-t-4 border-black bg-white md:hidden">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-1 items-center justify-center border-r-4 border-black py-4 transition-colors last:border-r-0 hover:bg-yellow-400 active:bg-yellow-500"
        >
          {/* Aumentamos o ícone e removemos o texto para não poluir a tela menor */}
          <item.icon size={26} strokeWidth={3} className="text-black" />
        </Link>
      ))}
    </nav>
  );
}
