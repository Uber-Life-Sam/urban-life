import { useState, useCallback } from "react";

export type Weapon = {
  id: string;
  name: string;
  fireRate: number;
  damage: number;
  range: number;
  ammo: number;
  maxAmmo: number;
};

const defaultWeapons: Weapon[] = [
  {
    id: "pistol",
    name: "Pistol",
    fireRate: 300,
    damage: 15,
    range: 50,
    ammo: 12,
    maxAmmo: 12,
  },
  {
    id: "rifle",
    name: "Rifle",
    fireRate: 100,
    damage: 8,
    range: 120,
    ammo: 30,
    maxAmmo: 30,
  },
];

export const useWeapons = () => {
  const [weapons, setWeapons] = useState(defaultWeapons);
  const [activeWeaponIndex, setActiveWeaponIndex] = useState(0);

  const activeWeapon = weapons[activeWeaponIndex];

  const switchWeapon = useCallback(() => {
    setActiveWeaponIndex((prev) => (prev + 1) % weapons.length);
  }, [weapons]);

  const reduceAmmo = useCallback(() => {
    setWeapons((prev) =>
      prev.map((w, i) =>
        i === activeWeaponIndex ? { ...w, ammo: Math.max(0, w.ammo - 1) } : w
      )
    );
  }, [activeWeaponIndex]);

  return {
    weapons,
    activeWeapon,
    switchWeapon,
    reduceAmmo,
  };
};
