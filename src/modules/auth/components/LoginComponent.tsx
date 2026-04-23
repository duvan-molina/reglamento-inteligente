import { LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { LoginFormData } from '../types.ts';

interface LoginComponentProps {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  errorProp: string;
  loading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export default function LoginComponent({
  register,
  errors,
  errorProp,
  loading,
  onSubmit
}: LoginComponentProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-shadow w-full max-w-md overflow-hidden rounded-2xl border border-border bg-white"
      >
        <div className="bg-brand-dark p-10 text-white">
          <div className="flex flex-col items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand font-black text-2xl shadow-lg ring-4 ring-slate-800">
              E
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">EduCloud AI</h1>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Reglamento Inteligente</p>
            </div>
          </div>
        </div>

        <div className="p-10">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Correo Institucional</label>
              <input
                {...register('email', { required: 'El correo institucional es obligatorio' })}
                type="email"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                placeholder="usuario@colegio.edu"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Contraseña</label>
              <input
                {...register('password', { required: 'La contraseña es obligatoria' })}
                type="password"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {errorProp && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                {errorProp}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 font-medium text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : (
                <><LogIn size={18} /> Acceder al Portal</>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
