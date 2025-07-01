'use client';

import styles from './AuthPage.module.scss';
import { LoginForm } from '@/features/auth/component/LoginForm';
import { Toaster } from 'sonner';

const Page = () => {
  return (
    <section className={styles.authSection}>
      <h1 className={styles.title}>Decamond</h1>
      <div className={styles.container}>
        <LoginForm />
      </div>
      <Toaster position="top-right" />
    </section>
  );
};

export default Page;
