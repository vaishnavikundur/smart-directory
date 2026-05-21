import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Zap, ArrowRight, ShieldAlert } from 'lucide-react';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import type { LoginData } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(data);
      setAuth(response.user, response.accessToken);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error || err.response?.data?.message || 
        'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col justify-center items-center px-4 relative overflow-hidden transition-colors duration-300">

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        {/* Brand/Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-full bg-[var(--text-primary)] flex items-center justify-center mb-5">
            <Zap size={22} className="text-[var(--bg-page)] fill-[var(--bg-page)]" />
          </div>
          <h2 className="text-[28px] font-semibold text-[var(--text-primary)] tracking-apple-tight">
            ContactFlow
          </h2>
          <p className="text-[var(--text-secondary)] text-[14px] mt-1 text-center">
            Sign in to your account.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--bg-card)] rounded-apple-lg border border-[var(--border-soft)] p-8 shadow-sm">
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[13px] flex items-start gap-3"
            >
              <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] tracking-wider mb-2">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  {...register('email')}
                  className={`input-field pl-10 w-full ${
                    errors.email
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                      : 'focus:border-[var(--apple-primary-focus)] focus:ring-1 focus:ring-[var(--apple-primary-focus)]'
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-[12px] text-red-500 mt-1.5 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] tracking-wider mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  {...register('password')}
                  className={`input-field pl-10 w-full ${
                    errors.password
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                      : 'focus:border-[var(--apple-primary-focus)] focus:ring-1 focus:ring-[var(--apple-primary-focus)]'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-[12px] text-red-500 mt-1.5 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-[var(--text-primary)] text-[var(--bg-page)] font-medium rounded-apple-pill transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-[14px] text-[var(--text-secondary)] mt-8">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-[var(--link-color)] font-medium hover:underline transition-colors"
          >
            Create one now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
