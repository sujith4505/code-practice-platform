import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Flame, Trophy, Terminal, BarChart2, User, LogOut, Menu, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const links = [
    { name: 'Dashboard', path: '/', icon: BarChart2, show: isAuthenticated },
    { name: 'Problems', path: '/problems', icon: Terminal, show: true },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy, show: true },
    { name: 'Profile', path: '/profile', icon: User, show: isAuthenticated },
    { name: 'Admin', path: '/admin', icon: Shield, show: isAuthenticated && user?.role === 'ADMIN' },
  ];

  return (
    <nav className="glass sticky top-0 z-50 w-full backdrop-blur-md px-6 py-4 shadow-lg border-b border-border/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight hover:opacity-90">
          <div className="bg-primary/25 text-primary p-2 rounded-lg border border-primary/20">
            <Terminal size={22} className="text-primary animate-pulse" />
          </div>
          <span className="gradient-text font-black">Code Pract</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {links.filter(l => l.show).map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1.5 text-sm font-medium transition-all duration-300 ${
                  active 
                    ? 'text-primary' 
                    : 'text-text/70 hover:text-text'
                }`}
              >
                <Icon size={16} />
                <span>{link.name}</span>
                {active && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="h-0.5 bg-primary w-full absolute bottom-[-18px] left-0 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Stats and CTA */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Streak */}
              <div className="flex items-center space-x-1 bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-full border border-amber-500/20 text-xs font-semibold">
                <Flame size={14} className="fill-amber-500" />
                <span>{user?.streak || 0} Day Streak</span>
              </div>

              {/* Score */}
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20 text-xs font-semibold">
                <Trophy size={14} />
                <span>{user?.score || 0} pts</span>
              </div>

              {/* Username & Logout */}
              <span className="text-sm font-semibold text-text/80">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer"
              >
                <LogOut size={12} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-text/75 hover:text-text text-sm font-semibold transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 border border-primary/25 shadow-md shadow-primary/20"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3">
          {isAuthenticated && (
            <div className="flex items-center space-x-2 bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full border border-amber-500/20 text-xs font-semibold">
              <Flame size={12} className="fill-amber-500" />
              <span>{user?.streak || 0}d</span>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-text/80 hover:text-text focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/20 mt-4 overflow-hidden"
          >
            <div className="flex flex-col space-y-3 py-4">
              {links.filter(l => l.show).map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 text-sm font-semibold py-2 px-3 hover:bg-white/5 rounded-lg text-text/80 hover:text-text transition-all duration-200"
                  >
                    <Icon size={16} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              {isAuthenticated ? (
                <div className="border-t border-border/20 pt-3 flex flex-col space-y-3 px-3">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-text/75">{user?.username}</span>
                    <span className="text-primary">{user?.score || 0} pts</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-center space-x-2 w-full bg-danger/10 hover:bg-danger/25 text-danger border border-danger/20 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-border/20 pt-3 flex flex-col space-y-2.5 px-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center border border-border/30 hover:border-border text-text/85 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center bg-primary hover:bg-primary-dark text-white py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md shadow-primary/10"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
