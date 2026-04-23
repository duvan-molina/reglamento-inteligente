import { useState, useRef } from 'react';
import { storage, db, auth } from '../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Upload, FileUp, X, CheckCircle } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

// Configurar worker de PDF.js localmente
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface DocumentUploadProps {
  onSuccess: () => void;
}

export default function DocumentUpload({ onSuccess }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'extracting' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(arrayBuffer).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
      setProgress(Math.round((i / pdf.numPages) * 50)); // Extraction is 50% of the work
    }
    return fullText;
  };

  const handleUpload = async () => {
    if (!file || !auth.currentUser) return;

    setStatus('extracting');
    try {
      // 1. Extraer texto
      const text = await extractTextFromPDF(file);

      // 2. Subir archivo a Storage
      setStatus('uploading');
      const storageRef = ref(storage, `documents/${Date.now()}-${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadResult.ref);
      setProgress(100);

      // 3. Guardar en Firestore
      await addDoc(collection(db, 'documents'), {
        name: file.name,
        storagePath: storageRef.fullPath,
        downloadUrl: downloadUrl,
        extractedText: text,
        uploadedBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setStatus('success');
      toast.success('Reglamento procesado correctamente');
      setTimeout(() => {
        setFile(null);
        setStatus('idle');
        onSuccess();
      }, 2000);
    } catch (error: any) {
      console.error('Upload Error:', error);
      setStatus('error');
      toast.error(error.message || 'Error al procesar el reglamento');
    }
  };

  const onFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="card-shadow flex flex-col rounded-2xl border border-border bg-white overflow-hidden">
      <header className="border-b border-border bg-slate-50/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Subir Reglamento (Admin)</h3>
          <span className="text-[9px] font-bold text-brand uppercase">Firebase Storage</span>
        </div>
      </header>

      <div className="p-6">
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 transition-all hover:border-brand hover:bg-indigo-50/30"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept="application/pdf"
              className="hidden"
            />
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-8 ring-slate-50 group-hover:text-brand group-hover:ring-indigo-50/50">
              <Upload size={24} />
            </div>
            <p className="text-xs font-bold text-slate-700">Arrastra el reglamento</p>
            <p className="mt-1 text-[10px] font-medium text-slate-400">Solo archivos .pdf (Máx 10MB)</p>
            <button className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-[10px] font-bold text-slate-500 shadow-sm transition-colors group-hover:border-brand group-hover:text-brand">
              Seleccionar Archivo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-border bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand shadow-sm">
                  <FileUp size={20} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-900">{file.name}</p>
                  <p className="text-[10px] font-mono text-slate-500 uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              {status === 'idle' && (
                <button onClick={removeFile} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X size={18} />
                </button>
              )}
            </div>

            {(status === 'extracting' || status === 'uploading') && (
              <div className="space-y-3 px-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {status === 'extracting' ? 'Extrayendo Datos...' : 'Sincronizando Cloud...'}
                  </span>
                  <span className="text-[10px] font-bold text-brand">{progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-brand shadow-sm shadow-indigo-200"
                  />
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-50 py-3 text-emerald-600 animate-in zoom-in">
                <CheckCircle size={18} />
                <span className="text-xs font-black uppercase tracking-widest">Documento Listo</span>
              </div>
            )}

            {status === 'idle' && (
              <button
                onClick={handleUpload}
                className="w-full rounded-xl bg-brand py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                PROCESAR REGLAMENTO
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
