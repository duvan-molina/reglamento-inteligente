import { Send, Bot, Sparkles, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RegulationDocument } from '../../../types';

interface RegulationChatComponentProps {
  question: string;
  setQuestion: (val: string) => void;
  currentAnswer: { q: string, a: string } | null;
  setCurrentAnswer: (ans: { q: string, a: string } | null) => void;
  documents: RegulationDocument[] | undefined;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RegulationChatComponent({
  question,
  setQuestion,
  currentAnswer,
  setCurrentAnswer,
  documents,
  isPending,
  onSubmit,
}: RegulationChatComponentProps) {
  return (
    <div className="grid h-[calc(100vh-160px)] gap-8 lg:grid-cols-4">
      {/* Left column: Documents Info */}
      <aside className="hidden lg:flex lg:col-span-1 flex-col gap-6 overflow-hidden">
        {/* Documentos */}
        <div className="card-shadow flex flex-1 flex-col rounded-2xl border border-border bg-white overflow-hidden">
          <div className="border-b border-slate-50 bg-slate-50 px-5 py-4">
            <div className="flex items-center gap-2 text-slate-800">
              <Sparkles size={16} className="text-slate-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest">Documentos Base</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {documents && documents.length > 0 ? documents.map((doc, i) => (
              <div
                key={doc.id || i}
                className="w-full text-left group"
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 rounded bg-brand p-1 text-white opacity-80">
                    <Bot size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-600 transition-colors group-hover:text-brand">
                      {doc.name}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {new Date(doc.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )) : <p className="text-[10px] text-slate-400 italic">No hay documentos cargados.</p>}
          </div>
        </div>

      </aside>

      {/* Right column: Chat Interface */}
      <div className="lg:col-span-3 flex flex-col overflow-hidden">
        <div className="card-shadow flex flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-white">
          <header className="flex items-center justify-between border-b border-border bg-white px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-indigo-100">
                <Bot size={22} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">EduCloud AI Assistant</h2>
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm animate-pulse"></span>
                  RAG ENGINE ACTIVE
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 uppercase">Gemini 3 Flash</span>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8 space-y-6 scrollbar-hide">
            <AnimatePresence mode="wait">
              {currentAnswer ? (
                <motion.div
                  key="answer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-none bg-brand p-4 text-white shadow-lg shadow-indigo-100">
                      <p className="text-sm leading-relaxed">{currentAnswer.q}</p>
                    </div>
                  </div>


                  {!isPending && currentAnswer.a && (
                    <div className="flex gap-4">
                      <div className="flex-1 max-w-[85%] rounded-2xl rounded-tl-none border border-border bg-white p-5 shadow-sm">
                        <div className="prose text-slate-700">
                          {currentAnswer.a}
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
                          <button
                            onClick={() => setCurrentAnswer(null)}
                            className="text-[10px] font-bold uppercase tracking-widest text-brand transition-colors hover:text-brand-dark"
                          >
                            Nueva Consulta →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-full flex-col items-center justify-center py-20"
                >
                  <div className="relative mb-6">
                    <div className="absolute -inset-4 rounded-full bg-indigo-50 animate-ping opacity-20"></div>
                    <MessageCircle size={80} strokeWidth={1} className="relative text-slate-200" />
                  </div>
                  <p className="text-xl font-bold tracking-tight text-slate-400">¿En qué puedo ayudarte hoy?</p>
                  <p className="mt-2 text-sm text-slate-400">Haz una pregunta sobre el reglamento escolar.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {isPending && (
              <div className="flex gap-4">
                <div className="flex-1 max-w-[40%] animate-pulse rounded-2xl rounded-tl-none border border-border bg-white p-6">
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-full"></div>
                    <div className="h-3 bg-slate-100 rounded w-4/5"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t border-border bg-white p-6 pt-4">
            <div className="flex gap-3">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Pregunta sobre convivencia, ausencias, uniforme..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-6 py-4 text-sm transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 placeholder:text-slate-400"
                disabled={isPending || !documents?.length}
              />
              <button
                type="submit"
                disabled={!question.trim() || isPending || !documents?.length}
                className="flex items-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                CONSULTAR
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
