import { useRef } from 'react';
import { Mesh } from 'three';

const CityEnvironment = () => {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#4a5f4a" />
      </mesh>

      {/* Roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[4, 50]} />
        <meshStandardMaterial color="#404040" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 4]} />
        <meshStandardMaterial color="#404040" />
      </mesh>

      {/* Buildings - Residential District */}
      <Building position={[-8, 0, -8]} size={[3, 6, 3]} color="#5a6c7a" />
      <Building position={[-8, 0, -15]} size={[3, 8, 3]} color="#4a5c6a" />
      <Building position={[-15, 0, -8]} size={[4, 5, 4]} color="#6a7c8a" />
      <Building position={[-15, 0, -15]} size={[3, 7, 3]} color="#5a6c7a" />

      {/* Buildings - Commercial District */}
      <Building position={[8, 0, -8]} size={[4, 10, 4]} color="#7a6c5a" windows />
      <Building position={[8, 0, -15]} size={[3, 12, 3]} color="#8a7c6a" windows />
      <Building position={[15, 0, -8]} size={[5, 8, 5]} color="#6a5c4a" windows />
      <Building position={[15, 0, -15]} size={[4, 9, 4]} color="#7a6c5a" windows />

      {/* Buildings - Industrial District */}
      <Building position={[-8, 0, 8]} size={[6, 4, 4]} color="#6a6a6a" />
      <Building position={[-15, 0, 8]} size={[5, 3, 6]} color="#5a5a5a" />
      <Building position={[-8, 0, 15]} size={[4, 5, 5]} color="#7a7a7a" />

      {/* Buildings - Mixed Use */}
      <Building position={[8, 0, 8]} size={[3, 7, 3]} color="#8a7c8a" windows />
      <Building position={[15, 0, 8]} size={[4, 6, 4]} color="#7a6c7a" />
      <Building position={[8, 0, 15]} size={[3, 8, 3]} color="#6a5c6a" windows />

      {/* Trees */}
      <Tree position={[-5, 0, 3]} />
      <Tree position={[5, 0, -3]} />
      <Tree position={[-3, 0, 5]} />
      <Tree position={[3, 0, 5]} />
    </group>
  );
};

interface BuildingProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  windows?: boolean;
}

const Building = ({ position, size, color, windows }: BuildingProps) => {
  const meshRef = useRef<Mesh>(null);
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        position={[0, size[1] / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
      {windows && (
        <>
          {/* Window lights */}
          {Array.from({ length: Math.floor(size[1] / 2) }).map((_, i) => (
            <group key={i}>
              <mesh position={[size[0] / 2 + 0.01, i * 2 + 1, 0]}>
                <planeGeometry args={[0.5, 0.5]} />
                <meshBasicMaterial color="#ffeb99" />
              </mesh>
              <mesh position={[-size[0] / 2 - 0.01, i * 2 + 1, 0]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[0.5, 0.5]} />
                <meshBasicMaterial color="#ffeb99" />
              </mesh>
            </group>
          ))}
        </>
      )}
    </group>
  );
};

const Tree = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 1]} />
        <meshStandardMaterial color="#4a3222" />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial color="#2d5a2d" />
      </mesh>
    </group>
  );
};

export default CityEnvironment;
