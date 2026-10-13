import React from 'react';
import { MapPin, X } from 'lucide-react';
import type { LocationInfo } from '../types/weather';

interface FavoritesBarProps {
  favorites: LocationInfo[];
  currentLocation: LocationInfo;
  onSelectLocation: (loc: LocationInfo) => void;
  onRemoveFavorite: (name: string) => void;
}

export const FavoritesBar: React.FC<FavoritesBarProps> = ({
  favorites,
  currentLocation,
  onSelectLocation,
  onRemoveFavorite,
}) => {
  if (!favorites.length) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-4">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 shrink-0 mr-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-sky-400" /> Pinned:
        </span>
        {favorites.map((loc) => {
          const isActive =
            loc.name.toLowerCase() === currentLocation.name?.toLowerCase() ||
            (Math.abs(loc.latitude - currentLocation.latitude) < 0.1 &&
              Math.abs(loc.longitude - currentLocation.longitude) < 0.1);

          return (
            <div
              key={`${loc.name}-${loc.country}`}
              className={`group inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-sky-500/30 text-white border-sky-400/50 shadow-sm shadow-sky-500/30'
                  : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/20 hover:text-white'
              }`}
              onClick={() => onSelectLocation(loc)}
            >
              <span>{loc.name}</span>
              {loc.country && <span className="opacity-60 text-[10px]">{loc.countryCode || loc.country}</span>}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(loc.name);
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-red-300 transition-opacity p-0.5 rounded-full"
                title="Remove favorite"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
