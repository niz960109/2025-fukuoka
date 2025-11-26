import React from 'react';
import { Cloud, Sun, CloudRain, CloudFog, CloudLightning, Snowflake, ChevronDown, ChevronUp } from 'lucide-react';
import { WeatherType } from '../types';

interface DayHeaderProps {
  date: string;
  weekday: string;
  weather: WeatherType; 
  weatherTemp: string; 
  dayIndex: number;
  realTimeWeather?: {
    code: number;
    tempMax: number;
    tempMin: number;
  };
  isOpen?: boolean;
  onToggle?: () => void;
}

const DayHeader: React.FC<DayHeaderProps> = ({ date, weekday, weather, weatherTemp, dayIndex, realTimeWeather, isOpen, onToggle }) => {
  
  const getRealTimeIcon = (code: number) => {
    if (code <= 1) return <Sun size={18} className="text-notion-gray" />;
    if (code <= 3) return <Cloud size={18} className="text-notion-gray" />;
    if (code <= 48) return <CloudFog size={18} className="text-notion-gray" />;
    if (code <= 67) return <CloudRain size={18} className="text-notion-gray" />;
    if (code <= 77) return <Snowflake size={18} className="text-notion-gray" />;
    if (code <= 82) return <CloudRain size={18} className="text-notion-gray" />;
    if (code <= 99) return <CloudLightning size={18} className="text-notion-gray" />;
    return <Cloud size={18} className="text-notion-gray" />;
  };

  const getFallbackIcon = () => {
    switch (weather) {
      case 'sunny': return <Sun size={18} className="text-notion-gray" />;
      case 'rainy': return <CloudRain size={18} className="text-notion-gray" />;
      case 'cloudy': default: return <Cloud size={18} className="text-notion-gray" />;
    }
  };

  return (
    <div 
      onClick={onToggle}
      className="mt-6 mb-4 cursor-pointer group select-none"
    >
      <div className="flex items-center justify-between p-4 bg-white border border-notion-border rounded-xl shadow-sm hover:shadow-md hover:border-notion-gray transition-all">
        <div className="flex items-center">
          <div className={`mr-4 p-2 rounded-full transition-colors ${isOpen ? 'bg-notion-text text-white' : 'bg-notion-gray-bg text-notion-gray group-hover:bg-notion-gray group-hover:text-white'}`}>
             {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-notion-text flex items-baseline">
              <span className="mr-2">Day {dayIndex}</span>
              <span className="text-base text-notion-gray font-normal">{date} ({weekday})</span>
            </h2>
          </div>
        </div>
        
        {realTimeWeather ? (
          <div className="flex items-center text-sm text-notion-gray bg-notion-gray-bg px-3 py-1.5 rounded-lg">
            <span className="mr-2 flex items-center gap-2">
              {getRealTimeIcon(realTimeWeather.code)}
            </span>
            <span className="font-mono font-bold">{Math.round(realTimeWeather.tempMax)}°C</span>
          </div>
        ) : (
          <div className="flex items-center text-sm text-notion-gray bg-notion-gray-bg px-3 py-1.5 rounded-lg">
            <span className="mr-2">{getFallbackIcon()}</span>
            <span className="font-mono font-bold">{weatherTemp}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayHeader;