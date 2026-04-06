export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Responsivo */}
      <div className="border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-6">
        <h2 className="text-2xl font-black uppercase md:text-3xl">
          Visão Geral
        </h2>
        <p className="text-sm font-bold text-zinc-600 md:text-base">
          Controle suas finanças com atitude.
        </p>
      </div>

      {/* Grid de Cards: 1 coluna no mobile, 3 no desktop */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <div className="border-4 border-black bg-green-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
          <p className="text-xs font-black uppercase">Saldo Total</p>
          <p className="text-3xl font-black md:text-4xl">R$ 0,00</p>
        </div>

        <div className="border-4 border-black bg-blue-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
          <p className="text-xs font-black uppercase">Receitas</p>
          <p className="text-3xl font-black md:text-4xl">R$ 0,00</p>
        </div>

        <div className="border-4 border-black bg-red-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
          <p className="text-xs font-black uppercase">Despesas</p>
          <p className="text-3xl font-black md:text-4xl">R$ 0,00</p>
        </div>
      </div>
    </div>
  );
}
