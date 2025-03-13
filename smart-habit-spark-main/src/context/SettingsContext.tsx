// src/context/SettingsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client"; // Corrected: Use default import

// Define the shape of the settings
interface Settings {
  pushNotifications: boolean;
  aiSuggestions: boolean;
  darkMode: boolean;
  autoSync: boolean;
  timeZone: boolean;
  language: string;
  privacy: boolean;
}

// Initial settings
const initialSettings: Settings = {
  pushNotifications: true,
  aiSuggestions: true,
  darkMode: true,
  autoSync: true,
  timeZone: true,
  language: "en",
  privacy: true,
};

// Define the context type
interface SettingsContextType {
  settings: Settings;
  updateSetting: (key: keyof Settings, value: boolean | string) => void;
}

// Create context with default values
const SettingsContext = createContext<SettingsContextType>({
  settings: initialSettings,
  updateSetting: () => {},
});

// WebSocket URL
const SOCKET_URL = "http://localhost:3000";

// Infer the Socket type from the io function
type Socket = ReturnType<typeof io>;

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket: Socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Handle successful connection
    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server with ID:", newSocket.id);
    });

    // Listen for settings updates from the server
    newSocket.on("settingsUpdate", (updatedSettings: Partial<Settings>) => {
      console.log("Received settings update:", updatedSettings);
      setSettings((prev) => ({ ...prev, ...updatedSettings }));
    });

    // Handle connection errors
    newSocket.on("connect_error", (error: Error) => {
      console.error("WebSocket connection error:", error.message);
    });

    // Handle disconnection
    newSocket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Function to update a specific setting and sync with server
  const updateSetting = (key: keyof Settings, value: boolean | string) => {
    const updatedSettings = {
      ...settings,
      [key]: value,
    };
    setSettings(updatedSettings);

    if (socket && socket.connected) {
      socket.emit("updateSettings", { [key]: value });
    } else {
      console.warn("Socket not connected, update not sent:", { [key]: value });
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use settings context
export const useSettings = (): SettingsContextType => useContext(SettingsContext);