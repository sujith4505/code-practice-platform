const prisma = require('../utils/prisma');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        score: true,
        streak: true,
        createdAt: true,
        lastActive: true
      }
    });

    res.json({ users });
  } catch (err) {
    next(err);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProblems = await prisma.problem.count();
    const totalSubmissions = await prisma.submission.count();

    // Accepted submissions count
    const acceptedCount = await prisma.submission.count({
      where: { status: 'ACCEPTED' }
    });

    // Average acceptance rate
    const averageAcceptance = totalSubmissions > 0 
      ? ((acceptedCount / totalSubmissions) * 100).toFixed(1) 
      : '0.0';

    // Group submissions by verdict
    const submissionsByVerdict = await prisma.submission.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    // Difficulty breakdown of solved problems
    const problemsByDifficulty = await prisma.problem.groupBy({
      by: ['difficulty'],
      _count: { id: true }
    });

    // Submissions by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSubmissions = await prisma.submission.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo }
      },
      select: {
        createdAt: true,
        status: true
      }
    });

    // Formulate daily submission activity logs
    const dailyActivity = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyActivity[dateStr] = { submissions: 0, accepted: 0 };
    }

    recentSubmissions.forEach(sub => {
      const dateStr = new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyActivity[dateStr]) {
        dailyActivity[dateStr].submissions++;
        if (sub.status === 'ACCEPTED') {
          dailyActivity[dateStr].accepted++;
        }
      }
    });

    const activityData = Object.keys(dailyActivity).map(key => ({
      date: key,
      submissions: dailyActivity[key].submissions,
      accepted: dailyActivity[key].accepted
    }));

    res.json({
      totalUsers,
      totalProblems,
      totalSubmissions,
      averageAcceptance: parseFloat(averageAcceptance),
      submissionsByVerdict: submissionsByVerdict.map(v => ({
        verdict: v.status,
        count: v._count.id
      })),
      problemsByDifficulty: problemsByDifficulty.map(d => ({
        difficulty: d.difficulty,
        count: d._count.id
      })),
      recentActivity: activityData
    });
  } catch (err) {
    next(err);
  }
};
