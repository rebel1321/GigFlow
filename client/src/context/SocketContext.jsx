import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const SocketContext = createContext(undefined);

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        newSocket.emit('join', user.id);
      });

      newSocket.on('bid-hired', (data) => {
        toast.success(data.message, {
          description: `Congratulations! You've been selected for "${data.gigTitle}"`,
          duration: 5000,
        });
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
