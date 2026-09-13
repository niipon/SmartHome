//import * as THREE from "three";
//import { OrbitControls } from "three/addons/controls/OrbitControls.js";

//let scene = null;
//let camera = null;
//let renderer = null;
//let controls = null;
//let animationFrame = null;
//let canvas = null;
//let clock = null;

//let raycaster = null;
//let mouse = new THREE.Vector2();

//let interactiveObjects = [];
//let hoveredObject = null;

//let house = null;
//let core = null;

//let resizeObserver = null;

//const navigationItems = [
//    {
//        name: "HOME",
//        label: "Главная",
//        description: "Управление домом",
//        position: [-4.0, 0.85, 0.2],
//        url: "/"
//    },
//    {
//        name: "SECURITY",
//        label: "Охрана",
//        description: "Безопасность дома",
//        position: [4.0, 0.85, 0.2],
//        url: "/security"
//    },
//    {
//        name: "LIGHTS",
//        label: "Освещение",
//        description: "Управление светом",
//        position: [-3.8, -0.65, 0.8],
//        url: "/lights"
//    },
//    {
//        name: "SETTINGS",
//        label: "Настройки",
//        description: "Параметры системы",
//        position: [3.8, -0.65, 0.8],
//        url: "/settings"
//    }
//];


///* =========================
//   MATERIALS
//   ========================= */

//function metalMaterial() {

//    return new THREE.MeshStandardMaterial({
//        color: 0x101721,
//        metalness: 0.85,
//        roughness: 0.25
//    });
//}


//function blueMaterial() {

//    return new THREE.MeshStandardMaterial({
//        color: 0x1557a5,
//        metalness: 0.65,
//        roughness: 0.2,
//        emissive: 0x0d55b8,
//        emissiveIntensity: 1.8
//    });
//}


//function glassMaterial() {

//    return new THREE.MeshPhysicalMaterial({
//        color: 0x102238,
//        metalness: 0.3,
//        roughness: 0.15,
//        transparent: true,
//        opacity: 0.94,
//        clearcoat: 1
//    });
//}


///* =========================
//   HOUSE
//   ========================= */

//function createHouse() {

//    const group = new THREE.Group();

//    const body = new THREE.Mesh(
//        new THREE.BoxGeometry(
//            3.5,
//            2,
//            2.5
//        ),
//        metalMaterial()
//    );

//    body.castShadow = true;

//    group.add(body);

//    const roof = new THREE.Mesh(
//        new THREE.ConeGeometry(
//            2.55,
//            1.4,
//            4
//        ),
//        metalMaterial()
//    );

//    roof.rotation.y =
//        Math.PI / 4;

//    roof.position.y =
//        1.7;

//    group.add(roof);

//    const glass = new THREE.Mesh(
//        new THREE.BoxGeometry(
//            3,
//            1.35,
//            0.08
//        ),
//        glassMaterial()
//    );

//    glass.position.set(
//        0,
//        0.15,
//        1.28
//    );

//    group.add(glass);

//    const door = new THREE.Mesh(
//        new THREE.BoxGeometry(
//            0.65,
//            1.25,
//            0.1
//        ),
//        blueMaterial()
//    );

//    door.position.set(
//        0,
//        -0.35,
//        1.34
//    );

//    group.add(door);

//    const windowMaterial =
//        new THREE.MeshStandardMaterial({
//            color: 0x318bff,
//            emissive: 0x1467dd,
//            emissiveIntensity: 2,
//            roughness: 0.12
//        });

//    const positions = [
//        [-1.05, 0.25],
//        [1.05, 0.25],
//        [-1.05, -0.7],
//        [1.05, -0.7]
//    ];

//    for (const p of positions) {

//        const windowMesh =
//            new THREE.Mesh(
//                new THREE.BoxGeometry(
//                    0.65,
//                    0.45,
//                    0.08
//                ),
//                windowMaterial
//            );

//        windowMesh.position.set(
//            p[0],
//            p[1],
//            1.33
//        );

//        group.add(windowMesh);
//    }

//    return group;
//}


///* =========================
//   CORE
//   ========================= */

//function createCore() {

//    const group =
//        new THREE.Group();

//    const sphere =
//        new THREE.Mesh(
//            new THREE.IcosahedronGeometry(
//                0.7,
//                2
//            ),
//            new THREE.MeshStandardMaterial({
//                color: 0x1764c9,
//                metalness: 0.8,
//                roughness: 0.12,
//                emissive: 0x1267e8,
//                emissiveIntensity: 2.5
//            })
//        );

//    group.add(sphere);

//    for (let i = 0; i < 2; i++) {

//        const ring =
//            new THREE.Mesh(
//                new THREE.TorusGeometry(
//                    1.05 + i * 0.28,
//                    0.018,
//                    8,
//                    48
//                ),
//                new THREE.MeshBasicMaterial({
//                    color: 0x3d91ff,
//                    transparent: true,
//                    opacity: 0.65
//                })
//            );

//        ring.rotation.x =
//            Math.PI / 2;

//        group.add(ring);
//    }

//    return group;
//}


///* =========================
//   CARD GLOW
//   ========================= */

