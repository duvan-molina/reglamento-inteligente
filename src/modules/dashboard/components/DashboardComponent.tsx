import { useState } from 'react';
import {
  FileText,
  Search,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import DocumentListScreen from '../../documents/screens/DocumentListScreen';
import RegulationChatScreen from '../../ai-search/screens/RegulationChatScreen';

interface DashboardComponentProps {
  user: any;
  isAdmin: boolean;
  activeTab: 'search' | 'docs';
  setActiveTab: (tab: 'search' | 'docs') => void;
  onSignOut: () => void;
}

export default function DashboardComponent({
  user,
  isAdmin,
  activeTab,
  setActiveTab,
  onSignOut
}: DashboardComponentProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Sidebar */}
      <aside className="hidden w-[260px] flex-col bg-brand-dark text-slate-200 md:flex">
        <div className="p-8 pb-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand font-black text-white shadow-lg">
              E
            </div>
            <span className="text-xl font-bold tracking-tight text-white">EduCloud AI</span>
          </div>
        </div>

        <nav className="flex-1 px-6">
          <div className="mb-8 overflow-hidden">
            <span className="mb-3 block px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Módulos</span>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('docs')}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${activeTab === 'docs'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
              >
                <FileText size={18} />
                Documentos
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${activeTab === 'search'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
              >
                <Search size={18} />
                Buscador Inteligente
              </button>
            </div>
          </div>


        </nav>

        <div className="mt-auto p-6">
          <button
            onClick={onSignOut}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 py-2.5 text-xs font-bold text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <LogOut size={14} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-8 shadow-sm">
          <div className="text-lg font-bold tracking-tight text-slate-800">
            {activeTab === 'search' ? 'Consulta Inteligente' : 'Gestión de Reglamentos'}
          </div>
          <div className="flex items-center gap-4 relative">
            <div className="hidden text-right sm:block text-xs">
              <p className="font-bold text-slate-900">{user?.email?.split('@')[0]}</p>
              <div className="mt-0.5 inline-block rounded-full border border-emerald-500 bg-emerald-50 px-2.5 py-0.5 text-[9px] font-black uppercase text-emerald-600">
                {user?.role}
              </div>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-border font-bold text-slate-500 border border-slate-200 transition-all hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              {user?.email?.slice(0, 2).toUpperCase()}
            </button>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="absolute right-0 top-12 w-56 rounded-xl bg-white p-2 shadow-xl shadow-slate-200/50 border border-border md:hidden z-50">
                <div className="px-3 py-2 mb-2 border-b border-slate-50">
                  <p className="text-xs font-bold text-slate-800 truncate">{user?.email}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{user?.role}</p>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => { setActiveTab('docs'); setIsMobileMenuOpen(false); }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${activeTab === 'docs' ? 'bg-indigo-50 text-brand' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <FileText size={14} />
                    Documentos
                  </button>
                  <button
                    onClick={() => { setActiveTab('search'); setIsMobileMenuOpen(false); }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${activeTab === 'search' ? 'bg-indigo-50 text-brand' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <Search size={14} />
                    Consulta Inteligente
                  </button>
                </div>
                <div className="mt-2 border-t border-slate-50 pt-2">
                  <button
                    onClick={onSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut size={14} />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl">
            {activeTab === 'search' ? (
              <RegulationChatScreen />
            ) : (
              <DocumentListScreen />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
