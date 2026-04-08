'use client';

import { useState } from 'react';
import { X, Plus, Building } from 'lucide-react';
import { createAccount } from '@/app/dashboard/actions';

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

export function AddAccountModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState(BANKS[0]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    console.log('🚀 1. Botão clicado! Iniciando salvamento...');

    try {
      const formData = new FormData(e.currentTarget);

      if (selectedBank.id !== 'outro') {
        formData.set('name', selectedBank.name);
      }
      formData.set('color', selectedBank.color);

      console.log('📦 2. Dados prontos para envio:', {
        name: formData.get('name'),
        type: formData.get('type'),
        balance: formData.get('balance'),
        color: formData.get('color'),
      });

      await createAccount(formData);

      console.log('✅ 3. Conta salva com sucesso no Supabase!');
      setIsOpen(false);
      setSelectedBank(BANKS[0]); // Reseta para o primeiro banco
    } catch (error) {
      console.error('❌ ERRO AO SALVAR:', error);
      alert(
        "Erro ao salvar a conta. Verifique o console ou confira se a coluna 'color' foi criada no Supabase."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full flex-col items-center justify-center gap-1 border-[3px] border-black bg-blue-500 p-2 text-center text-[9px] leading-tight font-black text-white uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none sm:flex-row sm:gap-2 sm:border-4 sm:px-4 sm:py-2 sm:text-sm sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <Plus size={16} strokeWidth={3} className="shrink-0 sm:h-5 sm:w-5" />
        <span>Nova Conta</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div
              className="flex items-center justify-between border-b-4 border-black p-4 transition-colors duration-300"
              style={{
                backgroundColor: selectedBank.color,
                color: selectedBank.text,
              }}
            >
              <h3 className="flex items-center gap-2 text-xl font-black uppercase">
                <Building size={24} strokeWidth={3} />
                {selectedBank.name}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="border-2 border-black bg-white p-1 text-black transition-colors hover:bg-red-500 hover:text-white"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-black uppercase">
                  Selecione a Instituição
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {BANKS.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`border-2 border-black px-2 py-2 text-xs font-bold transition-all ${
                        selectedBank.id === bank.id
                          ? 'translate-x-[-2px] translate-y-[-2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-white hover:bg-gray-100'
                      }`}
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
              </div>

              {selectedBank.id === 'outro' && (
                <div className="space-y-1">
                  <label className="text-xs font-black text-black uppercase">
                    Nome da Conta (Personalizado)
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Ex: Carteira de Cripto..."
                    required
                    className="w-full border-2 border-black px-3 py-2 font-bold transition-all outline-none focus:bg-yellow-100 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-black text-black uppercase">
                  Tipo de Conta
                </label>
                <select
                  name="type"
                  required
                  defaultValue="Conta Corrente"
                  className="w-full border-2 border-black bg-white px-3 py-2 font-bold transition-all outline-none focus:bg-yellow-100 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <option value="Conta Corrente">Conta Corrente</option>
                  <option value="Conta Poupança">Conta Poupança</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Investimentos">Investimentos</option>
                  <option value="Dinheiro em Espécie">
                    Dinheiro em Espécie
                  </option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-black uppercase">
                  Saldo Inicial (R$)
                </label>
                <input
                  name="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  className="w-full border-2 border-black px-3 py-2 font-bold transition-all outline-none focus:bg-yellow-100 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
                <p className="pt-1 text-[10px] leading-tight font-bold text-zinc-500">
                  Para cartões de crédito, o saldo inicial deve ser 0 (ou o
                  valor negativo da fatura já aberta).
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full border-2 border-black bg-green-400 py-3 font-black text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar Conta'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
