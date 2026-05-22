import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, Zap, ArrowRight, ShieldAlert } from 'lucide-react';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import type { RegisterData } from '@/types';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(data);
      setAuth(response.user, response.accessToken);
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.error || err.response?.data?.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-resend-canvas flex flex-col justify-center items-center px-4 relative overflow-hidden transition-colors duration-300">

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        {/* Brand/Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-resend-full bg-resend-ink flex items-center justify-center mb-5">
            <Zap size={22} className="text-resend-canvas fill-resend-canvas" />
          </div>
          <h2 className="text-[24px] font-medium text-resend-ink tracking-resend-tight font-display">
            SMART DIRECTORY
          </h2>
          <p className="text-resend-charcoal text-[13px] mt-2 text-center font-mono">
            Create your account to get started.
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-resend-surface-card rounded-resend-lg border border-resend-hairline p-8 shadow-2xl">

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-resend-md bg-red-500/10 border border-red-500/20 text-red-500 text-[13px] flex items-start gap-3 font-mono"
            >
              <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label className="block text-[12px] font-medium text-resend-charcoal uppercase tracking-widest mb-2">
                FULL NAME
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-resend-ash">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  {...register('name')}
                  className={`input-field pl-10 w-full font-mono text-[13px] ${
                    errors.name
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                      : ''
                  }`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-[12px] text-red-500 mt-1.5 font-medium font-mono">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[12px] font-medium text-resend-charcoal uppercase tracking-widest mb-2">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-resend-ash">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  {...register('email')}
                  className={`input-field pl-10 w-full font-mono text-[13px] ${
                    errors.email
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                      : ''
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-[12px] text-red-500 mt-1.5 font-medium font-mono">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[12px] font-medium text-resend-charcoal uppercase tracking-widest mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-resend-ash">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  {...register('password')}
                  className={`input-field pl-10 w-full font-mono text-[13px] ${
                    errors.password
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
                      : ''
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-[12px] text-red-500 mt-1.5 font-medium font-mono">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-[13px] text-resend-ash mt-8 font-mono">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-resend-ink font-medium hover:underline transition-colors"
          >
            Sign in instead
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
