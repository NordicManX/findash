import { login, signup } from './actions';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-yellow-400 p-4 font-sans">
      <form className="w-full max-w-sm border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-6 text-center text-4xl font-black tracking-tighter text-black uppercase">
          FinDash
        </h1>

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-black uppercase">Email</label>
            <input
              name="email"
              type="email"
              placeholder="EMAIL@EXEMPLO.COM"
              required
              className="w-full border-2 border-black bg-white px-4 py-3 text-sm font-bold transition-all outline-none focus:bg-yellow-100 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-black uppercase">Senha</label>
            <input
              name="password"
              type="password"
              placeholder="••••••"
              required
              className="w-full border-2 border-black bg-white px-4 py-3 text-sm font-bold transition-all outline-none focus:bg-yellow-100 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            type="submit"
            formAction={login}
            className="w-full border-2 border-black bg-blue-500 px-4 py-3 text-sm font-black text-white uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            Entrar
          </button>

          <button
            type="submit"
            formAction={signup}
            className="w-full border-2 border-black bg-white px-4 py-3 text-sm font-black text-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            Criar Conta
          </button>
        </div>
      </form>
    </div>
  );
}
