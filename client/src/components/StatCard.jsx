import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, color = 'primary', description }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-success/10 text-success border-success/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-darkcard border border-border/40 p-5 rounded-2xl flex items-start space-x-4 shadow-lg hover:shadow-xl hover:border-border/80 transition-all duration-300"
    >
      <div className={`p-3.5 rounded-xl border ${colorClasses[color] || colorClasses.primary}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-text/60 text-xs font-semibold uppercase tracking-wider">{title}</h3>
        <p className="text-2xl font-extrabold mt-1 text-text">{value}</p>
        {description && (
          <p className="text-text/45 text-xs mt-1">{description}</p>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
