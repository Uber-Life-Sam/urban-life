// Urban Life 3D Game - FIXED CODE
console.log('Game starting...');

// 1. SETUP BASIC SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue

// Camera setup
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. CREATE PLAYER (Green Cube)
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 1;
scene.add(player);

// 3. ADD GROUND (Green Plane)
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x3a7d3a,
    side: THREE.DoubleSide
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // FIXED: Correct rotation
scene.add(ground);

// 4. ADD SOME BUILDINGS (Colored Cubes)
function createBuilding(x, z, width, height, depth, color) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const building = new THREE.Mesh(geometry, material);
    building.position.set(x, height / 2, z);
    scene.add(building);
    return building;
}

// Create buildings around the map
createBuilding(-15, -10, 8, 10, 8, 0xff0000);  // Red building
createBuilding(10, 5, 6, 8, 6, 0x0000ff);     // Blue building  
createBuilding(20, -15, 10, 12, 10, 0xffff00); // Yellow building
createBuilding(-20, 15, 7, 15, 7, 0xff00ff);   // Pink building

// 5. SET CAMERA POSITION (IMPORTANT FIX)
camera.position.set(0, 10, 15); // Camera behind and above player
camera.lookAt(0, 0, 0);

// 6. KEYBOARD CONTROLS
const keys = {};

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// 7. PLAYER MOVEMENT
function updatePlayer() {
    const speed = 0.3;
    
    if (keys['ArrowUp'] || keys['w']) {
        player.position.z -= speed;
    }
    if (keys['ArrowDown'] || keys['s']) {
        player.position.z += speed;
    }
    if (keys['ArrowLeft'] || keys['a']) {
        player.position.x -= speed;
    }
    if (keys['ArrowRight'] || keys['d']) {
        player.position.x += speed;
    }
}

// 8. UPDATE CAMERA (GTA Style)
function updateCamera() {
    // Camera follows player from behind
    camera.position.x = player.position.x;
    camera.position.y = player.position.y + 8;  // Height
    camera.position.z = player.position.z + 10; // Distance behind
    
    camera.lookAt(player.position.x, player.position.y, player.position.z);
}

// 9. GAME LOOP
function animate() {
    requestAnimationFrame(animate);
    
    updatePlayer();
    updateCamera();
    
    renderer.render(scene, camera);
}

// 10. START THE GAME
animate();

console.log('Game started successfully!');
console.log('Use Arrow Keys or WASD to move the green cube');
