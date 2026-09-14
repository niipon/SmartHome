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

let interactiveObjects = [];
let cards = [];

let blazorReference = null;

let resizeHandler = null;
let pointerMoveHandler = null;
let pointerDownHandler = null;
let pointerUpHandler = null;
let clickHandler = null;


/* =========================================================
   NAVIGATION
========================================================= */

const navigationItems = [

    {
        name: "HOME",
        label: "Главная",
        description: "Состояние дома",
        position: [-2.7, 1.0, 0.8],
        url: "/"
    },

    {
        name: "SECURITY",
        label: "Охрана",
        description: "Безопасность дома",
        position: [2.7, 1.0, 0.8],
        url: "/security"
    },

    {
        name: "LIGHTS",
        label: "Освещение",
        description: "Управление светом",
        position: [-2.7, -1.0, 0.8],
        url: "/lights"
    },

    {
        name: "SETTINGS",
        label: "Настройки",
        description: "Параметры системы",
        position: [2.7, -1.0, 0.8],
        url: "/settings"
    },

    {
        name: "NOTIFICATIONS",
        label: "Уведомления",
        description: "Центр уведомлений",
        position: [0, -2.35, 0.8],
        url: "/notifications"
    }

];


/* =========================================================
   HELPERS
========================================================= */

function updatePointer(event) {

    if (!canvas)
        return;

    const rect =
        canvas.getBoundingClientRect();

    mouse.x =
        ((event.clientX - rect.left) /
            rect.width) * 2 - 1;

    mouse.y =
        -((event.clientY - rect.top) /
            rect.height) * 2 + 1;
}


function getNavigationFromObject(object) {

    let current = object;

    while (current) {

        if (
            current.userData &&
            current.userData.navigation
        ) {
            return current.userData.navigation;
        }

        current = current.parent;
    }

    return null;
}


/* =========================================================
   CLICK
========================================================= */

async function handleClick(event) {

    if (!raycaster || !camera)
        return;

    updatePointer(event);

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const hits =
        raycaster.intersectObjects(
            interactiveObjects,
            true
        );

    if (!hits.length)
        return;

    const navigation =
        getNavigationFromObject(
            hits[0].object
        );

    if (
        !navigation ||
        !navigation.url
    ) {
        return;
    }

    console.log(
        "CONTROL CENTER CLICK:",
        navigation.name,
        navigation.url
    );


    /* -----------------------------------------
       Blazor navigation
    ----------------------------------------- */

    if (blazorReference) {

        try {

            await blazorReference.invokeMethodAsync(
                "NavigateFrom3D",
                navigation.url
            );

            return;

        }
        catch (error) {

            console.error(
                "Blazor navigation error:",
                error
            );

        }
    }


    /* -----------------------------------------
       Fallback
    ----------------------------------------- */

    window.location.href =
        navigation.url;
}


/* =========================================================
   HOVER
========================================================= */

function handlePointerMove(event) {

    if (!raycaster || !camera)
        return;

    updatePointer(event);

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const hits =
        raycaster.intersectObjects(
            interactiveObjects,
            true
        );

    if (hits.length) {

        canvas.style.cursor =
            "pointer";

    }
    else {

        canvas.style.cursor =
            "default";

    }
}


/* =========================================================
   CARD CREATION
========================================================= */

