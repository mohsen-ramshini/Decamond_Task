'use client';

import { useEffect, useState } from 'react';
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
    <section className="w-full min-h-screen flex flex-col items-center justify-center bg-secondary py-8">
      <h1 className="text-5xl font-extrabold text-white drop-shadow-md tracking-wide mb-10">
        Homino Safe
      </h1>
      <div className="w-5/6 lg:w-3/5 flex flex-col justify-center items-center">
        <LoginForm onSubmit={handleSubmit} />
        {loading && <p className="text-white mt-4">در حال ورود...</p>}
        {errorMsg && <p className="text-red-500 mt-4">{errorMsg}</p>}
      </div>
    </section>
  );
};

export default Page;
