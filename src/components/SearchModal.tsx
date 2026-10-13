import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, X, Loader2, Navigation, Compass } from 'lucide-react';
import type { LocationInfo } from '../types/weather';
import { POPULAR_LOCATIONS, searchLocations } from '../services/weatherApi';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: LocationInfo) => void;
  onUseCurrentLocation: () => void;
  isLocating?: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  onUseCurrentLocation,
  isLocating,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setQuery('');
    setResults([]);
    setLoading(false);
    onClose();
  }, [onClose]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim().length >= 2) {
      setLoading(true);
    } else {
      setLoading(false);
      setResults([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      const items = await searchLocations(query);
      if (!cancelled) {
        setResults(items);
        setLoading(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden glass-panel-dark flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-700/60 flex items-center gap-3">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search city, state or country..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-lg outline-none"
          />
          {loading && <Loader2 className="w-5 h-5 text-sky-400 animate-spin shrink-0" />}
          {query && !loading && (
            <button
              onClick={() => handleQueryChange('')}
              className="text-slate-400 hover:text-white p-1 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white px-2 py-1 text-sm bg-slate-800 rounded-lg hover:bg-slate-700 transition"
          >
            Esc
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {/* Current Location Quick Option */}
          <button
            onClick={() => {
              onUseCurrentLocation();
              handleClose();
            }}
            disabled={isLocating}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-300 transition-colors group text-left"
          >
            {isLocating ? (
              <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
            ) : (
              <Navigation className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
            )}
            <div>
              <p className="font-medium text-sky-100">Use Current Location</p>
              <p className="text-xs text-sky-300/70">Detect using GPS</p>
            </div>
          </button>

          {/* Search Results */}
          {query.trim().length >= 2 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
                Search Results
              </p>
              {results.length === 0 && !loading ? (
                <div className="p-8 text-center text-slate-400">
                  <Compass className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                  <p>No locations found for &quot;{query}&quot;</p>
                  <p className="text-xs text-slate-500 mt-1">Try searching for a major city or checking spelling</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {results.map((loc, idx) => (
                    <button
                      key={`${loc.name}-${loc.latitude}-${loc.longitude}-${idx}`}
                      onClick={() => {
                        onSelectLocation(loc);
                        handleClose();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 transition-colors text-left group border border-transparent hover:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors shrink-0" />
                        <div>
                          <p className="font-medium text-slate-100 group-hover:text-white">
                            {loc.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 group-hover:text-slate-300 font-mono">
                        {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Popular Cities */
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
                Popular Cities
              </p>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    key={loc.name}
                    onClick={() => {
                      onSelectLocation(loc);
                      handleClose();
                    }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-left transition hover:border-slate-600"
                  >
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                    <div className="truncate">
                      <p className="font-medium text-sm text-slate-200 truncate">{loc.name}</p>
                      <p className="text-xs text-slate-400 truncate">{loc.country}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
