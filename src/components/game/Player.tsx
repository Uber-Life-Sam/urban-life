import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

const Player = () => {
  const playerRef = useRef<Mesh>(null);
  const [rotation, setRotation] = useState(0);

  useFrame((state) => {
    if (playerRef.current) {
      // Idle animation - subtle bob
      playerRef.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      playerRef.current.rotation.y = rotation;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Body */}
      <mesh ref={playerRef} position={[0, 0.6, 0]} castShadow>
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

      {/* Shadow circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.3} transparent />
      </mesh>
    </group>
  );
};

export default Player;