function createCard(item) {

    const group =
        new THREE.Group();

    group.position.set(
        item.position[0],
        item.position[1],
        item.position[2]
    );


    /* -----------------------------------------
       Main card
    ----------------------------------------- */

    const geometry =
        new THREE.BoxGeometry(
            2.15,
            1.15,
            0.12
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x0b1524,
            metalness: 0.75,
            roughness: 0.28,
            transparent: true,
            opacity: 0.96
        });

    const card =
        new THREE.Mesh(
            geometry,
            material
        );

    group.add(card);


    /* -----------------------------------------
       Border
    ----------------------------------------- */

    const borderGeometry =
        new THREE.EdgesGeometry(
            geometry
        );

    const borderMaterial =
        new THREE.LineBasicMaterial({
            color: 0x238cff,
            transparent: true,
            opacity: 0.9
        });

    const border =
        new THREE.LineSegments(
            borderGeometry,
            borderMaterial
        );

    group.add(border);


    /* -----------------------------------------
       Navigation data
    ----------------------------------------- */

    group.userData.navigation =
        item;

    card.userData.navigation =
        item;

    border.userData.navigation =
        item;


    /* -----------------------------------------
       Text
    ----------------------------------------- */

    const textCanvas =
        document.createElement("canvas");

    textCanvas.width = 1024;
    textCanvas.height = 512;

    const ctx =
        textCanvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        textCanvas.width,
        textCanvas.height
    );


    ctx.textAlign = "center";
    ctx.textBaseline = "middle";


    /* Title */

    ctx.font =
        "bold 72px Arial";

    ctx.fillStyle =
        "#ffffff";

    ctx.fillText(
        item.name,
        512,
        190
    );


    /* Description */

    ctx.font =
        "32px Arial";

    ctx.fillStyle =
        "#8fa8c7";

    ctx.fillText(
        item.description,
        512,
        280
    );


    const texture =
        new THREE.CanvasTexture(
            textCanvas
        );

    texture.colorSpace =
        THREE.SRGBColorSpace;


    const textMaterial =
        new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });


    const textGeometry =
        new THREE.PlaneGeometry(
            1.85,
            0.9
        );


    const text =
        new THREE.Mesh(
            textGeometry,
            textMaterial
        );

    text.position.z =
        0.075;

    text.userData.navigation =
        item;

    group.add(text);


    /* -----------------------------------------
       Glow
    ----------------------------------------- */

    const glowGeometry =
        new THREE.PlaneGeometry(
            2.35,
            1.35
        );

    const glowMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x087cff,
            transparent: true,
            opacity: 0.045,
            side: THREE.DoubleSide
        });

    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );

    glow.position.z =
        -0.08;

    glow.userData.navigation =
        item;

    group.add(glow);


    /* -----------------------------------------
       Store
    ----------------------------------------- */

    interactiveObjects.push(
        group
    );

    cards.push(
        group
    );

    scene.add(
        group
    );


    return group;
}


/* =========================================================
   RESPONSIVE CAMERA
========================================================= */

function updateResponsiveCamera() {

    if (
        !camera ||
        !renderer ||
        !cards ||
        cards.length < 5
    ) {
        return;
    }

    const width =
        window.innerWidth;


    /* -----------------------------------------
       Desktop
    ----------------------------------------- */

    if (width > 1200) {

        camera.position.set(
            0,
            0.5,
            8.8
        );

        camera.fov = 48;

        cards[0].position.set(
            -2.7,
            1.0,
            0.8
        );

        cards[1].position.set(
            2.7,
            1.0,
            0.8
        );

        cards[2].position.set(
            -2.7,
            -1.0,
            0.8
        );

        cards[3].position.set(
            2.7,
            -1.0,
            0.8
        );

        cards[4].position.set(
            0,
            -2.35,
            0.8
        );

        cards.forEach(card => {
            card.scale.set(
                1,
                1,
                1
            );
        });

    }


    /* -----------------------------------------
       Tablet
    ----------------------------------------- */

    else if (width > 700) {

        camera.position.set(
            0,
            0.4,
            9.8
        );

        camera.fov = 52;

        cards[0].position.set(
            -2.35,
            1.05,
            0.8
        );

        cards[1].position.set(
            2.35,
            1.05,
            0.8
        );

        cards[2].position.set(
            -2.35,
            -0.85,
            0.8
        );

        cards[3].position.set(
            2.35,
            -0.85,
            0.8
        );

        cards[4].position.set(
            0,
            -2.05,
            0.8
        );

        cards.forEach(card => {
            card.scale.set(
                0.9,
                0.9,
                0.9
            );
        });

    }


    /* -----------------------------------------
       Phone
    ----------------------------------------- */

    else {

        camera.position.set(
            0,
            0.2,
            10.8
        );

        camera.fov = 55;

        cards[0].position.set(
            -1.45,
            2.45,
            0.8
        );

        cards[1].position.set(
            1.45,
            2.45,
            0.8
        );

        cards[2].position.set(
            -1.45,
            0.65,
            0.8
        );

        cards[3].position.set(
            1.45,
            0.65,
            0.8
        );

        cards[4].position.set(
            0,
            -1.25,
            0.8
        );

        cards.forEach(card => {
            card.scale.set(
                0.68,
                0.68,
                0.68
            );
        });

    }


    camera.updateProjectionMatrix();
}


/* =========================================================
   RESIZE
========================================================= */

function handleResize() {

    if (
        !camera ||
        !renderer ||
        !canvas
    ) {
        return;
    }

    const width =
        canvas.clientWidth ||
        window.innerWidth;

    const height =
        canvas.clientHeight ||
        window.innerHeight;


    camera.aspect =
        width / height;

    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height,
        false
    );


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    updateResponsiveCamera();
}


/* =========================================================
   ANIMATION
========================================================= */

