import { useEffect, useRef } from 'react';
import { WeatherState } from './useWeather';

export const useWeatherAudio = (weather: WeatherState) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const snowGainRef = useRef<GainNode | null>(null);
  const rainBufferSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const snowBufferSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Initialize audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    
    // Create gain nodes for volume control
    if (!rainGainRef.current) {
      rainGainRef.current = ctx.createGain();
      rainGainRef.current.connect(ctx.destination);
      rainGainRef.current.gain.value = 0;
    }
    
    if (!snowGainRef.current) {
      snowGainRef.current = ctx.createGain();
      snowGainRef.current.connect(ctx.destination);
      snowGainRef.current.gain.value = 0;
    }

    // Generate rain sound using noise
    const generateRainBuffer = () => {
      const sampleRate = ctx.sampleRate;
      const duration = 2; // 2 second loop
      const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < buffer.length; i++) {
        // Brown noise for rain
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }
      
      // Apply low-pass filter manually
      for (let i = 1; i < buffer.length; i++) {
        data[i] = data[i] * 0.7 + data[i - 1] * 0.3;
      }
      
      return buffer;
    };

    // Generate wind/snow sound
    const generateSnowBuffer = () => {
      const sampleRate = ctx.sampleRate;
      const duration = 3;
      const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < buffer.length; i++) {
        // Soft white noise for wind
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }
      
      return buffer;
    };

    // Start rain sound if needed
    if (weather.type === 'rain' && !rainBufferSourceRef.current) {
      const rainBuffer = generateRainBuffer();
      const source = ctx.createBufferSource();
      source.buffer = rainBuffer;
      source.loop = true;
      source.connect(rainGainRef.current!);
      source.start(0);
      rainBufferSourceRef.current = source;
    }

    // Start snow sound if needed
    if (weather.type === 'snow' && !snowBufferSourceRef.current) {
      const snowBuffer = generateSnowBuffer();
      const source = ctx.createBufferSource();
      source.buffer = snowBuffer;
      source.loop = true;
      source.connect(snowGainRef.current!);
      source.start(0);
      snowBufferSourceRef.current = source;
    }

    // Update volumes based on weather
    const targetRainVolume = weather.type === 'rain' ? weather.intensity * 0.3 : 0;
    const targetSnowVolume = weather.type === 'snow' ? weather.intensity * 0.2 : 0;

    // Smooth transition
    if (rainGainRef.current) {
      rainGainRef.current.gain.setTargetAtTime(targetRainVolume, ctx.currentTime, 0.5);
    }
    
    if (snowGainRef.current) {
      snowGainRef.current.gain.setTargetAtTime(targetSnowVolume, ctx.currentTime, 0.5);
    }

    return () => {
      // Cleanup will happen on component unmount
    };
  }, [weather]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rainBufferSourceRef.current) {
        rainBufferSourceRef.current.stop();
        rainBufferSourceRef.current = null;
      }
      if (snowBufferSourceRef.current) {
        snowBufferSourceRef.current.stop();
        snowBufferSourceRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);
};
