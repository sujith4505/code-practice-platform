import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, HelpCircle, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

const ProblemCard = ({ problem }) => {
  const difficultyColors = {
    EASY: 'text-success bg-success/10 border-success/20',
    MEDIUM: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    HARD: 'text-danger bg-danger/10 border-danger/20'
  };

  const statusIcons = {
    SOLVED: <CheckCircle className="text-success fill-success/10" size={18} />,
    ATTEMPTED: <HelpCircle className="text-amber-400 fill-amber-400/10" size={18} />,
    UNSOLVED: <Circle className="text-text/20" size={18} />
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-darkcard border border-border/40 hover:border-border/80 p-5 rounded-2xl flex items-center justify-between shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center space-x-4">
        {/* Status Indicator */}
        <div className="flex-shrink-0">
          {statusIcons[problem.solveStatus] || statusIcons.UNSOLVED}
        </div>
        
        {/* Problem Info */}
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-text hover:text-primary transition-colors">
              <Link to={`/problems/${problem.id}`}>{problem.title}</Link>
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColors[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
          </div>
          
          <div className="flex items-center space-x-3 mt-1.5 text-xs text-text/50 font-medium">
            <span className="bg-white/5 px-2.5 py-0.5 rounded-md border border-white/5">{problem.topic}</span>
            <span>Acceptance: <strong className="text-text/75">{problem.acceptanceRate}%</strong></span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Link
        to={`/problems/${problem.id}`}
        className="flex items-center space-x-1 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 hover:border-transparent px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group cursor-pointer"
      >
        <span>{problem.solveStatus === 'SOLVED' ? 'Revisit' : 'Solve'}</span>
        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
};

export default ProblemCard;
