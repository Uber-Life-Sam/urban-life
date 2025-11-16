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
  const leftLegRef = useRef<any>(null);
  const rightLegRef = useRef<any>(null);
  const leftArmRef = useRef<any>(null);
  const rightArmRef = useRef<any>(null);
  const prevPositionRef = useRef(position);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation;
    }

    // Check if NPC is moving
    const isMoving = 
      Math.abs(position[0] - prevPositionRef.current[0]) > 0.001 ||
      Math.abs(position[2] - prevPositionRef.current[2]) > 0.001;
    
    prevPositionRef.current = position;

    if (isMoving) {
      const time = state.clock.getElapsedTime();
      // Walking animation
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time * 10) * 0.4;
        rightLegRef.current.rotation.x = Math.sin(time * 10 + Math.PI) * 0.4;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(time * 10 + Math.PI) * 0.3;
        rightArmRef.current.rotation.x = Math.sin(time * 10) * 0.3;
      }
    } else {
      // Reset to neutral pose
      if (leftLegRef.current) leftLegRef.current.rotation.x *= 0.9;
      if (rightLegRef.current) rightLegRef.current.rotation.x *= 0.9;
      if (leftArmRef.current) leftArmRef.current.rotation.x *= 0.9;
      if (rightArmRef.current) rightArmRef.current.rotation.x *= 0.9;
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
      <mesh ref={leftArmRef} castShadow receiveShadow position={[-0.35 * scale, 0.75, 0]}>
        <boxGeometry args={[0.15 * scale, 0.8 * scale, 0.15 * scale]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh ref={rightArmRef} castShadow receiveShadow position={[0.35 * scale, 0.75, 0]}>
        <boxGeometry args={[0.15 * scale, 0.8 * scale, 0.15 * scale]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Legs */}
      <mesh ref={leftLegRef} castShadow receiveShadow position={[-0.15 * scale, 0.25, 0]}>
        <boxGeometry args={[0.2 * scale, 0.5 * scale, 0.2 * scale]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh ref={rightLegRef} castShadow receiveShadow position={[0.15 * scale, 0.25, 0]}>
        <boxGeometry args={[0.2 * scale, 0.5 * scale, 0.2 * scale]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  );
};

export default NPC;
