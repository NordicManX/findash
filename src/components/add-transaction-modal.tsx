'use client';

import { useState } from 'react';
import {
  X,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
} from 'lucide-react';
import { createTransaction } from '@/app/dashboard/actions';

type Account = {
  id: string;
  name: string;
  color: string;
  balance: number;
  type: string;
};

export function AddTransactionModal({ accounts }: { accounts: Account[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'expense' | 'income'>('expense');

  // Estado para o nosso novo Alerta Neo-Brutalista
  const [showNoAccountAlert, setShowNoAccountAlert] = useState(false);

  // Estado para controlar a descrição automaticamente
  const [description, setDescription] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set('type', type);

      await createTransaction(formData);

      // Limpa os dados ao fechar
      setIsOpen(false);
      setDescription('');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar a transação.');
    } finally {
      setLoading(false);
    }
  }

  // Se não tem conta, mostra o botão cinza e o NOSSO NOVO MODAL
  if (!accounts || accounts.length === 0) {
    return (
      <>
        <button
          onClick={() => setShowNoAccountAlert(true)}
          className="flex w-full flex-col items-center justify-center gap-1 border-[3px] border-black bg-zinc-300 p-2 text-center text-[9px] leading-tight font-black text-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none sm:flex-row sm:gap-2 sm:border-4 sm:px-4 sm:py-2 sm:text-sm sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <Plus size={16} strokeWidth={3} className="shrink-0 sm:h-5 sm:w-5" />
          <span>Nova Transação</span>
        </button>

        {/* MODAL DE ALERTA NEO-BRUTALISTA */}
        {showNoAccountAlert && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="animate-in zoom-in w-full max-w-sm border-4 border-black bg-white text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] duration-200">
              <div className="flex justify-center border-b-4 border-black bg-[#FCEB00] p-6">
                <AlertTriangle
                  size={56}
                  strokeWidth={3}
                  className="text-black"
                />
              </div>
              <div className="space-y-6 p-6">
                <h3 className="text-2xl font-black tracking-tight text-black uppercase">
                  Ação Bloqueada
                </h3>
                <p className="text-sm font-bold text-zinc-600">
                  Crie pelo menos uma{' '}
                  <span className="border-2 border-black bg-blue-500 px-1 text-white">
                    conta bancária
                  </span>{' '}
                  primeiro para poder registrar suas transações!
                </p>
                <button
                  onClick={() => setShowNoAccountAlert(false)}
                  className="w-full border-4 border-black bg-black py-3 font-black text-white uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                >
                  Entendi
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fluxo normal (se já tem conta bancária)
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full flex-col items-center justify-center gap-1 border-[3px] border-black bg-black p-2 text-center text-[9px] leading-tight font-black text-white uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none sm:flex-row sm:gap-2 sm:border-4 sm:px-4 sm:py-2 sm:text-sm sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <Plus size={16} strokeWidth={3} className="shrink-0 sm:h-5 sm:w-5" />
        <span>Nova Transação</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div
              className={`flex items-center justify-between border-b-4 border-black p-4 transition-colors duration-300 ${
                type === 'income'
                  ? 'bg-green-400 text-black'
                  : 'bg-red-500 text-white'
              }`}
            >
              <h3 className="flex items-center gap-2 text-xl font-black uppercase">
                {type === 'income' ? (
                  <ArrowUpCircle size={24} strokeWidth={3} />
                ) : (
                  <ArrowDownCircle size={24} strokeWidth={3} />
                )}
                Nova Transação
              </h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setDescription('');
                }}
                className="border-2 border-black bg-white p-1 text-black transition-colors hover:bg-black hover:text-white"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setType('expense');
                    setDescription('');
                  }}
                  className={`border-2 border-black py-3 font-black uppercase transition-all ${
                    type === 'expense'
                      ? 'translate-x-[-2px] translate-y-[-2px] bg-red-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('income');
                    setDescription('');
                  }}
                  className={`border-2 border-black py-3 font-black uppercase transition-all ${
                    type === 'income'
                      ? 'translate-x-[-2px] translate-y-[-2px] bg-green-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  Receita
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-black uppercase">
                  Etiqueta / Categoria
                </label>
                <select
                  name="category"
                  required
                  defaultValue=""
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-2 border-black bg-white px-3 py-2 font-bold transition-all outline-none focus:bg-yellow-100 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <option value="" disabled>
                    Selecione uma opção...
                  </option>
                  {type === 'expense' ? (
                    <>
                      <optgroup label="📺 Streaming & Assinaturas">
                        <option value="Netflix">Netflix</option>
                        <option value="Spotify">Spotify</option>
                        <option value="YouTube Premium">YouTube / Music</option>
                        <option value="Disney+">Disney+</option>
                        <option value="HBO Max">HBO Max</option>
                        <option value="Apple TV">Apple TV</option>
                        <option value="Amazon Prime">Amazon Prime</option>
                        <option value="Assinaturas Gerais">
                          Outras Assinaturas
                        </option>
                      </optgroup>
                      <optgroup label="🛒 Essenciais">
                        <option value="Mercado">Mercado</option>
                        <option value="Padaria">Padaria</option>
                        <option value="Aluguel">Aluguel / Condomínio</option>
                        <option value="Água/Luz/Internet">
                          Água / Luz / Internet
                        </option>
                        <option value="Farmácia">Farmácia</option>
                      </optgroup>
                      <optgroup label="🚗 Transporte">
                        <option value="Combustível">Combustível</option>
                        <option value="Uber/99">Uber / 99</option>
                        <option value="Ônibus/Metrô">Transporte Público</option>
                      </optgroup>
                      <optgroup label="🍔 Estilo de Vida">
                        <option value="Ifood/Delivery">iFood / Delivery</option>
                        <option value="Restaurantes/Bares">
                          Restaurantes / Bares
                        </option>
                        <option value="Roupas">Roupas / Acessórios</option>
                      </optgroup>
                      <option value="Outros Gastos">Outros Gastos</option>
                    </>
                  ) : (
                    <>
                      <optgroup label="💰 Entradas">
                        <option value="Salário">Salário</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Investimentos">Rendimentos</option>
                        <option value="Pix Recebido">Pix Recebido</option>
                        <option value="Outras Entradas">Outras Entradas</option>
                      </optgroup>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-black uppercase">
                  Descrição
                </label>
                <input
                  name="description"
                  type="text"
                  placeholder="Ex: Mensalidade, Pão..."
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-2 border-black px-3 py-2 font-bold transition-all outline-none focus:bg-yellow-100 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-black uppercase">
                    Valor (R$)
                  </label>
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                    className="w-full border-2 border-black px-3 py-2 font-bold transition-all outline-none focus:bg-yellow-100 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-black uppercase">
                    Data
                  </label>
                  <input
                    name="date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full border-2 border-black px-3 py-2 font-bold transition-all outline-none focus:bg-yellow-100 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-black uppercase">
                  Conta
                </label>
                <select
                  name="account_id"
                  required
                  className="w-full border-2 border-black bg-white px-3 py-2 font-bold transition-all outline-none focus:bg-yellow-100 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex cursor-pointer items-center gap-3 border-2 border-black bg-zinc-100 p-3 transition-colors hover:bg-yellow-100">
                <input
                  type="checkbox"
                  name="is_recurring"
                  className="h-5 w-5 cursor-pointer border-2 border-black accent-black"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-black uppercase">
                    🔄 Despesa Recorrente
                  </span>
                  <span className="text-[10px] font-bold text-zinc-600 uppercase">
                    Se repete todo mês
                  </span>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className={`mt-4 w-full border-4 border-black py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 ${
                  type === 'income'
                    ? 'bg-green-400 text-black'
                    : 'bg-red-500 text-white'
                }`}
              >
                {loading ? 'Salvando...' : 'Salvar Transação'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
