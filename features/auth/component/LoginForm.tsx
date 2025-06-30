'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Eye, EyeOff } from 'lucide-react';

import styles from '../styles/LoginForm.module.scss';

// تعریف schema با zod
const loginSchema = z.object({
  username: z.string().min(1, "لطفا نام کاربری را وارد کنید"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

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
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.showPasswordBtn}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
        </div>

        <a href="/forget-password" className={styles.forgetPasswordLink}>Forgot your password?</a>

        <button type="submit" className={styles.submitBtn}>Sign In</button>

        <button
          type="button"
          className={styles.ghostBtn}
          onClick={() => router.push('/auth/sign-up')}
        >
          Don’t have an account? Sign Up
        </button>
      </form>
    </div>
  );
};
