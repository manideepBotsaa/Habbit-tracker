
import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, CloudSnow, CloudSun, Sun, Wind } from 'lucide-react';
import GlassMorphism from '@/components/ui/GlassMorphism';

interface WeatherProps {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  temperature?: number;
  showEmoji?: boolean;
}

const Weather: React.FC<WeatherProps> = ({ condition, temperature, showEmoji = false }) => {
  const getWeatherIcon = () => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-6 w-6 text-orange-500" />;
      case 'cloudy':
        return <CloudSun className="h-6 w-6 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'snowy':
        return <CloudSnow className="h-6 w-6 text-blue-300" />;
      case 'windy':
        return <Wind className="h-6 w-6 text-gray-400" />;
    }
  };

  const getWeatherEmoji = () => {
    switch (condition) {
      case 'sunny':
        return "☀️";
      case 'cloudy':
        return "⛅";
      case 'rainy':
        return "🌧️";
      case 'snowy':
        return "❄️";
      case 'windy':
        return "💨";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <GlassMorphism className="flex items-center gap-3 p-3">
        {showEmoji ? (
          <span className="text-2xl">{getWeatherEmoji()}</span>
        ) : (
          getWeatherIcon()
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium">{condition.charAt(0).toUpperCase() + condition.slice(1)}</span>
          {temperature && (
            <span className="text-xs text-muted-foreground">{temperature}°C</span>
          )}
        </div>
      </GlassMorphism>
    </motion.div>
  );
};

export default Weather;
