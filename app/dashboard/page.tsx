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
  const [checkingUser, setCheckingUser] = useState(true);

useEffect(() => {
  console.log('[useEffect] Checking user in localStorage...');
  const userData = localStorage.getItem('user');
  const loggedOut = localStorage.getItem('loggedOut') === 'true';
  console.log('[useEffect] userData:', userData);
  console.log('[useEffect] loggedOut:', loggedOut);

  if (!userData || loggedOut) {
    console.log('[useEffect] No user data or logged out detected');
    setUser(null);
    setCheckingUser(false);
    return;
  }

  try {
    const parsedUser: User = JSON.parse(userData);
    console.log('[useEffect] Parsed user:', parsedUser);
    setUser(parsedUser);
  } catch (error) {
    console.error('[useEffect] Error parsing userData:', error);
    setUser(null);
  } finally {
    setCheckingUser(false);
  }
}, []);


useEffect(() => {
  console.log('[useEffect] user or checkingUser changed:', { user, checkingUser });

  if (!checkingUser) {
    if (!user) {
      console.log('[useEffect] No user found, redirecting to sign-in');
      toast.error('Please sign in first');
      router.replace('/auth/sign-in');
    } else {
      console.log('[useEffect] User exists, stay on dashboard');
    }
  }
}, [user, checkingUser, router]);

useEffect(() => {
  console.log('[useEffect] Checking user or loggedOut state...');
  if (checkingUser) return; 

  if (!user) {
    console.log('[useEffect] No user found, redirecting to sign-in');
    router.push('/auth/sign-in');
  } else {
    console.log('[useEffect] User exists, stay on dashboard');
  }
}, [user, checkingUser]);

  const handleLogout = () => {
    console.log('[handleLogout] Logging out user');
    localStorage.removeItem('user');
    localStorage.setItem('loggedOut', 'true');
    setUser(null);
    toast.success('Successfully logged out');
    router.replace('/auth/sign-in');
  };

  if (checkingUser) {
    console.log('[Render] Checking user...');
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('[Render] No user to display');
    return null;
  }

  console.log('[Render] Rendering dashboard with user:', user);

  return (
    <>
      <Toaster position="top-right" />
      <section className={styles.dashboard}>
        <div className={styles.card}>
          <img src={user.picture.large} alt="User Avatar" className={styles.avatar} />
          <h1 className={styles.title}>
            Welcome, {user.name.first} {user.name.last}
          </h1>
          <p className={styles.subtitle}>We're glad to have you here!</p>
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
