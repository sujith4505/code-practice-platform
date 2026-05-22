const prisma = require('../utils/prisma');
const redisClient = require('../services/redis.service');

exports.getLeaderboard = async (req, res, next) => {
  try {
    // 1. Check if Redis cache exists
    let totalCached = await redisClient.zcard('leaderboard');

    // 2. If Redis leaderboard is empty, seed it from DB
    if (totalCached === 0) {
      console.log('Redis leaderboard empty. Seeding cache from database...');
      const users = await prisma.user.findMany({
        orderBy: { score: 'desc' },
        select: { id: true, score: true }
      });
      for (const u of users) {
        await redisClient.zadd('leaderboard', u.score, u.id);
      }
    }

    // 3. Query top 50 users from Redis
    const topScores = await redisClient.zrevrange('leaderboard', 0, 49, { withScores: true });
    const rankings = [];

    for (let i = 0; i < topScores.length; i += 2) {
      const uId = topScores[i];
      const uScore = parseFloat(topScores[i+1]);

      const user = await prisma.user.findUnique({
        where: { id: uId },
        select: { username: true, streak: true }
      });

      if (user) {
        // Count solved problems
        const solved = await prisma.submission.groupBy({
          by: ['problemId'],
          where: {
            userId: uId,
            status: 'ACCEPTED'
          }
        });

        rankings.push({
          rank: Math.floor(i / 2) + 1,
          userId: uId,
          username: user.username,
          score: uScore,
          streak: user.streak,
          solvedCount: solved.length
        });
      }
    }

    res.json({ leaderboard: rankings });
  } catch (err) {
    next(err);
  }
};
