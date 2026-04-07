'use client';

import { useState } from 'react';
import { Pencil, X, AlertTriangle } from 'lucide-react';
import { updateTransaction, deleteTransaction } from '@/app/dashboard/actions';

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  account_id: string;
  is_recurring?: boolean;
};

type Account = {
  id: string;
  name: string;
  color: string;
  balance: number;
  type: string;
};

export function EditTransactionModal({
  transaction,
  accounts,
}: {
  transaction: Transaction;
  accounts: Account[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [type, setType] = useState<'expense' | 'income'>(transaction.type);

  // NOVO: Inicializa com a descrição que já estava salva no banco
  const [description, setDescription] = useState(transaction.description);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set('type', type);

      await updateTransaction(transaction.id, formData);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar a transação.');
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    setLoading(true);
    try {
      await deleteTransaction(transaction.id);
      setIsOpen(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir.');
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    setIsOpen(false);
    setShowDeleteConfirm(false);
    // Reseta a descrição pro original se o cara fechar sem salvar
    setDescription(transaction.description);
  }

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="rounded p-1 transition-colors hover:bg-black/10"
      >
        <Pencil size={16} strokeWidth={3} className="text-black" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 shadow-black backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div
              className={`flex items-center justify-between border-b-4 border-black p-4 transition-colors duration-300 ${
                showDeleteConfirm
                  ? 'bg-red-500 text-white'
                  : type === 'income'
                    ? 'bg-green-400 text-black'
                    : 'bg-red-500 text-white'
              }`}
            >
              <h3 className="flex items-center gap-2 text-xl font-black uppercase">
                {showDeleteConfirm ? (
                  <>
                    <AlertTriangle size={24} strokeWidth={3} /> Atenção!
                  </>
                ) : (
                  'Editar Transação'
                )}
              </h3>
              <button
                onClick={closeModal}
                className="border-2 border-black bg-white p-1 text-black transition-colors hover:bg-black hover:text-white"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {showDeleteConfirm ? (
              <div className="space-y-6 p-6 text-center text-black">
                <p className="text-lg font-bold">
                  Tem certeza que deseja excluir <br />
                  <span className="text-xl font-black text-red-600 uppercase">
                    {transaction.description}
                  </span>
                  ?
                </p>
                <p className="border-2 border-black bg-yellow-100 p-3 text-sm font-bold text-zinc-600">
                  O valor de R$ {Number(transaction.amount).toFixed(2)} será
                  recalculado do seu saldo total e da conta vinculada.
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 border-2 border-black bg-white py-3 font-black text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-gray-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={confirmDelete}
                    className="flex-1 border-2 border-black bg-red-500 py-3 font-black text-white uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-red-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                  >
                    {loading ? 'Excluindo...' : 'Sim, Excluir'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
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
                    onClick={() => setType('income')}
                    className={`border-2 border-black py-3 font-black uppercase transition-all ${
                      type === 'income'
                        ? 'translate-x-[-2px] translate-y-[-2px] bg-green-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    Receita
                  </button>
                </div>

                {/* Select de Categoria primeiro, definindo a Descrição no onChange */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-black uppercase">
                    Etiqueta / Categoria
                  </label>
                  <select
                    name="category"
                    required
                    defaultValue={transaction.category}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border-2 border-black bg-white px-3 py-2 font-bold transition-all outline-none focus:bg-yellow-100 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {type === 'expense' ? (
                      <>
                        <optgroup label="📺 Streaming & Assinaturas">
                          <option value="Netflix">Netflix</option>
                          <option value="Spotify">Spotify</option>
                          <option value="YouTube Premium">
                            YouTube / Music
                          </option>
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
                          <option value="Ônibus/Metrô">
                            Transporte Público
                          </option>
                        </optgroup>
                        <optgroup label="🍔 Estilo de Vida">
                          <option value="Ifood/Delivery">
                            iFood / Delivery
                          </option>
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
                          <option value="Outras Entradas">
                            Outras Entradas
                          </option>
                        </optgroup>
                      </>
                    )}
                  </select>
                </div>

                {/* O input de Descrição que agora reage à Categoria */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-black uppercase">
                    Descrição
                  </label>
                  <input
                    name="description"
                    type="text"
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
                      defaultValue={Number(transaction.amount).toFixed(2)}
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
                      defaultValue={
                        new Date(transaction.date).toISOString().split('T')[0]
                      }
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
                    defaultValue={transaction.account_id}
                    className="w-full border-2 border-black bg-white px-3 py-2 font-bold transition-all outline-none focus:bg-yellow-100 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* --- NOVO CHECKBOX DE RECORRÊNCIA AQUI --- */}
                <label className="flex cursor-pointer items-center gap-3 border-2 border-black bg-zinc-100 p-3 transition-colors hover:bg-yellow-100">
                  <input
                    type="checkbox"
                    name="is_recurring"
                    defaultChecked={transaction.is_recurring}
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
                {/* ----------------------------------------- */}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 border-2 border-black bg-white py-3 font-black text-red-600 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-red-50 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                  >
                    Excluir
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] border-2 border-black bg-green-400 py-3 font-black text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50"
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
