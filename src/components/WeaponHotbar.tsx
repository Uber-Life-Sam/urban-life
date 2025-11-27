import React from "react";

export const WeaponHotbar = ({ weapons, activeWeapon }: any) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 10,
        color: "white",
        fontFamily: "Arial",
      }}
    >
      {weapons.map((w: any) => (
        <div
          key={w.id}
          style={{
            padding: "8px 14px",
            border:
              activeWeapon.id === w.id ? "2px solid yellow" : "1px solid white",
            borderRadius: 4,
            background: "rgba(0,0,0,0.4)",
          }}
        >
          {w.name} ({w.ammo})
        </div>
      ))}
    </div>
  );
};