//function createCardGlow(width, height) {

//    const glow =
//        new THREE.Mesh(
//            new THREE.PlaneGeometry(
//                width,
//                height
//            ),
//            new THREE.MeshBasicMaterial({
//                color: 0x087cff,
//                transparent: true,
//                opacity: 0.08,
//                depthWrite: false
//            })
//        );

//    glow.position.z = -0.04;

//    return glow;
//}


///* =========================
//   CARD
//   ========================= */

//function createNavigationObject(item) {

//    const group =
//        new THREE.Group();

//    group.position.set(
//        item.position[0],
//        item.position[1],
//        item.position[2]
//    );

//    group.userData.navigation =
//        item;

//    group.userData.baseScale = 1;

//    /* =====================
//       BACK GLOW
//       ===================== */

//    const glow =
//        createCardGlow(
//            3.0,
//            1.72
//        );

//    glow.userData.navigation =
//        item;

//    group.add(glow);


//    /* =====================
//       MAIN GLASS PANEL
//       ===================== */

//    const panelMaterial =
//        new THREE.MeshPhysicalMaterial({

//            color: 0x0b1726,

//            metalness: 0.72,

//            roughness: 0.18,

//            transparent: true,

//            opacity: 0.94,

//            transmission: 0.08,

//            clearcoat: 1,

//            clearcoatRoughness: 0.12,

//            emissive: 0x03172f,

//            emissiveIntensity: 0.9
//        });


//    const panel =
//        new THREE.Mesh(
//            new THREE.BoxGeometry(
//                2.65,
//                1.42,
//                0.18
//            ),
//            panelMaterial
//        );

//    panel.userData.navigation =
//        item;

//    panel.castShadow = true;

//    group.add(panel);


//    /* =====================
//       INNER GLASS
//       ===================== */

//    const innerMaterial =
//        new THREE.MeshPhysicalMaterial({

//            color: 0x07101c,

//            metalness: 0.35,

//            roughness: 0.2,

//            transparent: true,

//            opacity: 0.9,

//            transmission: 0.12,

//            clearcoat: 1,

//            emissive: 0x020b18,

//            emissiveIntensity: 0.6
//        });


//    const inner =
//        new THREE.Mesh(
//            new THREE.BoxGeometry(
//                2.34,
//                1.08,
//                0.045
//            ),
//            innerMaterial
//        );

//    inner.position.z =
//        0.115;

//    inner.userData.navigation =
//        item;

//    group.add(inner);


//    /* =====================
//       OUTER GLOW BORDER
//       ===================== */

//    const border =
//        new THREE.LineSegments(
//            new THREE.EdgesGeometry(
//                new THREE.BoxGeometry(
//                    2.65,
//                    1.42,
//                    0.18
//                )
//            ),
//            new THREE.LineBasicMaterial({
//                color: 0x238cff,
//                transparent: true,
//                opacity: 0.85
//            })
//        );

//    border.position.z =
//        0.08;

//    border.userData.navigation =
//        item;

//    group.add(border);


//    /* =====================
//       INNER BORDER
//       ===================== */

//    const innerBorder =
//        new THREE.LineSegments(
//            new THREE.EdgesGeometry(
//                new THREE.BoxGeometry(
//                    2.34,
//                    1.08,
//                    0.045
//                )
//            ),
//            new THREE.LineBasicMaterial({
//                color: 0x155da8,
//                transparent: true,
//                opacity: 0.38
//            })
//        );

//    innerBorder.position.z =
//        0.145;

//    innerBorder.userData.navigation =
//        item;

//    group.add(innerBorder);


//    /* =====================
//       TOP LIGHT LINE
//       ===================== */

//    const topLine =
//        new THREE.Mesh(
//            new THREE.BoxGeometry(
//                1.9,
//                0.018,
//                0.025
//            ),
//            new THREE.MeshBasicMaterial({
//                color: 0x3d9cff,
//                transparent: true,
//                opacity: 0.85
//            })
//        );

//    topLine.position.set(
//        0,
//        0.61,
//        0.17
//    );

//    topLine.userData.navigation =
//        item;

//    group.add(topLine);


//    /* =====================
//       BOTTOM LIGHT LINE
//       ===================== */

//    const bottomLine =
//        new THREE.Mesh(
//            new THREE.BoxGeometry(
//                1.2,
//                0.014,
//                0.025
//            ),
//            new THREE.MeshBasicMaterial({
//                color: 0x146fd4,
//                transparent: true,
//                opacity: 0.75
//            })
//        );

//    bottomLine.position.set(
//        0,
//        -0.57,
//        0.17
//    );

//    bottomLine.userData.navigation =
//        item;

//    group.add(bottomLine);


//    /* =====================
//       SIDE LIGHT POINTS
//       ===================== */

//    const pointGeometry =
//        new THREE.SphereGeometry(
//            0.035,
//            12,
//            12
//        );

//    const pointMaterial =
//        new THREE.MeshBasicMaterial({
//            color: 0x5ab1ff
//        });


//    const leftPoint =
//        new THREE.Mesh(
//            pointGeometry,
//            pointMaterial
//        );

