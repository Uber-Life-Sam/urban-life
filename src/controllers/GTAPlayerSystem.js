import * as THREE from "three";
import { useEffect, useRef } from "react";

// ----------------------------------
// Server Sync (Built-In)
// ----------------------------------

export const usePlayerMovementSync = (syncOptions) => {
  const { serverUrl, syncIntervalMs } = syncOptions || {};
  const positionRef = useRef({ x: 0, y: 0, z: 0 });
  const syncRef = useRef(null);

  const updatePosition = (pos) => {
    positionRef.current = { ...positionRef.current, ...pos };
  };

  const startSync = () => {
    if (serverUrl && syncIntervalMs) {
      syncRef.current = setInterval(() => {
        fetch(`${serverUrl}/player/position`, {
          method: "POST",
          body: JSON.stringify(positionRef.current),
          headers: { "Content-Type": "application/json" },
        });
      }, syncIntervalMs);
    }
  };

  const stopSync = () => {
    if (syncRef.current) clearInterval(syncRef.current);
  };

  useEffect(() => {
    startSync();
    return stopSync;
  }, [serverUrl, syncIntervalMs]);

  return updatePosition;
};

// ----------------------------------
// GTA Player Controller
// ----------------------------------

export class GTAPlayerController {
  constructor(player, camera) {
    this.player = player;
    this.camera = camera;

    this.speed = 0.15;
    this.rotationSpeed = 0.08;
    this.keys = {};

    window.addEventListener("keydown", (e) => (this.keys[e.key] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.key] = false));
  }

  update() {
    // GTA-style camera direction
    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    const right = new THREE.Vector3().crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0)).normalize();

    // Movement
    let moved = false;

    if (this.keys["w"]) {
      this.player.position.add(cameraDirection.clone().multiplyScalar(this.speed));
      moved = true;
    }
    if (this.keys["s"]) {
      this.player.position.add(cameraDirection.clone().multiplyScalar(-this.speed));
      moved = true;
    }
    if (this.keys["a"]) {
      this.player.position.add(right.clone().multiplyScalar(-this.speed));
      moved = true;
    }
    if (this.keys["d"]) {
      this.player.position.add(right.clone().multiplyScalar(this.speed));
      moved = true;
    }

    // Rotate player toward movement direction
    if (moved) {
      const targetDir = cameraDirection.clone();
      this.player.lookAt(this.player.position.clone().add(targetDir));
    }
  }
}

// ----------------------------------
// GTA Third Person Camera
// ----------------------------------

export class GTACameraFollow {
  constructor(player, camera) {
    this.player = player;
    this.camera = camera;
    this.offset = new THREE.Vector3(0, 4, -7); // slightly higher + further
  }

  update() {
    const ideal = this.offset.clone().applyQuaternion(this.player.quaternion);
    const targetPos = this.player.position.clone().add(ideal);

    this.camera.position.lerp(targetPos, 0.08);
    this.camera.lookAt(this.player.position);
  }
}

// ----------------------------------
// Basic Collision (Optional)
// ----------------------------------

export const applyBasicCollision = (player, mapObjects) => {
  mapObjects.forEach((obj) => {
    const dist = player.position.distanceTo(obj.position);
    if (dist < 1.5) {
      // Push player back
      player.position.x += (player.position.x - obj.position.x) * 0.1;
      player.position.z += (player.position.z - obj.position.z) * 0.1;
    }
  });
};
