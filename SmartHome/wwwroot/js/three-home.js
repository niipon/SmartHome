three - home.jsimport * as THREE from "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js";

let scene;
let camera;
let renderer;
let animationId;

let house;
let particles = [];
let floatingObjects = [];

const state = {
    temperature: 0,
    humidity: 0,
    gas: 0,
    motion: false,
    security: false
};

export function init(containerId) {

    const container = document.getElementById(containerId);

    if (!container) {
        console.error("Three.js container not found:", containerId);
        return;
    }

    cleanup();

    // =========================
    // SCENE
    // =========================

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x05070b);

    scene.fog = new THREE.FogExp2(
        0x05070b,
        0.025
    );

    // =========================
    // CAMERA
    // =========================

    camera = new THREE.PerspectiveCamera(
        55,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    camera.position.set(
        8,
        6,
        11
    );

    camera.lookAt(
        0,
        1.5,
        0
    );

    // =========================
    // RENDERER
    // =========================

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

    container.innerHTML = "";

    container.appendChild(
        renderer.domElement
    );

    // =========================
    // LIGHTING
    // =========================

    const ambientLight =
        new THREE.AmbientLight(
            0x8899aa,
            1.4
        );

    scene.add(ambientLight);

    const mainLight =
        new THREE.DirectionalLight(
            0xffffff,
            3
        );

    mainLight.position.set(
        5,
        10,
        5
    );

    mainLight.castShadow = true;

    scene.add(mainLight);

    const blueLight =
        new THREE.PointLight(
            0x2288ff,
            15,
            30
        );

    blueLight.position.set(
        -5,
        3,
        4
    );

    scene.add(blueLight);

    const cyanLight =
        new THREE.PointLight(
            0x00eaff,
            12,
            25
        );

    cyanLight.position.set(
        5,
        2,
        -4
    );

    scene.add(cyanLight);

    // =========================
    // WORLD
    // =========================

    createFloor();
    createGrid();
    createHouse();
    createParticles();
    createFloatingPanels();

    // =========================
    // RESIZE
    // =========================

    window.addEventListener(
        "resize",
        onResize
    );

    // =========================
    // START
    // =========================

    animate();
}


// =====================================================
// FLOOR
// =====================================================

function createFloor() {

    const geometry =
        new THREE.CircleGeometry(
            25,
            96
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x070b11,
            roughness: 0.65,
            metalness: 0.3
        });

    const floor =
        new THREE.Mesh(
            geometry,
            material
        );

    floor.rotation.x =
        -Math.PI / 2;

    floor.position.y = -0.05;

    floor.receiveShadow = true;

    scene.add(floor);
}


// =====================================================
// GRID
// =====================================================

function createGrid() {

    const grid =
        new THREE.GridHelper(
            40,
            40,
            0x17304a,
            0x0b1826
        );

    grid.position.y = 0;

    scene.add(grid);
}


// =====================================================
// HOUSE
// =====================================================

function createHouse() {

    house =
        new THREE.Group();

    scene.add(house);

    // =========================
    // MAIN BODY
    // =========================

    const bodyGeometry =
        new THREE.BoxGeometry(
            7,
            3.2,
            5.5
        );

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x101722,
            roughness: 0.32,
            metalness: 0.5
        });

    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

    body.position.y = 1.6;

    body.castShadow = true;
    body.receiveShadow = true;

    house.add(body);


    // =========================
    // ROOF
    // =========================

    const roofGeometry =
        new THREE.ConeGeometry(
            4.7,
            2.4,
            4
        );

    const roofMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x151e2b,
            roughness: 0.28,
            metalness: 0.65
        });

    const roof =
        new THREE.Mesh(
            roofGeometry,
            roofMaterial
        );

    roof.position.y = 4.4;

    roof.rotation.y =
        Math.PI / 4;

    roof.castShadow = true;

    house.add(roof);


    // =========================
    // WINDOWS
    // =========================

    createWindow(
        -2.1,
        2,
        2.78
    );

    createWindow(
        0,
        2,
        2.78
    );

    createWindow(
        2.1,
        2,
        2.78
    );


    // =========================
    // DOOR
    // =========================

    const doorGeometry =
        new THREE.BoxGeometry(
            1.25,
            2.2,
            0.15
        );

    const doorMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x182536,
            metalness: 0.4,
            roughness: 0.3
        });

    const door =
        new THREE.Mesh(
            doorGeometry,
            doorMaterial
        );

    door.position.set(
        0,
        1.1,
        2.82
    );

    door.castShadow = true;

    house.add(door);


    // =========================
    // GLOW
    // =========================

    const glowGeometry =
        new THREE.BoxGeometry(
            7.05,
            3.25,
            5.55
        );

    const glowMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x008cff,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });

    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );

    glow.position.y = 1.6;

    house.add(glow);
}


// =====================================================
// WINDOW
// =====================================================

