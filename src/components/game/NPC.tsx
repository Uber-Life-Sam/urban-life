import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface NPCProps {
  position: [number, number, number];
  rotation: number;
  color: string;
  scale?: number;
}

const NPC = ({ position, rotation, color, scale = 0.8 }: NPCProps) => {
  const groupRef = useRef<any>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[0.5 * scale, 1 * scale, 0.3 * scale]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Head */}
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.25 * scale, 16, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      
      {/* Arms */}
      <mesh castShadow receiveShadow position={[-0.35 * scale, 0.75, 0]}>
        <boxGeometry args={[0.15 * scale, 0.8 * scale, 0.15 * scale]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.35 * scale, 0.75, 0]}>
        <boxGeometry args={[0.15 * scale, 0.8 * scale, 0.15 * scale]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Legs */}
      <mesh castShadow receiveShadow position={[-0.15 * scale, 0.25, 0]}>
        <boxGeometry args={[0.2 * scale, 0.5 * scale, 0.2 * scale]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh castShadow receiveShadow position={[0.15 * scale, 0.25, 0]}>
        <boxGeometry args={[0.2 * scale, 0.5 * scale, 0.2 * scale]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  );
};

export default NPC;