function animate() {

    if (!renderer || !scene || !camera)
        return;

    animationFrame =
        requestAnimationFrame(
            animate
        );


    /* -----------------------------------------
       Subtle card animation
    ----------------------------------------- */

    const time =
        performance.now() * 0.001;


    cards.forEach(
        (card, index) => {

            const baseY =
                card.userData.baseY ??
                card.position.y;

            if (
                card.userData.baseY ===
                undefined
            ) {
                card.userData.baseY =
                    baseY;
            }

            card.position.y =
                baseY +
                Math.sin(
                    time * 0.8 +
                    index * 0.7
                ) * 0.025;

        }
    );


    if (controls)
        controls.update();


    renderer.render(
        scene,
        camera
    );
}


/* =========================================================
   INIT
========================================================= */

export function init(
    canvasId,
    dotNetReference
) {

    console.log(
        "MY HOME CONTROL CENTER: INIT"
    );


    cleanup();


    blazorReference =
        dotNetReference;


    canvas =
        document.getElementById(
            canvasId
        );


    if (!canvas) {

        console.error(
            "CONTROL CENTER: canvas not found"
        );

        return;
    }


    /* -----------------------------------------
       Scene
    ----------------------------------------- */

    scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(
            0x050912
        );


    /* -----------------------------------------
       Camera
    ----------------------------------------- */

    camera =
        new THREE.PerspectiveCamera(
            48,
            window.innerWidth /
            window.innerHeight,
            0.1,
            100
        );

    camera.position.set(
        0,
        0.5,
        8.8
    );


    /* -----------------------------------------
       Renderer
    ----------------------------------------- */

    renderer =
        new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    /* -----------------------------------------
       Lights
    ----------------------------------------- */

    const ambientLight =
        new THREE.AmbientLight(
            0x8dbdff,
            1.8
        );

    scene.add(
        ambientLight
    );


    const mainLight =
        new THREE.DirectionalLight(
            0xffffff,
            2.5
        );

    mainLight.position.set(
        3,
        5,
        6
    );

    scene.add(
        mainLight
    );


    const blueLight =
        new THREE.PointLight(
            0x087cff,
            5,
            15
        );

    blueLight.position.set(
        0,
        0,
        4
    );

    scene.add(
        blueLight
    );


    /* -----------------------------------------
       Controls
    ----------------------------------------- */

    controls =
        new OrbitControls(
            camera,
            canvas
        );

    controls.enableDamping =
        true;

    controls.enablePan =
        false;

    controls.enableZoom =
        false;

    controls.minPolarAngle =
        Math.PI * 0.38;

    controls.maxPolarAngle =
        Math.PI * 0.62;


    /* -----------------------------------------
       Raycaster
    ----------------------------------------- */

    raycaster =
        new THREE.Raycaster();


    /* -----------------------------------------
       Cards
    ----------------------------------------- */

    interactiveObjects = [];
    cards = [];


    navigationItems.forEach(
        item => {

            createCard(
                item
            );

        }
    );


    /* -----------------------------------------
       Responsive
    ----------------------------------------- */

    updateResponsiveCamera();


    /* -----------------------------------------
       Events
    ----------------------------------------- */

    resizeHandler =
        handleResize;

    pointerMoveHandler =
        handlePointerMove;

    clickHandler =
        handleClick;


    window.addEventListener(
        "resize",
        resizeHandler
    );


    canvas.addEventListener(
        "pointermove",
        pointerMoveHandler
    );


    canvas.addEventListener(
        "click",
        clickHandler
    );


    /* -----------------------------------------
       Start
    ----------------------------------------- */

    animate();


    console.log(
        "MY HOME CONTROL CENTER: READY"
    );
}


/* =========================================================
   CLEANUP
========================================================= */

function cleanup() {

    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;
    }


    if (
        canvas &&
        pointerMoveHandler
    ) {

        canvas.removeEventListener(
            "pointermove",
            pointerMoveHandler
        );
    }


    if (
        canvas &&
        clickHandler
    ) {

        canvas.removeEventListener(
            "click",
            clickHandler
        );
    }


    if (resizeHandler) {

        window.removeEventListener(
            "resize",
            resizeHandler
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


    if (scene) {

        scene.traverse(
            object => {

                if (
                    object.geometry
                ) {
                    object.geometry.dispose();
                }

                if (
                    object.material
                ) {

                    if (
                        Array.isArray(
                            object.material
                        )
                    ) {

                        object.material.forEach(
                            material =>
                                material.dispose()
                        );

                    }
                    else {

                        object.material.dispose();

                    }
                }

            }
        );

        scene.clear();
        scene = null;
    }


    interactiveObjects = [];
    cards = [];

    raycaster = null;
    camera = null;
    canvas = null;

    blazorReference = null;
}


/* =========================================================
   DISPOSE
========================================================= */

export function dispose() {

    console.log(
        "MY HOME CONTROL CENTER: DISPOSE"
    );

    cleanup();
}