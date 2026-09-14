
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let animationFrame = null;
let canvas = null;
let clock = null;

let raycaster = null;
let mouse = new THREE.Vector2();

let interactiveObjects = [];
let hoveredObject = null;

let house = null;
let core = null;

let resizeObserver = null;

// Ссылка на Blazor
let blazorReference = null;


/* =========================
   NAVIGATION
   ========================= */

const navigationItems = [
    {
        name: "HOME",
        label: "Главная",
        description: "Управление домом",
        position: [-4.0, 0.85, 0.2],
        url: "/"
    },
    {
        name: "SECURITY",
        label: "Охрана",
        description: "Безопасность дома",
        position: [4.0, 0.85, 0.2],
        url: "/security"
    },
    {
        name: "LIGHTS",
        label: "Освещение",
        description: "Управление светом",
        position: [-3.8, -0.65, 0.8],
        url: "/lights"
    },
    {
        name: "SETTINGS",
        label: "Настройки",
        description: "Параметры системы",
        position: [3.8, -0.65, 0.8],
        url: "/settings"
    }
];


/* =========================
   MATERIALS
   ========================= */

function metalMaterial() {

    return new THREE.MeshStandardMaterial({
        color: 0x101721,
        metalness: 0.85,
        roughness: 0.25
    });
}


function blueMaterial() {

    return new THREE.MeshStandardMaterial({
        color: 0x1557a5,
        metalness: 0.65,
        roughness: 0.2,
        emissive: 0x0d55b8,
        emissiveIntensity: 1.8
    });
}


function glassMaterial() {

    return new THREE.MeshPhysicalMaterial({
        color: 0x102238,
        metalness: 0.3,
        roughness: 0.15,
        transparent: true,
        opacity: 0.94,
        clearcoat: 1
    });
}


/* =========================
   HOUSE
   ========================= */

function createHouse() {

    const group = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(
            3.5,
            2,
            2.5
        ),
        metalMaterial()
    );

    group.add(body);


    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(
            2.55,
            1.4,
            4
        ),
        metalMaterial()
    );

    roof.rotation.y = Math.PI / 4;
    roof.position.y = 1.7;

    group.add(roof);


    const glass = new THREE.Mesh(
        new THREE.BoxGeometry(
            3,
            1.35,
            0.08
        ),
        glassMaterial()
    );

    glass.position.set(
        0,
        0.15,
        1.28
    );

    group.add(glass);


    const door = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.65,
            1.25,
            0.1
        ),
        blueMaterial()
    );

    door.position.set(
        0,
        -0.35,
        1.34
    );

    group.add(door);


    const windowMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x318bff,
            emissive: 0x1467dd,
            emissiveIntensity: 2,
            roughness: 0.12
        });


    const positions = [
        [-1.05, 0.25],
        [1.05, 0.25],
        [-1.05, -0.7],
        [1.05, -0.7]
    ];


    for (const p of positions) {

        const windowMesh =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.65,
                    0.45,
                    0.08
                ),
                windowMaterial
            );

        windowMesh.position.set(
            p[0],
            p[1],
            1.33
        );

        group.add(windowMesh);
    }

    return group;
}


/* =========================
   CORE
   ========================= */

function createCore() {

    const group =
        new THREE.Group();

    const sphere =
        new THREE.Mesh(
            new THREE.IcosahedronGeometry(
                0.7,
                2
            ),
            new THREE.MeshStandardMaterial({
                color: 0x1764c9,
                metalness: 0.8,
                roughness: 0.12,
                emissive: 0x1267e8,
                emissiveIntensity: 2.5
            })
        );

    group.add(sphere);


    for (let i = 0; i < 2; i++) {

        const ring =
            new THREE.Mesh(
                new THREE.TorusGeometry(
                    1.05 + i * 0.28,
                    0.018,
                    8,
                    48
                ),
                new THREE.MeshBasicMaterial({
                    color: 0x3d91ff,
                    transparent: true,
                    opacity: 0.65
                })
            );

        ring.rotation.x =
            Math.PI / 2;

        group.add(ring);
    }

    return group;
}


/* =========================
   CARD GLOW
   ========================= */

