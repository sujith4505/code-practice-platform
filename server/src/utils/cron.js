const cron = require('node-cron');
const prisma = require('./prisma');

// Runs daily at midnight to check for broken streaks
const initCron = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily streak reset cron job...');
    try {
      const now = new Date();
      const users = await prisma.user.findMany({
        where: {
          streak: { gt: 0 },
          lastActive: { not: null }
        }
      });

      for (const user of users) {
        const lastActive = new Date(user.lastActive);
        
        // Compare calendar days
        const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const d2 = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
        
        const diffTime = d1 - d2;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        // If user hasn't solved any problems for more than 1 day (today is 0, yesterday was 1, so > 1 means broken)
        if (diffDays > 1) {
          await prisma.user.update({
            where: { id: user.id },
            data: { streak: 0 }
          });
          console.log(`Reset streak to 0 for user: ${user.username}`);
        }
      }
      console.log('Daily streak check complete.');
    } catch (error) {
      console.error('Error in streak reset cron job:', error);
    }
  });
};

module.exports = { initCron };
