import { useQuery } from '@tanstack/react-query';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
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

  return (
    <DocumentListComponent
      isAdmin={isAdmin}
      documents={documents}
      isLoading={isLoading}
      onRefetch={refetch}
    />
  );
}
