import type { ReactNode } from 'react';
import styles from './AuthLayout.module.scss';

export default function AuthLayout({ children }: { children: ReactNode }) {
  // You can add a toggle or use prefers-color-scheme, here we just add .dark class for demo
  // document.body.classList.add('dark'); // Uncomment to force dark mode
  return (
    <div className={styles['auth-layout']}>
      <div className={styles['auth-logo-mobile']}>
        {/* لوگو یا آیکون موبایل اینجا قرار می‌گیرد */}
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