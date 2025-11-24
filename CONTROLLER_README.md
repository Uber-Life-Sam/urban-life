# GTA 5 Style Character Controller

A premium, professional AAA-quality third-person character controller system inspired by Grand Theft Auto 5.

## Features

✅ **Smooth Third-Person Camera**
- Camera offset: (0, 2, -4)
- Smoothing factor: 10
- Auto-follows player with smooth interpolation

✅ **Free-Look Camera Rotation**
- Right-click + drag to rotate camera around player
- Smooth horizontal (yaw) and vertical (pitch) rotation
- Clamped vertical rotation to prevent camera flipping

✅ **Camera-Relative Movement**
- Player movement follows camera direction
- WASD for directional movement
- Movement always relative to where the camera is looking

✅ **Smooth Character Rotation**
- Character smoothly rotates to face movement direction
- Uses rotation lerping for natural turning
- No instant snapping

✅ **Walk & Sprint System**
- Walk speed: 6 units/sec
- Sprint speed: 9 units/sec
- Sprint with Left Shift (only when moving forward)
- Sprint indicator UI

✅ **Premium AAA Feel**
- Smooth acceleration and deceleration
- Velocity-based movement for natural feel
- Delta time for frame-independent movement
- Professional animation-ready rotation system

## Architecture

### Modular Scripts

#### 1. `useCameraRotate.ts`
Handles mouse drag camera rotation with:
- Right-click detection
- Horizontal and vertical rotation tracking
- Configurable sensitivity
- Vertical clamping

#### 2. `useCameraFollow.ts`
Manages smooth camera follow behavior:
- Position interpolation with configurable smoothing
- Rotation-based offset calculation
- Look-at targeting
- Smooth transitions

#### 3. `useGTAPlayerMovement.ts`
Controls character movement:
- Keyboard input handling
- Camera-relative movement calculation
- Walk/sprint state management
- Smooth rotation with lerping
- Velocity-based physics

#### 4. `GTACameraController.tsx`
Integrates camera systems:
- Combines rotation and follow behaviors
- Manages camera reference
- Configurable parameters

#### 5. `ControlsHint.tsx`
UI component showing controls to users

## Usage

```typescript
import { useGTAPlayerMovement } from "@/hooks/useGTAPlayerMovement";
import { useCameraRotate } from "@/hooks/useCameraRotate";

// In your component:
const playerRef = useRef(null);
const cameraRef = useRef(null);

// Camera rotation
const cameraRotation = useCameraRotate({
  sensitivity: 0.003,
  verticalClamp: { min: -Math.PI / 4, max: Math.PI / 3 },
});

// Player movement
const playerState = useGTAPlayerMovement({
  playerRef,
  cameraRotation,
  walkSpeed: 6,
  sprintSpeed: 9,
  rotationSpeed: 8,
});

// In your Canvas:
<GTACameraController 
  ref={cameraRef} 
  target={playerState.position} 
  offset={[0, 2, -4]} 
  smoothing={10}
/>
```

## Controls

| Action | Input |
|--------|-------|
| Move Forward | W |
| Move Backward | S |
| Move Left | A |
| Move Right | D |
| Sprint | Left Shift (while moving) |
| Rotate Camera | Right Click + Drag |
| Enter Building | E |

## Technical Details

### Movement System
- Uses velocity-based physics for smooth acceleration/deceleration
- Velocity is clamped to prevent excessive speed
- Rotation uses shortest-angle calculation for natural turning
- Frame-independent with delta time

### Camera System
- Quaternion-based rotation for gimbal-lock-free rotation
- Smooth interpolation prevents jarring camera movements
- Separate horizontal and vertical rotation controls
- Look-at smoothing for cinematic feel

### Performance
- Optimized with RAF (RequestAnimationFrame)
- Minimal re-renders using refs
- Efficient vector calculations
- Clean-up on unmount

## Configuration

All parameters are configurable:

```typescript
// Movement speeds
walkSpeed: 6,        // Walk speed units/sec
sprintSpeed: 9,      // Sprint speed units/sec
rotationSpeed: 8,    // Character rotation speed

// Camera
offset: [0, 2, -4],  // Camera offset from player
smoothing: 10,       // Camera smoothness (higher = smoother)
sensitivity: 0.003,  // Mouse sensitivity

// Rotation clamps
verticalClamp: { 
  min: -Math.PI / 4,  // Look down limit
  max: Math.PI / 3    // Look up limit
}
```

## Integration with Lovable Cloud

The controller seamlessly integrates with:
- **Save System**: Player position and rotation are saved automatically
- **Quest System**: Works with quest markers and objectives
- **Weather System**: Movement unaffected by weather
- **Interior System**: Smooth transitions between indoor/outdoor
- **Mini-Map**: Real-time position tracking

## Best Practices

1. **Always use refs** for player and camera objects
2. **Keep smoothing values consistent** across systems
3. **Test sprint on different terrain types**
4. **Adjust speeds based on scale** of your world
5. **Profile performance** with performance stats overlay

## Credits

Inspired by Rockstar Games' Grand Theft Auto 5 character controller.
Built for Lovable Studio with professional game development standards.
