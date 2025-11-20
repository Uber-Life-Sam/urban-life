// Urban Life 3D Game - Main Code
// This file contains all the game logic

// 1. SETUP BASIC SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue background

// Camera setup
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 2. CREATE PLAYER
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 1; // Raise above ground
scene.add(player);

// 3. ADD GROUND
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x3a7d3a,
    side: THREE.DoubleSide
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / 2; // Rotate to be horizontal
ground.position.y = 0;
scene.add(ground);

// 4. ADD BUILDINGS
function createBuilding(x, z, width, height, depth, color) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const building = new THREE.Mesh(geometry, material);
    building.position.set(x, height / 2, z);
    scene.add(building);
    return building;
}

// Create multiple buildings
const buildings = [
    createBuilding(-20, -15, 8, 12, 8, 0xff6b6b),
    createBuilding(15, -10, 10, 15, 10, 0x4ecdc4),
    createBuilding(-10, 20, 6, 8, 6, 0xffe66d),
    createBuilding(25, 15, 12, 20, 12, 0x6a0572),
    createBuilding(-30, 5, 7, 10, 7, 0x1a535c)
];

// 5. KEYBOARD CONTROLS
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    'w': false,
    's': false,
    'a': false,
    'd': false
};

// Keyboard event listeners
document.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
});

// 6. PLAYER MOVEMENT
const playerSpeed = 0.2;

function updatePlayerMovement() {
    // Forward/Backward
    if (keys['ArrowUp'] || keys['w']) {
        player.position.z -= playerSpeed;
    }
    if (keys['ArrowDown'] || keys['s']) {
        player.position.z += playerSpeed;
    }
    
    // Left/Right
    if (keys['ArrowLeft'] || keys['a']) {
        player.position.x -= playerSpeed;
    }
    if (keys['ArrowRight'] || keys['d']) {
        player.position.x += playerSpeed;
    }
}

// 7. CAMERA SYSTEM (GTA Style - Behind Player)
function updateCamera() {
    // Camera follows player from behind and above
    const cameraDistance = 10;
    const cameraHeight = 5;
    
    camera.position.x = player.position.x;
    camera.position.y = player.position.y + cameraHeight;
    camera.position.z = player.position.z + cameraDistance;
    
    // Camera looks at player
    camera.lookAt(player.position.x, player.position.y + 2, player.position.z);
}

// 8. WINDOW RESIZE HANDLING
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 9. GAME LOOP
function animate() {
    requestAnimationFrame(animate);
    
    // Update game state
    updatePlayerMovement();
    updateCamera();
    
    // Render scene
    renderer.render(scene, camera);
}

// 10. START THE GAME
animate();

console.log('Urban Life 3D Game Started!');
console.log('Controls: Arrow Keys or WASD to move');
