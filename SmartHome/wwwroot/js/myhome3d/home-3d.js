import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let clock = null;
let canvas = null;

let animationFrame = null;
let resizeObserver = null;

let raycaster = null;
let mouse = null;

let selectedCard = null;

let sphereSystem = null;
let sphere = null;
let sphereWire = null;
let coreGlow = null;

let rings = [];
let particles = null;

let dataObjects = [];

let notificationButton = null;

let state = {
    IndoorTemperature: 0,
    OutdoorTemperature: 0,
    Humidity: 0,
    GasDetected: false,
    GasValue: 0,
    MotionDetected: false,
    SecurityEnabled: false,
    StationOnline: false
};


// ============================================================
// INIT
// ============================================================

function init(canvasId) {

    dispose();

    canvas = document.getElementById(canvasId);

    if (!canvas) {
        console.error("MY HOME 3D: canvas not found");
        return;
    }

    scene = new THREE.Scene();

    scene.background =
        new THREE.Color(0x050912);

    scene.fog =
        new THREE.FogExp2(
            0x050912,
            0.018
        );

    clock =
        new THREE.Clock();

    raycaster =
        new THREE.Raycaster();

    mouse =
        new THREE.Vector2();

    selectedCard = null;


    // ========================================================
    // CAMERA
    // ========================================================

    camera =
        new THREE.OrthographicCamera(
            -5,
            5,
            5,
            -5,
            0.1,
            100
        );

    camera.position.set(
        0,
        0,
        15
    );

    camera.lookAt(
        0,
        0,
        0
    );


    // ========================================================
    // RENDERER
    // ========================================================

    renderer =
        new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
        });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    // ========================================================
    // LIGHTS
    // ========================================================

    createLights();


    // ========================================================
    // BACKGROUND
    // ========================================================

    createBackground();


    // ========================================================
    // SPHERE
    // ========================================================

    createSphereSystem();


    // ========================================================
    // DATA
    // ========================================================

    createDataObjects();


    // ========================================================
    // NOTIFICATIONS
    // ========================================================

    createNotificationButton();


    // ========================================================
    // CONTROLS
    // ========================================================

    controls =
        new OrbitControls(
            camera,
            renderer.domElement
        );

    controls.enableDamping = true;
    controls.dampingFactor = 0.045;

    controls.enablePan = false;
    controls.enableZoom = false;

    controls.rotateSpeed = 0.22;

    controls.minPolarAngle =
        Math.PI * 0.40;

    controls.maxPolarAngle =
        Math.PI * 0.60;

    controls.target.set(
        0,
        0,
        0
    );


    // ========================================================
    // EVENTS
    // ========================================================

    canvas.addEventListener(
        "pointermove",
        onPointerMove
    );

    canvas.addEventListener(
        "pointerdown",
        onPointerDown
    );


    // ========================================================
    // RESIZE
    // ========================================================

    resizeObserver =
        new ResizeObserver(
            updateResponsiveLayout
        );

    resizeObserver.observe(canvas);

    updateResponsiveLayout();

    animate();
}


// ============================================================
// LIGHTS
// ============================================================

function createLights() {

    const hemisphere =
        new THREE.HemisphereLight(
            0x5c9fff,
            0x04070c,
            2.2
        );

    scene.add(hemisphere);


    const key =
        new THREE.DirectionalLight(
            0xc9e5ff,
            2.0
        );

    key.position.set(
        -4,
        7,
        10
    );

    scene.add(key);


    const blue =
        new THREE.PointLight(
            0x168cff,
            28,
            20
        );

    blue.position.set(
        -4,
        2,
        5
    );

    scene.add(blue);


    const blue2 =
        new THREE.PointLight(
            0x246bff,
            20,
            18
        );

    blue2.position.set(
        4,
        -2,
        5
    );

    scene.add(blue2);
}


// ============================================================
// BACKGROUND
// ============================================================

