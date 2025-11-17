import { FurnitureItem } from '@/types/interior';

interface InteriorEnvironmentProps {
  furniture: FurnitureItem[];
}

const FurnitureComponent = ({ item }: { item: FurnitureItem }) => {
  const renderFurniture = () => {
    switch (item.type) {
      case 'bed':
        return (
          <group>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[2, 0.5, 3]} />
              <meshStandardMaterial color={item.color || '#8B4513'} />
            </mesh>
            <mesh position={[0, 0.5, -1.3]} castShadow>
              <boxGeometry args={[2, 0.8, 0.2]} />
              <meshStandardMaterial color={item.color || '#654321'} />
            </mesh>
          </group>
        );
      
      case 'table':
        return (
          <group>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[1.5, 0.1, 1]} />
              <meshStandardMaterial color={item.color || '#654321'} />
            </mesh>
            <mesh position={[-0.6, -0.4, -0.4]} castShadow>
              <boxGeometry args={[0.1, 0.8, 0.1]} />
              <meshStandardMaterial color={item.color || '#654321'} />
            </mesh>
            <mesh position={[0.6, -0.4, -0.4]} castShadow>
              <boxGeometry args={[0.1, 0.8, 0.1]} />
              <meshStandardMaterial color={item.color || '#654321'} />
            </mesh>
            <mesh position={[-0.6, -0.4, 0.4]} castShadow>
              <boxGeometry args={[0.1, 0.8, 0.1]} />
              <meshStandardMaterial color={item.color || '#654321'} />
            </mesh>
            <mesh position={[0.6, -0.4, 0.4]} castShadow>
              <boxGeometry args={[0.1, 0.8, 0.1]} />
              <meshStandardMaterial color={item.color || '#654321'} />
            </mesh>
          </group>
        );
      
      case 'chair':
        return (
          <group>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.5, 0.1, 0.5]} />
              <meshStandardMaterial color={item.color || '#654321'} />
            </mesh>
            <mesh position={[0, 0.5, -0.2]} castShadow>
              <boxGeometry args={[0.5, 1, 0.1]} />
              <meshStandardMaterial color={item.color || '#654321'} />
            </mesh>
          </group>
        );
      
      case 'shelf':
        return (
          <group>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.3, 2, 1.5]} />
              <meshStandardMaterial color={item.color || '#654321'} />
            </mesh>
          </group>
        );
      
      case 'counter':
        return (
          <group>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[3, 1, 0.8]} />
              <meshStandardMaterial color={item.color || '#8B7355'} />
            </mesh>
          </group>
        );
      
      default:
        return null;
    }
  };

  return (
    <group position={item.position} rotation={[0, item.rotation, 0]}>
      {renderFurniture()}
    </group>
  );
};

const InteriorEnvironment = ({ furniture }: InteriorEnvironmentProps) => {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#b8956a" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 3, -10]} receiveShadow>
        <boxGeometry args={[20, 6, 0.2]} />
        <meshStandardMaterial color="#e8d5c4" />
      </mesh>
      <mesh position={[0, 3, 10]} receiveShadow>
        <boxGeometry args={[20, 6, 0.2]} />
        <meshStandardMaterial color="#e8d5c4" />
      </mesh>
      <mesh position={[-10, 3, 0]} receiveShadow>
        <boxGeometry args={[0.2, 6, 20]} />
        <meshStandardMaterial color="#e8d5c4" />
      </mesh>
      <mesh position={[10, 3, 0]} receiveShadow>
        <boxGeometry args={[0.2, 6, 20]} />
        <meshStandardMaterial color="#e8d5c4" />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f5f5f0" />
      </mesh>

      {/* Furniture */}
      {furniture.map((item) => (
        <FurnitureComponent key={item.id} item={item} />
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={1} castShadow />
      <pointLight position={[-5, 4, -5]} intensity={0.5} />
      <pointLight position={[5, 4, 5]} intensity={0.5} />
    </group>
  );
};

export default InteriorEnvironment;
