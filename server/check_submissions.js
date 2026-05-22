const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    console.log(`Found ${submissions.length} recent submissions:`);
    for (const sub of submissions) {
      console.log(`\nSubmission: ID ${sub.id}`);
      console.log(' - userId:', sub.userId);
      console.log(' - problemId:', sub.problemId);
      console.log(' - language:', sub.language);
      console.log(' - status:', sub.status);
      console.log(' - runtime:', sub.runtime);
      console.log(' - memory:', sub.memory);
      console.log(' - output:', sub.output);
      console.log(' - code:', sub.code);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
