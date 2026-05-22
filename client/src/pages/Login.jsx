import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Terminal, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const navigate = useNavigate();
  const [showError, setShowError] = useState(true);

  const onSubmit = async (data) => {
    try {
      clearError();
      await login(data.identifier, data.password);
      navigate('/');
    } catch (e) {
      setShowError(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-darkcard border border-border/40 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        {/* Top Glow decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full" />

        {/* Heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 text-primary p-3.5 rounded-2xl border border-primary/20 mb-3">
            <Terminal size={28} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-text">Welcome Back</h2>
          <p className="text-text/50 text-sm mt-1 text-center">Practice. Solve. Get Interview Ready.</p>
        </div>

        {/* Error Notification */}
        {error && showError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-start space-x-3 bg-danger/10 text-danger border border-danger/20 p-4 rounded-xl mb-6 text-sm"
          >
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Login Error</p>
              <p className="text-xs text-danger/80 mt-0.5">{error}</p>
            </div>
            <button onClick={() => setShowError(false)} className="text-xs font-bold hover:underline cursor-pointer">Dismiss</button>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-text/60 text-xs font-semibold uppercase tracking-wider mb-2">Username or Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/30">
                <Mail size={18} />
              </div>
              <input
                type="text"
                {...register('identifier', { required: 'Username or Email is required' })}
                placeholder="enter email or username"
                className="w-full pl-11 pr-4 py-3 bg-darkbg border border-border/40 focus:border-primary/80 rounded-xl text-text placeholder-text/35 text-sm focus:outline-none transition-all duration-300"
              />
            </div>
            {errors.identifier && (
              <span className="text-xs text-danger mt-1.5 block font-medium">{errors.identifier.message}</span>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-text/60 text-xs font-semibold uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" onClick={clearError} className="text-xs font-semibold text-primary hover:text-primary-light transition-colors">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/30">
                <Lock size={18} />
              </div>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-darkbg border border-border/40 focus:border-primary/80 rounded-xl text-text placeholder-text/35 text-sm focus:outline-none transition-all duration-300"
              />
            </div>
            {errors.password && (
              <span className="text-xs text-danger mt-1.5 block font-medium">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-text/50">
          <span>Don't have an account? </span>
          <Link to="/register" onClick={clearError} className="font-bold text-primary hover:text-primary-light transition-colors">
            Register Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