function createCardGlow(width, height) {

    const glow =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                width,
                height
            ),
            new THREE.MeshBasicMaterial({
                color: 0x087cff,
                transparent: true,
                opacity: 0.08,
                depthWrite: false
            })
        );

    glow.position.z = -0.04;

    return glow;
}


/* =========================
   CARD
   ========================= */

function createNavigationObject(item) {

    const group =
        new THREE.Group();

    group.position.set(
        item.position[0],
        item.position[1],
        item.position[2]
    );

    group.userData.navigation = item;

    group.userData.baseScale = 1;


    const glow =
        createCardGlow(
            3.0,
            1.72
        );

    glow.userData.navigation = item;

    group.add(glow);


    const panelMaterial =
        new THREE.MeshPhysicalMaterial({

            color: 0x0b1726,

            metalness: 0.72,
            roughness: 0.18,

            transparent: true,

            opacity: 0.94,

            transmission: 0.08,

            clearcoat: 1,

            clearcoatRoughness: 0.12,

            emissive: 0x03172f,

            emissiveIntensity: 0.9
        });


    const panel =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.65,
                1.42,
                0.18
            ),
            panelMaterial
        );

    panel.userData.navigation = item;

    group.add(panel);


    const innerMaterial =
        new THREE.MeshPhysicalMaterial({

            color: 0x07101c,

            metalness: 0.35,

            roughness: 0.2,

            transparent: true,

            opacity: 0.9,

            transmission: 0.12,

            clearcoat: 1,

            emissive: 0x020b18,

            emissiveIntensity: 0.6
        });


    const inner =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.34,
                1.08,
                0.045
            ),
            innerMaterial
        );

    inner.position.z = 0.115;

    inner.userData.navigation = item;

    group.add(inner);


    const border =
        new THREE.LineSegments(
            new THREE.EdgesGeometry(
                new THREE.BoxGeometry(
                    2.65,
                    1.42,
                    0.18
                )
            ),
            new THREE.LineBasicMaterial({
                color: 0x238cff,
                transparent: true,
                opacity: 0.85
            })
        );

    border.position.z = 0.08;

    border.userData.navigation = item;

    group.add(border);


    const innerBorder =
        new THREE.LineSegments(
            new THREE.EdgesGeometry(
                new THREE.BoxGeometry(
                    2.34,
                    1.08,
                    0.045
                )
            ),
            new THREE.LineBasicMaterial({
                color: 0x155da8,
                transparent: true,
                opacity: 0.38
            })
        );

    innerBorder.position.z = 0.145;

    innerBorder.userData.navigation = item;

    group.add(innerBorder);


    const topLine =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.9,
                0.018,
                0.025
            ),
            new THREE.MeshBasicMaterial({
                color: 0x3d9cff,
                transparent: true,
                opacity: 0.85
            })
        );

    topLine.position.set(
        0,
        0.61,
        0.17
    );

    topLine.userData.navigation = item;

    group.add(topLine);


    const bottomLine =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.2,
                0.014,
                0.025
            ),
            new THREE.MeshBasicMaterial({
                color: 0x146fd4,
                transparent: true,
                opacity: 0.75
            })
        );

    bottomLine.position.set(
        0,
        -0.57,
        0.17
    );

    bottomLine.userData.navigation = item;

    group.add(bottomLine);


    const pointGeometry =
        new THREE.SphereGeometry(
            0.035,
            12,
            12
        );

    const pointMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x5ab1ff
        });


    const leftPoint =
        new THREE.Mesh(
            pointGeometry,
            pointMaterial
        );

    leftPoint.position.set(
        -1.08,
        0.58,
        0.18
    );

    leftPoint.userData.navigation = item;

    group.add(leftPoint);


    const rightPoint =
        new THREE.Mesh(
            pointGeometry,
            pointMaterial
        );

    rightPoint.position.set(
        1.08,
        0.58,
        0.18
    );

    rightPoint.userData.navigation = item;

    group.add(rightPoint);


    const title =
        createTextSprite(
            item.name,
            44,
            "#ffffff"
        );

    title.position.set(
        0,
        0.20,
        0.23
    );

    title.scale.set(
        2.0,
        0.48,
        1
    );

    title.userData.navigation = item;

    group.add(title);


    const description =
        createTextSprite(
            item.description,
            22,
            "#8db9e9"
        );

    description.position.set(
        0,
        -0.26,
        0.23
    );

    description.scale.set(
        2.15,
        0.28,
        1
    );

    description.userData.navigation = item;

    group.add(description);


    const status =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.055,
                16,
                16
            ),
            new THREE.MeshBasicMaterial({
                color: 0x39a6ff
            })
        );

    status.position.set(
        -0.92,
        -0.47,
        0.22
    );

    status.userData.navigation = item;

    group.add(status);


    interactiveObjects.push(panel);
    interactiveObjects.push(inner);
    interactiveObjects.push(border);
    interactiveObjects.push(innerBorder);
    interactiveObjects.push(topLine);
    interactiveObjects.push(bottomLine);
    interactiveObjects.push(leftPoint);
    interactiveObjects.push(rightPoint);
    interactiveObjects.push(title);
    interactiveObjects.push(description);
    interactiveObjects.push(status);
    interactiveObjects.push(glow);


    return group;
}


