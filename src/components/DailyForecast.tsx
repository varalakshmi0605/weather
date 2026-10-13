import React, { useState } from 'react';
import {
  CalendarDays,
  Droplets,
  ChevronDown,
  ChevronUp,
  Sun,
  Wind,
  Sunrise,
  Sunset,
} from 'lucide-react';
import type { DailyForecastItem, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import {
  formatDailyDate,
  formatHourlyTime,
  formatTemp,
  formatTempNumber,
  formatWindSpeed,
} from '../utils/formatters';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  daily,
  tempUnit,
  windUnit,
}) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  if (!daily.length) return null;

  // Calculate global min and max for accurate temperature range bars
  const allMinTemps = daily.map((d) => formatTempNumber(d.tempMin, tempUnit));
  const allMaxTemps = daily.map((d) => formatTempNumber(d.tempMax, tempUnit));
  const minTempAll = Math.min(...allMinTemps);
  const maxTempAll = Math.max(...allMaxTemps);
  const tempSpread = Math.max(1, maxTempAll - minTempAll);

  const toggleExpand = (date: string) => {
    setExpandedDate((prev) => (prev === date ? null : date));
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-sky-400" />
        <h3 className="text-lg font-bold text-white m-0">7-Day Extended Forecast</h3>
      </div>

      <div className="divide-y divide-white/10">
        {daily.map((item) => {
          const { dayName, formattedDate, isToday } = formatDailyDate(item.date);
          const isExpanded = expandedDate === item.date;

          const currentMin = formatTempNumber(item.tempMin, tempUnit);
          const currentMax = formatTempNumber(item.tempMax, tempUnit);

          const leftPercent = Math.max(0, ((currentMin - minTempAll) / tempSpread) * 100);
          const widthPercent = Math.max(8, ((currentMax - currentMin) / tempSpread) * 100);

          return (
            <div key={item.date} className="py-3 transition-colors">
              {/* Main day row */}
              <div
                onClick={() => toggleExpand(item.date)}
                className="flex items-center justify-between gap-3 cursor-pointer group hover:bg-white/5 p-2 rounded-2xl transition"
              >
                {/* Day name & date */}
                <div className="w-24 sm:w-28 shrink-0">
                  <p className={`text-sm font-bold ${isToday ? 'text-sky-300' : 'text-white'}`}>
                    {dayName}
                  </p>
                  <p className="text-xs text-slate-400">{formattedDate}</p>
                </div>

                {/* Condition & icon */}
                <div className="flex items-center gap-2.5 w-32 sm:w-40 shrink-0">
                  <WeatherIcon name={item.condition.iconName} size={26} animate={false} />
                  <span className="text-xs sm:text-sm text-slate-200 truncate hidden sm:inline">
                    {item.condition.label}
                  </span>
                </div>

                {/* Rain probability */}
                <div className="w-14 sm:w-16 flex items-center gap-1 text-xs text-cyan-300 shrink-0">
                  {item.precipitationProbabilityMax > 15 ? (
                    <>
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item.precipitationProbabilityMax}%</span>
                    </>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </div>

                {/* Range bar & min/max numbers */}
                <div className="flex-1 flex items-center justify-end sm:justify-center gap-3">
                  <span className="text-xs sm:text-sm font-medium text-slate-300 w-8 text-right">
                    {formatTemp(item.tempMin, tempUnit)}
                  </span>

                  {/* Gradient range bar */}
                  <div className="hidden sm:block flex-1 max-w-[140px] h-2 bg-white/10 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs sm:text-sm font-bold text-white w-8 text-left">
                    {formatTemp(item.tempMax, tempUnit)}
                  </span>
                </div>

                {/* Expand toggler */}
                <div className="text-slate-400 group-hover:text-white p-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded details section */}
              {isExpanded && (
                <div className="mt-2 p-4 bg-white/5 rounded-2xl border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-slate-400">Max UV Index</p>
                      <p className="font-semibold text-white">{item.uvIndexMax.toFixed(1)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <p className="text-slate-400">Max Wind</p>
                      <p className="font-semibold text-white">
                        {formatWindSpeed(item.windSpeedMax, windUnit)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sunrise className="w-4 h-4 text-amber-300 shrink-0" />
                    <div>
                      <p className="text-slate-400">Sunrise</p>
                      <p className="font-semibold text-white">{formatHourlyTime(item.sunrise)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sunset className="w-4 h-4 text-indigo-300 shrink-0" />
                    <div>
                      <p className="text-slate-400">Sunset</p>
                      <p className="font-semibold text-white">{formatHourlyTime(item.sunset)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