function createBackground() {

    const glow =
        new THREE.Mesh(
            new THREE.CircleGeometry(
                4.8,
                64
            ),
            new THREE.MeshBasicMaterial({
                color: 0x0c3c72,
                transparent: true,
                opacity: 0.10,
                side: THREE.DoubleSide
            })
        );

    glow.position.z = -3;

    scene.add(glow);


    const grid =
        new THREE.GridHelper(
            30,
            30,
            0x12365c,
            0x071523
        );

    grid.position.y = -5;

    grid.material.transparent = true;
    grid.material.opacity = 0.28;

    scene.add(grid);


    const geometry =
        new THREE.BufferGeometry();

    const count = 320;

    const positions =
        new Float32Array(
            count * 3
        );

    for (
        let i = 0;
        i < count;
        i++
    ) {

        positions[i * 3] =
            (Math.random() - 0.5) * 22;

        positions[i * 3 + 1] =
            (Math.random() - 0.5) * 15;

        positions[i * 3 + 2] =
            -2 -
            Math.random() * 7;
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({
            color: 0x378fff,
            size: 0.022,
            transparent: true,
            opacity: 0.40
        });


    particles =
        new THREE.Points(
            geometry,
            material
        );

    scene.add(particles);
}


// ============================================================
// SPHERE SYSTEM
// ============================================================

function createSphereSystem() {

    sphereSystem =
        new THREE.Group();


    sphere =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1.25,
                64,
                64
            ),
            new THREE.MeshPhysicalMaterial({
                color: 0x071c32,
                metalness: 0.75,
                roughness: 0.18,
                clearcoat: 0.8,
                clearcoatRoughness: 0.18,
                emissive: 0x063d78,
                emissiveIntensity: 0.65
            })
        );

    sphereSystem.add(sphere);


    sphereWire =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1.29,
                20,
                20
            ),
            new THREE.MeshBasicMaterial({
                color: 0x258dff,
                wireframe: true,
                transparent: true,
                opacity: 0.23
            })
        );

    sphereSystem.add(sphereWire);


    const ring1 =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                1.48,
                0.025,
                10,
                128
            ),
            new THREE.MeshBasicMaterial({
                color: 0x36a4ff,
                transparent: true,
                opacity: 0.9
            })
        );

    ring1.rotation.x =
        Math.PI / 2;

    sphereSystem.add(ring1);
    rings.push(ring1);


    const ring2 =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                1.72,
                0.014,
                8,
                128
            ),
            new THREE.MeshBasicMaterial({
                color: 0x176fff,
                transparent: true,
                opacity: 0.65
            })
        );

    ring2.rotation.x =
        Math.PI * 0.36;

    ring2.rotation.z =
        Math.PI * 0.16;

    sphereSystem.add(ring2);
    rings.push(ring2);


    const ring3 =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                1.95,
                0.009,
                8,
                128
            ),
            new THREE.MeshBasicMaterial({
                color: 0x4ab6ff,
                transparent: true,
                opacity: 0.35
            })
        );

    ring3.rotation.x =
        Math.PI * 0.68;

    ring3.rotation.z =
        -Math.PI * 0.22;

    sphereSystem.add(ring3);
    rings.push(ring3);


    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const point =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.045,
                    12,
                    12
                ),
                new THREE.MeshBasicMaterial({
                    color: 0x62c5ff
                })
            );

        const angle =
            (Math.PI * 2 / 8) * i;

        point.position.set(
            Math.cos(angle) * 1.72,
            0,
            Math.sin(angle) * 1.72
        );

        sphereSystem.add(point);

        point.userData.orbit =
            angle;

        point.userData.orbitSpeed =
            0.35 +
            Math.random() * 0.25;

        point.userData.orbitRadius =
            1.72;
    }


    coreGlow =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                1.65,
                32,
                32
            ),
            new THREE.MeshBasicMaterial({
                color: 0x167cff,
                transparent: true,
                opacity: 0.035,
                side: THREE.BackSide
            })
        );

    sphereSystem.add(coreGlow);


    const title =
        createTextSprite(
            "MY HOME",
            52,
            "#dff3ff"
        );

    title.scale.set(
        1.5,
        0.30,
        1
    );

    title.position.set(
        0,
        -2.05,
        1.2
    );

    sphereSystem.add(title);


    const subtitle =
        createTextSprite(
            "SMART HOME SYSTEM",
            24,
            "#5181a9"
        );

    subtitle.scale.set(
        1.45,
        0.15,
        1
    );

    subtitle.position.set(
        0,
        -2.38,
        1.2
    );

    sphereSystem.add(subtitle);


    scene.add(sphereSystem);
}


// ============================================================
// DATA OBJECTS
// ============================================================

function createDataObjects() {

    createDataObject(
        "temperature",
        "ТЕМПЕРАТУРА",
        "--°C",
        "INDOOR",
        -3.55,
        2.05
    );


    createDataObject(
        "humidity",
        "ВЛАЖНОСТЬ",
        "--%",
        "AIR",
        3.55,
        2.05
    );


    createDataObject(
        "outdoor",
        "НА УЛИЦЕ",
        "--°C",
        "OUTDOOR",
        -3.55,
        -0.55
    );


    createDataObject(
        "gas",
        "ГАЗ",
        "--",
        "MQ SENSOR",
        3.55,
        -0.55
    );


    createStatusObject(
        "security",
        "ОХРАНА",
        "ВЫКЛ",
        -2.05,
        -2.65
    );


    createStatusObject(
        "motion",
        "ДВИЖЕНИЕ",
        "НЕТ",
        2.05,
        -2.65
    );


    createStatusObject(
        "station",
        "СТАНЦИЯ",
        "ОФЛАЙН",
        0,
        3.65
    );
}


