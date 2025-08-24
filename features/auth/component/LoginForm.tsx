import styles from './LoginForm.module.scss';
import React, { useEffect, useState, useContext } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
// import "flag-icons/css/flag-icons.min.css";
import { useLogin } from "../api/use-login";
import { User } from '../types/user';
import { UserContext } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { data, error, refetch } = useLogin();
  const router = useRouter();
  const userContext = useContext(UserContext);
  if (!userContext) throw new Error('UserContext not found');
  const { setUser } = userContext;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    let data = { username: username.replace(/\D/g, ""), password };
    try {
      const result = await refetch();
      setIsLoading(false);
      if (result.data) {
        await new Promise((res) => setTimeout(res, 1200));
        router.push('/dashboard');
      }
    } catch {
      setIsLoading(false);
      await new Promise((res) => setTimeout(res, 1200));
    }
  };
    // Define shouldFetch as needed, for example:
    const shouldFetch = true; // Set this to your actual condition

    useEffect(() => {
    if (data && shouldFetch) {
      toast.success('Logged in successfully');
      router.push('/dashboard');
    }
    setIsLoading(false);
  }, [data, setUser, router, shouldFetch]);

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-header']}>
        <h1>Sign In</h1>
        <p>Please enter your credentials to sign in!</p>
      </div>

      <form onSubmit={handleSubmit} className={styles['login-form']}>
        <div className={styles['login-form-item']}>
          <label className={styles['login-label']} htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            className={styles['login-input']}
            placeholder="9123456789"
            value={username.replace(/\D/g, "")}
            onChange={e => setUsername(e.target.value.replace(/\D/g, ""))}
            required
            dir="ltr"
            autoComplete="username"
            pattern="^9\d{9}$"
            maxLength={10}
          />
        </div>

        <div className={styles['login-form-item']}>
          <label className={styles['login-label']} htmlFor="password">Password</label>
          <div className={styles['login-password-wrapper']}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={styles['login-input']}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              dir="ltr"
              autoComplete="current-password"
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
        </div>

        <a
          href="/auth/forget-password"
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
            href="/auth/sign-up"
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


