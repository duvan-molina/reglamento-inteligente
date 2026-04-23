import { FileText, Calendar, ExternalLink, Inbox, ShieldCheck } from 'lucide-react';
import DocumentUpload from '../containers/DocumentUpload';

interface DocumentListComponentProps {
  isAdmin: boolean;
  documents: any[] | undefined;
  isLoading: boolean;
  onRefetch: () => void;
}

export default function DocumentListComponent({
  isAdmin,
  documents,
  isLoading,
  onRefetch,
}: DocumentListComponentProps) {
  return (
    <div className="grid h-[calc(100vh-160px)] gap-8 overflow-hidden lg:grid-cols-5">
      <div className="lg:col-span-2 overflow-y-auto pr-2">
        {isAdmin ? (
          <DocumentUpload onSuccess={onRefetch} />
        ) : (
          <div className="card-shadow flex flex-col items-center justify-center rounded-2xl border border-border bg-white p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Acceso Administrativo</h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              La carga de reglamentos está restringida a personal autorizado de la institución.
            </p>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm border-l-4 border-l-brand">
          <h4 className="text-xs font-bold uppercase tracking-widest text-brand">Institución Digital</h4>
          <p className="mt-2 text-xs text-slate-500">EduCloud centraliza los reglamentos para garantizar acceso transparente a toda la comunidad.</p>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden lg:col-span-3">
        <div className="card-shadow flex flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-white">
          <header className="flex items-center justify-between border-b border-border bg-slate-50/50 px-8 py-5">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-slate-400" />
              <h2 className="text-sm font-bold tracking-tight text-slate-900">Repositorio de Documentos</h2>
            </div>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-black uppercase text-brand">
              {documents?.length || 0} ARCHIVOS
            </span>
          </header>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-brand"></div>
              </div>
            ) : documents && documents.length > 0 ? (
              documents.map((doc) => (
                <div key={doc.id} className="group flex items-center justify-between gap-6 p-6 transition-all hover:bg-slate-50/50">
                  <div className="flex items-center gap-5">
                    <div className="rounded-xl bg-slate-100 p-3 text-brand transition-transform group-hover:scale-110">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-bold text-slate-900">{doc.name}</h4>
                      <div className="mt-1 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                        <span className="text-emerald-500">Verficado</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={doc.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-slate-400 shadow-sm transition-all hover:border-brand hover:text-brand hover:shadow-indigo-100"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <Inbox size={48} strokeWidth={1} className="text-slate-200 mb-2" />
                <p className="text-sm font-bold tracking-tight">No hay documentos cargados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
