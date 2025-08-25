import type { ReactNode } from 'react';
import styles from './AuthLayout.module.scss';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles['auth-layout']}>
      <div className={styles['auth-logo-mobile']}>
      </div>
      <div className={styles['auth-form-side']}>
        {children}
      </div>
      <div className={styles['auth-video-side']}>
        <video
          className={styles['auth-video-bg']}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/video/bg-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className={styles['auth-video-overlay']} />
      </div>
    </div>
  );
}