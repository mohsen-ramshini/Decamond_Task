'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/features/auth/api/use-login';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

import { Eye, EyeOff } from 'lucide-react';
import styles from '../styles/LoginForm.module.scss';

// Define validation schema
const loginSchema = z.object({
  countryCode: z.string().min(1, 'Country code is required'),
  phone: z.string().regex(/^9\d{9}$/, 'Phone must be 10 digits and start with 9'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false); // کنترل اجرای refetch

  const router = useRouter();
  const { setUser } = useUser();
  const { data, error, refetch } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      countryCode: '+98',
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    localStorage.removeItem('user');
    setShouldFetch(true); // اجازه اجرای refetch داده شود
  };

  // وقتی shouldFetch به true تغییر کرد، refetch اجرا شود
  useEffect(() => {
    if (shouldFetch) {
      refetch();
      setShouldFetch(false);
    }
  }, [shouldFetch, refetch]);

  // پردازش داده موفق
  useEffect(() => {
    if (data && shouldFetch) {
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.removeItem('loggedOut');
      toast.success('Logged in successfully');
      router.push('/dashboard');
    }
    setLoading(false);
  }, [data, setUser, router,shouldFetch]);

  // نمایش خطا
  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Login error');
      setLoading(false);
    }
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Sign In to Your Account</h1>
        <p>Please enter your phone number and password to sign in.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Country code dropdown + phone number */}
        <div className={styles.formItem}>
          <label htmlFor="phone" className={styles.label}>Phone Number</label>
          <div className={styles.phoneWrapper}>
            <select
              {...register('countryCode')}
              className={styles.countryCodeSelect}
              disabled={loading}
            >
              <option value="+98">🇮🇷 +98</option>
            </select>
            <input
              id="phone"
              type="tel"
              placeholder="9123456789"
              {...register('phone')}
              className={`${styles.input} ${errors.phone ? styles.errorInput : ''}`}
              dir="ltr"
              disabled={loading}
            />
          </div>
          {errors.phone && <p className={styles.errorMessage}>{errors.phone.message}</p>}
        </div>

        {/* Password */}
        <div className={styles.formItem}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password')}
              className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
              dir="ltr"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.showPasswordBtn}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
        </div>

        {/* Actions */}
        <a href="" className={styles.forgetPasswordLink}>Forgot your password?</a>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <span className={styles.spinner} /> : 'Sign In'}
        </button>

        <button
          type="button"
          className={styles.ghostBtn}
          onClick={() => router.push('/signup')}
          disabled={loading}
        >
          Don’t have an account? Sign Up
        </button>
      </form>
    </div>
  );
};
