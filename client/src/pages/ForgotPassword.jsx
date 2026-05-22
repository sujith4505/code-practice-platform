import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Terminal, Mail, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [demoToken, setDemoToken] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.post('/auth/forgot-password', { email: data.email });
      setSuccess(response.data.message);
      // Capture the demo reset token for easy offline walkthrough usage!
      if (response.data.demoResetToken) {
        setDemoToken(response.data.demoResetToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-black tracking-tight text-text">Reset Password</h2>
          <p className="text-text/50 text-sm mt-1 text-center">We will send you instructions to reset your password.</p>
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
          <div className="space-y-4">
            <div className="flex items-start space-x-3 bg-success/10 text-success border border-success/20 p-4 rounded-xl text-sm">
              <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Link Sent</p>
                <p className="text-xs text-success/80 mt-0.5">{success}</p>
              </div>
            </div>
            
            {demoToken && (
              <div className="bg-white/5 border border-border/40 p-4 rounded-xl text-xs space-y-2">
                <p className="font-bold text-text/80">Demo Helper (Offline Mode):</p>
                <p className="text-text/50 leading-relaxed">
                  Since this is a simulated mail service, click below to immediately reset your password with this token:
                </p>
                <Link
                  to={`/reset-password?token=${demoToken}`}
                  className="inline-block bg-primary text-white font-bold px-3 py-1.5 rounded-md hover:bg-primary-dark transition-all mt-1"
                >
                  Proceed to Reset
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-text/60 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/30">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Please provide a valid email' }
                  })}
                  placeholder="john@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-darkbg border border-border/40 focus:border-primary/80 rounded-xl text-text placeholder-text/35 text-sm focus:outline-none transition-all duration-300"
                />
              </div>
              {errors.email && (
                <span className="text-xs text-danger mt-1.5 block font-medium">{errors.email.message}</span>
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
                  <span>Sending instructions...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-text/50">
          <span>Remember your password? </span>
          <Link to="/login" className="font-bold text-primary hover:text-primary-light transition-colors">
            Login Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
