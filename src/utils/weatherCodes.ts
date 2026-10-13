import type { WeatherConditionInfo } from '../types/weather';

export function getWeatherCondition(code: number, isDay: boolean = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Clear Sky' : 'Clear Night',
        category: isDay ? 'clear-day' : 'clear-night',
        iconName: isDay ? 'Sun' : 'Moon',
      };
    case 1:
      return {
        code,
        label: isDay ? 'Mainly Clear' : 'Mainly Clear',
        category: isDay ? 'clear-day' : 'clear-night',
        iconName: isDay ? 'SunMedium' : 'Moon',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        category: 'cloudy',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        category: 'cloudy',
        iconName: 'Cloud',
      };
    case 45:
      return {
        code,
        label: 'Foggy',
        category: 'fog',
        iconName: 'CloudFog',
      };
    case 48:
      return {
        code,
        label: 'Depositing Rime Fog',
        category: 'fog',
        iconName: 'CloudFog',
      };
    case 51:
      return {
        code,
        label: 'Light Drizzle',
        category: 'drizzle',
        iconName: 'CloudDrizzle',
      };
    case 53:
      return {
        code,
        label: 'Moderate Drizzle',
        category: 'drizzle',
        iconName: 'CloudDrizzle',
      };
    case 55:
      return {
        code,
        label: 'Dense Drizzle',
        category: 'drizzle',
        iconName: 'CloudDrizzle',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        category: 'rain',
        iconName: 'CloudHail',
      };
    case 61:
      return {
        code,
        label: 'Slight Rain',
        category: 'rain',
        iconName: 'CloudRain',
      };
    case 63:
      return {
        code,
        label: 'Moderate Rain',
        category: 'rain',
        iconName: 'CloudRain',
      };
    case 65:
      return {
        code,
        label: 'Heavy Rain',
        category: 'rain',
        iconName: 'CloudRain',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        category: 'rain',
        iconName: 'CloudHail',
      };
    case 71:
      return {
        code,
        label: 'Slight Snow',
        category: 'snow',
        iconName: 'CloudSnow',
      };
    case 73:
      return {
        code,
        label: 'Moderate Snow',
        category: 'snow',
        iconName: 'CloudSnow',
      };
    case 75:
      return {
        code,
        label: 'Heavy Snow',
        category: 'snow',
        iconName: 'Snowflake',
      };
    case 77:
      return {
        code,
        label: 'Snow Grains',
        category: 'snow',
        iconName: 'Snowflake',
      };
    case 80:
      return {
        code,
        label: 'Slight Showers',
        category: 'rain',
        iconName: 'CloudRain',
      };
    case 81:
      return {
        code,
        label: 'Moderate Showers',
        category: 'rain',
        iconName: 'CloudRain',
      };
    case 82:
      return {
        code,
        label: 'Violent Showers',
        category: 'rain',
        iconName: 'CloudRain',
      };
    case 85:
      return {
        code,
        label: 'Slight Snow Showers',
        category: 'snow',
        iconName: 'CloudSnow',
      };
    case 86:
      return {
        code,
        label: 'Heavy Snow Showers',
        category: 'snow',
        iconName: 'CloudSnow',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        category: 'thunderstorm',
        iconName: 'CloudLightning',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Severe Thunderstorm & Hail',
        category: 'thunderstorm',
        iconName: 'CloudLightning',
      };
    default:
      return {
        code,
        label: 'Partly Cloudy',
        category: 'cloudy',
        iconName: 'Cloud',
      };
  }
}

export function getAqiDetails(usAqi?: number) {
  if (usAqi === undefined || usAqi === null) {
    return {
      description: 'Moderate air quality',
      level: 'Moderate' as const,
      color: '#fbbf24', // yellow
    };
  }

  if (usAqi <= 50) {
    return {
      description: 'Air quality is satisfactory and poses little or no risk.',
      level: 'Good' as const,
      color: '#34d399', // green
    };
  } else if (usAqi <= 100) {
    return {
      description: 'Air quality is acceptable; some pollutants may be moderate concern.',
      level: 'Moderate' as const,
      color: '#fbbf24', // yellow
    };
  } else if (usAqi <= 150) {
    return {
      description: 'Members of sensitive groups may experience health effects.',
      level: 'Unhealthy for Sensitive' as const,
      color: '#fb923c', // orange
    };
  } else if (usAqi <= 200) {
    return {
      description: 'Everyone may begin to experience health effects.',
      level: 'Unhealthy' as const,
      color: '#f87171', // red
    };
  } else if (usAqi <= 300) {
    return {
      description: 'Health alert: The risk of health effects is increased for all.',
      level: 'Very Unhealthy' as const,
      color: '#c084fc', // purple
    };
  } else {
    return {
      description: 'Health warning of emergency conditions.',
      level: 'Hazardous' as const,
      color: '#991b1b', // maroon
    };
  }
}
