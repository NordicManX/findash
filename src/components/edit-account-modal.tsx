'use client';

import { useState } from 'react';
import { Pencil, X, AlertTriangle } from 'lucide-react';
import { updateAccount, deleteAccount } from '@/app/dashboard/actions';

// Definindo a "forma" do nosso objeto account para o TypeScript não reclamar
type Account = {
  id: string;
  name: string;
  color: string;
  balance: number;
  type: string;
};

const BANKS = [
  { id: 'nubank', name: 'Nubank', color: '#8A05BE', text: '#FFFFFF' },
  { id: 'bb', name: 'Banco do Brasil', color: '#FCEB00', text: '#000000' },
  { id: 'sicredi', name: 'Sicredi', color: '#008A38', text: '#FFFFFF' },
  { id: 'itau', name: 'Itaú', color: '#EC7000', text: '#FFFFFF' },
  { id: 'inter', name: 'Inter', color: '#FF7A00', text: '#000000' },
  { id: 'bradesco', name: 'Bradesco', color: '#CC092F', text: '#FFFFFF' },
  { id: 'caixa', name: 'Caixa', color: '#005CA9', text: '#FFFFFF' },
  { id: 'santander', name: 'Santander', color: '#EC0000', text: '#FFFFFF' },
  { id: 'c6', name: 'C6 Bank', color: '#242424', text: '#FFFFFF' },
  { id: 'outro', name: 'Outro Banco', color: '#F3F4F6', text: '#000000' },
];

// Usando o tipo Account em vez de 'any'
export function EditAccountModal({ account }: { account: Account }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const initialBank =
    BANKS.find((b) => b.color === account.color) || BANKS[BANKS.length - 1];
  const [selectedBank, setSelectedBank] = useState(initialBank);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      if (selectedBank.id !== 'outro') formData.set('name', selectedBank.name);
      formData.set('color', selectedBank.color);

      await updateAccount(account.id, formData);
      setIsOpen(false);
    } catch (error) {
      // Agora estamos "usando" o erro no console, o ESLint vai ficar feliz
      console.error(error);
      alert('Erro ao atualizar.');
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    setLoading(true);
    try {
      await deleteAccount(account.id);
      setIsOpen(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      // Usando o erro aqui também
      console.error(error);
      alert('Erro ao excluir.');
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    setIsOpen(false);
    setShowDeleteConfirm(false);
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
        <Pencil size={16} strokeWidth={3} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 shadow-black backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div
              className="flex items-center justify-between border-b-4 border-black p-4 transition-colors duration-300"
              style={{
                backgroundColor: showDeleteConfirm
                  ? '#EF4444'
                  : selectedBank.color,
                color: showDeleteConfirm ? '#FFFFFF' : selectedBank.text,
              }}
            >
              <h3 className="flex items-center gap-2 text-xl font-black uppercase">
                {showDeleteConfirm ? (
                  <>
                    <AlertTriangle size={24} strokeWidth={3} /> Atenção!
                  </>
                ) : (
                  'Editar Conta'
                )}
              </h3>
              <button
                onClick={closeModal}
                className="border-2 border-black bg-white p-1 text-black transition-colors hover:bg-red-500 hover:text-white"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {showDeleteConfirm ? (
              <div className="space-y-6 p-6 text-center text-black">
                <p className="text-lg font-bold">
                  Tem certeza que deseja excluir a conta <br />
                  <span className="text-xl font-black text-red-600 uppercase">
                    {account.name}
                  </span>
                  ?
                </p>
                <p className="border-2 border-black bg-yellow-100 p-3 text-sm font-bold text-zinc-600">
                  Esta ação é irreversível e o saldo desta conta deixará de
                  fazer parte do seu Saldo Total.
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
              <form
                onSubmit={handleUpdate}
                className="space-y-5 p-6 text-black"
              >
                <div className="grid grid-cols-2 gap-2">
                  {BANKS.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`border-2 border-black p-2 text-xs font-bold transition-all ${selectedBank.id === bank.id ? 'translate-x-[-2px] translate-y-[-2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-100'}`}
                      style={{
                        backgroundColor:
                          selectedBank.id === bank.id ? bank.color : 'white',
                        color:
                          selectedBank.id === bank.id ? bank.text : 'black',
                      }}
                    >
                      {bank.name}
                    </button>
                  ))}
                </div>

                {selectedBank.id === 'outro' && (
                  <div className="space-y-1">
                    <label className="text-xs font-black text-black uppercase">
                      Nome da Conta
                    </label>
                    <input
                      name="name"
                      type="text"
                      defaultValue={account.name}
                      required
                      className="w-full border-2 border-black px-3 py-2 font-bold transition-all outline-none focus:bg-yellow-100 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase">
                    Saldo Atual (R$)
                  </label>
                  <input
                    name="balance"
                    type="number"
                    step="0.01"
                    defaultValue={account.balance}
                    required
                    className="w-full border-2 border-black px-3 py-2 font-bold transition-all outline-none focus:bg-yellow-100 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

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
