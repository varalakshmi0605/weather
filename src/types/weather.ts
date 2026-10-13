export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';

export interface LocationInfo {
  id?: number | string;
  name: string;
  admin1?: string; // state/region
  country: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export type WeatherCategory =
  | 'clear-day'
  | 'clear-night'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm';

export interface WeatherConditionInfo {
  code: number;
  label: string;
  category: WeatherCategory;
  iconName: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
  isDay: boolean;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  surfacePressure: number;
  visibility: number; // in meters or km
  uvIndex: number;
  precipitation: number;
}

export interface HourlyForecastItem {
  time: string; // ISO string
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  condition: WeatherConditionInfo;
  windSpeed: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string; // YYYY-MM-DD
  weatherCode: number;
  condition: WeatherConditionInfo;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  precipitationProbabilityMax: number;
  precipitationSum: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface AirQuality {
  usAqi?: number;
  europeanAqi?: number;
  pm2_5?: number;
  pm10?: number;
  description: string;
  level: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  color: string;
}

export interface WeatherData {
  location: LocationInfo;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQuality;
  lastUpdated: string;
}