/* =========================
   TEXT
   ========================= */

function createTextSprite(
    text,
    fontSize,
    color
) {

    const textCanvas =
        document.createElement("canvas");

    textCanvas.width = 512;
    textCanvas.height = 128;

    const context =
        textCanvas.getContext("2d");

    context.clearRect(
        0,
        0,
        textCanvas.width,
        textCanvas.height
    );

    context.font =
        `800 ${ fontSize }px Arial`;

    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillStyle = color;

    context.shadowColor = "#1685ff";
    context.shadowBlur = 8;

    context.fillText(
        text,
        textCanvas.width / 2,
        textCanvas.height / 2
    );


    const texture =
        new THREE.CanvasTexture(
            textCanvas
        );

    texture.colorSpace =
        THREE.SRGBColorSpace;

    texture.minFilter =
        THREE.LinearFilter;

    texture.magFilter =
        THREE.LinearFilter;


    const material =
        new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false
        });


    return new THREE.Sprite(material);
}


/* =========================
   LIGHTS
   ========================= */

function createLights() {

    scene.add(
        new THREE.HemisphereLight(
            0x4d82bd,
            0x080b10,
            2.8
        )
    );


    const directional =
        new THREE.DirectionalLight(
            0xffffff,
            3.5
        );

    directional.position.set(
        5,
        8,
        7
    );

    scene.add(directional);


    const blue =
        new THREE.PointLight(
            0x1474ff,
            25,
            20
        );

    blue.position.set(
        -5,
        3,
        4
    );

    scene.add(blue);


    const blue2 =
        new THREE.PointLight(
            0x168cff,
            18,
            18
        );

    blue2.position.set(
        5,
        2,
        -3
    );

    scene.add(blue2);
}


/* =========================
   ENVIRONMENT
   ========================= */

function createEnvironment() {

    const floor =
        new THREE.Mesh(
            new THREE.CircleGeometry(
                18,
                64
            ),
            new THREE.MeshStandardMaterial({
                color: 0x020407,
                metalness: 0.8,
                roughness: 0.3
            })
        );

    floor.rotation.x =
        -Math.PI / 2;

    floor.position.y =
        -1.5;

    scene.add(floor);


    const grid =
        new THREE.GridHelper(
            30,
            30,
            0x174c8d,
            0x07101c
        );

    grid.position.y =
        -1.48;

    grid.material.transparent = true;
    grid.material.opacity = 0.16;

    scene.add(grid);


    const platform =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                3.3,
                3.5,
                0.3,
                64
            ),
            metalMaterial()
        );

    platform.position.y =
        -1.25;

    scene.add(platform);


    const ring =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                3.35,
                0.025,
                8,
                64
            ),
            new THREE.MeshBasicMaterial({
                color: 0x2585ff,
                transparent: true,
                opacity: 0.7
            })
        );

    ring.rotation.x =
        Math.PI / 2;

    ring.position.y =
        -1.08;

    scene.add(ring);
}


/* =========================
   POINTER
   ========================= */

