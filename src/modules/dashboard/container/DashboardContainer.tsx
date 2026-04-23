import { useState } from 'react';
import { auth } from '../../../lib/firebase';
import { signOut } from 'firebase/auth';
import { useAuthStore } from '../../auth/store/authStore';
import { useRole } from '../../../hooks/useAuth';
import DashboardComponent from '../components/DashboardComponent';

export default function DashboardContainer() {
  const user = useAuthStore((state) => state.user);
  const { isAdmin } = useRole();
  const [activeTab, setActiveTab] = useState<'search' | 'docs'>('search');

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <DashboardComponent
      user={user}
      isAdmin={isAdmin}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onSignOut={handleSignOut}
    />
  );
}
