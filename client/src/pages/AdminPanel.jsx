import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Users, BarChart2, CheckCircle, Percent, Terminal,
  Loader2, AlertCircle, TrendingUp, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const COLORS = ['#00d48a', '#ff4d67', '#fbbf24', '#7c5cff', '#38bdf8'];

const AdminPanel = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, usersRes] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/admin/users')
        ]);
        setAnalytics(analyticsRes.data);
        setUsers(usersRes.data.users);
      } catch (err) {
        setError('Failed to load admin data.');
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
        <p className="text-text/65 text-sm font-semibold">Loading admin dashboard...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="max-w-md mx-auto my-16 bg-danger/10 border border-danger/20 p-6 rounded-3xl text-center space-y-4">
        <AlertCircle size={36} className="text-danger mx-auto" />
        <h3 className="text-lg font-bold text-text">Admin Access Error</h3>
        <p className="text-xs text-text/60">{error || 'Unable to load analytics.'}</p>
      </div>
    );
  }

  const verdictData = analytics.submissionsByVerdict || [];
  const difficultyData = analytics.problemsByDifficulty || [];
  const activityData = analytics.recentActivity || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="bg-primary/10 border border-primary/20 p-2.5 rounded-xl">
          <Shield className="text-primary" size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-text">Admin Dashboard</h1>
          <p className="text-text/50 text-xs mt-0.5">Platform analytics and user management</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-darkcard border border-border/40 p-1.5 rounded-2xl w-fit">
        {['overview', 'users'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-300 cursor-pointer ${
              activeTab === tab
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-text/50 hover:text-text'
            }`}
          >
            {tab === 'overview' ? 'Overview' : 'Users'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Top Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: Users, label: 'Total Users', value: analytics.totalUsers, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
              { icon: Terminal, label: 'Total Problems', value: analytics.totalProblems, color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/20' },
              { icon: BarChart2, label: 'Submissions', value: analytics.totalSubmissions, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
              { icon: Percent, label: 'Acceptance Rate', value: `${analytics.averageAcceptance}%`, color: 'text-success', bg: 'bg-success/10 border-success/20' },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -3 }}
                className="bg-darkcard border border-border/40 rounded-2xl p-5 flex items-start space-x-3.5 shadow-md"
              >
                <div className={`p-2.5 rounded-xl border ${item.bg}`}>
                  <item.icon size={20} className={item.color} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text/40 uppercase tracking-wider">{item.label}</p>
                  <p className={`text-2xl font-black mt-1 ${item.color}`}>{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Area Chart - Weekly Activity */}
            <div className="lg:col-span-2 bg-darkcard border border-border/40 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center space-x-2 mb-5">
                <TrendingUp className="text-primary" size={18} />
                <h3 className="text-sm font-bold text-text">7-Day Submission Activity</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={activityData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c5cff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7c5cff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAccepted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d48a" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00d48a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#141422', border: '1px solid #252538', borderRadius: '10px', fontSize: '11px', color: '#f5f5f7' }} />
                  <Area type="monotone" dataKey="submissions" stroke="#7c5cff" strokeWidth={2} fill="url(#colorTotal)" name="Total" />
                  <Area type="monotone" dataKey="accepted" stroke="#00d48a" strokeWidth={2} fill="url(#colorAccepted)" name="Accepted" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart - Submission Verdict Distribution */}
            <div className="bg-darkcard border border-border/40 rounded-3xl p-6 shadow-xl flex flex-col">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="text-success" size={18} />
                <h3 className="text-sm font-bold text-text">Verdict Distribution</h3>
              </div>
              {verdictData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={170}>
                    <PieChart>
                      <Pie data={verdictData} dataKey="count" nameKey="verdict" innerRadius={40} outerRadius={60} paddingAngle={3}>
                        {verdictData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#141422', border: '1px solid #252538', borderRadius: '10px', fontSize: '11px', color: '#f5f5f7' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {verdictData.map((v, i) => (
                      <div key={v.verdict} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-text/60 truncate max-w-[120px]">{v.verdict.replace(/_/g, ' ')}</span>
                        </div>
                        <span className="font-bold text-text">{v.count}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-text/30 text-xs text-center my-auto">No submission data</p>
              )}
            </div>
          </div>

          {/* Problems by Difficulty Bar Chart */}
          <div className="bg-darkcard border border-border/40 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center space-x-2 mb-5">
              <Terminal className="text-sky-400" size={18} />
              <h3 className="text-sm font-bold text-text">Problems by Difficulty</h3>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={difficultyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="difficulty" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#141422', border: '1px solid #252538', borderRadius: '10px', fontSize: '11px', color: '#f5f5f7' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {difficultyData.map((entry, i) => {
                    const barColor = entry.difficulty === 'EASY' ? '#00d48a' : entry.difficulty === 'MEDIUM' ? '#fbbf24' : '#ff4d67';
                    return <Cell key={i} fill={barColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-darkcard border border-border/40 rounded-3xl shadow-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-darkbg/80 border-b border-border/40 text-[10px] font-black uppercase tracking-widest text-text/40">
            <div className="col-span-3">Username</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-1">Role</div>
            <div className="col-span-1 text-right">Score</div>
            <div className="col-span-1 text-right">Streak</div>
            <div className="col-span-2 text-right">Joined</div>
          </div>

          {users.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-12 gap-2 px-6 py-4 border-b border-border/20 last:border-0 items-center hover:bg-white/[0.02] transition-all"
            >
              <div className="col-span-3 flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-black text-primary flex-shrink-0">
                  {u.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-text truncate">{u.username}</span>
              </div>
              <div className="col-span-4">
                <span className="text-xs text-text/50 truncate">{u.email}</span>
              </div>
              <div className="col-span-1">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${
                  u.role === 'ADMIN'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-white/5 text-text/40 border border-white/10'
                }`}>
                  {u.role}
                </span>
              </div>
              <div className="col-span-1 text-right">
                <span className="text-sm font-bold text-primary">{u.score}</span>
              </div>
              <div className="col-span-1 text-right">
                <span className="text-sm font-bold text-amber-500">{u.streak}d</span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-xs text-text/40">{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}

          {users.length === 0 && (
            <p className="text-center text-text/40 text-sm py-16">No users registered yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
