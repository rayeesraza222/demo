const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

if (signUpButton) {
    signUpButton.addEventListener("click", () => {
        container.classList.add("right-panel-active");
    });
}

if (signInButton) {
    signInButton.addEventListener("click", () => {
        container.classList.remove("right-panel-active");
    });
}

// Mobile Event Listeners
const mobileSignUpButton = document.getElementById("mobileSignUp");
const mobileSignInButton = document.getElementById("mobileSignIn");

if (mobileSignUpButton) {
    mobileSignUpButton.addEventListener("click", () => {
        container.classList.add("right-panel-active");
    });
}

if (mobileSignInButton) {
    mobileSignInButton.addEventListener("click", () => {
        container.classList.remove("right-panel-active");
    });
}

// Three.js Background Animation - Galaxy Spiral
const canvasContainer = document.getElementById("canvas-container");

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
canvasContainer.innerHTML = ""; // Clear any existing canvas
canvasContainer.appendChild(renderer.domElement);

// Galaxy Parameters
const parameters = {
    count: 5000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
};


let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
    // Destroy old galaxy if exists
    if(points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }

    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for(let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        // Position
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
        
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

        positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);

        colors[i3    ] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
};

generateGalaxy();

// Mouse Interaction
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

    // Rotate Galaxy
    if (points) {
        points.rotation.y = elapsedTime * 0.05;
        
        // Slight tilt based on mouse
        points.rotation.x = mouseY * 0.0001;
        points.rotation.z = mouseX * 0.0001;
    }

    camera.position.x = Math.cos(elapsedTime * 0.1) * 6;
    camera.position.z = Math.sin(elapsedTime * 0.1) * 6;
    camera.position.y = Math.sin(elapsedTime * 0.05) * 2;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

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
