'use client';

import styles from './AuthPage.module.scss';
import { LoginForm } from '@/features/auth/component/LoginForm';
import { Toaster } from 'sonner';

// Auth page component
const Page = () => {
  return (
    // Main section for authentication UI
    <section className={styles.authSection}>
      {/* App or company title */}
      <h1 className={styles.title}>Decamond</h1>

      {/* Container wrapping the login form */}
      <div className={styles.container}>
        <LoginForm />
      </div>

      {/* Toast notifications container positioned at top-right */}
      <Toaster position="top-right" />
    </section>
  );
};

export default Page;
