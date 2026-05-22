const prisma = require('../utils/prisma');
const { executeCode } = require('../services/judge0.service');
const { checkAndAwardBadges } = require('../services/badge.service');
const redisClient = require('../services/redis.service');
const { emitLeaderboardUpdate } = require('../services/socket.service');

// Map difficulty to points
const DIFFICULTY_POINTS = {
  EASY: 10,
  MEDIUM: 20,
  HARD: 30
};

// Map Verdict text to prisma enum Verdict
const VERDICT_MAP = {
  'Accepted': 'ACCEPTED',
  'ACCEPTED': 'ACCEPTED',
  'Wrong Answer': 'WRONG_ANSWER',
  'WRONG_ANSWER': 'WRONG_ANSWER',
  'Runtime Error': 'RUNTIME_ERROR',
  'RUNTIME_ERROR': 'RUNTIME_ERROR',
  'Compilation Error': 'COMPILATION_ERROR',
  'COMPILATION_ERROR': 'COMPILATION_ERROR',
  'Time Limit Exceeded': 'TIME_LIMIT_EXCEEDED',
  'TIME_LIMIT_EXCEEDED': 'TIME_LIMIT_EXCEEDED'
};

exports.runCode = async (req, res, next) => {
  try {
    const { problemId, code, language } = req.body;

    const problem = await prisma.problem.findUnique({
      where: { id: problemId }
    });

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Parse test cases
    let testCases = [];
    try {
      testCases = Array.isArray(problem.testCases) ? problem.testCases : JSON.parse(problem.testCases || '[]');
    } catch (e) {
      return res.status(500).json({ message: 'Problem test cases are corrupted' });
    }

    const sampleCases = testCases.filter(tc => tc.isSample);
    if (sampleCases.length === 0 && testCases.length > 0) {
      sampleCases.push(testCases[0]); // Fallback to first test case if no sample is marked
    }

    const results = [];

    // Run each sample case
    for (let i = 0; i < sampleCases.length; i++) {
      const tc = sampleCases[i];
      const executionResult = await executeCode(language, code, tc.input, tc.expectedOutput);
      
      results.push({
        testCaseIndex: i,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        output: executionResult.output,
        status: executionResult.status,
        runtime: executionResult.runtime,
        memory: executionResult.memory
      });
    }

    res.json({
      message: 'Code run completed',
      results
    });
  } catch (err) {
    next(err);
  }
};

exports.submitCode = async (req, res, next) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user.id;

    const problem = await prisma.problem.findUnique({
      where: { id: problemId }
    });

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Parse test cases
    let testCases = [];
    try {
      testCases = Array.isArray(problem.testCases) ? problem.testCases : JSON.parse(problem.testCases || '[]');
    } catch (e) {
      return res.status(500).json({ message: 'Problem test cases are corrupted' });
    }

    let finalVerdict = 'Accepted';
    let maxRuntime = 0;
    let maxMemory = 0;
    let failingOutput = null;

    // Run ALL test cases
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const executionResult = await executeCode(language, code, tc.input, tc.expectedOutput);
      
      maxRuntime = Math.max(maxRuntime, executionResult.runtime);
      maxMemory = Math.max(maxMemory, executionResult.memory);

      if (executionResult.status !== 'Accepted') {
        finalVerdict = executionResult.status;
        failingOutput = executionResult.output;
        break; // Stop at first failing test case
      }
    }

    // Check if this is the user's first accepted solve for this problem
    let isFirstSolve = false;
    let pointsEarned = 0;

    const dbVerdict = VERDICT_MAP[finalVerdict] || 'WRONG_ANSWER';

    if (dbVerdict === 'ACCEPTED') {
      const priorAccepted = await prisma.submission.findFirst({
        where: {
          userId,
          problemId,
          status: 'ACCEPTED'
        }
      });
      if (!priorAccepted) {
        isFirstSolve = true;
        pointsEarned = DIFFICULTY_POINTS[problem.difficulty] || 10;
      }
    }

    // Save submission to DB
    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId,
        code,
        language,
        status: dbVerdict,
        runtime: parseFloat(maxRuntime),
        memory: parseFloat(maxMemory),
        output: failingOutput
      }
    });

    // Update user stats
    let user = await prisma.user.findUnique({ where: { id: userId } });
    let newlyAwardedBadges = [];

    if (dbVerdict === 'ACCEPTED') {
      // Update score
      const now = new Date();
      const lastActive = user.lastActive ? new Date(user.lastActive) : null;
      
      let streakInc = 0;
      if (!lastActive) {
        streakInc = 1;
      } else {
        const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const d2 = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
        const diffDays = Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) streakInc = 1;
        else if (diffDays > 1) streakInc = -user.streak + 1; // reset streak to 1
      }

      user = await prisma.user.update({
        where: { id: userId },
        data: {
          score: user.score + pointsEarned,
          streak: streakInc !== 0 ? (streakInc < 0 ? 1 : user.streak + 1) : user.streak,
          lastActive: now
        }
      });

      // Update Redis Leaderboard cache
      await redisClient.zadd('leaderboard', user.score, user.id);

      // Check badges
      newlyAwardedBadges = await checkAndAwardBadges(userId, prisma);

      // Trigger real-time leaderboard update
      // Fetch latest top leaderboard records
      const topScores = await redisClient.zrevrange('leaderboard', 0, 9, { withScores: true });
      const leaderboardDetails = [];
      
      // Parse alternating members and scores
      for (let i = 0; i < topScores.length; i += 2) {
        const uId = topScores[i];
        const uScore = parseFloat(topScores[i+1]);
        const dbUser = await prisma.user.findUnique({
          where: { id: uId },
          select: { username: true, streak: true }
        });
        if (dbUser) {
          const solved = await prisma.submission.groupBy({
            by: ['problemId'],
            where: { userId: uId, status: 'ACCEPTED' }
          });
          leaderboardDetails.push({
            rank: Math.floor(i / 2) + 1,
            username: dbUser.username,
            score: uScore,
            streak: dbUser.streak,
            solved: solved.length
          });
        }
      }

      // If leaderboard details is not empty, emit update
      if (leaderboardDetails.length > 0) {
        emitLeaderboardUpdate(leaderboardDetails);
      }
    }

    res.status(201).json({
      message: 'Code submission completed',
      submission,
      verdict: finalVerdict,
      pointsEarned,
      isFirstSolve,
      newlyAwardedBadges,
      streak: user.streak
    });
  } catch (err) {
    next(err);
  }
};

exports.getSubmissions = async (req, res, next) => {
  try {
    const { problemId } = req.query;
    const userId = req.user.id;

    const where = { userId };
    if (problemId) {
      where.problemId = problemId;
    }

    const submissions = await prisma.submission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        problem: {
          select: { title: true, difficulty: true }
        }
      }
    });

    res.json({ submissions });
  } catch (err) {
    next(err);
  }
};
