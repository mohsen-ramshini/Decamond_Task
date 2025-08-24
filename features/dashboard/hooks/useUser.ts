import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/contexts/UserContext';

export function useUser() {
  const userContext = useContext(UserContext);
  const router = useRouter();

  if (!userContext) throw new Error('UserContext not found');
  const { user, setUser } = userContext;

  // اگر کاربر در context نبود، از localStorage بخوان و ذخیره کن
  if (!user) {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
        router.replace('/auth/sign-in');
      }
    } else {
      router.replace('/auth/sign-in');
    }
  }

  return user;
}