//    leftPoint.position.set(
//        -1.08,
//        0.58,
//        0.18
//    );

//    leftPoint.userData.navigation =
//        item;

//    group.add(leftPoint);


//    const rightPoint =
//        new THREE.Mesh(
//            pointGeometry,
//            pointMaterial
//        );

//    rightPoint.position.set(
//        1.08,
//        0.58,
//        0.18
//    );

//    rightPoint.userData.navigation =
//        item;

//    group.add(rightPoint);


//    /* =====================
//       TITLE
//       ===================== */

//    const title =
//        createTextSprite(
//            item.name,
//            44,
//            "#ffffff"
//        );

//    title.position.set(
//        0,
//        0.20,
//        0.23
//    );

//    title.scale.set(
//        2.0,
//        0.48,
//        1
//    );

//    title.userData.navigation =
//        item;

//    group.add(title);


//    /* =====================
//       DESCRIPTION
//       ===================== */

//    const description =
//        createTextSprite(
//            item.description,
//            22,
//            "#8db9e9"
//        );

//    description.position.set(
//        0,
//        -0.26,
//        0.23
//    );

//    description.scale.set(
//        2.15,
//        0.28,
//        1
//    );

//    description.userData.navigation =
//        item;

//    group.add(description);


//    /* =====================
//       SMALL STATUS DOT
//       ===================== */

//    const status =
//        new THREE.Mesh(
//            new THREE.SphereGeometry(
//                0.055,
//                16,
//                16
//            ),
//            new THREE.MeshBasicMaterial({
//                color: 0x39a6ff
//            })
//        );

//    status.position.set(
//        -0.92,
//        -0.47,
//        0.22
//    );

//    status.userData.navigation =
//        item;

//    group.add(status);


//    /* =====================
//       INTERACTIVE OBJECTS
//       ===================== */

//    interactiveObjects.push(panel);
//    interactiveObjects.push(inner);
//    interactiveObjects.push(border);
//    interactiveObjects.push(innerBorder);
//    interactiveObjects.push(topLine);
//    interactiveObjects.push(bottomLine);
//    interactiveObjects.push(leftPoint);
//    interactiveObjects.push(rightPoint);
//    interactiveObjects.push(title);
//    interactiveObjects.push(description);
//    interactiveObjects.push(status);
//    interactiveObjects.push(glow);


//    return group;
//}


///* =========================
//   TEXT SPRITE
//   ========================= */

//function createTextSprite(
//    text,
//    fontSize,
//    color
//) {

//    const textCanvas =
//        document.createElement(
//            "canvas"
//        );

//    textCanvas.width =
//        512;

//    textCanvas.height =
//        128;

//    const context =
//        textCanvas.getContext(
//            "2d"
//        );

//    context.clearRect(
//        0,
//        0,
//        textCanvas.width,
//        textCanvas.height
//    );

//    context.font =
//        `800 ${fontSize}px Arial`;

//    context.textAlign =
//        "center";

//    context.textBaseline =
//        "middle";

//    context.fillStyle =
//        color;

//    context.shadowColor =
//        "#1685ff";

//    context.shadowBlur =
//        8;

//    context.fillText(
//        text,
//        textCanvas.width / 2,
//        textCanvas.height / 2
//    );

//    const texture =
//        new THREE.CanvasTexture(
//            textCanvas
//        );

//    texture.colorSpace =
//        THREE.SRGBColorSpace;

//    texture.minFilter =
//        THREE.LinearFilter;

//    texture.magFilter =
//        THREE.LinearFilter;

//    const material =
//        new THREE.SpriteMaterial({
//            map: texture,
//            transparent: true,
//            depthWrite: false
//        });

//    const sprite =
//        new THREE.Sprite(
//            material
//        );

//    return sprite;
//}


///* =========================
//   LIGHTS
//   ========================= */

//function createLights() {

//    scene.add(
//        new THREE.HemisphereLight(
//            0x4d82bd,
//            0x080b10,
//            2.8
//        )
//    );

//    const directional =
//        new THREE.DirectionalLight(
//            0xffffff,
//            3.5
//        );

//    directional.position.set(
//        5,
//        8,
//        7
//    );

//    scene.add(
//        directional
//    );

//    const blue =
//        new THREE.PointLight(
//            0x1474ff,
//            25,
//            20
//        );

//    blue.position.set(
//        -5,
//        3,
//        4
//    );

//    scene.add(
//        blue
//    );

//    const blue2 =
//        new THREE.PointLight(
//            0x168cff,
//            18,
//            18
//        );

//    blue2.position.set(
//        5,
//        2,
//        -3
//    );

//    scene.add(
//        blue2
//    );
//}


///* =========================
//   ENVIRONMENT
//   ========================= */

//function createEnvironment() {

//    const floor =
//        new THREE.Mesh(
//            new THREE.CircleGeometry(
//                18,
//                64
//            ),
//            new THREE.MeshStandardMaterial({
//                color: 0x020407,
//                metalness: 0.8,
//                roughness: 0.3
//            })
//        );

//    floor.rotation.x =
//        -Math.PI / 2;

