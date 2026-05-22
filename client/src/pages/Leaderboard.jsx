import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useSocket } from '../hooks/useSocket';
import { Trophy, Crown, Flame, Zap, Loader2, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RANK_COLORS = {
  1: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  2: 'text-zinc-300 bg-zinc-300/10 border-zinc-300/20',
  3: 'text-amber-600 bg-amber-600/10 border-amber-600/20'
};

const Leaderboard = () => {
  const user = useAuthStore((state) => state.user);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  // Real-time socket updates
  const liveData = useSocket('leaderboard');

  // Initial fetch from REST
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard');
        setLeaderboard(res.data.leaderboard);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Sync with socket live data when available
  useEffect(() => {
    if (liveData && liveData.length > 0) {
      setLeaderboard(liveData);
      setIsLive(true);
    }
  }, [liveData]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={36} className="text-primary animate-spin" />
        <p className="text-text/65 text-sm font-semibold tracking-wide">Loading rankings...</p>
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text flex items-center space-x-2">
            <Trophy className="text-yellow-400" size={28} />
            <span>Global Leaderboard</span>
          </h1>
          <p className="text-text/50 text-xs mt-1">Top performers ranked by total score earned.</p>
        </div>
        <div className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${
          isLive 
            ? 'text-success bg-success/10 border-success/20' 
            : 'text-text/40 bg-white/5 border-border/30'
        }`}>
          {isLive ? <Wifi size={12} /> : <WifiOff size={12} />}
          <span>{isLive ? 'Live Sync' : 'Static'}</span>
        </div>
      </div>

      {/* Top 3 Podium */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 pt-4">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-end"
          >
            <div className="text-center space-y-2 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-zinc-300/10 border border-zinc-300/20 flex items-center justify-center text-2xl font-black text-zinc-300 mx-auto">
                {top3[1]?.username?.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-bold text-text truncate max-w-[80px]">{top3[1]?.username}</p>
              <p className="text-xs text-text/50 font-semibold">{top3[1]?.score} pts</p>
            </div>
            <div className="w-full bg-zinc-300/10 border border-zinc-300/20 rounded-t-2xl py-5 flex items-center justify-center">
              <span className="text-2xl font-black text-zinc-300">2</span>
            </div>
          </motion.div>

          {/* 1st Place — taller */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="flex flex-col items-center justify-end"
          >
            <div className="text-center space-y-2 mb-3">
              <Crown size={24} className="text-yellow-400 mx-auto animate-bounce" style={{ animationDuration: '2s' }} />
              <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 border-2 border-yellow-400/40 flex items-center justify-center text-3xl font-black text-yellow-400 mx-auto shadow-lg shadow-yellow-400/10">
                {top3[0]?.username?.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-bold text-text truncate max-w-[80px]">{top3[0]?.username}</p>
              <p className="text-xs text-yellow-400 font-bold">{top3[0]?.score} pts</p>
            </div>
            <div className="w-full bg-yellow-400/10 border border-yellow-400/30 rounded-t-2xl py-8 flex items-center justify-center">
              <span className="text-3xl font-black text-yellow-400">1</span>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-end"
          >
            <div className="text-center space-y-2 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-600/10 border border-amber-600/20 flex items-center justify-center text-2xl font-black text-amber-600 mx-auto">
                {top3[2]?.username?.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-bold text-text truncate max-w-[80px]">{top3[2]?.username}</p>
              <p className="text-xs text-text/50 font-semibold">{top3[2]?.score} pts</p>
            </div>
            <div className="w-full bg-amber-600/10 border border-amber-600/20 rounded-t-2xl py-3 flex items-center justify-center">
              <span className="text-2xl font-black text-amber-600">3</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Full Rankings Table */}
      <div className="bg-darkcard border border-border/40 rounded-3xl overflow-hidden shadow-xl">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-darkbg/70 border-b border-border/40 text-[10px] font-black uppercase tracking-widest text-text/40">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">Player</div>
          <div className="col-span-2 text-right">Score</div>
          <div className="col-span-2 text-right">Solved</div>
          <div className="col-span-2 text-right">Streak</div>
        </div>

        {/* Table Rows */}
        <AnimatePresence>
          {leaderboard.map((entry, index) => {
            const isCurrentUser = user && entry.username === user.username;
            const rankStyle = RANK_COLORS[entry.rank] || '';

            return (
              <motion.div
                key={entry.userId || entry.username}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`grid grid-cols-12 gap-2 px-6 py-4 border-b border-border/20 last:border-0 items-center transition-all duration-300 ${
                  isCurrentUser 
                    ? 'bg-primary/5 border-l-2 border-primary' 
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Rank */}
                <div className="col-span-1">
                  {entry.rank <= 3 ? (
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black border ${rankStyle}`}>
                      {entry.rank}
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-text/45 pl-2">#{entry.rank}</span>
                  )}
                </div>

                {/* Player Info */}
                <div className="col-span-5 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-black text-primary flex-shrink-0">
                    {entry.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={`text-sm font-bold truncate ${isCurrentUser ? 'text-primary' : 'text-text'}`}>
                      {entry.username}
                      {isCurrentUser && <span className="ml-2 text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">You</span>}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="col-span-2 text-right">
                  <span className="text-sm font-extrabold text-text">{entry.score}</span>
                  <span className="text-[10px] text-text/40 ml-0.5">pts</span>
                </div>

                {/* Solved */}
                <div className="col-span-2 text-right">
                  <span className="text-sm font-bold text-success">{entry.solvedCount ?? entry.solved ?? 0}</span>
                </div>

                {/* Streak */}
                <div className="col-span-2 text-right flex items-center justify-end space-x-1">
                  <Flame size={13} className="text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-text/80">{entry.streak}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {leaderboard.length === 0 && (
          <div className="py-16 text-center text-text/40 text-sm">
            No rankings yet. Be the first to solve a problem!
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
