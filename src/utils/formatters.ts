import type { TemperatureUnit, WindSpeedUnit } from '../types/weather';

export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatTempNumber(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  if (unit === 'mph') {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function getWindDirectionCompass(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function formatHourlyTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch {
    return isoString.slice(11, 16);
  }
}

export function formatDailyDate(dateString: string): { dayName: string; formattedDate: string; isToday: boolean } {
  try {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const dayName = isToday ? 'Today' : date.toLocaleDateString([], { weekday: 'short' });
    const formattedDate = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return { dayName, formattedDate, isToday };
  } catch {
    return { dayName: dateString, formattedDate: dateString, isToday: false };
  }
}

export function getUvCategory(uv: number): { label: string; color: string } {
  if (uv < 3) return { label: 'Low', color: 'text-emerald-400' };
  if (uv < 6) return { label: 'Moderate', color: 'text-yellow-400' };
  if (uv < 8) return { label: 'High', color: 'text-amber-500' };
  if (uv < 11) return { label: 'Very High', color: 'text-red-500' };
  return { label: 'Extreme', color: 'text-purple-500' };
}
