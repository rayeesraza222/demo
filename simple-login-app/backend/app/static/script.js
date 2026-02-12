// DOM Elements for form switching
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// Three.js Background Animation
const canvasContainer = document.getElementById("canvas-container");

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
canvasContainer.appendChild(renderer.domElement);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000; // Number of particles

const posArray = new Float32Array(particlesCount * 3); // 3 values per vertex (x, y, z)

for (let i = 0; i < particlesCount * 3; i++) {
  // Random positions
  posArray[i] = (Math.random() - 0.5) * 15; // Spread particles
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3),
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  color: 0xff4b2b, // Primary color
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending, // Glow effect
});

// Mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Connecting Lines (Optional - can be performance heavy, so let's stick to particles for smooth exp on all devices or adding a separate mesh)
// Let's add a wireframe sphere for depth
const sphereGeometry = new THREE.IcosahedronGeometry(10, 1);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0xff416c,
  wireframe: true,
  transparent: true,
  opacity: 0.2,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Lighting (Not strictly needed for BasicMaterial/Points, but good practice)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

camera.position.z = 5;

// Mouse Interactivity
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  // Rotate the entire particle system slowly
  particlesMesh.rotation.y = elapsedTime * 0.05;
  particlesMesh.rotation.x = elapsedTime * 0.02;

  sphere.rotation.x = elapsedTime * 0.1;
  sphere.rotation.y = elapsedTime * 0.1;

  // Mouse Interaction Parallax
  // Subtle movement based on mouse position
  particlesMesh.rotation.y += mouseX * 0.00005;
  particlesMesh.rotation.x += mouseY * 0.00005;

  camera.position.x += (mouseX * 0.001 - camera.position.x) * 0.05;
  camera.position.y += (-mouseY * 0.001 - camera.position.y) * 0.05;

  // Wave effect for particles (advanced)
  // We can access positions and modify them if we want a wave, but let's keep it simple and performant first.

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// Handle Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
