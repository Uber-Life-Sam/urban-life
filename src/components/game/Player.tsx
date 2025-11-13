import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface PlayerProps {
  position: [number, number, number];
  rotation: number;
  isMoving: boolean;
}

const Player = ({ position, rotation, isMoving }: PlayerProps) => {
  const groupRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);

  useFrame((state) => {
    if (bodyRef.current) {
      // Idle or walking animation - bob up and down
      const bobSpeed = isMoving ? 4 : 2;
      const bobAmount = isMoving ? 0.1 : 0.05;
      bodyRef.current.position.y = bobAmount + Math.sin(state.clock.elapsedTime * bobSpeed) * bobAmount;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      <group ref={bodyRef}>
        {/* Body */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
          <meshStandardMaterial color="#ff8844" />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#ffbb99" />
        </mesh>

        {/* Backpack */}
        <mesh position={[0, 0.8, -0.35]} castShadow>
          <boxGeometry args={[0.4, 0.5, 0.2]} />
          <meshStandardMaterial color="#4466aa" />
        </mesh>
      </group>

      {/* Shadow circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.3} transparent />
      </mesh>
    </group>
  );
};

export default Player;
