import React, { useRef } from 'react';
import { Clock, Droplets, ChevronLeft, ChevronRight, Wind } from 'lucide-react';
import type { HourlyForecastItem, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { formatHourlyTime, formatTemp, formatWindSpeed } from '../utils/formatters';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  tempUnit,
  windUnit,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!hourly.length) return null;

  return (
    <div className="w-full glass-panel rounded-3xl p-6 shadow-xl relative">
      {/* Header with Navigation arrows */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-white m-0">Hourly Forecast (Next 24 Hours)</h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-xl glass-button text-slate-300 hover:text-white"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-xl glass-button text-slate-300 hover:text-white"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hourly scrollable row */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1 snap-x"
      >
        {hourly.map((item, index) => {
          const isFirst = index === 0;
          const timeLabel = isFirst ? 'Now' : formatHourlyTime(item.time);

          return (
            <div
              key={item.time}
              className={`flex flex-col items-center justify-between min-w-[90px] sm:min-w-[105px] p-3.5 rounded-2xl border transition-all shrink-0 snap-start ${
                isFirst
                  ? 'bg-sky-500/20 border-sky-400/40 shadow-lg shadow-sky-500/10'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {/* Time */}
              <span className="text-xs font-semibold text-slate-300 mb-2">
                {timeLabel}
              </span>

              {/* Weather Icon */}
              <div className="my-1.5">
                <WeatherIcon
                  name={item.condition.iconName}
                  size={32}
                  animate={false}
                />
              </div>

              {/* Temperature */}
              <span className="text-lg font-bold text-white mt-1">
                {formatTemp(item.temperature, tempUnit)}
              </span>

              {/* Rain Chance */}
              <div className="mt-2.5 flex items-center gap-1 text-[11px] text-cyan-300">
                {item.precipitationProbability > 0 ? (
                  <>
                    <Droplets className="w-3 h-3 text-cyan-400" />
                    <span>{item.precipitationProbability}%</span>
                  </>
                ) : (
                  <span className="text-slate-500 text-[10px]">—</span>
                )}
              </div>

              {/* Wind mini */}
              <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                <Wind className="w-2.5 h-2.5 text-slate-500" />
                <span>{formatWindSpeed(item.windSpeed, windUnit).split(' ')[0]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
