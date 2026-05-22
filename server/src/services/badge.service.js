const BADGE_CRITERIA = {
  FIRST_SOLVE: 'FIRST_SOLVE',
  STREAK_7: 'STREAK_7',
  PROBLEMS_50: 'PROBLEMS_50',
  TOP_10: 'TOP_10',
  PERFECT_WEEK: 'PERFECT_WEEK'
};

exports.checkAndAwardBadges = async (userId, prisma) => {
  const newlyAwarded = [];

  try {
    // 1. Fetch user data, existing badges, and list of successful submissions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { badges: true }
    });

    if (!user) return [];

    const existingBadgeTypes = new Set(user.badges.map(b => b.type));

    const solvedCount = await prisma.submission.groupBy({
      by: ['problemId'],
      where: {
        userId,
        status: 'ACCEPTED'
      }
    });

    const uniqueSolved = solvedCount.length;

    // 2. Evaluate 'FIRST_SOLVE'
    if (uniqueSolved >= 1 && !existingBadgeTypes.has(BADGE_CRITERIA.FIRST_SOLVE)) {
      await prisma.badge.create({
        data: { userId, type: BADGE_CRITERIA.FIRST_SOLVE }
      });
      newlyAwarded.push(BADGE_CRITERIA.FIRST_SOLVE);
    }

    // 3. Evaluate 'PROBLEMS_50'
    if (uniqueSolved >= 50 && !existingBadgeTypes.has(BADGE_CRITERIA.PROBLEMS_50)) {
      await prisma.badge.create({
        data: { userId, type: BADGE_CRITERIA.PROBLEMS_50 }
      });
      newlyAwarded.push(BADGE_CRITERIA.PROBLEMS_50);
    }

    // 4. Evaluate 'STREAK_7' and 'PERFECT_WEEK'
    if (user.streak >= 7) {
      if (!existingBadgeTypes.has(BADGE_CRITERIA.STREAK_7)) {
        await prisma.badge.create({
          data: { userId, type: BADGE_CRITERIA.STREAK_7 }
        });
        newlyAwarded.push(BADGE_CRITERIA.STREAK_7);
      }
      if (!existingBadgeTypes.has(BADGE_CRITERIA.PERFECT_WEEK)) {
        await prisma.badge.create({
          data: { userId, type: BADGE_CRITERIA.PERFECT_WEEK }
        });
        newlyAwarded.push(BADGE_CRITERIA.PERFECT_WEEK);
      }
    }

    // 5. Evaluate 'TOP_10'
    // Fetch users sorted by score desc, check if this user is in the top 10
    const topUsers = await prisma.user.findMany({
      orderBy: { score: 'desc' },
      take: 10,
      select: { id: true }
    });

    const isTop10 = topUsers.some(u => u.id === userId);
    if (isTop10 && !existingBadgeTypes.has(BADGE_CRITERIA.TOP_10)) {
      await prisma.badge.create({
        data: { userId, type: BADGE_CRITERIA.TOP_10 }
      });
      newlyAwarded.push(BADGE_CRITERIA.TOP_10);
    }

  } catch (error) {
    console.error('Error evaluating badges:', error);
  }

  return newlyAwarded;
};
