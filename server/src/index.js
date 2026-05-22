require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const problemRoutes = require('./routes/problem.routes');
const submissionRoutes = require('./routes/submission.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');
const badgeRoutes = require('./routes/badge.routes');
const adminRoutes = require('./routes/admin.routes');
const aiRoutes = require('./routes/ai.routes');

const { initSocket } = require('./services/socket.service');
const { initCron } = require('./utils/cron');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();
const server = http.createServer(app);

// Port setup
const PORT = process.env.PORT || 5000;

// Security and Logging Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Disable to prevent conflicts with local development and Monaco Editor CDN scripts
}));
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Socket.io initialization
initSocket(server);

// Cron Jobs initialization
initCron();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Centralized error handler
app.use(errorHandler);

// Start Server
server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Code Pract Server running on port ${PORT} `);
  console.log(`=========================================`);
});
