import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const useRaycastHit = (camera: any, activeWeapon: any) => {
  const raycaster = new THREE.Raycaster();

  useFrame(() => {
    if (!activeWeapon) return;

    raycaster.setFromCamera({ x: 0, y: 0 }, camera);

    const intersects = raycaster.intersectObjects(
      window.__sceneObjects || [],
      true
    );

    if (intersects.length > 0) {
      const hit = intersects[0];

      if (hit.object.userData?.enemy) {
        hit.object.userData.enemy.takeDamage(activeWeapon.damage);
      }
    }
  });
};