// ============================================================
// DATA OBJECT
// ============================================================

function createDataObject(
    id,
    title,
    value,
    subtitle,
    x,
    y
) {

    const group =
        new THREE.Group();

    group.userData.id =
        id;

    group.userData.cardType =
        "data";

    group.userData.originalZ =
        2;

    group.position.set(
        x,
        y,
        2
    );


    const width = 2.35;
    const height = 1.12;


    const panel =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                0.10
            ),
            new THREE.MeshPhysicalMaterial({
                color: 0x081625,
                metalness: 0.55,
                roughness: 0.22,
                transparent: true,
                opacity: 0.91
            })
        );

    group.add(panel);


    const border =
        createBorder(
            width,
            height
        );

    group.add(border);


    const point =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.035,
                10,
                10
            ),
            new THREE.MeshBasicMaterial({
                color: 0x258dff
            })
        );

    point.position.set(
        -width / 2 + 0.16,
        height / 2 - 0.16,
        0.10
    );

    group.add(point);


    const titleSprite =
        createTextSprite(
            title,
            34,
            "#69a9d9"
        );

    titleSprite.scale.set(
        1.15,
        0.18,
        1
    );

    titleSprite.position.set(
        0,
        0.30,
        0.12
    );

    group.add(titleSprite);


    const valueSprite =
        createTextSprite(
            value,
            76,
            "#e8f6ff"
        );

    valueSprite.scale.set(
        1.30,
        0.34,
        1
    );

    valueSprite.position.set(
        0,
        -0.04,
        0.13
    );

    group.add(valueSprite);


    const subtitleSprite =
        createTextSprite(
            subtitle,
            24,
            "#466984"
        );

    subtitleSprite.scale.set(
        0.95,
        0.12,
        1
    );

    subtitleSprite.position.set(
        0,
        -0.35,
        0.12
    );

    group.add(subtitleSprite);


    group.userData.valueSprite =
        valueSprite;

    group.userData.border =
        border;

    group.userData.panel =
        panel;

    group.userData.point =
        point;

    group.userData.baseX =
        x;

    group.userData.baseY =
        y;

    group.userData.baseScale =
        1;

    group.userData.originalScale =
        1;

    group.userData.cardWidth =
        width;

    group.userData.cardHeight =
        height;

    dataObjects.push(group);

    scene.add(group);
}


// ============================================================
// STATUS OBJECT
// ============================================================

function createStatusObject(
    id,
    title,
    value,
    x,
    y
) {

    const group =
        new THREE.Group();

    group.userData.id =
        id;

    group.userData.cardType =
        "status";

    group.userData.originalZ =
        2;

    group.position.set(
        x,
        y,
        2
    );


    const width = 2.35;
    const height = 0.72;


    const panel =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                0.10
            ),
            new THREE.MeshPhysicalMaterial({
                color: 0x081625,
                metalness: 0.55,
                roughness: 0.22,
                transparent: true,
                opacity: 0.91
            })
        );

    group.add(panel);


    const border =
        createBorder(
            width,
            height
        );

    group.add(border);


    // ========================================================
    // STATUS TITLE
    // ========================================================

    const titleSprite =
        createTextSprite(
            title,
            34,
            "#69a9d9"
        );

    titleSprite.scale.set(
        1.10,
        0.20,
        1
    );

    titleSprite.position.set(
        -0.60,
        0,
        0.12
    );

    group.add(titleSprite);


    // ========================================================
    // STATUS VALUE
    // ========================================================

    const valueSprite =
        createTextSprite(
            value,
            38,
            "#9acfff"
        );

    valueSprite.scale.set(
        1.08,
        0.21,
        1
    );

    valueSprite.position.set(
        0.65,
        0,
        0.12
    );

    group.add(valueSprite);


    group.userData.valueSprite =
        valueSprite;

    group.userData.titleSprite =
        titleSprite;

    group.userData.border =
        border;

    group.userData.panel =
        panel;

    group.userData.baseX =
        x;

    group.userData.baseY =
        y;

    group.userData.baseScale =
        1;

    group.userData.originalScale =
        1;

    group.userData.cardWidth =
        width;

    group.userData.cardHeight =
        height;

    dataObjects.push(group);

    scene.add(group);
}


// ============================================================
// NOTIFICATION
// ============================================================

