import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, query, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import toast from 'react-hot-toast';
import { db, storage } from '../../../lib/firebase';
import { useRole } from '../../../hooks/useAuth';
import { RegulationDocument } from '../../../types';
import DocumentListComponent from '../components/DocumentListComponent';

export default function DocumentListContainer() {
  const { isAdmin } = useRole();
  const { data: documents, isLoading, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const q = query(collection(db, 'documents'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RegulationDocument));
    },
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, storagePath: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este reglamento?')) return;
    
    setDeletingId(id);
    try {
      // 1. Borrar en Storage
      const fileRef = ref(storage, storagePath);
      await deleteObject(fileRef);
      
      // 2. Borrar en Firestore
      await deleteDoc(doc(db, 'documents', id));
      
      toast.success('Reglamento eliminado');
      refetch();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Error al eliminar');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DocumentListComponent
      isAdmin={isAdmin}
      documents={documents}
      isLoading={isLoading}
      onRefetch={refetch}
      onDelete={handleDelete}
      deletingId={deletingId}
    />
  );
}
