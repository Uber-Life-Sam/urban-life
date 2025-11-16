// src/components/game/Player.tsx
import React, { forwardRef, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

interface PlayerProps {
  position?: [number, number, number];
  rotation?: number; // Y rotation in radians
  isMoving?: boolean;
}

const Player = forwardRef<Group, PlayerProps>(({ position = [0, 0, 0], rotation = 0, isMoving = false }, ref) => {
  const bodyRef = useRef<Group | null>(null);
  const leftLegRef = useRef<Group | null>(null);
  const rightLegRef = useRef<Group | null>(null);
  const leftArmRef = useRef<Group | null>(null);
  const rightArmRef = useRef<Group | null>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (bodyRef.current) {
      const bobSpeed = isMoving ? 8 : 0;
      const bobAmount = isMoving ? 0.08 : 0;
      bodyRef.current.position.y = bobAmount + Math.sin(time * bobSpeed) * bobAmount;
    }
    if (leftLegRef.current && rightLegRef.current) {
      if (isMoving) {
        const legSwing = Math.sin(time * 8) * 0.5;
        leftLegRef.current.rotation.x = legSwing;
        rightLegRef.current.rotation.x = -legSwing;
      } else {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }
    }
    if (leftArmRef.current && rightArmRef.current) {
      if (isMoving) {
        const armSwing = Math.sin(time * 8) * 0.4;
        leftArmRef.current.rotation.x = -armSwing;
        rightArmRef.current.rotation.x = armSwing;
      } else {
        leftArmRef.current.rotation.x = 0;
        rightArmRef.current.rotation.x = 0;
      }
    }
  });

  return (
    // forwarded ref applied to top-level group
    <group ref={ref} position={position} rotation={[0, rotation, 0]}>
      <group ref={bodyRef}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[0.5, 0.7, 0.3]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>

        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>

        <mesh position={[0.1, 1.55, 0.18]} castShadow>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.1, 1.55, 0.18]} castShadow>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        <group ref={leftArmRef} position={[0.35, 0.9, 0]}>
          <mesh position={[0, -0.25, 0]} castShadow>
            <boxGeometry args={[0.15, 0.6, 0.15]} />
            <meshStandardMaterial color="#2563eb" />
          </mesh>
          <mesh position={[0, -0.55, 0]} castShadow>
            <boxGeometry args={[0.13, 0.05, 0.13]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[-0.35, 0.9, 0]}>
          <mesh position={[0, -0.25, 0]} castShadow>
            <boxGeometry args={[0.15, 0.6, 0.15]} />
            <meshStandardMaterial color="#2563eb" />
          </mesh>
          <mesh position={[0, -0.55, 0]} castShadow>
            <boxGeometry args={[0.13, 0.05, 0.13]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
        </group>

        <group ref={leftLegRef} position={[0.15, 0.5, 0]}>
          <mesh position={[0, -0.25, 0]} castShadow>
            <boxGeometry args={[0.18, 0.5, 0.18]} />
            <meshStandardMaterial color="#1e40af" />
          </mesh>
          <mesh position={[0, -0.52, 0.05]} castShadow>
            <boxGeometry args={[0.18, 0.08, 0.25]} />
            <meshStandardMaterial color="#422006" />
          </mesh>
        </group>

        <group ref={rightLegRef} position={[-0.15, 0.5, 0]}>
          <mesh position={[0, -0.25, 0]} castShadow>
            <boxGeometry args={[0.18, 0.5, 0.18]} />
            <meshStandardMaterial color="#1e40af" />
          </mesh>
          <mesh position={[0, -0.52, 0.05]} castShadow>
            <boxGeometry args={[0.18, 0.08, 0.25]} />
            <meshStandardMaterial color="#422006" />
          </mesh>
        </group>
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000000" opacity={0.3} transparent />
      </mesh>
    </group>
  );
});

Player.displayName = "Player";
export default Player;
