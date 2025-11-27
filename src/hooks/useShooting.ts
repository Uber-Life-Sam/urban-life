import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const useShooting = (camera: any, activeWeapon: any, reduceAmmo: any) => {
  const isShooting = useRef(false);
  const canShoot = useRef(true);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) isShooting.current = true;
    };
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 0) isShooting.current = false;
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  useFrame(() => {
    if (!isShooting.current || !activeWeapon || !canShoot.current) return;

    if (activeWeapon.ammo <= 0) return;

    // 🔫 Fire!
    canShoot.current = false;
    reduceAmmo();

    // Recoil effect
    camera.rotation.x += 0.02;

    // Cooldown between shots
    setTimeout(() => {
      canShoot.current = true;
    }, activeWeapon.fireRate);
  });
};
