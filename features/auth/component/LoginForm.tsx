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

// Validation schema using Zod
const loginSchema = z.object({
  username: z.string().min(1, "Please enter your username"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useUser();
  const { data, error, refetch } = useLogin(); // test login query (GET)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async () => {
    console.log('[onSubmit] Form submitted');
    setLoading(true);
    localStorage.removeItem('user');
    try {
      console.log('[onSubmit] Calling refetch() to fetch user data');
      await refetch();
    } catch (e) {
      console.log('[onSubmit] Error during refetch:', e);
      // handled in useEffect
    }
  };

  useEffect(() => {
    console.log('[useEffect data] Data changed:', data);
    if (data) {
      console.log('[useEffect data] Setting user and storing in localStorage');
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.removeItem('loggedOut');
      toast.success('Logged in successfully');
      router.push('/dashboard');
    }
    setLoading(false);
  }, [data, setUser, router]);

  useEffect(() => {
    console.log('[useEffect error] Error changed:', error);
    if (error) {
      toast.error(error.message || 'Login error');
      setLoading(false);
    }
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Sign In to Your Account</h1>
        <p>Please enter your username and password to sign in.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formItem}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            {...register('username')}
            className={`${styles.input} ${errors.username ? styles.errorInput : ''}`}
            dir="ltr"
            disabled={loading}
          />
          {errors.username && <p className={styles.errorMessage}>{errors.username.message}</p>}
        </div>

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
              onClick={() => {
                console.log('[TogglePassword] Toggling password visibility');
                setShowPassword(!showPassword);
              }}
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

        <a href="" className={styles.forgetPasswordLink}>Forgot your password?</a>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <span className={styles.spinner} /> : 'Sign In'}
        </button>

        <button
          type="button"
          className={styles.ghostBtn}
          onClick={() => {
            console.log('[SignUp] Navigate to Sign Up page');
            router.push('');
          }}
          disabled={loading}
        >
          Don’t have an account? Sign Up
        </button>
      </form>
    </div>
  );
};
