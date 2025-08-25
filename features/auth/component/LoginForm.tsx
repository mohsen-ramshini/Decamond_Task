import styles from './LoginForm.module.scss'; // مطمئن شو این فایل وجود دارد و کلاس‌ها درست تعریف شده‌اند
import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useLogin } from "../api/use-login";
import { UserContext } from '@/contexts/UserContext';
import { loginSchema } from '../types/schema';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


const phoneLoginSchema = loginSchema.extend({
  phone: z.string()
    .regex(/^09\d{9}$/, { message: "Phone number must be 11 digits and start with 09" }),
}).omit({ username: true });

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm<z.infer<typeof phoneLoginSchema>>({
    resolver: zodResolver(phoneLoginSchema),
    mode: 'onSubmit',
  });
  const { data, error, isFetching } = useLogin({ enabled: shouldFetch });
  const router = useRouter();
  const userContext = useContext(UserContext);
  if (!userContext) throw new Error('UserContext not found');
  const { setUser } = userContext;

  const onSubmit = async (values: z.infer<typeof phoneLoginSchema>) => {
    setIsLoading(true);
    setShouldFetch(true);
  };
  useEffect(() => {
    if (data && shouldFetch) {
      setUser(data);
      toast.success('Logged in successfully');
      setShouldFetch(false); 
      router.push('/dashboard');
    }
    if (!isFetching) setIsLoading(false);
    if (error && shouldFetch) {
      setError("phone", { message: "Login failed" });
      toast.error('Login failed');
      setShouldFetch(false);
    }
  }, [data, setUser, router, isFetching, shouldFetch, error, setError]);

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-header']}>
        <h1>Sign In</h1>
        <p>Please enter your credentials to sign in!</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles['login-form']}>
        <div className={styles['login-form-item']}>
          <label className={styles['login-label']} htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="text"
            className={styles['login-input'] + (errors.phone ? ' ' + styles['login-error-input'] : '')}
            placeholder="Enter your phone number"
            autoComplete="tel"
            dir="ltr"
            {...register('phone')}
          />
          {errors.phone && (
            <span className={styles['login-error-message']}>
              {errors.phone.message as string}
            </span>
          )}
        </div>

        <div className={styles['login-form-item']}>
          <label className={styles['login-label']} htmlFor="password">Password</label>
          <div className={styles['login-password-wrapper']}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={styles['login-input'] + (errors.password ? ' ' + styles['login-error-input'] : '')}
              placeholder="Enter your password"
              autoComplete="current-password"
              dir="ltr"
              {...register('password')}
            />
            <button
              type="button"
              className={styles['login-show-password-btn']}
              onClick={() => setShowPassword(s => !s)}
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {errors.password && (
            <span className={styles['login-error-message']}>
              {errors.password.message as string}
            </span>
          )}
        </div>

        <a
          href=""
          className={styles['login-forget-password']}
        >
          Forgot password?
        </a>

        <button
          type="submit"
          className={styles['login-submit-btn']}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className={styles['login-spinner']} />
          ) : (
            'Sign In'
          )}
        </button>
        <div className={styles['login-signup-row']}>
          <span>Don’t have an account yet?</span>
          <a
            href=""
            className={styles['login-signup-link']}
            tabIndex={0}
          >
            Sign Up
          </a>
        </div>
      </form>
    </div>
  );
};


