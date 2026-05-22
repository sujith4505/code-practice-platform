import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Editor from '@monaco-editor/react';
import { useAuthStore } from '../store/authStore';
import { 
  Play, Send, HelpCircle, AlertCircle, CheckCircle, 
  Terminal, ArrowLeft, Loader2, Sparkles, History, ListCollapse 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Error Boundary for Monaco Editor to prevent entire page crash if Monaco fails to load or violates CSP
class EditorErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Monaco Editor failed to load or crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Custom highly aesthetic fallback textarea editor matching the VS Dark theme
const FallbackEditor = ({ value, onChange, language }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = e.target.value;
      const newVal = val.substring(0, start) + "    " + val.substring(end);
      onChange(newVal);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-full p-6 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm border-0 focus:outline-none focus:ring-0 resize-none whitespace-pre overflow-auto leading-relaxed"
        placeholder="Write your solution here..."
        style={{
          tabSize: 4,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
        }}
      />
      <div className="absolute bottom-3 right-4 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] rounded-lg font-bold pointer-events-none z-10 backdrop-blur-sm">
        Lite Mode (Fallback)
      </div>
    </div>
  );
};

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUserStats = useAuthStore((state) => state.updateUserStats);

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  
  // Tabs State (left panel)
  const [activeTab, setActiveTab] = useState('description'); // 'description' or 'submissions'
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  // Execution Output console state
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [runResults, setRunResults] = useState([]);
  const [submissionVerdict, setSubmissionVerdict] = useState(null);

  // AI Hint state
  const [hintLoading, setHintLoading] = useState(false);
  const [hintContent, setHintContent] = useState('');
  const [aiError, setAiError] = useState('');

  // 1. Fetch Problem Details
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/problems/${id}`);
        const fetchedProblem = res.data;
        
        if (fetchedProblem) {
          // Robust defensive parsing for JSON fields in case they are returned as stringified JSON
          if (typeof fetchedProblem.examples === 'string') {
            try {
              fetchedProblem.examples = JSON.parse(fetchedProblem.examples);
            } catch (e) {
              fetchedProblem.examples = [];
            }
          }
          if (typeof fetchedProblem.codeTemplates === 'string') {
            try {
              fetchedProblem.codeTemplates = JSON.parse(fetchedProblem.codeTemplates);
            } catch (e) {
              fetchedProblem.codeTemplates = {};
            }
          }
        }
        
        setProblem(fetchedProblem);
        
        // Setup initial templates
        const templates = fetchedProblem?.codeTemplates || {};
        if (templates.javascript) {
          setCode(templates.javascript);
        } else if (Object.keys(templates).length > 0) {
          const firstLang = Object.keys(templates)[0];
          setLanguage(firstLang);
          setCode(templates[firstLang]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  // 2. Handle Language Toggle
  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    if (problem?.codeTemplates && problem.codeTemplates[selectedLang]) {
      setCode(problem.codeTemplates[selectedLang]);
    }
  };

  // 3. Fetch User Submissions History
  const fetchSubmissionsHistory = async () => {
    setSubmissionsLoading(true);
    try {
      const res = await api.get('/submissions', {
        params: { problemId: id }
      });
      setUserSubmissions(res.data.submissions);
    } catch (err) {
      console.error('Error fetching submissions history:', err);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchSubmissionsHistory();
    }
  }, [activeTab]);

  // 4. Run Code on Sample Cases
  const handleRunCode = async () => {
    setRunLoading(true);
    setConsoleOpen(true);
    setSubmissionVerdict(null);
    setRunResults([]);
    try {
      const res = await api.post('/submissions/run', {
        problemId: id,
        code,
        language
      });
      setRunResults(res.data.results);
    } catch (err) {
      console.error(err);
      setRunResults([{
        status: 'Runtime Error',
        output: err.response?.data?.message || 'Error occurred during execution'
      }]);
    } finally {
      setRunLoading(false);
    }
  };

  // 5. Submit Code for Full Evaluation
  const handleSubmitCode = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSubmitLoading(true);
    setConsoleOpen(true);
    setSubmissionVerdict(null);
    setRunResults([]);
    try {
      const res = await api.post('/submissions/submit', {
        problemId: id,
        code,
        language
      });
      
      const data = res.data;
      setSubmissionVerdict({
        status: data.verdict,
        pointsEarned: data.pointsEarned,
        streak: data.streak,
        newlyAwardedBadges: data.newlyAwardedBadges,
        output: data.submission.output
      });

      // Update Zustand local stats
      if (data.verdict === 'Accepted') {
        const currentScore = user.score + data.pointsEarned;
        updateUserStats(currentScore, data.streak);
      }

      // Re-fetch submissions if we are on that tab
      if (activeTab === 'submissions') {
        fetchSubmissionsHistory();
      }
    } catch (err) {
      console.error(err);
      setSubmissionVerdict({
        status: 'Compilation Error',
        output: err.response?.data?.message || 'Error compiling code'
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // 6. Request AI Hint
  const handleGetHint = async () => {
    setHintLoading(true);
    setHintContent('');
    setAiError('');
    try {
      const res = await api.post('/ai/hints', {
        problemId: id,
        userCode: code
      });
      setHintContent(res.data.hint);
    } catch (err) {
      setAiError(err.response?.data?.message || 'Unable to load AI feedback at this time.');
    } finally {
      setHintLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={36} className="text-primary animate-spin" />
        <p className="text-text/65 text-sm font-semibold tracking-wide">Loading workspace...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-md mx-auto my-16 bg-danger/10 border border-danger/20 p-6 rounded-3xl text-center space-y-4">
        <AlertCircle size={36} className="text-danger mx-auto" />
        <h3 className="text-lg font-bold text-text">Workspace Error</h3>
        <p className="text-xs text-text/60">Problem could not be retrieved.</p>
        <Link to="/problems" className="inline-block bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/80">
          Back to Problems
        </Link>
      </div>
    );
  }

  const difficultyColors = {
    EASY: 'text-success bg-success/10 border-success/20',
    MEDIUM: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    HARD: 'text-danger bg-danger/10 border-danger/20'
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex flex-col lg:flex-row bg-darkbg border-t border-border/20">
      
      {/* LEFT COLUMN: Problem description / Submissions tab panel */}
      <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-border/40 flex flex-col h-[calc(100vh-76px)] overflow-y-auto">
        {/* Navigation back and Tab selectors */}
        <div className="flex items-center justify-between px-6 py-4 bg-darkcard/70 border-b border-border/40 sticky top-0 backdrop-blur z-20">
          <Link to="/problems" className="flex items-center space-x-1.5 text-xs text-text/60 hover:text-text font-bold transition-all">
            <ArrowLeft size={14} />
            <span>Problem List</span>
          </Link>

          <div className="flex space-x-1 bg-darkbg p-1 rounded-xl border border-border/30">
            <button
              onClick={() => setActiveTab('description')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'description' ? 'bg-primary text-white' : 'text-text/60 hover:text-text'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'submissions' ? 'bg-primary text-white' : 'text-text/60 hover:text-text'
              }`}
            >
              Submissions
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-6 space-y-6">
          {activeTab === 'description' ? (
            <>
              {/* Title & difficulty */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3.5">
                  <h1 className="text-xl md:text-2xl font-black text-text">{problem.title}</h1>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${difficultyColors[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-text/50">
                  <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded">{problem.topic}</span>
                </div>
              </div>

              <div className="w-full h-px bg-border/40" />

              {/* Description Body */}
              <div className="text-text/80 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {problem.description}
              </div>

              {/* Constraints */}
              {problem.constraints && problem.constraints.trim().length > 0 && (
                <div className="space-y-2 bg-black/15 p-4 rounded-xl border border-white/5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-text/50">Constraints</h3>
                  <ul className="list-disc list-inside text-xs text-text/70 space-y-1 font-mono">
                    {problem.constraints.split('\n').map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Examples */}
              {problem.examples && Array.isArray(problem.examples) && problem.examples.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-text/60">Examples</h3>
                  {problem.examples.map((ex, index) => (
                    <div key={index} className="bg-darkcard border border-border/30 p-4.5 rounded-2xl space-y-2">
                      <p className="text-xs font-bold text-primary">Example {index + 1}</p>
                      <div className="space-y-1 text-xs font-mono">
                        <p><span className="text-text/40">Input:</span> <span className="text-text/90">{ex.input}</span></p>
                        <p><span className="text-text/40">Output:</span> <span className="text-text/90">{ex.output}</span></p>
                        {ex.explanation && (
                          <p className="text-[11px] text-text/55 leading-relaxed font-sans mt-1">{ex.explanation}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Submissions History tab */
            <div className="space-y-4">
              <h2 className="text-base font-bold text-text">Your Submission History</h2>
              {submissionsLoading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-2">
                  <Loader2 size={24} className="text-primary animate-spin" />
                  <p className="text-xs text-text/50">Fetching attempts...</p>
                </div>
              ) : userSubmissions.length > 0 ? (
                <div className="space-y-3">
                  {userSubmissions.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-4 bg-black/15 border border-white/5 rounded-2xl">
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sub.status === 'ACCEPTED' 
                            ? 'text-success bg-success/10 border border-success/15' 
                            : 'text-danger bg-danger/10 border border-danger/15'
                        }`}>
                          {sub.status === 'ACCEPTED' ? 'Accepted' : sub.status.replace(/_/g, ' ')}
                        </span>
                        <div className="flex items-center space-x-2 text-[10px] text-text/40 mt-2 font-mono">
                          <span>{sub.language}</span>
                          <span>•</span>
                          <span>{sub.runtime > 0 ? `${sub.runtime} ms` : 'N/A'}</span>
                          <span>•</span>
                          <span>{sub.memory > 0 ? `${sub.memory} KB` : 'N/A'}</span>
                        </div>
                      </div>
                      <span className="text-xs text-text/50 font-medium">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-black/10 border border-border/20 rounded-2xl text-sm text-text/45">
                  No submissions yet. Submit code to track attempts.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Monaco Editor and Console panel */}
      <div className="w-full lg:w-1/2 flex flex-col h-[calc(100vh-76px)] overflow-hidden">
        {/* Editor Toolbar Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-darkcard/50 border-b border-border/40">
          <div className="flex items-center space-x-2">
            <Terminal size={14} className="text-primary" />
            <span className="text-xs font-bold text-text/80">Code Editor</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Language Selector Dropdown */}
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-darkbg border border-border/40 focus:border-primary/80 text-text text-xs rounded-xl py-1.5 px-3 focus:outline-none transition-all cursor-pointer font-bold"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 relative border-b border-border/30 bg-[#1e1e1e]">
          <EditorErrorBoundary fallback={<FallbackEditor value={code} onChange={setCode} language={language} />}>
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                padding: { top: 16 },
                cursorBlinking: 'smooth',
                automaticLayout: true
              }}
            />
          </EditorErrorBoundary>
        </div>

        {/* Console Drawer (Dynamic height, overlaps or stacks) */}
        <AnimatePresence>
          {consoleOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '35vh' }}
              exit={{ height: 0 }}
              className="bg-darkcard border-t border-border/50 flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-2.5 bg-darkbg border-b border-border/30">
                <span className="text-xs font-black uppercase tracking-wider text-text/60">Execution Output</span>
                <button
                  onClick={() => setConsoleOpen(false)}
                  className="text-xs text-text/45 hover:text-text cursor-pointer"
                >
                  <ListCollapse size={16} />
                </button>
              </div>

              <div className="flex-1 p-5 overflow-y-auto font-mono text-xs space-y-4">
                {runLoading && (
                  <div className="flex items-center space-x-2 text-text/60">
                    <Loader2 size={14} className="animate-spin text-primary" />
                    <span>Running sample tests...</span>
                  </div>
                )}

                {submitLoading && (
                  <div className="flex items-center space-x-2 text-text/60">
                    <Loader2 size={14} className="animate-spin text-primary" />
                    <span>Running code against full test cases...</span>
                  </div>
                )}

                {/* Submissions verdict display */}
                {submissionVerdict && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2.5">
                      {submissionVerdict.status === 'Accepted' ? (
                        <CheckCircle size={22} className="text-success fill-success/10 animate-bounce" />
                      ) : (
                        <AlertCircle size={22} className="text-danger fill-danger/10" />
                      )}
                      <div>
                        <h4 className={`text-sm font-black ${
                          submissionVerdict.status === 'Accepted' ? 'text-success' : 'text-danger'
                        }`}>
                          {submissionVerdict.status === 'Accepted' ? 'Accepted!' : submissionVerdict.status.replace(/_/g, ' ')}
                        </h4>
                        {submissionVerdict.status === 'Accepted' && (
                          <p className="text-[10px] text-text/60">
                            +{submissionVerdict.pointsEarned} pts added • Current Streak: {submissionVerdict.streak} days
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Unlocked Badges announcement */}
                    {submissionVerdict.newlyAwardedBadges && submissionVerdict.newlyAwardedBadges.length > 0 && (
                      <div className="bg-primary/10 border border-primary/20 p-3.5 rounded-xl flex items-center space-x-2.5">
                        <Sparkles className="text-primary animate-pulse" size={16} />
                        <div className="text-xs">
                          <p className="font-bold text-text">New Achievement Unlocked!</p>
                          <p className="text-text/60 text-[10px] mt-0.5">
                            You earned the: {submissionVerdict.newlyAwardedBadges.join(', ')} Badge
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Output details (failing case or stderr) */}
                    {submissionVerdict.output && (
                      <div className="bg-black/25 border border-white/5 p-4 rounded-xl">
                        <p className="text-text/40 text-[10px] font-bold mb-1.5 uppercase">Failing Output Detail</p>
                        <pre className="text-text/75 leading-relaxed overflow-x-auto whitespace-pre-wrap">{submissionVerdict.output}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Run Results on sample cases */}
                {!runLoading && !submitLoading && runResults.length > 0 && (
                  <div className="space-y-4">
                    {runResults.map((res, i) => (
                      <div key={i} className="bg-black/25 border border-white/5 p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between border-b border-border/20 pb-2">
                          <p className="font-bold text-text/80 text-xs">Test Case {i + 1}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            res.status === 'Accepted' ? 'text-success bg-success/10 border border-success/15' : 'text-danger bg-danger/10 border border-danger/15'
                          }`}>
                            {res.status}
                          </span>
                        </div>
                        {res.status === 'Accepted' ? (
                          <div className="space-y-1.5 text-xs text-text/70">
                            <p><span className="text-text/40">Input:</span> {res.input}</p>
                            <p><span className="text-text/40">Expected:</span> {res.expectedOutput}</p>
                            <p><span className="text-text/40">Output:</span> <span className="text-success">{res.output}</span></p>
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-xs text-text/70">
                            <p><span className="text-text/40">Input:</span> {res.input}</p>
                            <p><span className="text-text/40">Expected:</span> {res.expectedOutput}</p>
                            <p><span className="text-text/40">Output:</span> <span className="text-danger">{res.output || 'No output'}</span></p>
                          </div>
                        )}
                        <div className="flex space-x-4 text-[10px] text-text/40 pt-1">
                          <span>Runtime: {res.runtime} ms</span>
                          <span>Memory: {res.memory} KB</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Panel Bar */}
        <div className="px-6 py-4 bg-darkcard/90 border-t border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-3.5 z-15">
          {/* AI Helper Tray */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleGetHint}
              disabled={hintLoading || !user}
              className="flex items-center space-x-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {hintLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin text-primary" />
                  <span>AI Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-primary animate-pulse" />
                  <span>Get AI Hint</span>
                </>
              )}
            </button>
            
            {!user && (
              <span className="text-[10px] text-text/40 font-semibold">(Login required for AI)</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3.5">
            <button
              onClick={handleRunCode}
              disabled={runLoading || submitLoading}
              className="flex items-center justify-center space-x-1.5 border border-border/60 hover:border-border text-text px-5 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
            >
              <Play size={14} />
              <span>Run Code</span>
            </button>

            <button
              onClick={handleSubmitCode}
              disabled={runLoading || submitLoading}
              className="flex items-center justify-center space-x-1.5 bg-success hover:bg-success/90 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-success/15 disabled:opacity-40 cursor-pointer animate-pulse hover:animate-none"
            >
              <Send size={14} />
              <span>Submit Solution</span>
            </button>
          </div>
        </div>

        {/* AI Hint Drawer panel */}
        <AnimatePresence>
          {(hintContent || aiError) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="px-6 py-4 bg-darkbg border-t border-border/40 font-sans text-xs space-y-2 bg-gradient-to-r from-primary/5 via-transparent to-transparent"
            >
              <div className="flex items-center justify-between pb-1 border-b border-border/20">
                <span className="font-black text-primary flex items-center space-x-1">
                  <Sparkles size={12} className="animate-pulse" />
                  <span>AI Coding Advice</span>
                </span>
                <button
                  onClick={() => { setHintContent(''); setAiError(''); }}
                  className="text-text/40 hover:text-text text-[10px]"
                >
                  Dismiss
                </button>
              </div>
              {hintContent ? (
                <div className="text-text/80 leading-relaxed font-medium mt-1">
                  {hintContent}
                </div>
              ) : (
                <p className="text-danger">{aiError}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProblemDetail;
