import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import BadgeGrid from '../components/BadgeGrid';
import {
  User, Trophy, Flame, CheckCircle, Percent, Clock,
  Loader2, AlertCircle, Terminal, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip
} from 'recharts';

const COLORS = ['#00d48a', '#fbbf24', '#ff4d67'];

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, badgesRes] = await Promise.all([
          api.get('/auth/dashboard'),
          api.get('/badges')
        ]);
        setStats(statsRes.data);
        setBadges(badgesRes.data.badges || []);
      } catch (err) {
        setError('Could not load profile data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={36} className="text-primary animate-spin" />
        <p className="text-text/65 text-sm font-semibold">Loading profile...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-md mx-auto my-16 bg-danger/10 border border-danger/20 p-6 rounded-3xl text-center space-y-4">
        <AlertCircle size={36} className="text-danger mx-auto" />
        <p className="text-text/60 text-xs">{error}</p>
      </div>
    );
  }

  const difficultyData = stats.difficultyDistribution || [];
  const totalSolved = stats.solvedCount || 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

      {/* Profile Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border border-border/40 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-xl relative overflow-hidden"
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-3xl bg-primary/15 border-2 border-primary/30 flex items-center justify-center text-4xl font-black text-primary shadow-lg shadow-primary/10">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          {user?.role === 'ADMIN' && (
            <span className="absolute -bottom-2 -right-2 text-[9px] font-black bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
              Admin
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-2xl font-black text-text">{user?.username}</h1>
          <p className="text-text/50 text-sm">{user?.email}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
            <div className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1.5 rounded-full text-xs font-bold">
              <Flame size={13} className="fill-amber-500" />
              <span>{stats.streak} Day Streak</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-bold">
              <Trophy size={13} />
              <span>{stats.score} Points</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-success/10 border border-success/20 text-success px-3 py-1.5 rounded-full text-xs font-bold">
              <CheckCircle size={13} />
              <span>{totalSolved} Solved</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/5 border border-border/30 text-text/60 px-3 py-1.5 rounded-full text-xs font-bold">
              <Trophy size={13} />
              <span>Rank #{stats.rank}</span>
            </div>
          </div>
        </div>

        {/* Accuracy circle stat */}
        <div className="text-center flex-shrink-0 bg-black/20 border border-border/20 rounded-2xl px-6 py-4">
          <p className="text-[10px] font-bold text-text/40 uppercase tracking-wider mb-1">Accuracy</p>
          <p className="text-3xl font-black text-primary">{stats.accuracy}%</p>
          <p className="text-[10px] text-text/40 mt-1">{stats.totalAttempts} total attempts</p>
        </div>
      </motion.div>

      {/* Stats + Difficulty Breakdown Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick stat cards */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {[
            { icon: CheckCircle, label: 'Problems Solved', value: totalSolved, color: 'text-success' },
            { icon: Trophy, label: 'Global Rank', value: `#${stats.rank}`, color: 'text-primary' },
            { icon: Clock, label: 'Total Attempts', value: stats.totalAttempts, color: 'text-amber-400' },
            { icon: Percent, label: 'Accuracy Rate', value: `${stats.accuracy}%`, color: 'text-sky-400' },
          ].map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -3 }}
              className="bg-darkcard border border-border/40 rounded-2xl p-5 flex flex-col space-y-2 shadow-md"
            >
              <item.icon size={20} className={item.color} />
              <p className="text-xs text-text/50 font-semibold">{item.label}</p>
              <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Difficulty pie chart */}
        <div className="bg-darkcard border border-border/40 rounded-2xl p-5 shadow-md flex flex-col justify-between">
          <h3 className="text-sm font-bold text-text mb-2">Difficulty Breakdown</h3>
          <div className="h-40 relative flex items-center justify-center">
            {totalSolved > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={difficultyData} innerRadius={40} outerRadius={58} paddingAngle={4} dataKey="value">
                      {difficultyData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#141422', border: '1px solid #252538', borderRadius: '10px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center pointer-events-none">
                  <p className="text-xl font-black text-text">{totalSolved}</p>
                  <p className="text-[9px] text-text/40 uppercase">Solved</p>
                </div>
              </>
            ) : (
              <p className="text-text/30 text-xs">No data yet</p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1 border-t border-border/30 pt-3 text-center">
            {['Easy', 'Medium', 'Hard'].map((label, i) => (
              <div key={label}>
                <p className="text-[10px] text-text/50">{label}</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: COLORS[i] }}>
                  {difficultyData[i]?.value ?? 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements / Badges */}
      <div className="bg-darkcard border border-border/40 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center space-x-2">
          <Trophy className="text-yellow-400" size={20} />
          <h2 className="text-base font-bold text-text">Achievements & Badges</h2>
          <span className="text-xs font-bold text-text/40 bg-white/5 border border-border/30 px-2 py-0.5 rounded-full ml-2">
            {badges.length} / 5 Unlocked
          </span>
        </div>
        <BadgeGrid earnedBadges={badges} />
      </div>

      {/* Recent Submissions */}
      <div className="bg-darkcard border border-border/40 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <Terminal className="text-primary" size={20} />
          <h2 className="text-base font-bold text-text">Recent Activity</h2>
        </div>

        <div className="space-y-3">
          {(stats.recentSubmissions || []).length > 0 ? (
            stats.recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-3.5 bg-black/10 rounded-xl border border-white/5"
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-text">{sub.problem?.title}</p>
                  <div className="flex items-center space-x-2 text-xs text-text/40">
                    <span className="uppercase font-bold bg-white/5 px-1.5 py-0.5 rounded border border-white/5 text-[9px]">
                      {sub.language}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar size={11} />
                      <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  sub.status === 'ACCEPTED'
                    ? 'text-success bg-success/10 border-success/20'
                    : 'text-danger bg-danger/10 border-danger/20'
                }`}>
                  {sub.status === 'ACCEPTED' ? 'Accepted' : sub.status.replace(/_/g, ' ')}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-text/40 text-sm py-10">No submissions yet. Start solving!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