function createNotificationButton() {

    notificationButton =
        new THREE.Group();


    notificationButton.position.set(
        0,
        -3.65,
        2
    );

    notificationButton.userData.baseY =
        -3.65;


    const panel =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.5,
                0.58,
                0.10
            ),
            new THREE.MeshPhysicalMaterial({
                color: 0x081625,
                metalness: 0.55,
                roughness: 0.22,
                transparent: true,
                opacity: 0.91
            })
        );

    panel.userData.notification =
        true;

    notificationButton.add(panel);


    const border =
        createBorder(
            2.5,
            0.58
        );

    notificationButton.add(border);


    const text =
        createTextSprite(
            "🔔  УВЕДОМЛЕНИЯ",
            31,
            "#75baff"
        );

    text.scale.set(
        1.25,
        0.18,
        1
    );

    text.position.z =
        0.13;

    notificationButton.add(text);

    scene.add(notificationButton);
}


// ============================================================
// BORDER
// ============================================================

function createBorder(
    width,
    height
) {

    const points = [

        new THREE.Vector3(
            -width / 2,
            -height / 2,
            0
        ),

        new THREE.Vector3(
            width / 2,
            -height / 2,
            0
        ),

        new THREE.Vector3(
            width / 2,
            height / 2,
            0
        ),

        new THREE.Vector3(
            -width / 2,
            height / 2,
            0
        ),

        new THREE.Vector3(
            -width / 2,
            -height / 2,
            0
        )
    ];


    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(points);


    const material =
        new THREE.LineBasicMaterial({
            color: 0x258dff,
            transparent: true,
            opacity: 0.78
        });


    const line =
        new THREE.Line(
            geometry,
            material
        );

    line.position.z =
        0.08;

    return line;
}


// ============================================================
// TEXT
// ============================================================

function createTextSprite(
    text,
    fontSize,
    color
) {

    const width = 1200;
    const height = 240;


    const textCanvas =
        document.createElement("canvas");

    textCanvas.width =
        width;

    textCanvas.height =
        height;


    const ctx =
        textCanvas.getContext("2d");


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    ctx.font =
        `700 ${fontSize}px Arial`;

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillStyle =
        color;

    ctx.shadowColor =
        color;

    ctx.shadowBlur =
        15;


    ctx.fillText(
        text,
        width / 2,
        height / 2
    );


    const texture =
        new THREE.CanvasTexture(
            textCanvas
        );

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


    sprite.userData.canvas =
        textCanvas;

    sprite.userData.context =
        ctx;

    sprite.userData.texture =
        texture;

    sprite.userData.fontSize =
        fontSize;

    sprite.userData.color =
        color;


    return sprite;
}


// ============================================================
// UPDATE TEXT
// ============================================================

function updateText(
    sprite,
    text,
    color = null
) {

    if (!sprite)
        return;


    const textCanvas =
        sprite.userData.canvas;

    const ctx =
        sprite.userData.context;

    const texture =
        sprite.userData.texture;


    if (
        !textCanvas ||
        !ctx ||
        !texture
    )
        return;


    const finalColor =
        color ||
        sprite.userData.color;


    ctx.clearRect(
        0,
        0,
        textCanvas.width,
        textCanvas.height
    );


    ctx.font =
        `700 ${sprite.userData.fontSize}px Arial`;

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillStyle =
        finalColor;

    ctx.shadowColor =
        finalColor;

    ctx.shadowBlur =
        15;


    ctx.fillText(
        text,
        textCanvas.width / 2,
        textCanvas.height / 2
    );


    texture.needsUpdate =
        true;
}


// ============================================================
// STATE
// ============================================================

