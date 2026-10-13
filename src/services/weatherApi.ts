import type {
  AirQuality,
  CurrentWeather,
  DailyForecastItem,
  HourlyForecastItem,
  LocationInfo,
  WeatherData,
} from '../types/weather';
import { getAqiDetails, getWeatherCondition } from '../utils/weatherCodes';

export const POPULAR_LOCATIONS: LocationInfo[] = [
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, admin1: 'England' },
  { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006, admin1: 'New York' },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, admin1: 'Tokyo' },
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, admin1: 'Île-de-France' },
  { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, admin1: 'New South Wales' },
  { name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, admin1: 'Dubai' },
  { name: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777, admin1: 'Maharashtra' },
];

export async function searchLocations(query: string): Promise<LocationInfo[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`
    );
    if (!res.ok) throw new Error('Geocoding search failed');
    const data = await res.json();

    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code,
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone,
    }));
  } catch (err) {
    console.error('Error searching locations:', err);
    return [];
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<LocationInfo> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
      {
        headers: { 'Accept-Language': 'en' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const name =
        addr.neighbourhood ||
        addr.suburb ||
        addr.village ||
        addr.town ||
        addr.city ||
        addr.municipality ||
        addr.county ||
        addr.state_district ||
        'My Location';
      const country = addr.country || '';
      const admin1 = addr.state || addr.region || '';
      return {
        name,
        country,
        admin1,
        latitude,
        longitude,
      };
    }
  } catch (err) {
    console.warn('Reverse geocode error or timed out, using fallback coordinates name:', err);
  }

  return {
    name: 'My Location',
    country: '',
    latitude,
    longitude,
  };
}

export async function fetchWeatherData(location: LocationInfo): Promise<WeatherData> {
  const { latitude, longitude } = location;

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,visibility&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto&forecast_days=8`;

  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,european_aqi,pm2_5,pm10`;

  const [weatherRes, aqiRes] = await Promise.allSettled([
    fetch(weatherUrl).then((r) => {
      if (!r.ok) throw new Error(`Weather fetch failed: ${r.statusText}`);
      return r.json();
    }),
    fetch(aqiUrl).then((r) => (r.ok ? r.json() : null)),
  ]);

  if (weatherRes.status === 'rejected') {
    throw weatherRes.reason;
  }

  const raw = weatherRes.value;

  // Process Current Weather
  const curRaw = raw.current;
  const isDay = curRaw.is_day === 1;
  const currentCondition = getWeatherCondition(curRaw.weather_code, isDay);

  const current: CurrentWeather = {
    time: curRaw.time,
    temperature: curRaw.temperature_2m,
    apparentTemperature: curRaw.apparent_temperature,
    humidity: curRaw.relative_humidity_2m,
    weatherCode: curRaw.weather_code,
    condition: currentCondition,
    isDay,
    windSpeed: curRaw.wind_speed_10m,
    windDirection: curRaw.wind_direction_10m,
    windGusts: curRaw.wind_gusts_10m ?? curRaw.wind_speed_10m,
    surfacePressure: Math.round(curRaw.surface_pressure),
    visibility: Math.round(curRaw.visibility / 1000), // convert meters to km
    uvIndex: curRaw.uv_index ?? 0,
    precipitation: curRaw.precipitation,
  };

  // Process Next 24 Hours
  const hourlyRaw = raw.hourly;
  const currentTime = new Date(curRaw.time).getTime();
  
  // Find current hour index or closest
  let startIndex = hourlyRaw.time.findIndex((t: string) => new Date(t).getTime() >= currentTime);
  if (startIndex === -1) startIndex = 0;

  const hourly: HourlyForecastItem[] = [];
  const hoursToInclude = 24;
  for (let i = startIndex; i < Math.min(startIndex + hoursToInclude, hourlyRaw.time.length); i++) {
    const itemIsDay = hourlyRaw.is_day?.[i] === 1;
    const code = hourlyRaw.weather_code[i];
    hourly.push({
      time: hourlyRaw.time[i],
      temperature: hourlyRaw.temperature_2m[i],
      apparentTemperature: hourlyRaw.apparent_temperature[i],
      humidity: hourlyRaw.relative_humidity_2m[i],
      precipitationProbability: hourlyRaw.precipitation_probability[i] ?? 0,
      precipitation: hourlyRaw.precipitation[i] ?? 0,
      weatherCode: code,
      condition: getWeatherCondition(code, itemIsDay),
      windSpeed: hourlyRaw.wind_speed_10m[i],
      isDay: itemIsDay,
    });
  }

  // Process 7-day Daily Forecast
  const dailyRaw = raw.daily;
  const daily: DailyForecastItem[] = [];
  const daysCount = Math.min(7, dailyRaw.time.length);
  for (let i = 0; i < daysCount; i++) {
    const code = dailyRaw.weather_code[i];
    daily.push({
      date: dailyRaw.time[i],
      weatherCode: code,
      condition: getWeatherCondition(code, true),
      tempMax: dailyRaw.temperature_2m_max[i],
      tempMin: dailyRaw.temperature_2m_min[i],
      apparentTempMax: dailyRaw.apparent_temperature_max[i],
      apparentTempMin: dailyRaw.apparent_temperature_min[i],
      precipitationProbabilityMax: dailyRaw.precipitation_probability_max[i] ?? 0,
      precipitationSum: dailyRaw.precipitation_sum[i] ?? 0,
      windSpeedMax: dailyRaw.wind_speed_10m_max[i],
      uvIndexMax: dailyRaw.uv_index_max?.[i] ?? 0,
      sunrise: dailyRaw.sunrise[i],
      sunset: dailyRaw.sunset[i],
    });
  }

  // Process Air Quality if available
  let airQuality: AirQuality | undefined;
  if (aqiRes.status === 'fulfilled' && aqiRes.value?.current) {
    const aqiCur = aqiRes.value.current;
    const usAqi = aqiCur.us_aqi;
    const aqiInfo = getAqiDetails(usAqi);
    airQuality = {
      usAqi,
      europeanAqi: aqiCur.european_aqi,
      pm2_5: aqiCur.pm2_5,
      pm10: aqiCur.pm10,
      description: aqiInfo.description,
      level: aqiInfo.level,
      color: aqiInfo.color,
    };
  }

  return {
    location,
    current,
    hourly,
    daily,
    airQuality,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