//    floor.position.y =
//        -1.5;

//    scene.add(
//        floor
//    );

//    const grid =
//        new THREE.GridHelper(
//            30,
//            30,
//            0x174c8d,
//            0x07101c
//        );

//    grid.position.y =
//        -1.48;

//    grid.material.transparent =
//        true;

//    grid.material.opacity =
//        0.16;

//    scene.add(
//        grid
//    );

//    const platform =
//        new THREE.Mesh(
//            new THREE.CylinderGeometry(
//                3.3,
//                3.5,
//                0.3,
//                64
//            ),
//            metalMaterial()
//        );

//    platform.position.y =
//        -1.25;

//    scene.add(
//        platform
//    );

//    const ring =
//        new THREE.Mesh(
//            new THREE.TorusGeometry(
//                3.35,
//                0.025,
//                8,
//                64
//            ),
//            new THREE.MeshBasicMaterial({
//                color: 0x2585ff,
//                transparent: true,
//                opacity: 0.7
//            })
//        );

//    ring.rotation.x =
//        Math.PI / 2;

//    ring.position.y =
//        -1.08;

//    scene.add(
//        ring
//    );
//}


///* =========================
//   POINTER
//   ========================= */

//function updatePointer(event) {

//    if (!canvas)
//        return;

//    const rect =
//        canvas.getBoundingClientRect();

//    if (
//        !rect.width ||
//        !rect.height
//    )
//        return;

//    mouse.x =
//        (
//            (event.clientX - rect.left)
//            / rect.width
//        ) * 2 - 1;

//    mouse.y =
//        -(
//            (event.clientY - rect.top)
//            / rect.height
//        ) * 2 + 1;
//}


///* =========================
//   HOVER
//   ========================= */

//function checkHover() {

//    if (
//        !raycaster ||
//        !camera
//    )
//        return;

//    raycaster.setFromCamera(
//        mouse,
//        camera
//    );

//    const hits =
//        raycaster.intersectObjects(
//            interactiveObjects,
//            false
//        );

//    const object =
//        hits.length
//            ? hits[0].object
//            : null;

//    let newHoveredCard = null;

//    if (object) {

//        let current =
//            object;

//        while (
//            current &&
//            current.parent
//        ) {

//            if (
//                current.userData &&
//                current.userData.navigation
//            ) {

//                newHoveredCard =
//                    current;

//                break;
//            }

//            current =
//                current.parent;
//        }
//    }

//    if (
//        newHoveredCard !==
//        hoveredObject
//    ) {

//        if (hoveredObject) {

//            hoveredObject.userData.hoverTarget =
//                1;
//        }

//        hoveredObject =
//            newHoveredCard;

//        if (hoveredObject) {

//            hoveredObject.userData.hoverTarget =
//                1.055;
//        }
//    }

//    if (hoveredObject) {

//        const currentScale =
//            hoveredObject.scale.x;

//        const target =
//            hoveredObject.userData.hoverTarget ||
//            1.055;

//        const newScale =
//            THREE.MathUtils.lerp(
//                currentScale,
//                target,
//                0.15
//            );

//        hoveredObject.scale.setScalar(
//            newScale
//        );

//        canvas.style.cursor =
//            "pointer";

//    }
//    else {

//        canvas.style.cursor =
//            "default";
//    }
//}


///* =========================
//   CLICK
//   ========================= */

//function handleClick() {

//    if (
//        !raycaster ||
//        !camera
//    )
//        return;

//    raycaster.setFromCamera(
//        mouse,
//        camera
//    );

//    const hits =
//        raycaster.intersectObjects(
//            interactiveObjects,
//            false
//        );

//    if (!hits.length)
//        return;

//    const navigation =
//        hits[0].object
//            .userData
//            .navigation;

//    if (
//        navigation &&
//        navigation.url
//    ) {

//        window.location.href =
//            navigation.url;
//    }
//}


///* =========================
//   RESPONSIVE CAMERA
//   ========================= */

//function updateResponsiveCamera() {

//    if (
//        !camera ||
//        !canvas
//    )
//        return;

//    const width =
//        canvas.clientWidth;

//    const height =
//        canvas.clientHeight;

//    if (
//        !width ||
//        !height
//    )
//        return;

//    const aspect =
//        width / height;

//    let viewHeight;

//    if (aspect >= 1.5) {

//        viewHeight =
//            7.2;

//    }
//    else if (aspect >= 1.0) {

//        viewHeight =
//            7.6;

//    }
//    else if (aspect >= 0.7) {

//        viewHeight =
//            8.5;

//    }
//    else {

//        viewHeight =
//            9.2;
//    }

//    const viewWidth =
//        viewHeight * aspect;

//    camera.left =
//        -viewWidth / 2;

//    camera.right =
//        viewWidth / 2;

//    camera.top =
//        viewHeight / 2;

//    camera.bottom =
//        -viewHeight / 2;

//    camera.updateProjectionMatrix();


//    /* =========================
//       NAVIGATION CARDS
//       ========================= */

//    const cards =
//        scene?.userData?.navigationCards;

//    if (
//        !cards ||
//        cards.length < 4
//    ) {

