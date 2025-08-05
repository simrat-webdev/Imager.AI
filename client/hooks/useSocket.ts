import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export interface UseSocketReturn {
  isConnected: boolean;
  emit: (event: string, data: any) => void;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
}

export function useSocket(
  onConnectionEstablished?: (data: any) => void,
  onGenerationStarted?: (data: any) => void,
  onGenerationProgress?: (data: any) => void,
  onGenerationComplete?: (data: any) => void,
  onGenerationError?: (data: any) => void
): UseSocketReturn {
  const socket = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");

  const connect = useCallback(() => {
    if (socket.current?.connected) return;

    setConnectionStatus("connecting");

    // Connect to your backend server
    socket.current = io("http://localhost:3001", {
      transports: ["websocket", "polling"],
    });

    socket.current.on("connect", () => {
      setIsConnected(true);
      setConnectionStatus("connected");
      console.log("Socket.io connected:", socket.current?.id);
    });

    socket.current.on("disconnect", (reason) => {
      setIsConnected(false);
      setConnectionStatus("disconnected");
      console.log("Socket.io disconnected:", reason);
    });

    socket.current.on("connect_error", (error) => {
      setConnectionStatus("error");
      console.error("Socket.io connection error:", error);
    });

    // Event listeners for AI image generation
    socket.current.on("connection_established", (data) => {
      console.log("Connected to server:", data.message);
      onConnectionEstablished?.(data);
    });

    socket.current.on("generation_started", (data) => {
      onGenerationStarted?.(data);
    });

    socket.current.on("generation_progress", (data) => {
      onGenerationProgress?.(data);
    });

    socket.current.on("generation_complete", (data) => {
      onGenerationComplete?.(data);
    });

    socket.current.on("generation_error", (data) => {
      onGenerationError?.(data);
    });
  }, [
    onConnectionEstablished,
    onGenerationStarted,
    onGenerationProgress,
    onGenerationComplete,
    onGenerationError,
  ]);

  const emit = useCallback((event: string, data: any) => {
    if (socket.current?.connected) {
      socket.current.emit(event, data);
    } else {
      console.warn("Socket.io is not connected");
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [connect]);

  return {
    isConnected,
    emit,
    connectionStatus,
  };
}
