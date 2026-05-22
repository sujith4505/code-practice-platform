const prisma = require('../utils/prisma');
const { getAIHint } = require('../services/ai.service');

exports.getHint = async (req, res, next) => {
  try {
    const { problemId, userCode } = req.body;

    if (!problemId) {
      return res.status(400).json({ message: 'problemId is required' });
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId }
    });

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const hint = await getAIHint(problem.title, problem.description, userCode || '');

    res.json(hint);
  } catch (err) {
    next(err);
  }
};