function updatePointer(event) {

    if (!canvas)
        return;

    const rect =
        canvas.getBoundingClientRect();

    if (!rect.width || !rect.height)
        return;

    mouse.x =
        ((event.clientX - rect.left) /
            rect.width) * 2 - 1;

    mouse.y =
        -((event.clientY - rect.top) /
            rect.height) * 2 + 1;
}


/* =========================
   FIND NAVIGATION
   ========================= */

function findNavigation(object) {

    let current = object;

    while (current) {

        if (
            current.userData &&
            current.userData.navigation
        ) {

            return current.userData.navigation;
        }

        current =
            current.parent;
    }

    return null;
}


/* =========================
   HOVER
   ========================= */

function checkHover() {

    if (!raycaster || !camera)
        return;

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const hits =
        raycaster.intersectObjects(
            interactiveObjects,
            true
        );

    const object =
        hits.length
            ? hits[0].object
            : null;


    const navigation =
        object
            ? findNavigation(object)
            : null;


    let newHoveredCard = null;


    if (navigation && object) {

        newHoveredCard =
            object;

        while (
            newHoveredCard.parent &&
            !newHoveredCard.userData?.baseScale
        ) {

            newHoveredCard =
                newHoveredCard.parent;
        }
    }


    if (
        newHoveredCard !==
        hoveredObject
    ) {

        hoveredObject =
            newHoveredCard;
    }


    if (canvas) {

        canvas.style.cursor =
            navigation
                ? "pointer"
                : "default";
    }
}


/* =========================
   CLICK / TOUCH
   ========================= */

function handleClick(event) {

    if (
        !raycaster ||
        !camera ||
        !canvas
    ) {
        return;
    }


    // На iPhone координаты нужно
    // обновлять непосредственно при касании
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


    if (!hits.length) {

        console.log(
            "CONTROL CENTER: nothing clicked"
        );

        return;
    }


    const navigation =
        findNavigation(
            hits[0].object
        );


    if (
        !navigation ||
        !navigation.url
    ) {

        console.log(
            "CONTROL CENTER: navigation not found"
        );

        return;
    }


    const url =
        navigation.url;


    console.log(
        "CONTROL CENTER: OPEN",
        url
    );


    // =========================================
    // BLAZOR NAVIGATION
    // =========================================

    if (blazorReference) {

        blazorReference
            .invokeMethodAsync(
                "NavigateFrom3D",
                url
            )
            .then(() => {

                console.log(
                    "CONTROL CENTER: Blazor navigation complete"
                );

            })
            .catch(error => {

                console.error(
                    "CONTROL CENTER: Blazor navigation failed",
                    error
                );

                // Запасной вариант
                window.location.assign(
                    url
                );
            });

        return;
    }


    // =========================================
    // FALLBACK
    // =========================================

    window.location.assign(
        url
    );
}


/* =========================
   RESPONSIVE CAMERA
   ========================= */

