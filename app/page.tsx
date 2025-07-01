'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import styles from './Dashboard.module.scss';

interface User {
  name: {
    first: string;
    last: string;
  };
  picture: {
    large: string;
  };
}

const DashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // فقط یکبار اجرا میشه برای گرفتن یوزر از localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (!userData) {
      toast.error('Please log in first');
      router.push('/auth/sign-in');
      return;
    }

    try {
      const parsedUser: User = JSON.parse(userData);
      setUser(parsedUser);
    } catch {
      toast.error('Failed to read user data');
      router.push('/auth/sign-in');
    }
  }, [router]);

  // اگر یوزر پاک شد، ریدایرکت می‌کنیم
  useEffect(() => {
    if (!user) {
      // اگر صفحه اول بود و یوزر null بود، ریدایرکت میشه
      // توجه: اگر به logout تابع setUser(null) داده بشه، اینجا اجرا میشه
      router.push('/auth/sign-in');
    }
  }, [user, router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null); // پاک کردن user در state برای رندر مجدد
    toast.success('You have been logged out');
  };

  if (!user) return null; // تا زمانی که یوزر لود نشده چیزی نشون نمیده

  return (
    <>

    </>
  );
};

export default DashboardPage;