//        return;
//    }

//    const home =
//        cards[0];

//    const security =
//        cards[1];

//    const lights =
//        cards[2];

//    const settings =
//        cards[3];


//    /* =========================
//       WIDE SCREEN
//       ========================= */

//    if (aspect >= 1.5) {

//        home.position.set(
//            -4.0,
//            1.0,
//            0.3
//        );

//        security.position.set(
//            4.0,
//            1.0,
//            0.3
//        );

//        lights.position.set(
//            -3.8,
//            -0.05,
//            0.8
//        );

//        settings.position.set(
//            3.8,
//            -0.05,
//            0.8
//        );

//        home.scale.setScalar(1);
//        security.scale.setScalar(1);
//        lights.scale.setScalar(1);
//        settings.scale.setScalar(1);
//    }


//    /* =========================
//       MEDIUM SCREEN
//       ========================= */

//    else if (aspect >= 1.0) {

//        home.position.set(
//            -3.0,
//            1.0,
//            0.3
//        );

//        security.position.set(
//            3.0,
//            1.0,
//            0.3
//        );

//        lights.position.set(
//            -2.8,
//            -0.45,
//            0.8
//        );

//        settings.position.set(
//            2.8,
//            -0.45,
//            0.8
//        );

//        home.scale.setScalar(
//            0.88
//        );

//        security.scale.setScalar(
//            0.88
//        );

//        lights.scale.setScalar(
//            0.88
//        );

//        settings.scale.setScalar(
//            0.88
//        );
//    }


//    /* =========================
//       TABLET
//       ========================= */

//    else if (aspect >= 0.7) {

//        home.position.set(
//            -2.35,
//            1.15,
//            0.3
//        );

//        security.position.set(
//            2.35,
//            1.15,
//            0.3
//        );

//        lights.position.set(
//            -2.35,
//            -0.9,
//            0.8
//        );

//        settings.position.set(
//            2.35,
//            -0.9,
//            0.8
//        );

//        home.scale.setScalar(
//            0.72
//        );

//        security.scale.setScalar(
//            0.72
//        );

//        lights.scale.setScalar(
//            0.72
//        );

//        settings.scale.setScalar(
//            0.72
//        );
//    }


//    /* =========================
//   PHONE
//   ========================= */

//    else {
//        // PHONE
//        // Карточки выносим вперед по Z,
//        // чтобы дом их не перекрывал

//        home.position.set(-2.0, 2.35, -0.5);
//        security.position.set(2.0, 2.35, -0.5);

//        lights.position.set(-2.0, -2.35, -0.5);
//        settings.position.set(2.0, -2.35, -0.5);

//        home.scale.setScalar(0.24);
//        security.scale.setScalar(0.24);
//        lights.scale.setScalar(0.24);
//        settings.scale.setScalar(0.24);
//    }
//}


///* =========================
//   RESIZE
//   ========================= */

//function handleResize() {

//    if (
//        !camera ||
//        !renderer ||
//        !canvas
//    )
//        return;

//    const width =
//        canvas.clientWidth;

//    const height =
//        canvas.clientHeight;

//    if (
//        !width ||
//        !height
//    )
//        return;

//    renderer.setSize(
//        width,
//        height,
//        false
//    );

//    updateResponsiveCamera();
//}


///* =========================
//   ANIMATION
//   ========================= */

//let lastFrameTime = 0;


//function animate(time = 0) {

//    animationFrame =
//        requestAnimationFrame(
//            animate
//        );

//    if (
//        time -
//        lastFrameTime <
//        33
//    )
//        return;

//    lastFrameTime =
//        time;

//    if (!clock)
//        return;

//    const elapsed =
//        clock.getElapsedTime();

//    if (controls)
//        controls.update();


//    /* =====================
//       HOUSE
//       ===================== */

//    if (house) {

//        house.rotation.y =
//            Math.sin(
//                elapsed * 0.25
//            ) * 0.025;
//    }


//    /* =====================
//       CORE
//       ===================== */

//    if (core) {

//        core.rotation.y =
//            elapsed * 0.2;

//        core.position.y =
//            0.2 +
//            Math.sin(
//                elapsed
//            ) * 0.04;
//    }


//    /* =====================
//       CARD ANIMATION
//       ===================== */

//    if (
//        scene &&
//        scene.userData &&
//        scene.userData.navigationCards
//    ) {

//        for (
//            const card
//            of scene.userData.navigationCards
//        ) {

//            if (!card)
//                continue;

//            const targetScale =
//                card === hoveredObject
//                    ? 1.055
//                    : 1;

//            const current =
//                card.scale.x;

//            const next =
//                THREE.MathUtils.lerp(
//                    current,
//                    targetScale,
//                    0.12
//                );

//            card.scale.setScalar(
//                next
//            );


//            /* subtle floating */

//            const baseY =
//                card.userData.baseY ??
//                card.position.y;

//            card.userData.baseY =
//                baseY;

//            card.position.y =
//                baseY +
//                Math.sin(
//                    elapsed * 1.2 +
//                    card.position.x
//                ) * 0.008;
//        }
//    }


