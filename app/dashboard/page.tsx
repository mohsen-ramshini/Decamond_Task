'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import styles from './Dashboard.module.scss';

// Define User interface to type user data
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

  // Local state to hold user info and loading/checking status
  const [user, setUser] = useState<User | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);

  // On component mount, check for user data in localStorage
  useEffect(() => {
    console.log('[useEffect] Checking user in localStorage...');
    const userData = localStorage.getItem('user');
    const loggedOut = localStorage.getItem('loggedOut') === 'true';
    console.log('[useEffect] userData:', userData);
    console.log('[useEffect] loggedOut:', loggedOut);

    // If no user data or logged out flag is true, clear user state
    if (!userData || loggedOut) {
      console.log('[useEffect] No user data or logged out detected');
      setUser(null);
      setCheckingUser(false);
      return;
    }

    // Try parsing user data and set user state
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

  // Effect to handle redirect if user is not authenticated after checking
  useEffect(() => {
    console.log('[useEffect] user or checkingUser changed:', { user, checkingUser });

    if (!checkingUser) {
      if (!user) {
        console.log('[useEffect] No user found, redirecting to sign-in');
        toast.error('Please sign in first');
        router.replace('/auth/sign-in'); // Replace to prevent back navigation
      } else {
        console.log('[useEffect] User exists, stay on dashboard');
      }
    }
  }, [user, checkingUser, router]);

  // Additional effect to manage redirection — optional safeguard
  useEffect(() => {
    console.log('[useEffect] Checking user or loggedOut state...');
    if (checkingUser) return; // Wait until user checking is complete

    if (!user) {
      console.log('[useEffect] No user found, redirecting to sign-in');
      router.push('/auth/sign-in');
    } else {
      console.log('[useEffect] User exists, stay on dashboard');
    }
  }, [user, checkingUser]);

  // Logout handler to clear user data and redirect
  const handleLogout = () => {
    console.log('[handleLogout] Logging out user');
    localStorage.removeItem('user');
    localStorage.setItem('loggedOut', 'true'); // Mark user as logged out
    setUser(null);
    toast.success('Successfully logged out');
    router.replace('/auth/sign-in');
  };

  // While checking user info, show loading indicator
  if (checkingUser) {
    console.log('[Render] Checking user...');
    return <div>Loading...</div>;
  }

  // If no user data available, render nothing (redirect handled in effects)
  if (!user) {
    console.log('[Render] No user to display');
    return null;
  }

  // Render dashboard with user info
  console.log('[Render] Rendering dashboard with user:', user);

  return (
    <>
      {/* Notification container */}
      <Toaster position="top-right" />

      <section className={styles.dashboard}>
        <div className={styles.card}>
          {/* User avatar */}
          <img src={user.picture.large} alt="User Avatar" className={styles.avatar} />

          {/* Welcome message with user name */}
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
