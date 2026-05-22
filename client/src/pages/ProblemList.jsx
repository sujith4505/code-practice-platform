import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProblemCard from '../components/ProblemCard';
import { Search, Loader2, ArrowLeft, ArrowRight, SlidersHorizontal, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const TOPICS = [
  'All',
  'Arrays',
  'Strings',
  'Sorting',
  'Hash Table',
  'Two Pointers',
  'Stack',
  'Queue',
  'Binary Search',
  'Recursion',
  'Backtracking',
  'Dynamic Programming',
  'Greedy',
  'Graph',
  'Math',
  'Database'
];

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('All');
  
  // Sorting state
  const [sortBy, setSortBy] = useState('title');
  const [order, setOrder] = useState('asc');

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const topicQuery = topic === 'All' ? '' : topic;
      const res = await api.get('/problems', {
        params: {
          search,
          difficulty,
          topic: topicQuery,
          sortBy,
          order,
          page,
          limit: 8
        }
      });
      setProblems(res.data.problems);
      setTotalPages(res.data.pagination.totalPages);
      setTotalCount(res.data.pagination.total);
    } catch (err) {
      console.error('Error fetching problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [search, difficulty, topic, sortBy, order, page]);

  // Reset page when filters change
  const handleFilterChange = (filterType, value) => {
    setPage(1);
    if (filterType === 'difficulty') setDifficulty(value);
    if (filterType === 'topic') setTopic(value);
    if (filterType === 'search') setSearch(value);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text">Code Practice</h1>
          <p className="text-text/50 text-xs mt-1">
            Choose from <span className="text-primary font-bold">{totalCount}</span> challenges. Boost your problem-solving capabilities.
          </p>
        </div>

        {/* Global Progress mini bar */}
        <div className="flex items-center space-x-3 bg-white/5 border border-border/30 px-4 py-2.5 rounded-2xl">
          <Trophy size={16} className="text-primary" />
          <div className="text-xs">
            <span className="font-bold text-text">Practice Roadmap</span>
            <p className="text-text/45 text-[10px] mt-0.5">Solve daily challenges to increase rating</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar controls */}
      <div className="bg-darkcard border border-border/40 p-5 rounded-3xl shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/30">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search problems by name or keyword..."
              className="w-full pl-11 pr-4 py-3 bg-darkbg border border-border/40 focus:border-primary/80 rounded-xl text-text placeholder-text/35 text-sm focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center space-x-2">
            <SlidersHorizontal size={14} className="text-text/40" />
            <select
              value={difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="bg-darkbg border border-border/40 focus:border-primary/80 text-text text-sm rounded-xl py-3 px-4 focus:outline-none transition-all duration-300 min-w-[120px] cursor-pointer"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Sort Dropdowns */}
          <div className="flex items-center space-x-2">
            <select
              value={`${sortBy}-${order}`}
              onChange={(e) => {
                const [field, dir] = e.target.value.split('-');
                setSortBy(field);
                setOrder(dir);
              }}
              className="bg-darkbg border border-border/40 focus:border-primary/80 text-text text-sm rounded-xl py-3 px-4 focus:outline-none transition-all duration-300 min-w-[150px] cursor-pointer"
            >
              <option value="title-asc">Sort Name (A-Z)</option>
              <option value="title-desc">Sort Name (Z-A)</option>
              <option value="difficulty-asc">Difficulty (Easy first)</option>
              <option value="difficulty-desc">Difficulty (Hard first)</option>
            </select>
          </div>
        </div>

        {/* Topic Pill Filters */}
        <div className="border-t border-border/20 pt-4">
          <p className="text-[10px] font-bold text-text/50 uppercase tracking-wider mb-2.5">Topic Categories</p>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-2">
            {TOPICS.map((topicItem) => {
              const active = topic === topicItem;
              return (
                <button
                  key={topicItem}
                  onClick={() => handleFilterChange('topic', topicItem)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                    active
                      ? 'bg-primary border-transparent text-white font-bold'
                      : 'bg-darkbg border-border/40 text-text/60 hover:text-text hover:border-border/80 font-medium'
                  }`}
                >
                  {topicItem}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Problems Render */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
          <Loader2 size={36} className="text-primary animate-spin" />
          <p className="text-text/65 text-xs font-semibold tracking-wide">Loading algorithmic challenges...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {problems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {problems.map((problem, index) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProblemCard problem={problem} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-darkcard border border-border/30 rounded-3xl space-y-2">
              <p className="text-base font-bold text-text/75">No challenges found</p>
              <p className="text-xs text-text/40">Try adjusting your filters or search keyword.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/30 pt-6">
              <p className="text-xs text-text/45 font-medium">
                Page <strong className="text-text/80">{page}</strong> of <strong className="text-text/80">{totalPages}</strong>
              </p>
              <div className="flex items-center space-x-3.5">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="flex items-center space-x-1.5 border border-border/40 hover:border-border text-text/80 px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Previous</span>
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="flex items-center space-x-1.5 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemList;
