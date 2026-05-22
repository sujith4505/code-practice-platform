const prisma = require('../utils/prisma');

exports.getProblems = async (req, res, next) => {
  try {
    const { search, difficulty, topic, sortBy, order = 'asc', page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build filter query
    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    if (difficulty) {
      where.difficulty = difficulty.toUpperCase();
    }

    if (topic) {
      where.topic = { contains: topic };
    }

    // Sorting
    let orderBy = { title: 'asc' };
    if (sortBy) {
      if (sortBy === 'difficulty') {
        orderBy = { difficulty: order };
      } else if (sortBy === 'title') {
        orderBy = { title: order };
      } else {
        orderBy = { [sortBy]: order };
      }
    }

    // Fetch problems count
    const totalProblems = await prisma.problem.count({ where });

    // Fetch problems
    const problems = await prisma.problem.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        submissions: {
          select: {
            id: true,
            status: true,
            userId: true
          }
        }
      }
    });

    const currentUserId = req.user ? req.user.id : null;

    // Map problems with stats
    const mappedProblems = problems.map(prob => {
      const totalSubs = prob.submissions.length;
      const acceptedSubs = prob.submissions.filter(s => s.status === 'ACCEPTED').length;
      const acceptanceRate = totalSubs > 0 ? ((acceptedSubs / totalSubs) * 100).toFixed(1) : '75.0'; // Default to a standard acceptance rate if no submissions yet

      // Check user solve status
      let solveStatus = 'UNSOLVED';
      if (currentUserId) {
        const userSubs = prob.submissions.filter(s => s.userId === currentUserId);
        if (userSubs.some(s => s.status === 'ACCEPTED')) {
          solveStatus = 'SOLVED';
        } else if (userSubs.length > 0) {
          solveStatus = 'ATTEMPTED';
        }
      }

      // Remove sensitive test cases / Solutions from list endpoint
      const { testCases, referenceSolutions, ...publicFields } = prob;

      return {
        ...publicFields,
        acceptanceRate: parseFloat(acceptanceRate),
        solveStatus,
        totalAttempts: totalSubs
      };
    });

    res.json({
      problems: mappedProblems,
      pagination: {
        total: totalProblems,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalProblems / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getProblemDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { id }
    });

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Extract sample test cases to show the user
    let sampleTestCases = [];
    try {
      const parsedCases = Array.isArray(problem.testCases) ? problem.testCases : JSON.parse(problem.testCases || '[]');
      sampleTestCases = parsedCases.filter(tc => tc.isSample);
    } catch (e) {
      console.error('Error parsing testCases json:', e);
    }

    // Don't leak full test cases and reference solutions in problem detail
    const { testCases, referenceSolutions, ...publicProblem } = problem;

    res.json({
      ...publicProblem,
      sampleTestCases
    });
  } catch (err) {
    next(err);
  }
};

exports.createProblem = async (req, res, next) => {
  try {
    const { title, difficulty, topic, description, constraints, examples, testCases, codeTemplates, referenceSolutions } = req.body;

    const problem = await prisma.problem.create({
      data: {
        title,
        difficulty: difficulty.toUpperCase(),
        topic,
        description,
        constraints,
        examples: examples || [],
        testCases: testCases || [],
        codeTemplates: codeTemplates || {},
        referenceSolutions: referenceSolutions || {}
      }
    });

    res.status(201).json({
      message: 'Problem created successfully',
      problem
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProblem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, difficulty, topic, description, constraints, examples, testCases, codeTemplates, referenceSolutions } = req.body;

    const problem = await prisma.problem.update({
      where: { id },
      data: {
        title,
        difficulty: difficulty ? difficulty.toUpperCase() : undefined,
        topic,
        description,
        constraints,
        examples,
        testCases,
        codeTemplates,
        referenceSolutions
      }
    });

    res.json({
      message: 'Problem updated successfully',
      problem
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProblem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.problem.delete({
      where: { id }
    });

    res.json({
      message: 'Problem deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
