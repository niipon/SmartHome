import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let animationFrame = null;
let canvas = null;
let raycaster = null;
let mouse = new THREE.Vector2();
let clickableCards = [];

const cards = [
    {
        title: "HOME",
        subtitle: "Главная",
        route: "/",
        position: [-3.4, 1.0, 0]
    },
    {
        title: "SECURITY",
        subtitle: "Охрана",
        route: "/security",
        position: [3.4, 1.0, 0]
    },
    {
        title: "LIGHTS",
        subtitle: "Освещение",
        route: "/lights",
        position: [-3.4, -1.2, 0]
    },
    {
        title: "SETTINGS",
        subtitle: "Настройки",
        route: "/settings",
        position: [3.4, -1.2, 0]
    }
];

function createText(text, size = 40) {

    const canvas = document.createElement("canvas");

    canvas.width = 512;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 512, 128);

    ctx.font = `800 ${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#1685ff";
    ctx.shadowBlur = 10;

    ctx.fillText(
        text,
        256,
        64
    );

    const texture = new THREE.CanvasTexture(canvas);

    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
    });

    const sprite = new THREE.Sprite(material);

    return sprite;
}


function createCard(data) {

    const group = new THREE.Group();

    group.position.set(
        data.position[0],
        data.position[1],
        data.position[2]
    );

    /*
     * Основная панель
     */

    const panel = new THREE.Mesh(
        new THREE.BoxGeometry(
            2.8,
            1.45,
            0.16
        ),
        new THREE.MeshStandardMaterial({
            color: 0x0a1625,
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x03172f,
            emissiveIntensity: 1
        })
    );

    group.add(panel);


    /*
     * Синяя рамка
     */

    const border = new THREE.LineSegments(
        new THREE.EdgesGeometry(
            new THREE.BoxGeometry(
                2.8,
                1.45,
                0.16
            )
        ),
        new THREE.LineBasicMaterial({
            color: 0x238cff
        })
    );

    group.add(border);


    /*
     * Верхняя линия
     */

    const topLine = new THREE.Mesh(
        new THREE.BoxGeometry(
            1.9,
            0.025,
            0.03
        ),
        new THREE.MeshBasicMaterial({
            color: 0x3d9cff
        })
    );

    topLine.position.set(
        0,
        0.55,
        0.12
    );

    group.add(topLine);


    /*
     * Название
     */

    const title = createText(
        data.title,
        42
    );

    title.position.set(
        0,
        0.12,
        0.18
    );

    title.scale.set(
        2.0,
        0.5,
        1
    );

    group.add(title);


    /*
     * Подзаголовок
     */

    const subtitle = createText(
        data.subtitle,
        24
    );

    subtitle.position.set(
        0,
        -0.3,
        0.18
    );

    subtitle.scale.set(
        2.0,
        0.32,
        1
    );

    group.add(subtitle);


    /*
     * Точка состояния
     */

    const dot = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.055,
            16,
            16
        ),
        new THREE.MeshBasicMaterial({
            color: 0x39a6ff
        })
    );

    dot.position.set(
        -1.05,
        -0.48,
        0.18
    );

    group.add(dot);

    group.userData.route = data.route;

    return group;
}


function createHouse() {

    const group = new THREE.Group();

    /*
     * Дом
     */

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(
            3.2,
            1.9,
            2.3
        ),
        new THREE.MeshStandardMaterial({
            color: 0x111a25,
            metalness: 0.8,
            roughness: 0.25
        })
    );

    body.position.y = -0.1;

    group.add(body);


    /*
     * Крыша
     */

    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(
            2.45,
            1.35,
            4
        ),
        new THREE.MeshStandardMaterial({
            color: 0x182332,
            metalness: 0.8,
            roughness: 0.25
        })
    );

    roof.rotation.y = Math.PI / 4;

    roof.position.y = 1.5;

    group.add(roof);


    /*
     * Переднее стекло
     */

    const glass = new THREE.Mesh(
        new THREE.BoxGeometry(
            2.7,
            1.1,
            0.08
        ),
        new THREE.MeshStandardMaterial({
            color: 0x1764c9,
            emissive: 0x0b4fae,
            emissiveIntensity: 2,
            metalness: 0.4,
            roughness: 0.1
        })
    );

    glass.position.set(
        0,
        0.05,
        1.18
    );

    group.add(glass);


    /*
     * Дверь
     */

    const door = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.55,
            1.15,
            0.1
        ),
        new THREE.MeshBasicMaterial({
            color: 0x218cff
        })
    );

    door.position.set(
        0,
        -0.38,
        1.25
    );

    group.add(door);


    /*
     * Окна
     */

    for (const x of [-0.95, 0.95]) {

        const windowMesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.55,
                0.38,
                0.08
            ),
            new THREE.MeshBasicMaterial({
                color: 0x3c9cff
            })
        );

        windowMesh.position.set(
            x,
            0.28,
            1.25
        );

        group.add(windowMesh);
    }


    return group;
}


function createCore() {

    const group = new THREE.Group();

    const sphere = new THREE.Mesh(
        new THREE.IcosahedronGeometry(
            0.65,
            2
        ),
        new THREE.MeshStandardMaterial({
            color: 0x1764c9,
            emissive: 0x1267e8,
            emissiveIntensity: 2.5,
            metalness: 0.8,
            roughness: 0.1
        })
    );

    group.add(sphere);


    for (let i = 0; i < 2; i++) {

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(
                0.95 + i * 0.25,
                0.018,
                8,
                64
            ),
            new THREE.MeshBasicMaterial({
                color: 0x3d91ff
            })
        );

        ring.rotation.x = Math.PI / 2;

        group.add(ring);
    }

    group.position.set(
        0,
        0.1,
        2
    );

    return group;
}


function createEnvironment() {

    const floor = new THREE.Mesh(
        new THREE.CircleGeometry(
            18,
            64
        ),
        new THREE.MeshStandardMaterial({
            color: 0x020407,
            metalness: 0.7,
            roughness: 0.3
        })
    );

    floor.rotation.x = -Math.PI / 2;

    floor.position.y = -1.65;

    scene.add(floor);


    const grid = new THREE.GridHelper(
        30,
        30,
        0x174c8d,
        0x07101c
    );

    grid.position.y = -1.63;

    grid.material.transparent = true;
    grid.material.opacity = 0.18;

    scene.add(grid);
}


function createLights() {

    const ambient = new THREE.HemisphereLight(
        0x6c9bd0,
        0x05070a,
        2.5
    );

    scene.add(ambient);


    const directional = new THREE.DirectionalLight(
        0xffffff,
        4
    );

    directional.position.set(
        5,
        8,
        10
    );

    scene.add(directional);


    const blue = new THREE.PointLight(
        0x168cff,
        30,
        20
    );

    blue.position.set(
        0,
        3,
        5
    );

    scene.add(blue);
}


function resize() {

    if (!canvas || !camera || !renderer)
        return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (width <= 0 || height <= 0)
        return;

    renderer.setSize(
        width,
        height,
        false
    );

    const aspect = width / height;

    const viewHeight = 9;

    const viewWidth =
        viewHeight * aspect;

    camera.left =
        -viewWidth / 2;

    camera.right =
        viewWidth / 2;

    camera.top =
        viewHeight / 2;

    camera.bottom =
        -viewHeight / 2;

    camera.updateProjectionMatrix();
}


function animate(time = 0) {

    animationFrame =
        requestAnimationFrame(animate);

    if (!scene || !camera || !renderer)
        return;

    if (controls)
        controls.update();


    const houseObject =
        scene.userData.house;

    const coreObject =
        scene.userData.core;


    if (houseObject) {

        houseObject.rotation.y =
            Math.sin(time * 0.00025) * 0.04;
    }


    if (coreObject) {

        coreObject.rotation.y =
            time * 0.0005;

        coreObject.position.y =
            0.1 +
            Math.sin(time * 0.001) * 0.08;
    }


    renderer.render(
        scene,
        camera
    );
}

function onPointerDown(event) {

    if (!canvas || !camera)
        return;

    const rect = canvas.getBoundingClientRect();

    mouse.x =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;

    mouse.y =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const intersects =
        raycaster.intersectObjects(
            clickableCards,
            true
        );

    if (intersects.length === 0)
        return;

    let object =
        intersects[0].object;

    while (
        object.parent &&
        !object.userData.route
    ) {
        object = object.parent;
    }

    const route =
        object.userData.route;

    if (!route)
        return;

    console.log(
        "CONTROL CENTER NAVIGATION:",
        route
    );

    window.location.href = route;
}

export function init(canvasId) {

    console.log(
        "CONTROL CENTER INIT"
    );

    cleanup();


    canvas =
        document.getElementById(canvasId);


    if (!canvas) {

        console.error(
            "Canvas not found:",
            canvasId
        );

        return;
    }


    /*
     * SCENE
     */

    scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(
            0x050912
        );


    /*
     * CAMERA
     */

    camera =
        new THREE.OrthographicCamera(
            -8,
            8,
            4.5,
            -4.5,
            0.1,
            100
        );

    camera.position.set(
        0,
        3,
        14
    );

    camera.lookAt(
        0,
        0,
        0
    );


    /*
     * RENDERER
     */

    renderer =
        new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: false
        });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            1.5
        )
    );

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;

    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure =
        1.2;


    /*
     * LIGHTS
     */

    createLights();

    createEnvironment();


    /*
     * HOUSE
     */

    const house =
        createHouse();

    scene.add(house);

    scene.userData.house =
        house;


    /*
     * CORE
     */

    const core =
        createCore();

    scene.add(core);

    scene.userData.core =
        core;


    /*
     * CARDS
     */

    scene.userData.cards = [];
    clickableCards = [];

    for (const item of cards) {

        const card =
            createCard(item);

        scene.add(card);

        scene.userData.cards.push(
            card
        );

        clickableCards.push(
            card
        );
    }


    /*
     * CONTROLS
     */

    controls =
        new OrbitControls(
            camera,
            canvas
        );

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;

    controls.enablePan = false;

    controls.minPolarAngle =
        Math.PI * 0.35;

    controls.maxPolarAngle =
        Math.PI * 0.62;

    controls.target.set(
        0,
        0,
        0
    );

    raycaster =
        new THREE.Raycaster();

    canvas.addEventListener(
        "pointerdown",
        onPointerDown
    );

    /*
     * RESIZE
     */

    window.addEventListener(
        "resize",
        resize
    );

    resize();


    console.log(
        "CONTROL CENTER READY"
    );


    animate();
}


function cleanup() {

    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;
    }


    window.removeEventListener(
        "resize",
        resize
    );

    if (canvas) {

        canvas.removeEventListener(
            "pointerdown",
            onPointerDown
        );
    }

    if (controls) {

        controls.dispose();

        controls = null;
    }


    if (renderer) {

        renderer.dispose();

        renderer = null;
    }


    scene = null;
    camera = null;
    canvas = null;
}


export function dispose() {

    cleanup();
}