import React, { useMemo } from 'react';
import {
  MapPin,
  ArrowUp,
  ArrowDown,
  Droplets,
  Wind,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { CurrentWeather as CurrentWeatherType, DailyForecastItem, LocationInfo, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import { formatTemp, formatWindSpeed } from '../utils/formatters';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  current: CurrentWeatherType;
  todayDaily?: DailyForecastItem;
  location: LocationInfo;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  lastUpdated: string;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  current,
  todayDaily,
  location,
  tempUnit,
  windUnit,
  lastUpdated,
}) => {
  const currentDateFormatted = useMemo(() => {
    return new Date(current.time).toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }, [current.time]);

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      {/* Decorative ambient gradient backdrop within card */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top row: Location & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2 text-white">
          <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white m-0">
            {location.name}
            {location.country && (
              <span className="text-base sm:text-lg font-normal text-slate-300 ml-2">
                {[location.admin1, location.country].filter(Boolean).join(', ')}
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>{currentDateFormatted}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Updated {lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Center main hero display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Huge Temp & Condition */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="flex items-center gap-6">
            <div className="p-4 sm:p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
              <WeatherIcon
                name={current.condition.iconName}
                size={72}
                className="scale-110 sm:scale-125"
              />
            </div>
            <div>
              <div className="flex items-baseline leading-none">
                <span className="text-6xl sm:text-8xl font-black tracking-tighter text-white drop-shadow-md">
                  {formatTemp(current.temperature, tempUnit)}
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-semibold text-sky-200 mt-2 flex items-center gap-2">
                {current.condition.label}
              </p>
            </div>
          </div>

          {/* Sub metrics: Feels like & Hi/Lo */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 text-sm">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Feels like <strong className="text-white">{formatTemp(current.apparentTemperature, tempUnit)}</strong></span>
            </div>

            {todayDaily && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-200">
                <span className="flex items-center text-rose-300">
                  <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                  <strong>{formatTemp(todayDaily.tempMax, tempUnit)}</strong>
                </span>
                <span className="text-slate-500">|</span>
                <span className="flex items-center text-sky-300">
                  <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                  <strong>{formatTemp(todayDaily.tempMin, tempUnit)}</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick glance badge cards */}
        <div className="md:col-span-5 grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-300 text-xs">
              <span>Wind Speed</span>
              <Wind className="w-4 h-4 text-sky-300" />
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-white">
                {formatWindSpeed(current.windSpeed, windUnit)}
              </p>
              <p className="text-[11px] text-slate-300">
                Gusts up to {formatWindSpeed(current.windGusts, windUnit)}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-300 text-xs">
              <span>Humidity</span>
              <Droplets className="w-4 h-4 text-sky-300" />
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-white">{current.humidity}%</p>
              <p className="text-[11px] text-slate-300">
                {current.humidity > 65 ? 'High humidity' : current.humidity < 35 ? 'Dry air' : 'Comfortable'}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-300 text-xs">
              <span>Precipitation</span>
              <Droplets className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-white">
                {current.precipitation > 0 ? `${current.precipitation} mm` : '0 mm'}
              </p>
              <p className="text-[11px] text-slate-300">
                {todayDaily ? `${todayDaily.precipitationProbabilityMax}% chance today` : 'Expected'}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-300 text-xs">
              <span>Visibility</span>
              <span className="text-emerald-400 font-bold text-xs">Good</span>
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-white">{current.visibility} km</p>
              <p className="text-[11px] text-slate-300">
                {current.visibility >= 10 ? 'Clear line of sight' : 'Slight haze/fog'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
