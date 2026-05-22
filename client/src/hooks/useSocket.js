import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = (room = 'leaderboard') => {
  const [data, setData] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to real-time updates socket');
      if (room === 'leaderboard') {
        socket.emit('join_leaderboard');
      }
    });

    socket.on('leaderboard_update', (updatedLeaderboard) => {
      setData(updatedLeaderboard);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from updates socket');
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [room]);

  return data;
};
