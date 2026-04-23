import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { askGemini } from '../../../services/geminiService';
import { RegulationDocument } from '../../../types';
import { useAuthStore } from '../../auth/store/authStore';
import RegulationChatComponent from '../components/RegulationChatComponent';

export default function RegulationChatContainer() {
  const user = useAuthStore((state) => state.user);
  const [question, setQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState<{ q: string, a: string } | null>(null);

  // 1. Fetch documents to use as context
  const { data: documents } = useQuery({
    queryKey: ['documents-context'],
    queryFn: async () => {
      const q = query(collection(db, 'documents'), orderBy('createdAt', 'desc'), limit(10));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RegulationDocument));
    },
  });



  // 3. Mutation for asking
  const chatMutation = useMutation({
    mutationFn: async (q: string) => {
      if (!documents || documents.length === 0) {
        throw new Error("No hay reglamentos cargados para consultar.");
      }

      // Combine text from most recent documents (RAG Light)
      const context = documents.map(d => d.extractedText).join('\n\n---\n\n');
      const answer = await askGemini(context, q);

      return answer;
    },
    onSuccess: (answer, q) => {
      setCurrentAnswer({ q, a: answer });
    },
    onError: (error: any) => {
      setCurrentAnswer(null);
      import('react-hot-toast').then(mod => mod.default.error(error.message || 'Error al generar respuesta.'));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || chatMutation.isPending) return;

    // Optimistic UI updates
    setCurrentAnswer({ q: question, a: '' });
    const currentQ = question;
    setQuestion('');

    chatMutation.mutate(currentQ);
  };

  return (
    <RegulationChatComponent
      question={question}
      setQuestion={setQuestion}
      currentAnswer={currentAnswer}
      setCurrentAnswer={setCurrentAnswer}
      documents={documents}
      isPending={chatMutation.isPending}
      onSubmit={handleSubmit}
    />
  );
}
