
import React from 'react';
import { Cloud, Sun, CloudRain, CloudFog, CloudLightning, Snowflake } from 'lucide-react';
import { WeatherType } from '../types';

interface DayHeaderProps {
  date: string;
  weekday: string;
  weather: WeatherType; // Fallback weather
  weatherTemp: string; // Fallback temp
  dayIndex: number;
  realTimeWeather?: {
    code: number;
    tempMax: number;
    tempMin: number;
  };
}

const DayHeader: React.FC<DayHeaderProps> = ({ date, weekday, weather, weatherTemp, dayIndex, realTimeWeather }) => {
  
  // WMO Weather interpretation codes (Open-Meteo)
  const getRealTimeIcon = (code: number) => {
    if (code <= 1) return <Sun size={14} className="text-notion-gray" />;
    if (code <= 3) return <Cloud size={14} className="text-notion-gray" />;
    if (code <= 48) return <CloudFog size={14} className="text-notion-gray" />;
    if (code <= 67) return <CloudRain size={14} className="text-notion-gray" />;
    if (code <= 77) return <Snowflake size={14} className="text-notion-gray" />;
    if (code <= 82) return <CloudRain size={14} className="text-notion-gray" />;
    if (code <= 99) return <CloudLightning size={14} className="text-notion-gray" />;
    return <Cloud size={14} className="text-notion-gray" />;
  };

  const getFallbackIcon = () => {
    switch (weather) {
      case 'sunny': return <Sun size={14} className="text-notion-gray" />;
      case 'rainy': return <CloudRain size={14} className="text-notion-gray" />;
      case 'cloudy': default: return <Cloud size={14} className="text-notion-gray" />;
    }
  };

  return (
    <div className="mt-8 mb-4">
      {/* Notion Divider */}
      <hr className="border-t border-notion-border mb-6" />
      
      <div className="flex items-center justify-between group">
        <h2 className="text-xl font-bold text-notion-text flex items-center">
          <span className="bg-notion-gray-bg text-notion-text px-1.5 rounded mr-2 text-sm font-normal py-0.5 border border-notion-border">Day {dayIndex}</span>
          <span>{date} ({weekday})</span>
        </h2>
        
        {realTimeWeather ? (
          <div className="flex items-center text-sm text-notion-gray bg-white border border-notion-border px-2 py-1 rounded shadow-sm">
            <span className="mr-2 flex items-center gap-1">
              {getRealTimeIcon(realTimeWeather.code)}
              <span className="text-[10px] uppercase font-bold tracking-tighter text-blue-600/70">LIVE</span>
            </span>
            <span className="font-mono">{Math.round(realTimeWeather.tempMax)}°C</span>
          </div>
        ) : (
          <div className="flex items-center text-sm text-notion-gray bg-white border border-notion-border px-2 py-1 rounded shadow-sm">
            <span className="mr-2">{getFallbackIcon()}</span>
            <span className="font-mono">{weatherTemp}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayHeader;
