import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

interface DoorInteractionProps {
  position: [number, number, number];
  playerPosition: [number, number, number];
  onEnter: () => void;
  buildingName: string;
}

const DoorInteraction = ({ position, playerPosition, onEnter, buildingName }: DoorInteractionProps) => {
  const [isNear, setIsNear] = useState(false);

  useFrame(() => {
    const dx = playerPosition[0] - position[0];
    const dz = playerPosition[2] - position[2];
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    const wasNear = isNear;
    const nowNear = distance < 3;
    
    if (nowNear !== wasNear) {
      setIsNear(nowNear);
    }

    // Check for E key press when near
    if (nowNear && (window as any)._gameKeys?.e) {
      onEnter();
      (window as any)._gameKeys.e = false; // Prevent repeated triggers
    }
  });

  if (!isNear) return null;

  return (
    <group position={[position[0], position[1] + 2, position[2]]}>
      <Text
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {`Press E to enter ${buildingName}`}
      </Text>
    </group>
  );
};

export default DoorInteraction;