function updateResponsiveCamera() {

    if (!camera || !canvas)
        return;

    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;

    if (!width || !height)
        return;

    const aspect =
        width / height;

    let viewHeight;


    if (aspect >= 1.5) {

        viewHeight = 9.2;

    }
    else if (aspect >= 1.0) {

        viewHeight = 9.7;

    }
    else if (aspect >= 0.7) {

        viewHeight = 10.8;

    }
    else {

        viewHeight = 11.8;
    }


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


    const cards =
        scene?.userData?.navigationCards;


    if (
        !cards ||
        cards.length < 4
    ) {
        return;
    }


    const home = cards[0];
    const security = cards[1];
    const lights = cards[2];
    const settings = cards[3];


    /* =========================
       WIDE
       ========================= */

    if (aspect >= 1.5) {

        home.position.set(
            -3.55,
            0.9,
            0.3
        );

        security.position.set(
            3.55,
            0.9,
            0.3
        );

        lights.position.set(
            -3.4,
            -0.05,
            0.8
        );

        settings.position.set(
            3.4,
            -0.05,
            0.8
        );

        setCardBaseScale(
            home,
            0.82
        );

        setCardBaseScale(
            security,
            0.82
        );

        setCardBaseScale(
            lights,
            0.82
        );

        setCardBaseScale(
            settings,
            0.82
        );
    }


    /* =========================
       MEDIUM
       ========================= */

    else if (aspect >= 1.0) {

        home.position.set(
            -2.75,
            0.9,
            0.3
        );

        security.position.set(
            2.75,
            0.9,
            0.3
        );

        lights.position.set(
            -2.6,
            -0.4,
            0.8
        );

        settings.position.set(
            2.6,
            -0.4,
            0.8
        );

        setCardBaseScale(
            home,
            0.76
        );

        setCardBaseScale(
            security,
            0.76
        );

        setCardBaseScale(
            lights,
            0.76
        );

        setCardBaseScale(
            settings,
            0.76
        );
    }


    /* =========================
       TABLET
       ========================= */

    else if (aspect >= 0.7) {

        home.position.set(
            -2.15,
            1.05,
            0.3
        );

        security.position.set(
            2.15,
            1.05,
            0.3
        );

        lights.position.set(
            -2.15,
            -0.8,
            0.8
        );

        settings.position.set(
            2.15,
            -0.8,
            0.8
        );

        setCardBaseScale(
            home,
            0.66
        );

        setCardBaseScale(
            security,
            0.66
        );

        setCardBaseScale(
            lights,
            0.66
        );

        setCardBaseScale(
            settings,
            0.66
        );
    }


    /* =========================
       PHONE
       ========================= */

    else {

        home.position.set(
            -1.8,
            2.1,
            -0.5
        );

        security.position.set(
            1.8,
            2.1,
            -0.5
        );

        lights.position.set(
            -1.8,
            -2.1,
            -0.5
        );

        settings.position.set(
            1.8,
            -2.1,
            -0.5
        );

        setCardBaseScale(
            home,
            0.66
        );

        setCardBaseScale(
            security,
            0.66
        );

        setCardBaseScale(
            lights,
            0.66
        );

        setCardBaseScale(
            settings,
            0.66
        );
    }
}


/* =========================
   CARD SCALE
   ========================= */

function setCardBaseScale(card, scale) {

    if (!card)
        return;

    card.userData.baseScale =
        scale;

    const hover =
        card === hoveredObject
            ? 1.055
            : 1;

    card.scale.setScalar(
        scale * hover
    );
}


/* =========================
   RESIZE
   ========================= */

function handleResize() {

    if (
        !camera ||
        !renderer ||
        !canvas
    )
        return;

    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;

    if (!width || !height)
        return;

    renderer.setSize(
        width,
        height,
        false
    );

    updateResponsiveCamera();
}


/* =========================
   ANIMATION
   ========================= */

let lastFrameTime = 0;

function animate(time = 0) {

    animationFrame =
        requestAnimationFrame(
            animate
        );


    if (
        time -
        lastFrameTime <
        33
    ) {
        return;
    }

    lastFrameTime = time;


    if (!clock)
        return;


    const elapsed =
        clock.getElapsedTime();


    if (controls)
        controls.update();


    /* HOUSE */

    if (house) {

        house.rotation.y =
            Math.sin(
                elapsed * 0.25
            ) * 0.025;
    }


    /* CORE */

    if (core) {

        core.rotation.y =
            elapsed * 0.2;

        core.position.y =
            0.2 +
            Math.sin(elapsed) *
            0.04;
    }


    /* CARDS */

    if (
        scene &&
        scene.userData &&
        scene.userData.navigationCards
    ) {

        for (
            const card
            of scene.userData.navigationCards
        ) {

            if (!card)
                continue;


            const baseScale =
                card.userData.baseScale ??
                1;


            const hoverScale =
                card === hoveredObject
                    ? 1.055
                    : 1;


            const targetScale =
                baseScale *
                hoverScale;


            const current =
                card.scale.x;


            const next =
                THREE.MathUtils.lerp(
                    current,
                    targetScale,
                    0.12
                );


            card.scale.setScalar(
                next
            );


            const baseY =
                card.userData.baseY ??
                card.position.y;


            card.userData.baseY =
                baseY;


            card.position.y =
                baseY +
                Math.sin(
                    elapsed * 1.2 +
                    card.position.x
                ) * 0.008;
        }
    }


    checkHover();


    if (
        renderer &&
        scene &&
        camera
    ) {

        renderer.render(
            scene,
            camera
        );
    }
}


