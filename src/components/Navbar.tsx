import React from 'react';
import {
  CloudSun,
  Search,
  Navigation,
  RefreshCw,
  Star,
  Loader2,
} from 'lucide-react';
import type { LocationInfo, TemperatureUnit } from '../types/weather';

interface NavbarProps {
  currentLocation: LocationInfo;
  tempUnit: TemperatureUnit;
  onToggleTempUnit: () => void;
  onOpenSearch: () => void;
  onUseCurrentLocation: () => void;
  onRefresh: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  loading: boolean;
  geoLocating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocation,
  tempUnit,
  onToggleTempUnit,
  onOpenSearch,
  onUseCurrentLocation,
  onRefresh,
  isFavorite,
  onToggleFavorite,
  loading,
  geoLocating,
}) => {
  return (
    <header className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Brand */}
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 shadow-lg shadow-sky-500/20 text-white">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
              Forecasting <span className="text-xs uppercase px-1.5 py-0.5 rounded font-mono bg-sky-500/20 text-sky-300 border border-sky-400/30">Live</span>
            </h1>
            <p className="text-xs text-slate-300">Global Forecast & Radar</p>
          </div>
        </div>

        {/* Mobile quick actions */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onToggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2 rounded-xl glass-button text-slate-200 ${
              isFavorite ? 'text-amber-400 fill-amber-400 bg-amber-400/10 border-amber-400/30' : ''
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
          <button
            onClick={onToggleTempUnit}
            className="px-2.5 py-1.5 rounded-xl glass-button text-xs font-semibold text-white"
          >
            {tempUnit === 'celsius' ? '°C' : '°F'}
          </button>
        </div>
      </div>

      {/* Search Bar & Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {/* Search Input trigger */}
        <button
          onClick={onOpenSearch}
          className="flex-1 sm:w-72 flex items-center justify-between px-3.5 py-2 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-white/30 transition-all text-sm group"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            <span className="truncate">{currentLocation.name ? `${currentLocation.name}...` : 'Search city...'}</span>
          </div>
          <kbd className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10">
            Search
          </kbd>
        </button>

        {/* GPS Location button */}
        <button
          onClick={onUseCurrentLocation}
          disabled={geoLocating}
          title="Use current GPS location"
          className="p-2.5 rounded-xl glass-button text-slate-200 hover:text-sky-300 transition-colors disabled:opacity-50"
        >
          {geoLocating ? (
            <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
        </button>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          title="Refresh forecast data"
          className="p-2.5 rounded-xl glass-button text-slate-200 hover:text-sky-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
        </button>

        {/* Favorite button (Desktop) */}
        <button
          onClick={onToggleFavorite}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`hidden sm:flex p-2.5 rounded-xl glass-button text-slate-200 hover:text-amber-300 transition-colors ${
            isFavorite ? 'text-amber-400 bg-amber-400/10 border-amber-400/30' : ''
          }`}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>

        {/* Unit Toggle Switch (Desktop) */}
        <button
          onClick={onToggleTempUnit}
          title="Toggle temperature unit"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl glass-button text-sm font-semibold text-white hover:text-sky-300 transition-colors"
        >
          <span className={tempUnit === 'celsius' ? 'text-sky-400 font-bold' : 'text-slate-400'}>
            °C
          </span>
          <span className="text-slate-500">/</span>
          <span className={tempUnit === 'fahrenheit' ? 'text-sky-400 font-bold' : 'text-slate-400'}>
            °F
          </span>
        </button>
      </div>
    </header>
  );
};