//    checkHover();


//    if (
//        renderer &&
//        scene &&
//        camera
//    ) {

//        renderer.render(
//            scene,
//            camera
//        );
//    }
//}


///* =========================
//   CLEANUP
//   ========================= */

//function cleanup() {

//    if (animationFrame) {

//        cancelAnimationFrame(
//            animationFrame
//        );

//        animationFrame =
//            null;
//    }

//    window.removeEventListener(
//        "resize",
//        handleResize
//    );

//    if (resizeObserver) {

//        resizeObserver.disconnect();

//        resizeObserver =
//            null;
//    }

//    if (canvas) {

//        canvas.removeEventListener(
//            "pointermove",
//            updatePointer
//        );

//        canvas.removeEventListener(
//            "click",
//            handleClick
//        );
//    }

//    if (controls) {

//        controls.dispose();

//        controls =
//            null;
//    }

//    if (renderer) {

//        renderer.dispose();

//        renderer.forceContextLoss();

//        renderer =
//            null;
//    }

//    scene =
//        null;

//    camera =
//        null;

//    canvas =
//        null;

//    raycaster =
//        null;

//    interactiveObjects =
//        [];

//    hoveredObject =
//        null;

//    clock =
//        null;

//    house =
//        null;

//    core =
//        null;
//}


///* =========================
//   INIT
//   ========================= */

//window.myHomeControlCenter = {

//    init: function (canvasId) {

//        console.log(
//            "MY HOME CONTROL CENTER: INIT"
//        );

//        cleanup();

//        canvas =
//            document.getElementById(
//                canvasId
//            );

//        if (!canvas) {

//            console.error(
//                "CONTROL CENTER: canvas not found"
//            );

//            return;
//        }


//        /* =====================
//           SCENE
//           ===================== */

//        scene =
//            new THREE.Scene();

//        scene.background =
//            new THREE.Color(
//                0x050912
//            );

//        scene.fog =
//            new THREE.FogExp2(
//                0x050912,
//                0.012
//            );


//        /* =====================
//           CAMERA
//           ===================== */

//        camera =
//            new THREE.OrthographicCamera(
//                -8,
//                8,
//                5,
//                -5,
//                0.1,
//                100
//            );

//        camera.position.set(
//            0,
//            2.8,
//            12
//        );

//        camera.lookAt(
//            0,
//            0,
//            0
//        );


//        /* =====================
//           RENDERER
//           ===================== */

//        renderer =
//            new THREE.WebGLRenderer({

//                canvas: canvas,

//                antialias: false,

//                powerPreference:
//                    "high-performance"

//            });

//        renderer.setPixelRatio(
//            Math.min(
//                window.devicePixelRatio,
//                1.5
//            )
//        );

//        renderer.outputColorSpace =
//            THREE.SRGBColorSpace;

//        renderer.toneMapping =
//            THREE.ACESFilmicToneMapping;

//        renderer.toneMappingExposure =
//            1.15;

//        renderer.shadowMap.enabled =
//            false;


//        /* =====================
//           RAYCASTER
//           ===================== */

//        raycaster =
//            new THREE.Raycaster();


//        /* =====================
//           CLOCK
//           ===================== */

//        clock =
//            new THREE.Clock();


//        /* =====================
//           WORLD
//           ===================== */

//        createLights();

//        createEnvironment();


//        /* =====================
//           HOUSE
//           ===================== */

//        house =
//            createHouse();

//        scene.add(
//            house
//        );


//        /* =====================
//           CORE
//           ===================== */

//        core =
//            createCore();

//        core.position.y =
//            0.2;

//        scene.add(
//            core
//        );


//        /* =====================
//           NAVIGATION CARDS
//           ===================== */

//        scene.userData.navigationCards =
//            [];

//        for (
//            const item
//            of navigationItems
//        ) {

//            const card =
//                createNavigationObject(
//                    item
//                );

//            scene.add(
//                card
//            );


//            /* ВАЖНО */

//            scene.userData.navigationCards.push(
//                card
//            );
//        }


//        console.log(
//            "Navigation cards:",
//            scene.userData.navigationCards
//        );


//        /* =====================
//           ORBIT CONTROLS
//           ===================== */

//        controls =
//            new OrbitControls(
//                camera,
//                canvas
//            );

//        controls.enableDamping =
//            true;

//        controls.dampingFactor =
//            0.06;

//        controls.enablePan =
//            false;

//        controls.minDistance =
//            7;

//        controls.maxDistance =
//            15;

//        controls.minPolarAngle =
//            Math.PI * 0.28;

//        controls.maxPolarAngle =
//            Math.PI * 0.62;

//        controls.target.set(
//            0,
//            0,
//            0
//        );

//        controls.autoRotate =
//            false;


//        /* =====================
//           EVENTS
//           ===================== */

//        canvas.addEventListener(
//            "pointermove",
//            updatePointer
//        );

//        canvas.addEventListener(
//            "click",
//            handleClick
//        );

//        window.addEventListener(
//            "resize",
//            handleResize
//        );


//        /* =====================
//           RESIZE OBSERVER
//           ===================== */

