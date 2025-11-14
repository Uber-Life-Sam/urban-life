// src/components/game/WeatherSystem.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { InstancedMesh, Object3D, FogExp2 } from 'three';
import type { WeatherState } from '@/hooks/useWeather';

interface WeatherSystemProps {
  weather: WeatherState;
  areaSize?: number; // radius/half-extent of spawn area
}

const WeatherSystem = ({ weather, areaSize = 30 }: WeatherSystemProps) => {
  const { scene } = useThree();
  const instancedRef = useRef<InstancedMesh | null>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const positionsRef = useRef<Array<{ x: number; y: number; z: number; vy: number }>>([]);

  const getParticleCount = () => {
    if (weather.type === 'rain') return Math.max(80, Math.floor(250 * weather.intensity));
    if (weather.type === 'snow') return Math.max(40, Math.floor(150 * weather.intensity));
    return 0;
  };

  useEffect(() => {
    if (weather.type === 'clear') {
      scene.fog = null;
      return;
    }

    const density = 0.01 * (0.2 + weather.visibilityFactor);
    scene.fog = new FogExp2(0x9fb6c8, density);
    return () => {
      scene.fog = null;
    };
  }, [scene, weather.type, weather.visibilityFactor]);

  useEffect(() => {
    const count = getParticleCount();
    positionsRef.current = [];
    for (let i = 0; i < count; i++) {
      positionsRef.current.push({
        x: (Math.random() - 0.5) * areaSize * 2,
        y: Math.random() * 20 + 2,
        z: (Math.random() - 0.5) * areaSize * 2,
        vy: (0.8 + Math.random() * 1.5) * (weather.type === 'snow' ? 0.3 : 1.0),
      });
    }
  }, [weather, areaSize]);

  useFrame((_, delta) => {
    if (!instancedRef.current || positionsRef.current.length === 0) return;
    const imesh = instancedRef.current;
    const count = positionsRef.current.length;
    for (let i = 0; i < count; i++) {
      const p = positionsRef.current[i];
      const speedScale = 1 + weather.intensity * 1.5;
      p.y -= p.vy * delta * speedScale;
      if (weather.type === 'snow') {
        p.x += Math.sin((i + performance.now() * 0.001) * 0.5) * 0.01 * (1 + weather.intensity);
        p.z += Math.cos((i + performance.now() * 0.001) * 0.3) * 0.01 * (1 + weather.intensity);
      }
      if (p.y < 0) {
        p.y = 10 + Math.random() * 12;
        p.x = (Math.random() - 0.5) * areaSize * 2;
        p.z = (Math.random() - 0.5) * areaSize * 2;
      }

      dummy.position.set(p.x, p.y, p.z);

      if (weather.type === 'rain') {
        dummy.rotation.set(Math.PI / 2, 0, Math.random() * Math.PI);
        dummy.scale.set(0.03, 0.6, 0.03);
      } else {
        dummy.rotation.set(0, 0, 0);
        const s = 0.08 + 0.12 * Math.random();
        dummy.scale.set(s, s, s);
      }
      dummy.updateMatrix();
      imesh.setMatrixAt(i, dummy.matrix);
    }
    imesh.instanceMatrix.needsUpdate = true;
  });

  if (weather.type === 'clear' || getParticleCount() === 0) return null;

  return (
    <instancedMesh
      ref={instancedRef}
      args={[undefined as any, undefined as any, getParticleCount()]}
      position={[0, 0, 0]}
      frustumCulled={false}
    >
      {weather.type === 'rain' ? (
        <>  
          <boxGeometry args={[0.02, 1, 0.02]} />
          <meshBasicMaterial color={'#a7d8ff'} transparent opacity={0.6} />
        </>
      ) : (
        <>  
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshBasicMaterial color={'#ffffff'} transparent opacity={0.9} />
        </>
      )}
    </instancedMesh>
  );
};

export default WeatherSystem;
