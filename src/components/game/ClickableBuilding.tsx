import { ThreeEvent } from '@react-three/fiber';
import { Building } from '@/data/buildings';

interface ClickableBuildingProps {
  building: Building;
  onClick: (building: Building) => void;
}

const ClickableBuilding = ({ building, onClick }: ClickableBuildingProps) => {
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(building);
  };

  return (
    <mesh
      position={building.position}
      onClick={handleClick}
      castShadow
      receiveShadow
    >
      <boxGeometry args={building.size} />
      <meshStandardMaterial 
        color={building.color} 
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  );
};

export default ClickableBuilding;
