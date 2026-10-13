import { useState, useEffect } from 'react';
import type { LocationInfo } from '../types/weather';
import { POPULAR_LOCATIONS } from '../services/weatherApi';

const STORAGE_KEY = 'weather_app_favorites_v1';

export function useFavorites() {
  const [favorites, setFavorites] = useState<LocationInfo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse favorites from storage', e);
    }
    // Initial defaults
    return POPULAR_LOCATIONS.slice(0, 4);
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to storage', e);
    }
  }, [favorites]);

  const addFavorite = (location: LocationInfo) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (item) => item.name.toLowerCase() === location.name.toLowerCase() && item.country === location.country
      );
      if (exists) return prev;
      return [location, ...prev];
    });
  };

  const removeFavorite = (name: string) => {
    setFavorites((prev) => prev.filter((item) => item.name.toLowerCase() !== name.toLowerCase()));
  };

  const isFavorite = (name: string): boolean => {
    return favorites.some((item) => item.name.toLowerCase() === name.toLowerCase());
  };

  const toggleFavorite = (location: LocationInfo) => {
    if (isFavorite(location.name)) {
      removeFavorite(location.name);
    } else {
      addFavorite(location);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}
