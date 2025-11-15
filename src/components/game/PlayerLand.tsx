interface PlayerLandProps {
  position: [number, number, number];
}

const PlayerLand = ({ position }: PlayerLandProps) => {
  return (
    <group position={position}>
      {/* Grass plot */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[20, 0.02, 16]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>

      {/* Driveway */}
      <mesh position={[0, 0.02, 9]} receiveShadow>
        <boxGeometry args={[4, 0.02, 6]} />
        <meshStandardMaterial color="#696969" />
      </mesh>

      {/* Fence - Front (with gate opening) */}
      {/* Left side */}
      <mesh position={[-7, 0.5, 8]} castShadow>
        <boxGeometry args={[0.1, 1, 8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Right side */}
      <mesh position={[7, 0.5, 8]} castShadow>
        <boxGeometry args={[0.1, 1, 8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Front left */}
      <mesh position={[-5, 0.5, 11.95]} castShadow>
        <boxGeometry args={[4, 1, 0.1]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Front right */}
      <mesh position={[5, 0.5, 11.95]} castShadow>
        <boxGeometry args={[4, 1, 0.1]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Fence - Back */}
      <mesh position={[0, 0.5, -7.95]} castShadow>
        <boxGeometry args={[20, 1, 0.1]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Fence - Left */}
      <mesh position={[-9.95, 0.5, 2]} castShadow>
        <boxGeometry args={[0.1, 1, 12]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Fence - Right */}
      <mesh position={[9.95, 0.5, 2]} castShadow>
        <boxGeometry args={[0.1, 1, 12]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Gate posts */}
      <mesh position={[-2, 0.7, 12]} castShadow>
        <boxGeometry args={[0.2, 1.4, 0.2]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[2, 0.7, 12]} castShadow>
        <boxGeometry args={[0.2, 1.4, 0.2]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Mailbox */}
      <mesh position={[-8, 0.8, 10]} castShadow>
        <boxGeometry args={[0.15, 1.6, 0.15]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[-8, 1.7, 10]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.3]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>

      {/* Garden beds */}
      <mesh position={[-7, 0.08, 0]} receiveShadow>
        <boxGeometry args={[3, 0.15, 4]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      
      {/* Flowers in garden */}
      {[...Array(8)].map((_, i) => (
        <group key={i} position={[-7 + (i % 4) * 0.8 - 1.2, 0.15, -1 + Math.floor(i / 4) * 2]}>
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color="#228b22" />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={['#ff1493', '#ff69b4', '#ffd700', '#ff4500'][i % 4]} />
          </mesh>
        </group>
      ))}

      {/* Trees */}
      {/* Tree 1 */}
      <mesh position={[7, 1, -5]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[7, 2.5, -5]} castShadow>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>

      {/* Tree 2 */}
      <mesh position={[-7, 1, -5]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[-7, 2.5, -5]} castShadow>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>

      {/* Path stones from driveway to door */}
      {[...Array(5)].map((_, i) => (
        <mesh key={`stone-${i}`} position={[0, 0.03, 6 - i * 1.2]} receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 8]} />
          <meshStandardMaterial color="#a9a9a9" />
        </mesh>
      ))}
    </group>
  );
};

export default PlayerLand;