/* =========================
   CLEANUP
   ========================= */

function cleanup() {

    console.log("CONTROL CENTER: CLEANUP");


    if (animationFrame) {

        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }


    window.removeEventListener(
        "resize",
        handleResize
    );


    if (resizeObserver) {

        resizeObserver.disconnect();
        resizeObserver = null;
    }


    if (canvas) {

        canvas.removeEventListener(
            "pointermove",
            updatePointer
        );

        canvas.removeEventListener(
            "pointerup",
            handleClick
        );
    }


    if (controls) {

        controls.dispose();
        controls = null;
    }


    if (renderer) {

        try {
            renderer.dispose();
        }
        catch { }


        try {
            renderer.forceContextLoss();
        }
        catch { }


        renderer = null;
    }


    scene = null;
    camera = null;
    canvas = null;
    raycaster = null;

    interactiveObjects = [];

    hoveredObject = null;

    clock = null;

    house = null;
    core = null;

    blazorReference = null;
}


/* =========================
   INIT
   ========================= */

export function init(
    canvasId,
    dotNetReference
) {

    console.log(
        "MY HOME CONTROL CENTER: INIT"
    );


    cleanup();


    // Сохраняем ссылку на Blazor
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


    /* SCENE */

    scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(
            0x050912
        );

    scene.fog =
        new THREE.FogExp2(
            0x050912,
            0.012
        );


    /* CAMERA */

    camera =
        new THREE.OrthographicCamera(
            -8,
            8,
            5,
            -5,
            0.1,
            100
        );

    camera.position.set(
        0,
        2.8,
        12
    );

    camera.lookAt(
        0,
        0,
        0
    );


    /* RENDERER */

    renderer =
        new THREE.WebGLRenderer({

            canvas: canvas,

            antialias: false,

            powerPreference:
                "high-performance"

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
        1.15;

    renderer.shadowMap.enabled =
        false;


    /* RAYCASTER */

    raycaster =
        new THREE.Raycaster();


    /* CLOCK */

    clock =
        new THREE.Clock();


    /* WORLD */

    createLights();

    createEnvironment();


    /* HOUSE */

    house =
        createHouse();

    scene.add(house);


    /* CORE */

    core =
        createCore();

    core.position.y =
        0.2;

    scene.add(core);


    /* CARDS */

    scene.userData.navigationCards =
        [];


    for (
        const item
        of navigationItems
    ) {

        const card =
            createNavigationObject(
                item
            );

        scene.add(card);

        scene.userData.navigationCards.push(
            card
        );
    }


    console.log(
        "Navigation cards:",
        scene.userData.navigationCards
    );


    /* CONTROLS */

    controls =
        new OrbitControls(
            camera,
            canvas
        );

    controls.enableDamping =
        true;

    controls.dampingFactor =
        0.06;

    controls.enablePan =
        false;

    controls.minDistance =
        7;

    controls.maxDistance =
        15;

    controls.minPolarAngle =
        Math.PI * 0.28;

    controls.maxPolarAngle =
        Math.PI * 0.62;

    controls.target.set(
        0,
        0,
        0
    );

    controls.autoRotate =
        false;


    /* EVENTS */

    canvas.addEventListener(
        "pointermove",
        updatePointer
    );

    // Работает и на мыши, и на iPhone
    canvas.addEventListener(
        "pointerup",
        handleClick
    );


    window.addEventListener(
        "resize",
        handleResize
    );


    /* RESIZE OBSERVER */

    resizeObserver =
        new ResizeObserver(
            () => {
                handleResize();
            }
        );


    if (canvas.parentElement) {

        resizeObserver.observe(
            canvas.parentElement
        );
    }


    /* INITIAL */

    handleResize();


    console.log(
        "MY HOME CONTROL CENTER: READY"
    );


    animate();
}


/* =========================
   DISPOSE
   ========================= */

export function dispose() {

    cleanup();
}

