// src/App.tsx
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Index from './pages/Index';
import Calendar from './pages/Calendar';
import AddHabit from './pages/AddHabit';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { SettingsProvider } from './context/SettingsContext';
import { useEffect } from 'react';
import { useSettings } from './context/SettingsContext';

const queryClient = new QueryClient();

// Custom hook to apply initial theme
const useApplyInitialTheme = () => {
  const { settings } = useSettings();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);
};

const App = () => {
  useApplyInitialTheme(); // Apply initial theme on app load

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SettingsProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background text-foreground">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/add-habit" element={<AddHabit />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
              <Navbar />
            </div>
          </BrowserRouter>
        </SettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;