function updateState(newState) {

    if (!newState) {

        console.warn(
            "MY HOME 3D: state is empty"
        );

        return;
    }


    state.IndoorTemperature =
        Number(
            newState.IndoorTemperature ??
            newState.indoorTemperature ??
            0
        );


    state.OutdoorTemperature =
        Number(
            newState.OutdoorTemperature ??
            newState.outdoorTemperature ??
            0
        );


    state.Humidity =
        Number(
            newState.Humidity ??
            newState.humidity ??
            0
        );


    state.GasDetected =
        Boolean(
            newState.GasDetected ??
            newState.gasDetected ??
            false
        );


    state.GasValue =
        Number(
            newState.GasValue ??
            newState.gasValue ??
            0
        );


    state.MotionDetected =
        Boolean(
            newState.MotionDetected ??
            newState.motionDetected ??
            false
        );


    state.SecurityEnabled =
        Boolean(
            newState.SecurityEnabled ??
            newState.securityEnabled ??
            false
        );


    state.StationOnline =
        Boolean(
            newState.StationOnline ??
            newState.stationOnline ??
            false
        );


    // ========================================================
    // TEMPERATURE
    // ========================================================

    const temperature =
        getDataObject("temperature");

    if (temperature) {

        updateText(
            temperature.userData.valueSprite,
            `${state.IndoorTemperature.toFixed(1)}°C`
        );
    }


    // ========================================================
    // HUMIDITY
    // ========================================================

    const humidity =
        getDataObject("humidity");

    if (humidity) {

        updateText(
            humidity.userData.valueSprite,
            `${Math.round(state.Humidity)}%`
        );
    }


    // ========================================================
    // OUTDOOR
    // ========================================================

    const outdoor =
        getDataObject("outdoor");

    if (outdoor) {

        updateText(
            outdoor.userData.valueSprite,
            `${state.OutdoorTemperature.toFixed(1)}°C`
        );
    }


    // ========================================================
    // GAS
    // ========================================================

    const gas =
        getDataObject("gas");

    if (gas) {

        updateText(
            gas.userData.valueSprite,

            state.GasDetected
                ? "ОПАСНО"
                : `${state.GasValue}`,

            state.GasDetected
                ? "#ff5c5c"
                : "#e8f6ff"
        );


        setObjectColor(
            gas,

            state.GasDetected
                ? 0xff4444
                : 0x258dff
        );
    }


    // ========================================================
    // SECURITY
    // ========================================================

    const security =
        getDataObject("security");

    if (security) {

        updateText(
            security.userData.valueSprite,

            state.SecurityEnabled
                ? "ВКЛ"
                : "ВЫКЛ",

            state.SecurityEnabled
                ? "#55e0a0"
                : "#9acfff"
        );


        setObjectColor(
            security,

            state.SecurityEnabled
                ? 0x43d99b
                : 0x258dff
        );
    }


    // ========================================================
    // MOTION
    // ========================================================

    const motion =
        getDataObject("motion");

    if (motion) {

        const dangerousMotion =
            state.MotionDetected &&
            state.SecurityEnabled;


        updateText(
            motion.userData.valueSprite,

            state.MotionDetected
                ? "ОБНАРУЖЕНО"
                : "НЕТ",

            dangerousMotion
                ? "#ff6262"
                : "#9acfff"
        );


        setObjectColor(
            motion,

            dangerousMotion
                ? 0xff4444
                : 0x258dff
        );
    }


    // ========================================================
    // STATION
    // ========================================================

    const station =
        getDataObject("station");

    if (station) {

        updateText(
            station.userData.valueSprite,

            state.StationOnline
                ? "ОНЛАЙН"
                : "ОФЛАЙН",

            state.StationOnline
                ? "#55e0a0"
                : "#ff6464"
        );


        setObjectColor(
            station,

            state.StationOnline
                ? 0x43d99b
                : 0xff4444
        );
    }


    updateSphereState();
}


// ============================================================
// SPHERE STATE
// ============================================================

function updateSphereState() {

    if (!sphere)
        return;


    let color =
        0x167cff;


    if (state.GasDetected) {

        color =
            0xff3030;
    }

    else if (
        state.MotionDetected &&
        state.SecurityEnabled
    ) {

        color =
            0xff5555;
    }

    else if (
        state.SecurityEnabled
    ) {

        color =
            0x43d99b;
    }


    sphere.material.emissive.setHex(
        color
    );

    sphere.material.emissiveIntensity =
        0.55;


    sphereWire.material.color.setHex(
        color
    );


    if (coreGlow) {

        coreGlow.material.color.setHex(
            color
        );
    }


    if (rings.length) {

        for (
            const ring of rings
        ) {

            ring.material.color.setHex(
                color
            );
        }
    }
}


// ============================================================
// OBJECT COLOR
// ============================================================

function setObjectColor(
    object,
    color
) {

    if (!object)
        return;


    if (
        object.userData.border &&
        object.userData.border.material
    ) {

        object.userData.border.material.color.setHex(
            color
        );
    }


    if (
        object.userData.point &&
        object.userData.point.material
    ) {

        object.userData.point.material.color.setHex(
            color
        );
    }


    if (
        object.userData.panel &&
        object.userData.panel.material
    ) {

        const material =
            object.userData.panel.material;


        if (material.emissive) {

            material.emissive.setHex(
                color
            );

            material.emissiveIntensity =
                0.035;
        }
    }
}


// ============================================================
// GET OBJECT
// ============================================================

function getDataObject(id) {

    return dataObjects.find(
        object =>
            object.userData.id === id
    );
}


// ============================================================
// RESPONSIVE
// ============================================================

