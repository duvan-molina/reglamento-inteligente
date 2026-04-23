import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthInit } from './hooks/useAuth';
import { useAuthStore } from './modules/auth/store/authStore';
import LoginScreen from './modules/auth/screens/LoginScreen';
import DashboardScreen from './modules/dashboard/screens/DashboardScreen';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

export default function App() {
  useAuthInit();
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
          <p className="font-mono text-sm uppercase tracking-widest text-slate-500">Iniciando Sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 text-slate-900 selection:bg-slate-900 selection:text-white">
        <Toaster position="top-right" />
        {!user ? <LoginScreen /> : <DashboardScreen />}
      </div>
    </QueryClientProvider>
  );
}
