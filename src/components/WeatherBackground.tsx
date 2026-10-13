import React from 'react';
import { Cloud, Sun } from 'lucide-react';
import type { WeatherCategory } from '../types/weather';

interface WeatherBackgroundProps {
  category?: WeatherCategory;
  isDay?: boolean;
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
  category = 'clear-day',
  isDay = true,
}) => {
  const getGradient = () => {
    if (!isDay && (category === 'clear-day' || category === 'clear-night')) {
      return 'from-slate-950 via-indigo-950 to-slate-900';
    }

    switch (category) {
      case 'clear-day':
        return 'from-sky-500 via-blue-600 to-indigo-700';
      case 'clear-night':
        return 'from-slate-950 via-indigo-950 to-slate-900';
      case 'cloudy':
        return isDay
          ? 'from-slate-600 via-slate-700 to-slate-900'
          : 'from-slate-900 via-zinc-950 to-neutral-900';
      case 'fog':
        return 'from-slate-700 via-zinc-800 to-stone-900';
      case 'drizzle':
      case 'rain':
        return 'from-slate-800 via-cyan-950 to-blue-950';
      case 'snow':
        return 'from-slate-800 via-sky-950 to-indigo-950';
      case 'thunderstorm':
        return 'from-purple-950 via-slate-950 to-neutral-950';
      default:
        return 'from-slate-900 via-indigo-950 to-slate-950';
    }
  };

  const isRainy = category === 'rain' || category === 'drizzle' || category === 'thunderstorm';
  const hasMovingClouds =
    isRainy || category === 'clear-day' || category === 'cloudy' || category === 'fog';

  return (
    <div className={`fixed inset-0 -z-10 bg-gradient-to-br ${getGradient()} transition-colors duration-1000 ease-in-out overflow-hidden`}>
      {/* Sun / Moon celestial ambient glow */}
      {isDay && (category === 'clear-day' || category === 'cloudy') && (
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl pointer-events-none animate-pulse" />
      )}
      {isDay && category === 'clear-day' && (
        <Sun
          className="weather-sun"
          aria-hidden="true"
        />
      )}
      {!isDay && (
        <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-indigo-300/10 blur-3xl pointer-events-none" />
      )}

      {/* Atmospheric accent orbs */}
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {hasMovingClouds && (
        <div className={`weather-clouds ${category === 'thunderstorm' ? 'weather-clouds-storm' : isRainy ? 'weather-clouds-rainy' : category === 'cloudy' || category === 'fog' ? 'weather-clouds-overcast' : 'weather-clouds-sunny'}`} aria-hidden="true">
          <Cloud className="weather-cloud weather-cloud-one" />
          <Cloud className="weather-cloud weather-cloud-two" />
          <Cloud className="weather-cloud weather-cloud-three" />
          <Cloud className="weather-cloud weather-cloud-four" />
        </div>
      )}

      {isRainy && (
        <div className={`weather-rain ${category === 'thunderstorm' ? 'weather-rain-storm' : ''}`} aria-hidden="true">
          {Array.from({ length: category === 'thunderstorm' ? 68 : 42 }, (_, index) => (
            <span
              className="weather-raindrop"
              key={index}
              style={{
                left: `${(index * 37) % 100}%`,
                animationDelay: `${-((index * 13) % 20) / 10}s`,
                animationDuration: `${0.75 + ((index * 7) % 8) / 10}s`,
              }}
            />
          ))}
        </div>
      )}

      {category === 'thunderstorm' && (
        <div className="weather-lightning" aria-hidden="true">
          <span className="weather-lightning-bolt" />
          <span className="weather-lightning-bolt weather-lightning-bolt-secondary" />
        </div>
      )}

      {category === 'snow' && (
        <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:28px_28px] animate-[pulse_4s_infinite]" />
      )}

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
    </div>
  );
};