function createWindow(x, y, z) {

    const geometry =
        new THREE.BoxGeometry(
            1.25,
            1.1,
            0.08
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x073d5c,
            emissive: 0x0066aa,
            emissiveIntensity: 1.5,
            metalness: 0.6,
            roughness: 0.15
        });

    const window =
        new THREE.Mesh(
            geometry,
            material
        );

    window.position.set(
        x,
        y,
        z
    );

    house.add(window);
}


// =====================================================
// PARTICLES
// =====================================================

function createParticles() {

    const geometry =
        new THREE.BufferGeometry();

    const positions = [];

    for (
        let i = 0;
        i < 700;
        i++
    ) {

        positions.push(
            (Math.random() - 0.5) * 35,
            Math.random() * 15,
            (Math.random() - 0.5) * 35
        );
    }

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            positions,
            3
        )
    );

    const material =
        new THREE.PointsMaterial({
            color: 0x38aaff,
            size: 0.025,
            transparent: true,
            opacity: 0.65
        });

    const points =
        new THREE.Points(
            geometry,
            material
        );

    scene.add(points);

    particles.push(points);
}


// =====================================================
// FLOATING 3D PANELS
// =====================================================

function createFloatingPanels() {

    createPanel(
        "TEMPERATURE",
        "20°C",
        -6,
        4.8,
        0
    );

    createPanel(
        "HUMIDITY",
        "45%",
        6,
        4.5,
        0
    );

    createPanel(
        "SECURITY",
        "ACTIVE",
        -5.5,
        1.5,
        -2
    );

    createPanel(
        "SYSTEM",
        "ONLINE",
        5.5,
        1.5,
        -2
    );
}


// =====================================================
// PANEL
// =====================================================

function createPanel(
    title,
    value,
    x,
    y,
    z
) {

    const group =
        new THREE.Group();

    group.position.set(
        x,
        y,
        z
    );

    const geometry =
        new THREE.BoxGeometry(
            3.1,
            1.35,
            0.18
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x0c1622,
            metalness: 0.65,
            roughness: 0.25,
            transparent: true,
            opacity: 0.94
        });

    const panel =
        new THREE.Mesh(
            geometry,
            material
        );

    panel.castShadow = true;

    group.add(panel);


    // glowing edge

    const edgeGeometry =
        new THREE.BoxGeometry(
            3.15,
            1.4,
            0.2
        );

    const edgeMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x168cff,
            wireframe: true,
            transparent: true,
            opacity: 0.35
        });

    const edge =
        new THREE.Mesh(
            edgeGeometry,
            edgeMaterial
        );

    group.add(edge);

    scene.add(group);

    floatingObjects.push(group);
}


// =====================================================
// UPDATE DATA FROM BLAZOR
// =====================================================

export function updateHomeData(
    temperature,
    humidity,
    gas,
    motion,
    security
) {

    state.temperature =
        temperature;

    state.humidity =
        humidity;

    state.gas =
        gas;

    state.motion =
        motion;

    state.security =
        security;
}


// =====================================================
// CAMERA
// =====================================================

export function setCamera(
    x,
    y,
    z
) {

    if (!camera)
        return;

    camera.position.set(
        x,
        y,
        z
    );

    camera.lookAt(
        0,
        1.5,
        0
    );
}


// =====================================================
// ANIMATION
// =====================================================

function animate() {

    animationId =
        requestAnimationFrame(
            animate
        );

    const time =
        performance.now() * 0.001;


    // HOUSE FLOAT

    if (house) {

        house.position.y =
            Math.sin(time * 0.7) * 0.05;

        house.rotation.y =
            Math.sin(time * 0.15) * 0.03;
    }


    // PANELS

    floatingObjects.forEach(
        (object, index) => {

            object.position.y +=
                Math.sin(
                    time * 0.8 +
                    index
                ) * 0.0008;

            object.rotation.y =
                Math.sin(
                    time * 0.4 +
                    index
                ) * 0.025;
        }
    );


    // PARTICLES

    particles.forEach(
        points => {

            points.rotation.y +=
                0.00025;

        }
    );


    renderer.render(
        scene,
        camera
    );
}


// =====================================================
// RESIZE
// =====================================================

function onResize() {

    const canvas =
        renderer?.domElement;

    if (!canvas)
        return;

    const container =
        canvas.parentElement;

    if (!container)
        return;

    camera.aspect =
        container.clientWidth /
        container.clientHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );
}


// =====================================================
// CLEANUP
// =====================================================

function cleanup() {

    if (animationId) {

        cancelAnimationFrame(
            animationId
        );

        animationId = null;
    }

    if (renderer) {

        renderer.dispose();

        if (
            renderer.domElement &&
            renderer.domElement.parentElement
        ) {

            renderer.domElement.parentElement
                .removeChild(
                    renderer.domElement
                );
        }
    }

    window.removeEventListener(
        "resize",
        onResize
    );

    scene = null;
    camera = null;
    renderer = null;
    house = null;

    particles = [];
    floatingObjects = [];
}