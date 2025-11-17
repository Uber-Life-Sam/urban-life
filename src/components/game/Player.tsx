// src/components/game/Player.tsx
import React, { forwardRef, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh } from "three";

interface PlayerProps {
  rotation?: number;
  isMoving?: boolean;
}

const Player = forwardRef<Group, PlayerProps>(({ rotation = 0, isMoving = false }, ref) => {
  // main group refs for body parts
  const headRef = useRef<Mesh | null>(null);
  const torsoRef = useRef<Mesh | null>(null);
  const leftArmRef = useRef<Group | null>(null);
  const rightArmRef = useRef<Group | null>(null);
  const leftLegRef = useRef<Group | null>(null);
  const rightLegRef = useRef<Group | null>(null);

  // initialize small scale realistic proportions (medium-poly)
  useEffect(() => {
    // nothing special needed; position managed by hook
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // walking bob
    const bob = isMoving ? Math.sin(t * 8) * 0.02 : 0;
    if (torsoRef.current) {
      torsoRef.current.position.y = 0.9 + Math.abs(bob);
    }
    // head small lag when moving
    if (headRef.current) {
      headRef.current.rotation.y += (0 - headRef.current.rotation.y) * 0.12;
      headRef.current.position.y = 1.6 + (isMoving ? Math.sin(t * 8) * 0.01 : 0);
    }

    // arms swing
    if (leftArmRef.current && rightArmRef.current) {
      if (isMoving) {
        const s = Math.sin(t * 8) * 0.6;
        leftArmRef.current.rotation.x = -0.7 + s * 0.25;
        rightArmRef.current.rotation.x = -0.7 - s * 0.25;
      } else {
        leftArmRef.current.rotation.x += (0 - leftArmRef.current.rotation.x) * 0.2;
        rightArmRef.current.rotation.x += (0 - rightArmRef.current.rotation.x) * 0.2;
      }
    }

    // legs swing
    if (leftLegRef.current && rightLegRef.current) {
      if (isMoving) {
        const s = Math.sin(t * 8) * 0.6;
        leftLegRef.current.rotation.x = 0.2 + s * 0.6;
        rightLegRef.current.rotation.x = 0.2 - s * 0.6;
      } else {
        leftLegRef.current.rotation.x += (0 - leftLegRef.current.rotation.x) * 0.2;
        rightLegRef.current.rotation.x += (0 - rightLegRef.current.rotation.x) * 0.2;
      }
    }
  });

  // Note: We DO NOT set position prop here because movement hook manipulates group.position directly via ref.
  return (
    <group ref={ref} rotation={[0, rotation, 0]}>
      {/* Torso */}
      <mesh ref={torsoRef as any} position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color="#2b6fb3" metalness={0.1} roughness={0.6} />
      </mesh>

      {/* Head */}
      <mesh ref={headRef as any} position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 12]} />
        <meshStandardMaterial color="#f1c27d" roughness={0.6} />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef as any} position={[0.4, 1.05, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.14, 0.6, 0.14]} />
          <meshStandardMaterial color="#2b6fb3" />
        </mesh>
        <mesh position={[0, -0.65, 0]} castShadow>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshStandardMaterial color="#f1c27d" />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef as any} position={[-0.4, 1.05, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.14, 0.6, 0.14]} />
          <meshStandardMaterial color="#2b6fb3" />
        </mesh>
        <mesh position={[0, -0.65, 0]} castShadow>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshStandardMaterial color="#f1c27d" />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef as any} position={[0.15, 0.5, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[0.18, 0.6, 0.18]} />
          <meshStandardMaterial color="#1f3e86" />
        </mesh>
        <mesh position={[0, -0.8, 0.05]} castShadow>
          <boxGeometry args={[0.18, 0.12, 0.25]} />
          <meshStandardMaterial color="#2b1b10" />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef as any} position={[-0.15, 0.5, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[0.18, 0.6, 0.18]} />
          <meshStandardMaterial color="#1f3e86" />
        </mesh>
        <mesh position={[0, -0.8, 0.05]} castShadow>
          <boxGeometry args={[0.18, 0.12, 0.25]} />
          <meshStandardMaterial color="#2b1b10" />
        </mesh>
      </group>

      {/* subtle shadow circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.45, 24]} />
        <meshBasicMaterial color="#000000" opacity={0.25} transparent />
      </mesh>
    </group>
  );
});

Player.displayName = "Player";
export default Player;
