import React from 'react';
import { Award, Zap, Compass, Star, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const ALL_BADGES = [
  {
    type: 'FIRST_SOLVE',
    name: 'First Solve',
    desc: 'Solved your first coding problem.',
    icon: Compass,
    color: 'text-sky-400 bg-sky-400/10 border-sky-400/20'
  },
  {
    type: 'STREAK_7',
    name: '7 Day Streak',
    desc: 'Maintained a streak for 7 consecutive days.',
    icon: Zap,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  },
  {
    type: 'PROBLEMS_50',
    name: '50 Problems',
    desc: 'Solved 50 distinct practice problems.',
    icon: Star,
    color: 'text-purple-400 bg-purple-400/10 border-purple-400/20'
  },
  {
    type: 'TOP_10',
    name: 'Top 10 Rank',
    desc: 'Entered the top 10 on the global leaderboard.',
    icon: Award,
    color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
  },
  {
    type: 'PERFECT_WEEK',
    name: 'Perfect Week',
    desc: 'Solved problems daily for 7 consecutive days.',
    icon: Calendar,
    color: 'text-rose-400 bg-rose-400/10 border-rose-400/20'
  }
];

const BadgeGrid = ({ earnedBadges = [] }) => {
  const earnedTypes = new Set(earnedBadges.map(b => b.type));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {ALL_BADGES.map((badge) => {
        const isEarned = earnedTypes.has(badge.type);
        const Icon = badge.icon;
        
        return (
          <motion.div
            key={badge.type}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={isEarned ? { y: -4 } : {}}
            className={`border rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 ${
              isEarned
                ? `${badge.color} shadow-lg shadow-black/5`
                : 'bg-darkcard/40 border-border/20 opacity-40 grayscale select-none'
            }`}
          >
            <div className={`p-3 rounded-full border mb-3 ${isEarned ? 'bg-black/10' : 'bg-transparent border-transparent'}`}>
              <Icon size={28} className={isEarned ? 'animate-bounce' : ''} style={{ animationDuration: '3s' }} />
            </div>
            <h4 className="text-sm font-bold text-text">{badge.name}</h4>
            <p className="text-text/50 text-[11px] mt-1 leading-normal max-w-[120px]">{badge.desc}</p>
            {isEarned && (
              <span className="text-[9px] font-black uppercase tracking-wider text-text/40 mt-3 bg-black/10 px-2 py-0.5 rounded-full">
                Unlocked
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default BadgeGrid;
