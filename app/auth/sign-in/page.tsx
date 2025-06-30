'use client';

import { useEffect, useState } from 'react';
import styles from './AuthPage.module.scss';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/features/auth/api/use-login';
import { LoginForm } from '@/features/auth/component/LoginForm';
import { useUser } from '@/contexts/UserContext';

const Page = () => {
  const router = useRouter();
  const { setUser } = useUser();

  const { data, error, isLoading, refetch } = useLogin();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (values: { username: string; password: string }) => {
    setLoading(true);
    setErrorMsg(null);
    // اینجا refetch رو می‌زنیم که دوباره درخواست ارسال بشه
    refetch();
  };

  useEffect(() => {
    if (data) {
      setLoading(false);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      router.push('/dashboard');
    }
  }, [data, router, setUser]);

  useEffect(() => {
    if (error) {
      setLoading(false);
      setErrorMsg(error.message || 'Login failed');
    }
  }, [error]);

return (
  <section className={styles.authSection}>
    <h1 className={styles.title}>Homino Safe</h1>
    <div className={styles.container}>
      <LoginForm onSubmit={handleSubmit} />
      {loading && <p className={`${styles.statusMessage} ${styles.loadingText}`}>در حال ورود...</p>}
      {errorMsg && <p className={`${styles.statusMessage} ${styles.errorText}`}>{errorMsg}</p>}
    </div>
  </section>
);
};

export default Page;
