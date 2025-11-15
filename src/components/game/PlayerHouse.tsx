import { useMemo } from 'react';

interface PlayerHouseProps {
  position: [number, number, number];
}

const PlayerHouse = ({ position }: PlayerHouseProps) => {
  return (
    <group position={position}>
      {/* Foundation */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[8, 0.2, 6]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 4, 6]} />
        <meshStandardMaterial color="#f5deb3" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 4.5, 0]} castShadow receiveShadow rotation={[0, 0, 0]}>
        <boxGeometry args={[9, 0.2, 7]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0, 5.2, 0]} castShadow rotation={[0, 0, 0]}>
        <coneGeometry args={[5, 1.5, 4]} />
        <meshStandardMaterial color="#a0522d" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 1.2, 3.01]} castShadow>
        <boxGeometry args={[1.2, 2.4, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0.4, 1.2, 3.06]} castShadow>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>

      {/* Windows - Front */}
      <mesh position={[-2.5, 2, 3.01]} castShadow>
        <boxGeometry args={[1.2, 1.2, 0.1]} />
        <meshStandardMaterial color="#87ceeb" opacity={0.6} transparent />
      </mesh>
      <mesh position={[2.5, 2, 3.01]} castShadow>
        <boxGeometry args={[1.2, 1.2, 0.1]} />
        <meshStandardMaterial color="#87ceeb" opacity={0.6} transparent />
      </mesh>

      {/* Windows - Side */}
      <mesh position={[-4.01, 2, 0]} castShadow>
        <boxGeometry args={[0.1, 1.2, 1.2]} />
        <meshStandardMaterial color="#87ceeb" opacity={0.6} transparent />
      </mesh>
      <mesh position={[4.01, 2, 0]} castShadow>
        <boxGeometry args={[0.1, 1.2, 1.2]} />
        <meshStandardMaterial color="#87ceeb" opacity={0.6} transparent />
      </mesh>

      {/* Chimney */}
      <mesh position={[-2.5, 5.5, -1]} castShadow>
        <boxGeometry args={[0.6, 2, 0.6]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Interior - Visible when close */}
      {/* Floor */}
      <mesh position={[0, 0.21, 0]} receiveShadow>
        <boxGeometry args={[7.8, 0.01, 5.8]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>

      {/* Furniture - Living Room */}
      {/* Couch */}
      <mesh position={[-2, 0.5, -1.5]} castShadow>
        <boxGeometry args={[2, 0.8, 0.8]} />
        <meshStandardMaterial color="#8b0000" />
      </mesh>
      <mesh position={[-2, 0.8, -1.9]} castShadow>
        <boxGeometry args={[2, 0.4, 0.2]} />
        <meshStandardMaterial color="#8b0000" />
      </mesh>

      {/* Coffee Table */}
      <mesh position={[-2, 0.3, 0]} castShadow>
        <boxGeometry args={[1, 0.1, 0.6]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[-2.4, 0.15, -0.2]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[-1.6, 0.15, -0.2]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[-2.4, 0.15, 0.2]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[-1.6, 0.15, 0.2]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Kitchen Counter */}
      <mesh position={[2.5, 0.5, -2]} castShadow>
        <boxGeometry args={[2, 1, 0.6]} />
        <meshStandardMaterial color="#a9a9a9" />
      </mesh>

      {/* Refrigerator */}
      <mesh position={[3.5, 1, -2.5]} castShadow>
        <boxGeometry args={[0.8, 2, 0.8]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Bed */}
      <mesh position={[2, 0.4, 1.5]} castShadow>
        <boxGeometry args={[1.5, 0.6, 2]} />
        <meshStandardMaterial color="#4169e1" />
      </mesh>
      <mesh position={[2, 0.8, 2.4]} castShadow>
        <boxGeometry args={[1.5, 0.4, 0.2]} />
        <meshStandardMaterial color="#4169e1" />
      </mesh>

      {/* Lamp */}
      <mesh position={[0, 3.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
      <pointLight position={[0, 3.5, 0]} intensity={1} distance={10} color="#ffff00" />
    </group>
  );
};

export default PlayerHouse;
