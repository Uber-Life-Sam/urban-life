import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

interface NPCWithLODProps {
  position: [number, number, number];
  rotation: number;
  color: string;
  scale?: number;
}

const NPCWithLOD = ({ position, rotation, color, scale = 0.8 }: NPCWithLODProps) => {
  const groupRef = useRef<any>(null);
  const leftLegRef = useRef<any>(null);
  const rightLegRef = useRef<any>(null);
  const leftArmRef = useRef<any>(null);
  const rightArmRef = useRef<any>(null);
  const prevPositionRef = useRef(position);
  const lodLevelRef = useRef(0);
  
  const { camera } = useThree();
  const npcPos = useMemo(() => new Vector3(...position), [position]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation;
    }

    // Calculate distance to camera for LOD
    npcPos.set(...position);
    const distance = camera.position.distanceTo(npcPos);
    
    // LOD levels: 0 (high detail), 1 (medium), 2 (low)
    let newLodLevel = 0;
    if (distance > 30) newLodLevel = 2;
    else if (distance > 15) newLodLevel = 1;
    
    lodLevelRef.current = newLodLevel;

    // Check if NPC is moving
    const isMoving = 
      Math.abs(position[0] - prevPositionRef.current[0]) > 0.001 ||
      Math.abs(position[2] - prevPositionRef.current[2]) > 0.001;
    
    prevPositionRef.current = position;

    // Only animate if close enough and moving
    if (isMoving && lodLevelRef.current < 2) {
      const time = state.clock.getElapsedTime();
      const animSpeed = lodLevelRef.current === 0 ? 10 : 8;
      
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time * animSpeed) * 0.4;
        rightLegRef.current.rotation.x = Math.sin(time * animSpeed + Math.PI) * 0.4;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(time * animSpeed + Math.PI) * 0.3;
        rightArmRef.current.rotation.x = Math.sin(time * animSpeed) * 0.3;
      }
    } else {
      // Reset to neutral pose
      if (leftLegRef.current) leftLegRef.current.rotation.x *= 0.9;
      if (rightLegRef.current) rightLegRef.current.rotation.x *= 0.9;
      if (leftArmRef.current) leftArmRef.current.rotation.x *= 0.9;
      if (rightArmRef.current) rightArmRef.current.rotation.x *= 0.9;
    }
  });

  // Adjust geometry detail based on LOD
  const headSegments = lodLevelRef.current === 0 ? 16 : lodLevelRef.current === 1 ? 8 : 6;
  const wheelSegments = lodLevelRef.current === 0 ? 16 : lodLevelRef.current === 1 ? 8 : 6;

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh castShadow={lodLevelRef.current < 2} receiveShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[0.5 * scale, 1 * scale, 0.3 * scale]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Head */}
      <mesh castShadow={lodLevelRef.current < 2} receiveShadow position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.25 * scale, headSegments, headSegments]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      
      {/* Arms - hide at far distance */}
      {lodLevelRef.current < 2 && (
        <>
          <mesh ref={leftArmRef} castShadow receiveShadow position={[-0.35 * scale, 0.75, 0]}>
            <boxGeometry args={[0.15 * scale, 0.8 * scale, 0.15 * scale]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh ref={rightArmRef} castShadow receiveShadow position={[0.35 * scale, 0.75, 0]}>
            <boxGeometry args={[0.15 * scale, 0.8 * scale, 0.15 * scale]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </>
      )}
      
      {/* Legs */}
      <mesh ref={leftLegRef} castShadow={lodLevelRef.current < 2} receiveShadow position={[-0.15 * scale, 0.25, 0]}>
        <boxGeometry args={[0.2 * scale, 0.5 * scale, 0.2 * scale]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh ref={rightLegRef} castShadow={lodLevelRef.current < 2} receiveShadow position={[0.15 * scale, 0.25, 0]}>
        <boxGeometry args={[0.2 * scale, 0.5 * scale, 0.2 * scale]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  );
};

export default NPCWithLOD;
