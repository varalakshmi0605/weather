import React from 'react';
import {
  Compass,
  Sun,
  Sunset,
  Sunrise,
  Gauge,
  Wind,
  ShieldAlert,
  Droplets,
  Eye,
} from 'lucide-react';
import type { AirQuality, CurrentWeather, DailyForecastItem, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import {
  formatHourlyTime,
  formatWindSpeed,
  getUvCategory,
  getWindDirectionCompass,
} from '../utils/formatters';

interface WeatherMetricsProps {
  current: CurrentWeather;
  todayDaily?: DailyForecastItem;
  airQuality?: AirQuality;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const WeatherMetrics: React.FC<WeatherMetricsProps> = ({
  current,
  todayDaily,
  airQuality,
  windUnit,
}) => {
  const uvInfo = getUvCategory(current.uvIndex);
  const compassDir = getWindDirectionCompass(current.windDirection);

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Gauge className="w-5 h-5 text-sky-400" /> Weather Highlights & Metrics
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Wind & Direction */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-400" /> Wind
            </span>
            <span className="text-xs text-sky-300 font-medium">{compassDir}</span>
          </div>

          <div className="my-4 flex items-center justify-between">
            <div>
              <p className="text-3xl font-extrabold text-white">
                {formatWindSpeed(current.windSpeed, windUnit)}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Gusts: {formatWindSpeed(current.windGusts, windUnit)}
              </p>
            </div>

            {/* Rotating compass needle */}
            <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center relative shadow-inner">
              <Compass
                className="w-8 h-8 text-sky-300 transition-transform duration-700"
                style={{ transform: `rotate(${current.windDirection}deg)` }}
              />
              <span className="absolute -top-1.5 text-[9px] font-bold text-slate-400">N</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-2.5">
            Wind angle {current.windDirection}° towards {compassDir}
          </div>
        </div>

        {/* Card 2: UV Index */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" /> UV Index
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 ${uvInfo.color}`}>
              {uvInfo.label}
            </span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{current.uvIndex.toFixed(1)}</span>
              <span className="text-xs text-slate-400">/ 11+</span>
            </div>

            {/* UV Gauge Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (current.uvIndex / 11) * 100)}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-2.5">
            {current.uvIndex >= 6
              ? 'High protection needed: use sunscreen & shades.'
              : 'Minimal protection required for average exposure.'}
          </div>
        </div>

        {/* Card 3: Air Quality (AQI) */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400" /> Air Quality
            </span>
            {airQuality?.level && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full text-slate-900"
                style={{ backgroundColor: airQuality.color }}
              >
                {airQuality.level}
              </span>
            )}
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">
                {airQuality?.usAqi !== undefined ? airQuality.usAqi : '--'}
              </span>
              <span className="text-xs text-slate-400">AQI (US)</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 line-clamp-1">
              {airQuality?.description || 'Air quality index within standard threshold.'}
            </p>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-2.5 flex justify-between">
            <span>PM2.5: {airQuality?.pm2_5 ? `${airQuality.pm2_5} µg/m³` : 'Normal'}</span>
            <span>PM10: {airQuality?.pm10 ? `${airQuality.pm10} µg/m³` : 'Normal'}</span>
          </div>
        </div>

        {/* Card 4: Sunrise & Sunset */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sunrise className="w-4 h-4 text-amber-300" /> Sun Schedule
            </span>
            <span className="text-xs text-slate-400">Solar Daylight</span>
          </div>

          <div className="my-4 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20">
                <Sunrise className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Sunrise</p>
                <p className="text-sm font-bold text-white">
                  {todayDaily ? formatHourlyTime(todayDaily.sunrise) : '--:--'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-400/10 text-indigo-300 border border-indigo-400/20">
                <Sunset className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Sunset</p>
                <p className="text-sm font-bold text-white">
                  {todayDaily ? formatHourlyTime(todayDaily.sunset) : '--:--'}
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-2.5">
            {current.isDay ? 'Daytime underway' : 'Night period active'}
          </div>
        </div>

        {/* Card 5: Barometric Pressure */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-sky-400" /> Pressure
            </span>
            <span className="text-xs text-slate-400">Barometer</span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{current.surfacePressure}</span>
              <span className="text-xs text-slate-400">hPa</span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              {current.surfacePressure > 1013
                ? 'High pressure system (fair/stable skies)'
                : 'Low pressure system (higher cloud & rain probability)'}
            </p>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-2.5">
            Normal standard sea-level is 1013 hPa
          </div>
        </div>

        {/* Card 6: Humidity & Visibility Details */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-400" /> Moisture & Sight
            </span>
            <span className="text-xs text-emerald-400 font-medium">Clear</span>
          </div>

          <div className="my-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Droplets className="w-3 h-3 text-sky-300" /> Relative Humidity
              </p>
              <p className="text-2xl font-extrabold text-white mt-1">{current.humidity}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Eye className="w-3 h-3 text-emerald-300" /> Range
              </p>
              <p className="text-2xl font-extrabold text-white mt-1">{current.visibility} km</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-white/10 pt-2.5">
            {current.humidity > 70 ? 'Muggy and moist atmosphere' : 'Crisp and comfortable air'}
          </div>
        </div>
      </div>
    </div>
  );
};
