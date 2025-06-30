'use client';

import { useEffect, useState } from 'react';
import styles from './AuthPage.module.scss';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/features/auth/api/use-login';
import { LoginForm } from '@/features/auth/component/LoginForm';
import { useUser } from '@/contexts/UserContext';
import { Toaster, toast } from 'sonner';

const Page = () => {
  const router = useRouter();
  const { setUser } = useUser();

  const { data, error, isLoading, refetch } = useLogin();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (values: { username: string; password: string }) => {
    setLoading(true);
    setErrorMsg(null);
    refetch();
  };

  useEffect(() => {
    if (data) {
      setLoading(false);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('ورود با موفقیت انجام شد');
      router.push('/dashboard');
    }
  }, [data, router, setUser]);

  useEffect(() => {
    if (error) {
      setLoading(false);
      setErrorMsg(error.message || 'Login failed');
      toast.error(error.message || 'خطا در ورود');
    }
  }, [error]);

  return (
    <>
      <section className={styles.authSection}>
        <h1 className={styles.title}>Decamond</h1>
        <div className={styles.container}>
          <LoginForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </section>
    </>
  );
};

export default Page;
