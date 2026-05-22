const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const redisClient = require('../services/redis.service');

// Streak update utility
const updateStreak = async (userId) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const now = new Date();
    if (!user.lastActive) {
      await prisma.user.update({
        where: { id: userId },
        data: { streak: 1, lastActive: now }
      });
      return;
    }

    const lastActive = new Date(user.lastActive);
    // Reset hours to compare calendar days
    const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const d2 = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
    
    const diffTime = d1 - d2;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Streak continues
      await prisma.user.update({
        where: { id: userId },
        data: { streak: user.streak + 1, lastActive: now }
      });
    } else if (diffDays > 1) {
      // Streak broken, reset to 1
      await prisma.user.update({
        where: { id: userId },
        data: { streak: 1, lastActive: now }
      });
    } else {
      // Same day, update active timestamp but keep streak
      await prisma.user.update({
        where: { id: userId },
        data: { lastActive: now }
      });
    }
  } catch (error) {
    console.error('Streak update error:', error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // If it's the first registered user, make them ADMIN, else STUDENT
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? 'ADMIN' : 'STUDENT';

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role,
        streak: 1,
        lastActive: new Date()
      }
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        score: user.score,
        streak: user.streak
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // identifier can be username or email

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }]
      }
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update streak on successful login
    await updateStreak(user.id);
    const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });

    const accessToken = generateAccessToken(updatedUser);
    const refreshToken = generateRefreshToken(updatedUser);

    // Remove any expired sessions and store new session
    await prisma.session.deleteMany({
      where: {
        OR: [
          { userId: updatedUser.id }, // Rotate/remove old ones
          { expiresAt: { lt: new Date() } }
        ]
      }
    });

    await prisma.session.create({
      data: {
        userId: updatedUser.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        score: updatedUser.score,
        streak: updatedUser.streak
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'Refresh token missing' });

    const session = await prisma.session.findUnique({
      where: { refreshToken: token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
      }
      return res.status(403).json({ message: 'Refresh token expired or invalid' });
    }

    // Verify token cryptographically
    try {
      jwt.verify(token, process.env.REFRESH_SECRET || 'fallback_refresh_secret');
    } catch (e) {
      return res.status(403).json({ message: 'Invalid refresh token signature' });
    }

    const newAccessToken = generateAccessToken(session.user);

    res.json({
      accessToken: newAccessToken
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User with this email not found' });
    }

    // Simulate sending email. Return success message and a mock code for demo purposes.
    res.json({
      message: 'Password reset link sent to your email (Simulated)',
      demoResetToken: Buffer.from(JSON.stringify({ id: user.id, exp: Date.now() + 3600000 })).toString('base64')
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    let userId;
    try {
      const decoded = JSON.parse(Buffer.from(resetToken, 'base64').toString('ascii'));
      if (decoded.exp < Date.now()) {
        return res.status(400).json({ message: 'Reset token has expired' });
      }
      userId = decoded.id;
    } catch (e) {
      return res.status(400).json({ message: 'Invalid reset token' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    });

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (token) {
      await prisma.session.deleteMany({
        where: { refreshToken: token }
      });
    }
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

exports.updateStreak = updateStreak; // Export for other usages

exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, streak: true, score: true }
    });

    // 1. Problems solved (distinct)
    const solvedGroup = await prisma.submission.groupBy({
      by: ['problemId'],
      where: { userId, status: 'ACCEPTED' }
    });
    const solvedCount = solvedGroup.length;

    // 2. Total attempts
    const totalAttempts = await prisma.submission.count({ where: { userId } });

    // 3. Accuracy
    const acceptedAttempts = await prisma.submission.count({ where: { userId, status: 'ACCEPTED' } });
    const accuracy = totalAttempts > 0 ? ((acceptedAttempts / totalAttempts) * 100).toFixed(1) : '0.0';

    // 4. Rank
    // Sync cache first if empty
    let totalCached = await redisClient.zcard('leaderboard');
    if (totalCached === 0) {
      const users = await prisma.user.findMany({
        orderBy: { score: 'desc' },
        select: { id: true, score: true }
      });
      for (const u of users) {
        await redisClient.zadd('leaderboard', u.score, u.id);
      }
    }
    const rankIndex = await redisClient.zrevrank('leaderboard', userId);
    const rank = rankIndex !== null ? rankIndex + 1 : 1;

    // 5. Recent submissions
    const recentSubmissions = await prisma.submission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        problem: {
          select: { title: true, difficulty: true }
        }
      }
    });

    // 6. Stats by difficulty (for charts)
    const easySolved = await prisma.submission.groupBy({
      by: ['problemId'],
      where: { userId, status: 'ACCEPTED', problem: { difficulty: 'EASY' } }
    });
    const mediumSolved = await prisma.submission.groupBy({
      by: ['problemId'],
      where: { userId, status: 'ACCEPTED', problem: { difficulty: 'MEDIUM' } }
    });
    const hardSolved = await prisma.submission.groupBy({
      by: ['problemId'],
      where: { userId, status: 'ACCEPTED', problem: { difficulty: 'HARD' } }
    });

    res.json({
      username: user.username,
      streak: user.streak,
      score: user.score,
      solvedCount,
      totalAttempts,
      accuracy: parseFloat(accuracy),
      rank,
      recentSubmissions,
      difficultyDistribution: [
        { name: 'Easy', value: easySolved.length },
        { name: 'Medium', value: mediumSolved.length },
        { name: 'Hard', value: hardSolved.length }
      ]
    });
  } catch (err) {
    next(err);
  }
};
