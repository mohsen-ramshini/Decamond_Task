"use client"
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';
import styles from '../style/Dashboard.module.scss';
import { UserContext } from '@/contexts/UserContext';
import { useUser } from '../hooks/useUser';



const DashboardPage = () => {
  const router = useRouter();
  const userContext = useContext(UserContext);
  if (!userContext) throw new Error('UserContext not found');
  const { logout } = userContext;
  const user = useUser();

  if (!user) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

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
          <button onClick={logout} className={styles.logoutBtn}>
            Log Out
          </button>
        </div>
      </section>
    </>
  );
};

export default DashboardPage;