//        resizeObserver =
//            new ResizeObserver(
//                () => {

//                    handleResize();

//                }
//            );

//        if (
//            canvas.parentElement
//        ) {

//            resizeObserver.observe(
//                canvas.parentElement
//            );
//        }


//        /* =====================
//           INITIAL RESIZE
//           ===================== */

//        handleResize();


//        console.log(
//            "MY HOME CONTROL CENTER: READY"
//        );


//        /* =====================
//           START
//           ===================== */

//        animate();
//    },


//    dispose: function () {

//        cleanup();

//    }

//};

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let canvas = null;

const navigationCards = [];

const items = [
    {
        title: "HOME",
        subtitle: "Главная",
        url: "/"
    },
    {
        title: "SECURITY",
        subtitle: "Безопасность",
        url: "/security"
    },
    {
        title: "LIGHTS",
        subtitle: "Освещение",
        url: "/lights"
    },
    {
        title: "SETTINGS",
        subtitle: "Настройки",
        url: "/settings"
    }
];

function createText(
    text,
    fontSize,
    width,
    height
) {
    const c =
        document.createElement("canvas");

    c.width = 1024;
    c.height = 256;

    const ctx =
        c.getContext("2d");

    ctx.clearRect(
        0,
        0,
        1024,
        256
    );

    ctx.font =
        `700 ${fontSize}px Arial`;

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillStyle =
        "#ffffff";

    ctx.fillText(
        text,
        512,
        128
    );

    const texture =
        new THREE.CanvasTexture(c);

    texture.colorSpace =
        THREE.SRGBColorSpace;

    const material =
        new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false
        });

    const sprite =
        new THREE.Sprite(material);

    sprite.scale.set(
        width,
        height,
        1
    );

    return sprite;
}

function createNavigationCard(item) {

    const card =
        new THREE.Group();

    /*
     * Карточка специально не огромная.
     */
    const geometry =
        new THREE.BoxGeometry(
            3.25,
            1.45,
            0.10
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0x07101d,
            transparent: true,
            opacity: 0.97
        });

    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );

    card.add(mesh);

    const edges =
        new THREE.EdgesGeometry(
            geometry
        );

    const border =
        new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({
                color: 0x2085ff,
                transparent: true,
                opacity: 0.95
            })
        );

    card.add(border);

    const title =
        createText(
            item.title,
            50,
            2.25,
            0.38
        );

    title.position.set(
        0,
        0.18,
        0.13
    );

    card.add(title);

    const subtitle =
        createText(
            item.subtitle,
            27,
            2.0,
            0.23
        );

    subtitle.position.set(
        0,
        -0.34,
        0.13
    );

    card.add(subtitle);

    card.userData.url =
        item.url;

    card.traverse(
        object => {
            object.userData.parentCard =
                card;
        }
    );

    scene.add(card);

    navigationCards.push(card);

    return card;
}

function createHouse() {

    const house =
        new THREE.Group();

    /*
     * НЕБОЛЬШОЙ ДОМ
     */
    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.45,
                1.75,
                1.85
            ),
            new THREE.MeshBasicMaterial({
                color: 0x080b10
            })
        );

    body.position.y =
        -0.25;

    house.add(body);

    /*
     * КРЫША
     */
    const roof =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                2.05,
                1.35,
                4
            ),
            new THREE.MeshBasicMaterial({
                color: 0x030407
            })
        );

    roof.rotation.y =
        Math.PI / 4;

    roof.position.y =
        1.25;

    house.add(roof);

    /*
     * ДВЕРЬ
     */
    const door =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.48,
                1.0,
                0.07
            ),
            new THREE.MeshBasicMaterial({
                color: 0x338ee8
            })
        );

    door.position.set(
        0,
        -0.62,
        0.96
    );

    house.add(door);

    /*
     * ОКНА
     */
    const windowGeometry =
        new THREE.BoxGeometry(
            0.55,
            0.45,
            0.07
        );

    const windowMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x82c5ff
        });

    const window1 =
        new THREE.Mesh(
            windowGeometry,
            windowMaterial
        );

    window1.position.set(
        -0.72,
        -0.05,
        0.96
    );

    house.add(window1);

    const window2 =
        new THREE.Mesh(
            windowGeometry,
            windowMaterial
        );

    window2.position.set(
        0.72,
        -0.05,
        0.96
    );

    house.add(window2);

    /*
     * НЕБОЛЬШОЙ 3D-ОБОД
     */
    const ring =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                2.65,
                0.025,
                12,
                80
            ),
            new THREE.MeshBasicMaterial({
                color: 0x1878dd,
                transparent: true,
                opacity: 0.75
            })
        );

    ring.rotation.x =
        Math.PI / 2;

    ring.position.y =
        -1.30;

    house.add(ring);

    /*
     * ИМЕННО ЗДЕСЬ ДОМ УМЕНЬШАЕМ
     */
    house.scale.setScalar(
        0.70
    );

    scene.add(house);

    scene.userData.house =
        house;
}

