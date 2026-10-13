import { useState, useEffect, useCallback } from 'react';
import type { LocationInfo, TemperatureUnit, WeatherData, WindSpeedUnit } from '../types/weather';
import { fetchWeatherData, POPULAR_LOCATIONS, reverseGeocode } from '../services/weatherApi';

const DEFAULT_LOCATION: LocationInfo = POPULAR_LOCATIONS[0]; // London

export function useWeather() {
  const [location, setLocation] = useState<LocationInfo>(() => {
    try {
      const saved = localStorage.getItem('weather_app_last_location');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_LOCATION;
  });

  const [tempUnit, setTempUnit] = useState<TemperatureUnit>(() => {
    try {
      return (localStorage.getItem('weather_app_temp_unit') as TemperatureUnit) || 'celsius';
    } catch {
      return 'celsius';
    }
  });

  const [windUnit, setWindUnit] = useState<WindSpeedUnit>('kmh');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [geoLocating, setGeoLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async (loc: LocationInfo) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(loc);
      setWeatherData(data);
      try {
        localStorage.setItem('weather_app_last_location', JSON.stringify(loc));
      } catch {
        // ignore
      }
    } catch (err: any) {
      console.error('Failed to fetch weather:', err);
      setError(err?.message || 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const execute = async () => {
      try {
        const data = await fetchWeatherData(location);
        if (!ignore) {
          setWeatherData(data);
          setError(null);
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err?.message || 'Failed to fetch weather data. Please try again.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    execute();
    return () => {
      ignore = true;
    };
  }, [location]);

  const toggleTempUnit = () => {
    setTempUnit((prev) => {
      const next = prev === 'celsius' ? 'fahrenheit' : 'celsius';
      localStorage.setItem('weather_app_temp_unit', next);
      setWindUnit(next === 'fahrenheit' ? 'mph' : 'kmh');
      return next;
    });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const detected = await reverseGeocode(lat, lon);
          setLocation(detected);
        } catch {
          setLocation({
            name: 'My Location',
            country: '',
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        } finally {
          setGeoLocating(false);
        }
      },
      (err) => {
        setGeoLocating(false);
        console.warn('Geolocation error:', err);
        setError('Location access denied or unavailable. You can search for your city above.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return {
    location,
    setLocation,
    weatherData,
    loading,
    geoLocating,
    error,
    tempUnit,
    windUnit,
    toggleTempUnit,
    refreshWeather: () => loadWeather(location),
    detectLocation,
  };
}
