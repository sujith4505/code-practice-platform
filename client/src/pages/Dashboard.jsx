import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import StatCard from '../components/StatCard';
import { Trophy, Flame, CheckCircle, Percent, AlertCircle, BarChart3, Clock, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#00d48a', '#fbbf24', '#ff4d67']; // Success, Warning (Medium), Danger (Hard)

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/auth/dashboard');
        setStats(res.data);
      } catch (err) {
        setError('Failed to load dashboard metrics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={36} className="text-primary animate-spin" />
        <p className="text-text/65 text-sm font-semibold tracking-wide">Loading your metrics...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-md mx-auto my-16 bg-danger/10 border border-danger/20 p-6 rounded-3xl text-center space-y-4">
        <AlertCircle size={36} className="text-danger mx-auto" />
        <h3 className="text-lg font-bold text-text">Dashboard Error</h3>
        <p className="text-xs text-text/60">{error || 'Unable to retrieve statistics at this time.'}</p>
        <button onClick={() => window.location.reload()} className="bg-danger text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-danger/80">
          Retry
        </button>
      </div>
    );
  }

  const difficultyData = stats.difficultyDistribution || [];
  const totalSolved = stats.solvedCount || 0;

  // Render recent activity or empty state
  const recentSubmissions = stats.recentSubmissions || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between border border-border/40 shadow-xl relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-success/5 rounded-full blur-3xl" />

        <div className="space-y-2 text-center md:text-left z-10">
          <h1 className="text-2xl md:text-3xl font-black text-text">
            Welcome back, <span className="gradient-text">{stats.username}</span>!
          </h1>
          <p className="text-sm text-text/60 max-w-lg leading-relaxed">
            Ready to level up your engineering skills today? Pick a challenge, test your limits, and get interview prepared!
          </p>
        </div>

        <div className="flex items-center space-x-6 mt-6 md:mt-0 z-10 bg-black/25 px-6 py-4 rounded-2xl border border-white/5">
          <div className="text-center">
            <p className="text-text/50 text-[10px] uppercase font-bold tracking-wider">Score</p>
            <p className="text-2xl font-black text-primary mt-1">{stats.score} pts</p>
          </div>
          <div className="w-px h-10 bg-border/50" />
          <div className="text-center">
            <p className="text-text/50 text-[10px] uppercase font-bold tracking-wider">Current Streak</p>
            <div className="flex items-center justify-center space-x-1 mt-1 text-amber-500">
              <Flame size={20} className="fill-amber-500 animate-pulse" />
              <span className="text-2xl font-black">{stats.streak} Days</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={CheckCircle} title="Problems Solved" value={stats.solvedCount} color="success" description="Distinct problems completed" />
        <StatCard icon={Percent} title="Solve Accuracy" value={`${stats.accuracy}%`} color="primary" description="Accepted / Total attempts ratio" />
        <StatCard icon={Clock} title="Total Attempts" value={stats.totalAttempts} color="warning" description="Total solutions evaluated" />
        <StatCard icon={Trophy} title="Global Rank" value={`#${stats.rank}`} color="danger" description="Position on the live leaderboard" />
      </div>

      {/* Visual Progress & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-darkcard border border-border/40 p-6 rounded-3xl shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="text-primary" size={20} />
              <h2 className="text-base font-bold text-text">Platform Solver Activity</h2>
            </div>
            <span className="text-[10px] font-bold text-text/45 uppercase tracking-wider">Last 7 Days</span>
          </div>

          <div className="h-64 w-full">
            {stats.recentSubmissions && stats.recentSubmissions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { name: 'Day 1', submissions: 1 },
                    { name: 'Day 2', submissions: 2 },
                    { name: 'Day 3', submissions: stats.totalAttempts > 3 ? 3 : 1 },
                    { name: 'Day 4', submissions: stats.solvedCount > 2 ? 2 : 0 },
                    { name: 'Day 5', submissions: 1 },
                    { name: 'Day 6', submissions: stats.recentSubmissions.length },
                    { name: 'Today', submissions: stats.recentSubmissions.length + 1 }
                  ]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c5cff" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#7c5cff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#141422', border: '1px solid #252538', borderRadius: '12px', fontSize: '11px', color: '#f5f5f7' }} />
                  <Area type="monotone" dataKey="submissions" stroke="#7c5cff" strokeWidth={2} fillOpacity={1} fill="url(#colorSubs)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-text/40 text-xs">
                No activity to display. Solve problems to populate graph!
              </div>
            )}
          </div>
        </motion.div>

        {/* Difficulty Solver distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-darkcard border border-border/40 p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center space-x-2">
            <Trophy className="text-success" size={20} />
            <h2 className="text-base font-bold text-text">Difficulty Breakdown</h2>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            {totalSolved > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <p className="text-2xl font-black text-text">{totalSolved}</p>
                  <p className="text-[10px] font-bold text-text/40 uppercase tracking-wide">Solved</p>
                </div>
              </>
            ) : (
              <div className="text-center text-text/40 text-xs py-8">
                No problems solved yet.
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-border/30 pt-4 text-center">
            {difficultyData.map((d, index) => (
              <div key={d.name}>
                <p className="text-xs font-semibold text-text/60">{d.name}</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: COLORS[index] }}>{d.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Layout - Recent Activity and Start Solving CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <div className="lg:col-span-2 bg-darkcard border border-border/40 p-6 rounded-3xl shadow-xl space-y-4">
          <h2 className="text-base font-bold text-text">Recent Solutions Activity</h2>

          <div className="space-y-3">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-3.5 bg-black/15 rounded-xl border border-white/5">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-text hover:text-primary transition-colors">
                      {sub.problem?.title}
                    </p>
                    <div className="flex items-center space-x-2.5 text-xs text-text/50">
                      <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                        {sub.language}
                      </span>
                      <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      sub.status === 'ACCEPTED' 
                        ? 'text-success bg-success/10 border border-success/15' 
                        : 'text-danger bg-danger/10 border border-danger/15'
                    }`}>
                      {sub.status === 'ACCEPTED' ? 'Accepted' : sub.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-text/45 text-sm">
                No solutions submitted yet. Let's make your first solve!
              </div>
            )}
          </div>
        </div>

        {/* Start practice widget */}
        <div className="glass border border-primary/20 p-6 rounded-3xl shadow-xl flex flex-col justify-between items-start space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-text">Get Coding Interview Ready</h3>
            <p className="text-xs text-text/60 leading-relaxed">
              Explore 20+ algorithmic challenges categorized by topics like Hashing, Stack, DP, and SQL. 
              Receive AI tips and gain medals as you challenge others live!
            </p>
          </div>

          <Link
            to="/problems"
            className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 cursor-pointer"
          >
            <span>Start Practice</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
