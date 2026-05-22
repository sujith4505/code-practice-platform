const prisma = require('../utils/prisma');

exports.getUserBadges = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.id;

    const badges = await prisma.badge.findMany({
      where: { userId },
      orderBy: { awardedAt: 'desc' }
    });

    res.json({ badges });
  } catch (err) {
    next(err);
  }
};
