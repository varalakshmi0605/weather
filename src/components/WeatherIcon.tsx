import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudHail,
  CloudSnow,
  Snowflake,
  CloudLightning,
  SunMedium,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
  animate?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  name,
  className = '',
  size = 24,
  animate = true,
}) => {
  const getIcon = () => {
    switch (name) {
      case 'Sun':
        return (
          <Sun
            size={size}
            className={`text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] ${
              animate ? 'animate-spin-slow' : ''
            } ${className}`}
          />
        );
      case 'SunMedium':
        return (
          <SunMedium
            size={size}
            className={`text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.5)] ${className}`}
          />
        );
      case 'Moon':
        return (
          <Moon
            size={size}
            className={`text-indigo-200 drop-shadow-[0_0_10px_rgba(199,210,254,0.4)] ${className}`}
          />
        );
      case 'CloudSun':
        return (
          <CloudSun
            size={size}
            className={`text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.4)] ${className}`}
          />
        );
      case 'CloudMoon':
        return (
          <CloudMoon
            size={size}
            className={`text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.3)] ${className}`}
          />
        );
      case 'Cloud':
        return <Cloud size={size} className={`text-slate-300 ${className}`} />;
      case 'CloudFog':
        return <CloudFog size={size} className={`text-slate-300 ${className}`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle size={size} className={`text-sky-300 ${className}`} />;
      case 'CloudRain':
        return (
          <CloudRain
            size={size}
            className={`text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)] ${className}`}
          />
        );
      case 'CloudHail':
        return <CloudHail size={size} className={`text-cyan-300 ${className}`} />;
      case 'CloudSnow':
        return (
          <CloudSnow
            size={size}
            className={`text-sky-200 drop-shadow-[0_0_8px_rgba(186,230,253,0.4)] ${className}`}
          />
        );
      case 'Snowflake':
        return (
          <Snowflake
            size={size}
            className={`text-sky-200 drop-shadow-[0_0_8px_rgba(186,230,253,0.5)] ${className}`}
          />
        );
      case 'CloudLightning':
        return (
          <CloudLightning
            size={size}
            className={`text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.6)] ${className}`}
          />
        );
      default:
        return <Cloud size={size} className={`text-slate-300 ${className}`} />;
    }
  };

  return <div className="inline-flex items-center justify-center">{getIcon()}</div>;
};
