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
      
      {/* Road markings - Lane lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`lane-v-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, i * 5 - 22.5]}>
          <planeGeometry args={[0.1, 2]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`lane-h-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[i * 5 - 22.5, 0.02, 0]}>
          <planeGeometry args={[2, 0.1]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      
      {/* Crosswalks */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`cross-n-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-1.5 + i * 0.4, 0.02, -2.5]}>
          <planeGeometry args={[0.3, 1]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`cross-s-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-1.5 + i * 0.4, 0.02, 2.5]}>
          <planeGeometry args={[0.3, 1]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`cross-w-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-2.5, 0.02, -1.5 + i * 0.4]}>
          <planeGeometry args={[1, 0.3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`cross-e-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0.02, -1.5 + i * 0.4]}>
          <planeGeometry args={[1, 0.3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      
      {/* Sidewalks */}
      <Sidewalk position={[-3, 0.05, 0]} rotation={0} length={50} />
      <Sidewalk position={[3, 0.05, 0]} rotation={0} length={50} />
      <Sidewalk position={[0, 0.05, -3]} rotation={Math.PI / 2} length={50} />
      <Sidewalk position={[0, 0.05, 3]} rotation={Math.PI / 2} length={50} />

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

      {/* Street Lights at intersection corners */}
      <StreetLight position={[2.5, 0, -2.5]} />
      <StreetLight position={[-2.5, 0, -2.5]} />
      <StreetLight position={[2.5, 0, 2.5]} />
      <StreetLight position={[-2.5, 0, 2.5]} />
      
      {/* Street Lights along roads */}
      <StreetLight position={[3.5, 0, -10]} />
      <StreetLight position={[3.5, 0, 10]} />
      <StreetLight position={[-3.5, 0, -10]} />
      <StreetLight position={[-3.5, 0, 10]} />
      <StreetLight position={[10, 0, 3.5]} />
      <StreetLight position={[-10, 0, 3.5]} />
      <StreetLight position={[10, 0, -3.5]} />
      <StreetLight position={[-10, 0, -3.5]} />
      
      {/* Trees along sidewalks */}
      <Tree position={[-5, 0, -10]} />
      <Tree position={[-5, 0, -5]} />
      <Tree position={[-5, 0, 5]} />
      <Tree position={[-5, 0, 10]} />
      <Tree position={[5, 0, -10]} />
      <Tree position={[5, 0, -5]} />
      <Tree position={[5, 0, 5]} />
      <Tree position={[5, 0, 10]} />
      <Tree position={[-10, 0, -5]} />
      <Tree position={[-5, 0, -5]} />
      <Tree position={[10, 0, -5]} />
      <Tree position={[-10, 0, 5]} />
      
      {/* Benches */}
      <Bench position={[-4, 0, -6]} rotation={0} />
      <Bench position={[4, 0, 6]} rotation={Math.PI} />
      <Bench position={[-6, 0, 4]} rotation={Math.PI / 2} />
      <Bench position={[6, 0, -4]} rotation={-Math.PI / 2} />
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
      <mesh position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshStandardMaterial color="#3d6a3d" />
      </mesh>
    </group>
  );
};

const StreetLight = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 5, 8]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.8} />
      </mesh>
      {/* Light fixture */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#f39c12" emissive="#f39c12" emissiveIntensity={0.5} />
      </mesh>
      {/* Light emission */}
      <pointLight position={[0, 5, 0]} color="#ffd700" intensity={2} distance={10} castShadow />
    </group>
  );
};

const Sidewalk = ({ position, rotation, length }: { position: [number, number, number], rotation: number, length: number }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, rotation]} position={position} receiveShadow>
      <planeGeometry args={[1.5, length]} />
      <meshStandardMaterial color="#8a8a8a" roughness={0.9} />
    </mesh>
  );
};

const Bench = ({ position, rotation }: { position: [number, number, number], rotation: number }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.1, 0.4]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.7, -0.15]} castShadow>
        <boxGeometry args={[1.2, 0.6, 0.1]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.5, 0.2, 0.1]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.5, 0.2, 0.1]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[-0.5, 0.2, -0.1]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.5, 0.2, -0.1]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  );
};

export default CityEnvironment;
