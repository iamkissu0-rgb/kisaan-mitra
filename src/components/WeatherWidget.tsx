import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, ThermometerSun, AlertTriangle } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
}

interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  precipitationProbability: number;
}

interface WeatherWidgetProps {
  latitude?: number;
  longitude?: number;
  compact?: boolean;
}

// MP districts approximate coordinates
const defaultCoords = { lat: 23.2599, lon: 77.4126 }; // Bhopal

const weatherCodes: Record<number, { icon: typeof Sun; label: { hi: string; en: string } }> = {
  0: { icon: Sun, label: { hi: 'साफ आसमान', en: 'Clear sky' } },
  1: { icon: Sun, label: { hi: 'मुख्यतः साफ', en: 'Mainly clear' } },
  2: { icon: Cloud, label: { hi: 'आंशिक बादल', en: 'Partly cloudy' } },
  3: { icon: Cloud, label: { hi: 'बादल छाए', en: 'Overcast' } },
  45: { icon: Cloud, label: { hi: 'कोहरा', en: 'Fog' } },
  48: { icon: Cloud, label: { hi: 'घना कोहरा', en: 'Dense fog' } },
  51: { icon: CloudRain, label: { hi: 'हल्की बूंदाबांदी', en: 'Light drizzle' } },
  53: { icon: CloudRain, label: { hi: 'बूंदाबांदी', en: 'Drizzle' } },
  55: { icon: CloudRain, label: { hi: 'घनी बूंदाबांदी', en: 'Dense drizzle' } },
  61: { icon: CloudRain, label: { hi: 'हल्की बारिश', en: 'Slight rain' } },
  63: { icon: CloudRain, label: { hi: 'बारिश', en: 'Moderate rain' } },
  65: { icon: CloudRain, label: { hi: 'भारी बारिश', en: 'Heavy rain' } },
  71: { icon: CloudSnow, label: { hi: 'हल्की बर्फ', en: 'Slight snow' } },
  73: { icon: CloudSnow, label: { hi: 'बर्फबारी', en: 'Moderate snow' } },
  75: { icon: CloudSnow, label: { hi: 'भारी बर्फबारी', en: 'Heavy snow' } },
  80: { icon: CloudRain, label: { hi: 'हल्की बौछार', en: 'Slight showers' } },
  81: { icon: CloudRain, label: { hi: 'बौछार', en: 'Moderate showers' } },
  82: { icon: CloudRain, label: { hi: 'भारी बौछार', en: 'Violent showers' } },
  95: { icon: CloudRain, label: { hi: 'तूफान', en: 'Thunderstorm' } },
  96: { icon: CloudRain, label: { hi: 'ओलावृष्टि', en: 'Thunderstorm with hail' } },
  99: { icon: CloudRain, label: { hi: 'भारी ओलावृष्टि', en: 'Heavy hail' } },
};

export function WeatherWidget({ latitude, longitude, compact = false }: WeatherWidgetProps) {
  const { language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lat = latitude || defaultCoords.lat;
  const lon = longitude || defaultCoords.lon;

  useEffect(() => {
    fetchWeather();
  }, [lat, lon]);

  async function fetchWeather() {
    setIsLoading(true);
    setError(null);

    try {
      // Using Open-Meteo free API (no API key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia/Kolkata&forecast_days=5`
      );

      if (!response.ok) throw new Error('Weather API error');

      const data = await response.json();

      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day === 1,
      });

      const forecastDays: ForecastDay[] = data.daily.time.slice(0, 5).map((date: string, i: number) => ({
        date,
        maxTemp: Math.round(data.daily.temperature_2m_max[i]),
        minTemp: Math.round(data.daily.temperature_2m_min[i]),
        weatherCode: data.daily.weather_code[i],
        precipitationProbability: data.daily.precipitation_probability_max[i] || 0,
      }));

      setForecast(forecastDays);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Weather unavailable');
    } finally {
      setIsLoading(false);
    }
  }

  const getWeatherInfo = (code: number) => {
    return weatherCodes[code] || weatherCodes[0];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'short' });
  };

  // Check for weather alerts (heavy rain, extreme temps)
  const hasAlert = forecast.some(f => f.precipitationProbability > 70 || f.maxTemp > 42);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-4">
          <div className="h-16 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return null; // Silently fail - weather is optional
  }

  const currentWeather = getWeatherInfo(weather.weatherCode);
  const WeatherIcon = currentWeather.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <WeatherIcon className="w-4 h-4 text-primary" />
        <span className="font-medium">{weather.temperature}°C</span>
        <span className="text-muted-foreground">
          {language === 'hi' ? currentWeather.label.hi : currentWeather.label.en}
        </span>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <WeatherIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{weather.temperature}°C</p>
              <p className="text-sm text-muted-foreground">
                {language === 'hi' ? currentWeather.label.hi : currentWeather.label.en}
              </p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Droplets className="w-3 h-3" />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Wind className="w-3 h-3" />
              <span>{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>

        {/* Weather Alert */}
        {hasAlert && (
          <div className="flex items-center gap-2 p-2 bg-amber-100 rounded-lg text-amber-800 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {language === 'hi' 
                ? 'आगामी दिनों में भारी बारिश की संभावना' 
                : 'Heavy rain likely in coming days'}
            </span>
          </div>
        )}

        {/* 5-Day Forecast */}
        <div>
          <p className="text-sm font-medium mb-2">
            {language === 'hi' ? '5 दिन का पूर्वानुमान' : '5-Day Forecast'}
          </p>
          <div className="flex gap-2">
            {forecast.map((day, idx) => {
              const dayWeather = getWeatherInfo(day.weatherCode);
              const DayIcon = dayWeather.icon;

              return (
                <div
                  key={day.date}
                  className={`flex-1 text-center p-2 rounded-lg ${
                    idx === 0 ? 'bg-primary/10' : 'bg-muted/50'
                  }`}
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {idx === 0 ? (language === 'hi' ? 'आज' : 'Today') : formatDate(day.date)}
                  </p>
                  <DayIcon className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-sm font-medium">{day.maxTemp}°</p>
                  <p className="text-xs text-muted-foreground">{day.minTemp}°</p>
                  {day.precipitationProbability > 30 && (
                    <div className="flex items-center justify-center gap-0.5 text-xs text-blue-600 mt-1">
                      <Droplets className="w-2 h-2" />
                      {day.precipitationProbability}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Farming Tips based on weather */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium mb-1 flex items-center gap-2">
            <ThermometerSun className="w-4 h-4 text-primary" />
            {language === 'hi' ? 'खेती सुझाव' : 'Farming Tip'}
          </p>
          <p className="text-xs text-muted-foreground">
            {weather.weatherCode >= 61 ? (
              language === 'hi' 
                ? 'बारिश के बाद छिड़काव न करें, खेतों में जल निकासी सुनिश्चित करें।' 
                : 'Avoid spraying after rain, ensure proper drainage in fields.'
            ) : weather.temperature > 35 ? (
              language === 'hi'
                ? 'गर्मी में सुबह जल्दी या शाम को सिंचाई करें।'
                : 'Irrigate early morning or evening during hot days.'
            ) : (
              language === 'hi'
                ? 'मौसम अनुकूल है, बुवाई या छिड़काव के लिए उपयुक्त।'
                : 'Weather is favorable for sowing or spraying.'
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
