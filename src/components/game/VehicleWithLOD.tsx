import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

interface VehicleWithLODProps {
  position: [number, number, number];
  rotation: number;
  color: string;
}

const VehicleWithLOD = ({ position, rotation, color }: VehicleWithLODProps) => {
  const groupRef = useRef<any>(null);
  const lodLevelRef = useRef(0);
  
  const { camera } = useThree();
  const vehiclePos = useMemo(() => new Vector3(...position), [position]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation;
    }

    // Calculate distance to camera for LOD
    vehiclePos.set(...position);
    const distance = camera.position.distanceTo(vehiclePos);
    
    // LOD levels: 0 (high detail), 1 (medium), 2 (low)
    if (distance > 40) lodLevelRef.current = 2;
    else if (distance > 20) lodLevelRef.current = 1;
    else lodLevelRef.current = 0;
  });

  const wheelSegments = lodLevelRef.current === 0 ? 16 : lodLevelRef.current === 1 ? 8 : 6;
  const castShadow = lodLevelRef.current < 2;

  return (
    <group ref={groupRef} position={position}>
      {/* Car body */}
      <mesh castShadow={castShadow} receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.4, 1.6]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Car roof */}
      <mesh castShadow={castShadow} receiveShadow position={[0, 0.4, -0.2]}>
        <boxGeometry args={[0.7, 0.3, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Windows - only show at high/medium detail */}
      {lodLevelRef.current < 2 && (
        <mesh position={[0, 0.4, -0.2]}>
          <boxGeometry args={[0.71, 0.25, 0.81]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
        </mesh>
      )}
      
      {/* Wheels - simplify at distance */}
      {lodLevelRef.current < 2 ? (
        <>
          <mesh position={[-0.4, -0.2, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, wheelSegments]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0.4, -0.2, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, wheelSegments]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[-0.4, -0.2, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, wheelSegments]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0.4, -0.2, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, wheelSegments]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </>
      ) : (
        // Ultra-simple wheels at far distance
        <>
          <mesh position={[-0.4, -0.2, 0.5]}>
            <boxGeometry args={[0.1, 0.3, 0.3]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0.4, -0.2, 0.5]}>
            <boxGeometry args={[0.1, 0.3, 0.3]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </>
      )}
    </group>
  );
};

export default VehicleWithLOD;
