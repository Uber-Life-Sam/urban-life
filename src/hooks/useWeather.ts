// src/hooks/useWeather.ts
import { useEffect, useRef, useState } from 'react';

export type WeatherType = 'clear' | 'rain' | 'snow' | 'fog';

export interface WeatherState {
  type: WeatherType;
  intensity: number; // 0..1 (0 for clear)
  visibilityFactor: number; // 0..1 where 0 = no reduction, 1 = strong reduction
}

const WEATHER_TYPES: WeatherType[] = ['clear', 'rain', 'snow', 'fog'];

export const useWeather = (timeOfDay: number) => {
  const [weather, setWeather] = useState<WeatherState>({ type: 'clear', intensity: 0, visibilityFactor: 0 });
  const timerRef = useRef<number | null>(null);

  const pickWeather = () => {
    const hour = timeOfDay ?? 12;
    let weights = WEATHER_TYPES.map(() => 1);

    // Simple biases by time of day
    if (hour >= 10 && hour <= 16) {
      weights = WEATHER_TYPES.map((t) => (t === 'clear' ? 5 : 1));
    } else if (hour >= 5 && hour <= 8) {
      weights = WEATHER_TYPES.map((t) => (t === 'fog' ? 3 : 1));
    } else if (hour >= 18 && hour <= 22) {
      weights = WEATHER_TYPES.map((t) => (t === 'snow' ? 2 : t === 'rain' ? 2 : 1));
    }

    const total = weights.reduce((a, b) => a + b, 0);
    const r = Math.random() * total;
    let cum = 0;
    let chosen: WeatherType = 'clear';
    for (let i = 0; i < WEATHER_TYPES.length; i++) {
      cum += weights[i];
      if (r <= cum) {
        chosen = WEATHER_TYPES[i];
        break;
      }
    }

    let intensity = 0;
    if (chosen === 'clear') intensity = 0;
    else intensity = parseFloat((0.3 + Math.random() * 0.7).toFixed(2)); // 0.3 .. 1.0

    // visibilityFactor: how much to reduce visibility (0..1)
    const visibilityFactor = chosen === 'clear' ? 0 : Math.min(1, intensity * (chosen === 'fog' ? 0.9 : 0.6));

    setWeather({ type: chosen, intensity, visibilityFactor });
  };

  useEffect(() => {
    // initial pick
    pickWeather();

    const scheduleChange = () => {
      const ms = 20000 + Math.floor(Math.random() * 50000); // change every 20s-70s
      timerRef.current = window.setTimeout(() => {
        pickWeather();
        scheduleChange();
      }, ms);
    };

    scheduleChange();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // small chance to re-roll when time changes (makes weather feel slightly reactive)
    if (Math.random() < 0.05) pickWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeOfDay]);

  const forceWeather = (type: WeatherType, intensity = 1) => {
    const visibilityFactor = type === 'clear' ? 0 : Math.min(1, intensity * (type === 'fog' ? 0.9 : 0.6));
    setWeather({ type, intensity, visibilityFactor });
  };

  return { weather, forceWeather } as const;
};
