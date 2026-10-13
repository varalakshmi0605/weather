import { useState } from 'react';
import { useWeather } from './hooks/useWeather';
import { useFavorites } from './hooks/useFavorites';
import { WeatherBackground } from './components/WeatherBackground';
import { Navbar } from './components/Navbar';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherMetrics } from './components/WeatherMetrics';
import { SearchModal } from './components/SearchModal';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  const {
    location,
    setLocation,
    weatherData,
    loading,
    geoLocating,
    error,
    tempUnit,
    windUnit,
    toggleTempUnit,
    refreshWeather,
    detectLocation,
  } = useWeather();

  const {
    toggleFavorite,
    isFavorite,
  } = useFavorites();

  const currentConditionCategory = weatherData?.current.condition.category;
  const isDay = weatherData?.current.isDay ?? true;
  const todayDaily = weatherData?.daily?.[0];

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Ambient dynamic sky backdrop */}
      <WeatherBackground category={currentConditionCategory} isDay={isDay} />

      {/* Navigation & Controls */}
      <Navbar
        currentLocation={location}
        tempUnit={tempUnit}
        onToggleTempUnit={toggleTempUnit}
        onOpenSearch={() => setSearchOpen(true)}
        onUseCurrentLocation={detectLocation}
        onRefresh={refreshWeather}
        isFavorite={isFavorite(location.name)}
        onToggleFavorite={() => toggleFavorite(location)}
        loading={loading}
        geoLocating={geoLocating}
      />

      {/* Main Container */}
      <main className="w-full max-w-6xl mx-auto px-4 flex-1 pb-16 space-y-6">
        {/* Error Notification Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={refreshWeather}
              className="px-3 py-1.5 rounded-xl bg-rose-500/30 hover:bg-rose-500/40 text-xs font-semibold text-white border border-rose-400/30 flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !weatherData && (
          <div className="space-y-6 animate-pulse">
            <div className="h-72 glass-panel rounded-3xl" />
            <div className="h-44 glass-panel rounded-3xl" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 glass-panel rounded-3xl" />
              <div className="h-96 glass-panel rounded-3xl" />
            </div>
          </div>
        )}

        {/* Weather Content */}
        {weatherData && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Hero: Current Weather */}
            <CurrentWeather
              current={weatherData.current}
              todayDaily={todayDaily}
              location={weatherData.location}
              tempUnit={tempUnit}
              windUnit={windUnit}
              lastUpdated={weatherData.lastUpdated}
            />

            {/* Middle Section: Next 24 Hours Timeline */}
            <HourlyForecast
              hourly={weatherData.hourly}
              tempUnit={tempUnit}
              windUnit={windUnit}
            />

            {/* Bottom Section: 7-Day Outlook & In-depth Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: 7-Day Forecast */}
              <div className="lg:col-span-5">
                <DailyForecast
                  daily={weatherData.daily}
                  tempUnit={tempUnit}
                  windUnit={windUnit}
                />
              </div>

              {/* Right Column: Detailed Highlights & Metrics */}
              <div className="lg:col-span-7">
                <WeatherMetrics
                  current={weatherData.current}
                  todayDaily={todayDaily}
                  airQuality={weatherData.airQuality}
                  tempUnit={tempUnit}
                  windUnit={windUnit}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectLocation={setLocation}
        onUseCurrentLocation={detectLocation}
        isLocating={geoLocating}
      />
    </div>
  );
}
