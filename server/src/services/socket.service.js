const { Server } = require('socket.io');

let ioClient = null;

exports.initSocket = (server) => {
  ioClient = new Server(server, {
    cors: {
      origin: '*', // In production, replace with client URL
      methods: ['GET', 'POST']
    }
  });

  ioClient.on('connection', (socket) => {
    console.log(`User connected to real-time sync: ${socket.id}`);

    // Join general channel or user-specific channel
    socket.on('join_leaderboard', () => {
      socket.join('leaderboard');
      console.log(`Socket ${socket.id} joined leaderboard room`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from sync: ${socket.id}`);
    });
  });

  return ioClient;
};

exports.emitLeaderboardUpdate = (data) => {
  if (ioClient) {
    ioClient.to('leaderboard').emit('leaderboard_update', data);
    console.log('Emitted real-time leaderboard update to clients.');
  }
};
