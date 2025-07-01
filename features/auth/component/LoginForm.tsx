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

// Define form validation schema using Zod
const loginSchema = z.object({
  username: z.string().min(1, "Please enter your username"),  // username is required
  password: z.string().min(6, "Password must be at least 6 characters"),  // password min length 6
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  // Local state to toggle password visibility and loading status
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useUser();
  
  // Custom hook to fetch user data (simulate login)
  // Using refetch to trigger login request on form submit
  const { data, error, refetch } = useLogin();

  // React Hook Form setup with Zod validation resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Form submission handler
  const onSubmit = async () => {
    console.log('[onSubmit] Form submitted');
    setLoading(true);
    localStorage.removeItem('user'); // Clear any previous user info

    try {
      console.log('[onSubmit] Calling refetch() to fetch user data');
      await refetch();  // Trigger login API call
    } catch (e) {
      console.log('[onSubmit] Error during refetch:', e);
      // Error handled in useEffect below
    }
  };

  // Effect to react on successful data fetch (login success)
  useEffect(() => {
    console.log('[useEffect data] Data changed:', data);
    if (data) {
      console.log('[useEffect data] Setting user and storing in localStorage');
      setUser(data);  // Update global user context
      localStorage.setItem('user', JSON.stringify(data));  // Persist user info locally
      localStorage.removeItem('loggedOut');  // Clear any logged out flag
      toast.success('Logged in successfully');  // Show success notification
      router.push('/dashboard');  // Redirect to dashboard
    }
    setLoading(false);  // Stop loading indicator
  }, [data, setUser, router]);

  // Effect to react on login errors
  useEffect(() => {
    console.log('[useEffect error] Error changed:', error);
    if (error) {
      toast.error(error.message || 'Login error');  // Show error notification
      setLoading(false);  // Stop loading indicator
    }
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Sign In to Your Account</h1>
        <p>Please enter your username and password to sign in.</p>
      </div>

      {/* Login form */}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Username input field */}
        <div className={styles.formItem}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            {...register('username')}
            className={`${styles.input} ${errors.username ? styles.errorInput : ''}`}
            dir="ltr"
            disabled={loading}  // disable input during loading
          />
          {errors.username && <p className={styles.errorMessage}>{errors.username.message}</p>}
        </div>

        {/* Password input with toggle visibility */}
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

        {/* Forgot password link */}
        <a href="" className={styles.forgetPasswordLink}>Forgot your password?</a>

        {/* Submit button with loading state */}
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <span className={styles.spinner} /> : 'Sign In'}
        </button>

        {/* Button to navigate to Sign Up page */}
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
