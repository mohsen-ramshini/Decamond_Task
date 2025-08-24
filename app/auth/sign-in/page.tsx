'use client';

import styles from './AuthPage.module.scss';
import { LoginForm } from '@/features/auth/component/LoginForm';
import { Toaster } from 'sonner';

// Auth page component
const Page = () => {
  return <LoginForm />;
};

export default Page;