function setupLayout() {

    const mobile =
        window.innerWidth <= 700;

    const tablet =
        window.innerWidth > 700 &&
        window.innerWidth <= 1100;

    const home =
        navigationCards[0];

    const security =
        navigationCards[1];

    const lights =
        navigationCards[2];

    const settings =
        navigationCards[3];

    if (mobile) {

        /*
         * ВЕРХНИЕ
         */
        home.position.set(
            -2.05,
            2.15,
            2
        );

        security.position.set(
            2.05,
            2.15,
            2
        );

        /*
         * НИЖНИЕ
         */
        lights.position.set(
            -2.05,
            -2.15,
            2
        );

        settings.position.set(
            2.05,
            -2.15,
            2
        );

        /*
         * Нормальный размер карточек
         */
        home.scale.setScalar(
            0.68
        );

        security.scale.setScalar(
            0.68
        );

        lights.scale.setScalar(
            0.68
        );

        settings.scale.setScalar(
            0.68
        );

        camera.position.set(
            0,
            0,
            10.5
        );

    }
    else if (tablet) {

        home.position.set(
            -3.05,
            2.15,
            2
        );

        security.position.set(
            3.05,
            2.15,
            2
        );

        lights.position.set(
            -3.05,
            -2.15,
            2
        );

        settings.position.set(
            3.05,
            -2.15,
            2
        );

        home.scale.setScalar(
            0.76
        );

        security.scale.setScalar(
            0.76
        );

        lights.scale.setScalar(
            0.76
        );

        settings.scale.setScalar(
            0.76
        );

        camera.position.set(
            0,
            0,
            9.2
        );

    }
    else {

        home.position.set(
            -3.55,
            2.25,
            2
        );

        security.position.set(
            3.55,
            2.25,
            2
        );

        lights.position.set(
            -3.55,
            -2.25,
            2
        );

        settings.position.set(
            3.55,
            -2.25,
            2
        );

        home.scale.setScalar(
            0.82
        );

        security.scale.setScalar(
            0.82
        );

        lights.scale.setScalar(
            0.82
        );

        settings.scale.setScalar(
            0.82
        );

        camera.position.set(
            0,
            0,
            8.5
        );
    }

    camera.lookAt(
        0,
        0,
        0
    );

    camera.aspect =
        canvas.clientWidth /
        canvas.clientHeight;

    camera.updateProjectionMatrix();
}

function resize() {

    if (!renderer ||
        !camera ||
        !canvas)
        return;

    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;

    if (
        width <= 0 ||
        height <= 0
    )
        return;

    renderer.setSize(
        width,
        height,
        false
    );

    camera.aspect =
        width / height;

    camera.updateProjectionMatrix();

    setupLayout();
}

function handleClick(event) {

    const rect =
        canvas.getBoundingClientRect();

    const mouse =
        new THREE.Vector2();

    mouse.x =
        ((event.clientX - rect.left) /
            rect.width) * 2 - 1;

    mouse.y =
        -((event.clientY - rect.top) /
            rect.height) * 2 + 1;

    const raycaster =
        new THREE.Raycaster();

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const objects = [];

    navigationCards.forEach(
        card => {

            card.traverse(
                object => {

                    if (
                        object.isMesh ||
                        object.isSprite
                    ) {
                        objects.push(
                            object
                        );
                    }
                }
            );
        }
    );

    const hits =
        raycaster.intersectObjects(
            objects,
            true
        );

    if (!hits.length)
        return;

    let object =
        hits[0].object;

    while (
        object &&
        !object.userData.url
    ) {
        object =
            object.parent;
    }

    if (
        object &&
        object.userData.url
    ) {

        window.location.assign(
            object.userData.url
        );
    }
}

function animate() {

    requestAnimationFrame(
        animate
    );

    const house =
        scene?.userData?.house;

    const time =
        performance.now() *
        0.001;

    if (house) {

        house.rotation.y =
            Math.sin(
                time * 0.35
            ) * 0.035;

        house.position.y =
            Math.sin(
                time * 0.7
            ) * 0.035;
    }

    navigationCards.forEach(
        (card, index) => {

            card.position.z =
                2 +
                Math.sin(
                    time * 0.7 +
                    index
                ) * 0.025;
        }
    );

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

function init() {

    if (scene)
        return;

    canvas =
        document.getElementById(
            "controlCenter3dCanvas"
        );

    if (!canvas)
        return;

    scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(
            0x05080d
        );

    camera =
        new THREE.PerspectiveCamera(
            40,
            1,
            0.1,
            100
        );

    renderer =
        new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;

    controls =
        new OrbitControls(
            camera,
            renderer.domElement
        );

    controls.enableDamping =
        true;

    controls.enableZoom =
        false;

    controls.enablePan =
        false;

    controls.minPolarAngle =
        Math.PI / 2;

    controls.maxPolarAngle =
        Math.PI / 2;

    createHouse();

    items.forEach(
        item => {
            createNavigationCard(item);
        }
    );

    canvas.addEventListener(
        "pointerup",
        handleClick
    );

    window.addEventListener(
        "resize",
        resize
    );

    setupLayout();

    resize();

    animate();
}

window.controlCenter3D = {
    init
};

window.myHomeControlCenter = {
    init
};