function updateResponsiveLayout() {

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


    if (
        !width ||
        !height
    )
        return;


    const aspect =
        width / height;


    let viewHeight;


    if (aspect < 0.62) {

        viewHeight =
            11.5;

        layoutPhone();
    }

    else if (aspect < 1.0) {

        viewHeight =
            9.8;

        layoutTablet();
    }

    else {

        viewHeight =
            8.2;

        layoutDesktop();
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


    renderer.setSize(
        width,
        height,
        false
    );
}


// ============================================================
// DESKTOP
// ============================================================

function layoutDesktop() {

    setObjectLayout(
        "temperature",
        -3.65,
        1.85,
        1
    );

    setObjectLayout(
        "humidity",
        3.65,
        1.85,
        1
    );

    setObjectLayout(
        "outdoor",
        -3.65,
        -0.55,
        1
    );

    setObjectLayout(
        "gas",
        3.65,
        -0.55,
        1
    );

    setObjectLayout(
        "security",
        -2.0,
        -2.45,
        1
    );

    setObjectLayout(
        "motion",
        2.0,
        -2.45,
        1
    );

    setObjectLayout(
        "station",
        0,
        3.15,
        1
    );


    if (sphereSystem) {

        sphereSystem.position.set(
            0,
            0.05,
            0
        );

        sphereSystem.scale.setScalar(
            1
        );
    }


    if (notificationButton) {

        notificationButton.position.set(
            0,
            -3.55,
            2
        );

        notificationButton.userData.baseY =
            -3.55;

        notificationButton.scale.setScalar(
            0.92
        );
    }
}


// ============================================================
// TABLET
// ============================================================

function layoutTablet() {

    setObjectLayout(
        "temperature",
        -2.85,
        2.05,
        0.82
    );

    setObjectLayout(
        "humidity",
        2.85,
        2.05,
        0.82
    );

    setObjectLayout(
        "outdoor",
        -2.85,
        -0.55,
        0.82
    );

    setObjectLayout(
        "gas",
        2.85,
        -0.55,
        0.82
    );

    setObjectLayout(
        "security",
        -1.65,
        -2.45,
        0.82
    );

    setObjectLayout(
        "motion",
        1.65,
        -2.45,
        0.82
    );

    setObjectLayout(
        "station",
        0,
        3.15,
        0.82
    );


    if (sphereSystem) {

        sphereSystem.position.set(
            0,
            0.05,
            0
        );

        sphereSystem.scale.setScalar(
            0.84
        );
    }


    if (notificationButton) {

        notificationButton.position.set(
            0,
            -3.55,
            2
        );

        notificationButton.userData.baseY =
            -3.55;

        notificationButton.scale.setScalar(
            0.78
        );
    }
}


// ============================================================
// PHONE
// ============================================================

function layoutPhone() {

    setObjectLayout(
        "temperature",
        -1.55,
        3.35,
        0.72
    );

    setObjectLayout(
        "humidity",
        1.55,
        3.35,
        0.72
    );

    setObjectLayout(
        "outdoor",
        -1.55,
        -2.45,
        0.72
    );

    setObjectLayout(
        "gas",
        1.55,
        -2.45,
        0.72
    );

    setObjectLayout(
        "security",
        -1.15,
        -3.55,
        0.76
    );

    setObjectLayout(
        "motion",
        1.15,
        -3.55,
        0.76
    );

    setObjectLayout(
        "station",
        0,
        4.25,
        0.76
    );


    if (sphereSystem) {

        sphereSystem.position.set(
            0,
            0.15,
            0
        );

        sphereSystem.scale.setScalar(
            0.73
        );
    }


    if (notificationButton) {

        notificationButton.position.set(
            0,
            -4.55,
            2
        );

        notificationButton.userData.baseY =
            -4.55;

        notificationButton.scale.setScalar(
            0.72
        );
    }
}


// ============================================================
// OBJECT LAYOUT
// ============================================================

function setObjectLayout(
    id,
    x,
    y,
    scale
) {

    const object =
        getDataObject(id);

    if (!object)
        return;


    object.userData.baseX =
        x;

    object.userData.baseY =
        y;

    object.userData.baseScale =
        scale;

    object.userData.originalScale =
        scale;


    if (object !== selectedCard) {

        object.position.x =
            x;

        object.position.y =
            y;

        object.position.z =
            object.userData.originalZ ??
            2;

        object.scale.setScalar(
            scale
        );
    }
}


// ============================================================
// FIND CARD
// ============================================================

function findCardFromHit(object) {

    let current =
        object;

    while (current) {

        if (
            current.userData &&
            current.userData.id &&
            dataObjects.includes(current)
        ) {

            return current;
        }

        current =
            current.parent;
    }

    return null;
}


// ============================================================
// POINTER POSITION
// ============================================================

function updatePointer(event) {

    if (
        !canvas ||
        !mouse
    )
        return;


    const rect =
        canvas.getBoundingClientRect();


    mouse.x =
        (
            (
                event.clientX -
                rect.left
            ) /
            rect.width
        ) * 2 - 1;


    mouse.y =
        -(
            (
                event.clientY -
                rect.top
            ) /
            rect.height
        ) * 2 + 1;
}


// ============================================================
// POINTER MOVE
// ============================================================

function onPointerMove(event) {

    if (
        !canvas ||
        !camera ||
        !raycaster ||
        !mouse
    )
        return;


    updatePointer(event);


    raycaster.setFromCamera(
        mouse,
        camera
    );


    const hits =
        raycaster.intersectObjects(
            dataObjects,
            true
        );


    if (hits.length) {

        const card =
            findCardFromHit(
                hits[0].object
            );

        canvas.style.cursor =
            card
                ? "pointer"
                : "default";

    }
    else {

        canvas.style.cursor =
            "default";
    }
}


// ============================================================
// CLICK / TAP
// ============================================================

function onPointerDown(event) {

    if (
        !canvas ||
        !camera ||
        !raycaster ||
        !mouse
    )
        return;


    updatePointer(event);


    raycaster.setFromCamera(
        mouse,
        camera
    );


    const hits =
        raycaster.intersectObjects(
            dataObjects,
            true
        );


    // ========================================================
    // НАЖАТИЕ МИМО
    // ========================================================

    if (!hits.length) {

        selectedCard =
            null;

        return;
    }


    const card =
        findCardFromHit(
            hits[0].object
        );


    if (!card)
        return;


    // ========================================================
    // ПОВТОРНОЕ НАЖАТИЕ
    // ========================================================

    if (selectedCard === card) {

        selectedCard =
            null;

        return;
    }


    // ========================================================
    // ОТКРЫВАЕМ ЛЮБУЮ КАРТОЧКУ
    // ========================================================

    selectedCard =
        card;
}


// ============================================================
// SELECTED CARD SCALE
// ============================================================

function getSelectedCardScale(card) {

    if (
        !camera ||
        !canvas ||
        !card
    ) {

        return 2;
    }


    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;


    if (
        !width ||
        !height
    ) {

        return 2;
    }


    const aspect =
        width / height;


    const baseScale =
        card.userData.originalScale ??
        card.userData.baseScale ??
        1;


    const cardWidth =
        card.userData.cardWidth ??
        2.35;


    const cardHeight =
        card.userData.cardHeight ??
        1.12;


    const viewHeight =
        aspect < 0.62
            ? 11.5
            : aspect < 1.0
                ? 9.8
                : 8.2;


    const viewWidth =
        viewHeight * aspect;


    // ========================================================
    // STATUS
    // ========================================================

    if (
        card.userData.cardType === "status"
    ) {

        const maxByWidth =
            (
                viewWidth * 0.88
            ) /
            cardWidth;


        const maxByHeight =
            (
                viewHeight * 0.32
            ) /
            cardHeight;


        let scale =
            Math.min(
                maxByWidth,
                maxByHeight
            );


        scale =
            Math.max(
                scale,
                baseScale * 2.4
            );


        return scale;
    }


    // ========================================================
    // DATA
    // ========================================================

    const maxByWidth =
        (
            viewWidth * 0.88
        ) /
        cardWidth;


    const maxByHeight =
        (
            viewHeight * 0.62
        ) /
        cardHeight;


    let scale =
        Math.min(
            maxByWidth,
            maxByHeight
        );


    scale =
        Math.max(
            scale,
            baseScale * 1.8
        );


    return scale;
}


// ============================================================
// ANIMATION
// ============================================================

function animate() {

    animationFrame =
        requestAnimationFrame(
            animate
        );


    if (
        !scene ||
        !renderer ||
        !camera
    )
        return;


    const time =
        clock.getElapsedTime();


    // ========================================================
    // SPHERE
    // ========================================================

    if (sphereSystem) {

        sphereSystem.rotation.y =
            Math.sin(
                time * 0.22
            ) * 0.10;

        sphereSystem.position.y =
            sphereSystem.userData.baseY ??
            sphereSystem.position.y;
    }


    if (sphere) {

        sphere.rotation.y +=
            0.0015;

        sphere.rotation.x =
            Math.sin(
                time * 0.35
            ) * 0.035;
    }


    if (sphereWire) {

        sphereWire.rotation.y -=
            0.0018;

        sphereWire.rotation.x +=
            0.0008;
    }


    // ========================================================
    // RINGS
    // ========================================================

    if (rings[0]) {

        rings[0].rotation.z +=
            0.003;
    }


    if (rings[1]) {

        rings[1].rotation.y +=
            0.002;

        rings[1].rotation.z +=
            0.001;
    }


    if (rings[2]) {

        rings[2].rotation.y -=
            0.0015;
    }


    // ========================================================
    // ORBIT POINTS
    // ========================================================

    if (sphereSystem) {

        for (
            const child of
            sphereSystem.children
        ) {

            if (
                child.userData &&
                child.userData.orbit !==
                undefined
            ) {

                const angle =
                    child.userData.orbit +
                    time *
                    child.userData.orbitSpeed;


                const radius =
                    child.userData.orbitRadius;


                child.position.x =
                    Math.cos(angle) *
                    radius;


                child.position.z =
                    Math.sin(angle) *
                    radius;


                child.position.y =
                    Math.sin(
                        angle * 2
                    ) * 0.15;
            }
        }
    }


    // ========================================================
    // GLOW
    // ========================================================

    if (coreGlow) {

        coreGlow.material.opacity =
            0.025 +
            Math.sin(
                time * 1.4
            ) * 0.009;
    }


    // ========================================================
    // CARDS
    // ========================================================

    for (
        const object of dataObjects
    ) {

        const baseY =
            object.userData.baseY ??
            object.position.y;


        const baseX =
            object.userData.baseX ??
            object.position.x;


        const isSelected =
            object === selectedCard;


        // ====================================================
        // NORMAL
        // ====================================================

        if (!isSelected) {

            object.position.x +=
                (
                    baseX -
                    object.position.x
                ) * 0.14;


            object.position.y +=
                (
                    (
                        baseY +
                        Math.sin(
                            time * 0.75 +
                            baseX
                        ) * 0.025
                    ) -
                    object.position.y
                ) * 0.14;


            object.position.z +=
                (
                    (
                        object.userData.originalZ ??
                        2
                    ) -
                    object.position.z
                ) * 0.14;
        }


        // ====================================================
        // OPEN
        // ====================================================

        else {

            object.position.x +=
                (
                    0 -
                    object.position.x
                ) * 0.12;


            object.position.y +=
                (
                    0 -
                    object.position.y
                ) * 0.12;


            object.position.z +=
                (
                    8 -
                    object.position.z
                ) * 0.12;
        }


        // ====================================================
        // SCALE
        // ====================================================

        const baseScale =
            object.userData.baseScale ??
            1;


        const targetScale =
            isSelected
                ? getSelectedCardScale(
                    object
                )
                : baseScale;


        object.scale.x +=
            (
                targetScale -
                object.scale.x
            ) * 0.12;


        object.scale.y +=
            (
                targetScale -
                object.scale.y
            ) * 0.12;


        object.scale.z +=
            (
                targetScale -
                object.scale.z
            ) * 0.12;


        // ====================================================
        // BORDER
        // ====================================================

        if (
            object.userData.border &&
            object.userData.border.material
        ) {

            const borderMaterial =
                object.userData.border.material;


            const targetOpacity =
                isSelected
                    ? 1.0
                    : 0.78;


            borderMaterial.opacity +=
                (
                    targetOpacity -
                    borderMaterial.opacity
                ) * 0.12;
        }
    }


    // ========================================================
    // PARTICLES
    // ========================================================

    if (particles) {

        particles.rotation.y =
            time * 0.008;

        particles.rotation.x =
            Math.sin(
                time * 0.15
            ) * 0.02;
    }


    // ========================================================
    // NOTIFICATION
    // ========================================================

    if (notificationButton) {

        const baseY =
            notificationButton.userData.baseY ??
            -3.65;


        notificationButton.position.y =
            baseY +
            Math.sin(
                time * 1.1
            ) * 0.002;
    }


    // ========================================================
    // CONTROLS
    // ========================================================

    if (controls)
        controls.update();


    renderer.render(
        scene,
        camera
    );
}


// ============================================================
// DISPOSE
// ============================================================

function dispose() {

    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;
    }


    if (resizeObserver) {

        resizeObserver.disconnect();

        resizeObserver = null;
    }


    if (canvas) {

        canvas.removeEventListener(
            "pointermove",
            onPointerMove
        );

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


    sphereSystem = null;
    sphere = null;
    sphereWire = null;
    coreGlow = null;


    rings = [];

    dataObjects = [];

    particles = null;

    notificationButton = null;

    selectedCard = null;

    raycaster = null;

    mouse = null;
}


// ============================================================
// PUBLIC API
// ============================================================

window.myHome3D = {

    init,

    updateState,

    dispose
};