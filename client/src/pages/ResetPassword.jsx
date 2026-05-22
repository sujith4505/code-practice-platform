import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Terminal, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const tokenParam = searchParams.get('token') || '';

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/reset-password', {
        resetToken: data.resetToken,
        newPassword: data.newPassword
      });
      setSuccess('Your password has been successfully reset. Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const passwordVal = watch('newPassword');

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
          <h2 className="text-2xl font-black tracking-tight text-text">Choose New Password</h2>
          <p className="text-text/50 text-sm mt-1 text-center">Set your new password to restore account access.</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-start space-x-3 bg-danger/10 text-danger border border-danger/20 p-4 rounded-xl mb-6 text-sm">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Reset Failed</p>
              <p className="text-xs text-danger/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Success Notification */}
        {success && (
          <div className="flex items-start space-x-3 bg-success/10 text-success border border-success/20 p-4 rounded-xl text-sm mb-6">
            <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Success</p>
              <p className="text-xs text-success/80 mt-0.5">{success}</p>
            </div>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-text/60 text-xs font-semibold uppercase tracking-wider mb-2">Reset Token</label>
              <input
                type="text"
                defaultValue={tokenParam}
                {...register('resetToken', { required: 'Reset token is required' })}
                placeholder="Paste token here if not automatically filled"
                className="w-full px-4 py-3 bg-darkbg border border-border/40 focus:border-primary/80 rounded-xl text-text placeholder-text/35 text-xs focus:outline-none transition-all duration-300"
              />
              {errors.resetToken && (
                <span className="text-xs text-danger mt-1 block font-medium">{errors.resetToken.message}</span>
              )}
            </div>

            <div>
              <label className="block text-text/60 text-xs font-semibold uppercase tracking-wider mb-2">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/30">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  {...register('newPassword', { 
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-darkbg border border-border/40 focus:border-primary/80 rounded-xl text-text placeholder-text/35 text-sm focus:outline-none transition-all duration-300"
                />
              </div>
              {errors.newPassword && (
                <span className="text-xs text-danger mt-1 block font-medium">{errors.newPassword.message}</span>
              )}
            </div>

            <div>
              <label className="block text-text/60 text-xs font-semibold uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/30">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  {...register('confirmPassword', { 
                    required: 'Confirm password is required',
                    validate: val => val === passwordVal || 'Passwords do not match'
                  })}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-darkbg border border-border/40 focus:border-primary/80 rounded-xl text-text placeholder-text/35 text-sm focus:outline-none transition-all duration-300"
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-xs text-danger mt-1 block font-medium">{errors.confirmPassword.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving Password...</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-text/50">
          <Link to="/login" className="font-bold text-primary hover:text-primary-light transition-colors">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
