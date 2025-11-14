import { useRef, useEffect } from 'react';

interface TrafficLightProps {
  position: [number, number, number];
  state: 'red' | 'yellow' | 'green';
}

const TrafficLight = ({ position, state }: TrafficLightProps) => {
  const getColor = () => {
    switch (state) {
      case 'red': return '#ff0000';
      case 'yellow': return '#ffff00';
      case 'green': return '#00ff00';
      default: return '#ffffff';
    }
  };

  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      
      {/* Light housing */}
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.15]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Active light */}
      <mesh position={[0, 1.7, 0.08]}>
        <circleGeometry args={[0.08, 16]} />
        <meshStandardMaterial color={getColor()} emissive={getColor()} emissiveIntensity={2} />
      </mesh>
      
      {/* Light glow */}
      <pointLight position={[0, 1.7, 0.2]} color={getColor()} intensity={1} distance={3} />
    </group>
  );
};

export default TrafficLight;
