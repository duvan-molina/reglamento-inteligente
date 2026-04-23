import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuthStore } from '../modules/auth/store/authStore';
import { UserProfile } from '../types';

export function useAuthInit() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          // If profile doesn't exist in Firestore yet (e.g. first login)
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);
}

export function useRole() {
  const user = useAuthStore((state) => state.user);
  
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';
  
  return {
    role: user?.role,
    isAdmin,
    isUser,
    isAuthenticated: !!user,
  };
}
