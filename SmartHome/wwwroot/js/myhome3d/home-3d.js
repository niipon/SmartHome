//import * as THREE from "three";
//import { OrbitControls } from "three/addons/controls/OrbitControls.js";

//let scene = null;
//let camera = null;
//let renderer = null;
//let controls = null;
//let clock = null;

//let canvas = null;

//let animationFrame = null;
//let resizeObserver = null;

//let raycaster = null;
//let mouse = null;

//let cards = [];

//let core = null;
//let coreRing = null;
//let coreGlow = null;

//let notificationButton = null;

//let state = {
//    IndoorTemperature: 0,
//    OutdoorTemperature: 0,
//    Humidity: 0,
//    GasDetected: false,
//    GasValue: 0,
//    MotionDetected: false,
//    SecurityEnabled: false,
//    StationOnline: false
//};


//// ============================================================
//// INIT
//// ============================================================

//function init(canvasId) {

//    dispose();


//    canvas =
//        document.getElementById(canvasId);


//    if (!canvas) {

//        console.error(
//            "MY HOME 3D: canvas not found"
//        );

//        return;
//    }


//    scene =
//        new THREE.Scene();


//    scene.background =
//        new THREE.Color(
//            0x050912
//        );


//    scene.fog =
//        new THREE.FogExp2(
//            0x050912,
//            0.018
//        );


//    clock =
//        new THREE.Clock();


//    raycaster =
//        new THREE.Raycaster();


//    mouse =
//        new THREE.Vector2();


//    // ========================================================
//    // CAMERA
//    // ========================================================

//    camera =
//        new THREE.OrthographicCamera(
//            -5,
//            5,
//            5,
//            -5,
//            0.1,
//            100
//        );


//    camera.position.set(
//        0,
//        0,
//        15
//    );


//    camera.lookAt(
//        0,
//        0,
//        0
//    );


//    // ========================================================
//    // RENDERER
//    // ========================================================

//    renderer =
//        new THREE.WebGLRenderer({

//            canvas: canvas,

//            antialias: true,

//            alpha: false,

//            powerPreference:
//                "high-performance"
//        });


//    renderer.setPixelRatio(
//        Math.min(
//            window.devicePixelRatio,
//            2
//        )
//    );


//    renderer.outputColorSpace =
//        THREE.SRGBColorSpace;


//    // ========================================================
//    // LIGHTS
//    // ========================================================

//    createLights();


//    // ========================================================
//    // BACKGROUND
//    // ========================================================

//    createBackground();


//    // ========================================================
//    // CENTRAL CORE
//    // ========================================================

//    createCore();


//    // ========================================================
//    // CARDS
//    // ========================================================

//    createCards();


//    // ========================================================
//    // NOTIFICATIONS
//    // ========================================================

//    createNotificationButton();


//    // ========================================================
//    // CONTROLS
//    // ========================================================

//    controls =
//        new OrbitControls(
//            camera,
//            renderer.domElement
//        );


//    controls.enableDamping = true;

//    controls.dampingFactor =
//        0.05;

//    controls.enablePan = false;

//    controls.enableZoom = false;

//    controls.rotateSpeed = 0.25;

//    controls.minPolarAngle =
//        Math.PI * 0.40;

//    controls.maxPolarAngle =
//        Math.PI * 0.60;


//    controls.target.set(
//        0,
//        0,
//        0
//    );


//    // ========================================================
//    // EVENTS
//    // ========================================================

//    canvas.addEventListener(
//        "pointermove",
//        onPointerMove
//    );


//    canvas.addEventListener(
//        "pointerdown",
//        onPointerDown
//    );


//    // ========================================================
//    // RESIZE
//    // ========================================================

//    resizeObserver =
//        new ResizeObserver(
//            updateResponsiveLayout
//        );


//    resizeObserver.observe(
//        canvas
//    );


//    updateResponsiveLayout();

//    animate();
//}


//// ============================================================
//// LIGHTS
//// ============================================================

//function createLights() {

//    const hemisphere =
//        new THREE.HemisphereLight(
//            0x5c9fff,
//            0x04070c,
//            2.4
//        );

//    scene.add(
//        hemisphere
//    );


//    const key =
//        new THREE.DirectionalLight(
//            0xc9e5ff,
//            2.4
//        );

//    key.position.set(
//        -4,
//        7,
//        10
//    );

//    scene.add(
//        key
//    );


//    const blue =
//        new THREE.PointLight(
//            0x168cff,
//            25,
//            20
//        );

//    blue.position.set(
//        -5,
//        2,
//        5
//    );

//    scene.add(
//        blue
//    );


//    const blue2 =
//        new THREE.PointLight(
//            0x246bff,
//            18,
//            18
//        );

//    blue2.position.set(
//        5,
//        -2,
//        4
//    );

//    scene.add(
//        blue2
//    );
//}


//// ============================================================
//// BACKGROUND
//// ============================================================

//function createBackground() {

//    // Large circular glow

//    const glowGeometry =
//        new THREE.CircleGeometry(
//            5,
//            64
//        );


//    const glowMaterial =
//        new THREE.MeshBasicMaterial({

//            color:
//                0x0c3c72,

//            transparent: true,

//            opacity: 0.12,

//            side:
//                THREE.DoubleSide
//        });


//    const glow =
//        new THREE.Mesh(
//            glowGeometry,
//            glowMaterial
//        );


//    glow.position.z =
//        -3;


//    glow.scale.set(
//        1.3,
//        1.3,
//        1
//    );


//    scene.add(
//        glow
//    );


//    // Grid

//    const grid =
//        new THREE.GridHelper(
//            30,
//            30,
//            0x12365c,
//            0x071523
//        );


//    grid.position.y =
//        -5;


//    grid.rotation.x =
//        0;


//    grid.material.transparent =
//        true;


//    grid.material.opacity =
//        0.35;


//    scene.add(
//        grid
//    );


//    // Particles

//    const geometry =
//        new THREE.BufferGeometry();


//    const count = 250;


//    const positions =
//        new Float32Array(
//            count * 3
//        );


//    for (
//        let i = 0;
//        i < count;
//        i++
//    ) {

//        positions[i * 3] =
//            (Math.random() - 0.5) * 24;

//        positions[i * 3 + 1] =
//            (Math.random() - 0.5) * 16;

//        positions[i * 3 + 2] =
//            -2 -
//            Math.random() * 6;
//    }


//    geometry.setAttribute(
//        "position",

//        new THREE.BufferAttribute(
//            positions,
//            3
//        )
//    );


//    const material =
//        new THREE.PointsMaterial({

//            color:
//                0x378fff,

//            size:
//                0.025,

//            transparent:
//                true,

//            opacity:
//                0.45
//        });


//    const particles =
//        new THREE.Points(
//            geometry,
//            material
//        );


//    scene.add(
//        particles
//    );
//}


//// ============================================================
//// CORE
//// ============================================================

//function createCore() {

//    core =
//        new THREE.Group();

//    core.userData.baseY = 0.05;

//    // Outer ring

//    const ringGeometry =
//        new THREE.TorusGeometry(
//            1.25,
//            0.025,
//            12,
//            96
//        );


//    const ringMaterial =
//        new THREE.MeshBasicMaterial({
//            color:
//                0x2b9cff
//        });


//    coreRing =
//        new THREE.Mesh(
//            ringGeometry,
//            ringMaterial
//        );


//    coreRing.rotation.x =
//        Math.PI / 2;


//    core.add(
//        coreRing
//    );


//    // Second ring

//    const ring2 =
//        new THREE.Mesh(
//            new THREE.TorusGeometry(
//                1.55,
//                0.012,
//                8,
//                96
//            ),

//            new THREE.MeshBasicMaterial({
//                color:
//                    0x176fff,

//                transparent:
//                    true,

//                opacity:
//                    0.6
//            })
//        );


//    ring2.rotation.x =
//        Math.PI / 2;


//    core.add(
//        ring2
//    );


//    // Inner sphere

//    const sphere =
//        new THREE.Mesh(

//            new THREE.SphereGeometry(
//                0.72,
//                32,
//                32
//            ),

//            new THREE.MeshPhysicalMaterial({

//                color:
//                    0x0a2c50,

//                metalness:
//                    0.65,

//                roughness:
//                    0.2,

//                emissive:
//                    0x0a62bd,

//                emissiveIntensity:
//                    0.65
//            })
//        );


//    core.add(
//        sphere
//    );


//    // Inner ring

//    const innerRing =
//        new THREE.Mesh(

//            new THREE.TorusGeometry(
//                0.85,
//                0.018,
//                8,
//                64
//            ),

//            new THREE.MeshBasicMaterial({
//                color:
//                    0x66c4ff
//            })
//        );


//    innerRing.rotation.y =
//        Math.PI / 2;


//    core.add(
//        innerRing
//    );


//    // Glow

//    const glowGeometry =
//        new THREE.SphereGeometry(
//            1.35,
//            32,
//            32
//        );


//    const glowMaterial =
//        new THREE.MeshBasicMaterial({

//            color:
//                0x167cff,

//            transparent:
//                true,

//            opacity:
//                0.035,

//            side:
//                THREE.BackSide
//        });


//    coreGlow =
//        new THREE.Mesh(
//            glowGeometry,
//            glowMaterial
//        );


//    core.add(
//        coreGlow
//    );


//    // MY HOME text

//    const title =
//        createTextSprite(
//            "MY HOME",
//            52,
//            "#dff3ff"
//        );


//    title.scale.set(
//        1.55,
//        0.3,
//        1
//    );


//    title.position.y =
//        0.12;


//    title.position.z =
//        1.65;


//    core.add(
//        title
//    );


//    // SYSTEM text

//    const system =
//        createTextSprite(
//            "SMART HOME SYSTEM",
//            25,
//            "#5181a9"
//        );


//    system.scale.set(
//        1.45,
//        0.16,
//        1
//    );


//    system.position.y =
//        -0.35;


//    system.position.z =
//        1.65;


//    core.add(
//        system
//    );


//    scene.add(
//        core
//    );
//}


//// ============================================================
//// CARDS
//// ============================================================

//function createCards() {

//    createDataCard(
//        "temperature",
//        "ТЕМПЕРАТУРА",
//        "--°C",
//        "INDOOR"
//    );


//    createDataCard(
//        "humidity",
//        "ВЛАЖНОСТЬ",
//        "--%",
//        "AIR"
//    );


//    createDataCard(
//        "outdoor",
//        "НА УЛИЦЕ",
//        "--°C",
//        "OUTDOOR"
//    );


//    createDataCard(
//        "gas",
//        "ГАЗ",
//        "--",
//        "MQ SENSOR"
//    );


//    createStatusCard(
//        "motion",
//        "ДВИЖЕНИЕ",
//        "НЕТ"
//    );


//    createStatusCard(
//        "security",
//        "ОХРАНА",
//        "ВЫКЛ"
//    );


//    createStatusCard(
//        "station",
//        "СТАНЦИЯ",
//        "ОФЛАЙН"
//    );
//}


//// ============================================================
//// DATA CARD
//// ============================================================

//function createDataCard(
//    id,
//    title,
//    value,
//    subtitle
//) {

//    const group =
//        new THREE.Group();


//    group.userData.id =
//        id;


//    const width = 2.55;
//    const height = 1.35;


//    // Glass

//    const glass =
//        new THREE.Mesh(

//            new THREE.BoxGeometry(
//                width,
//                height,
//                0.12
//            ),

//            new THREE.MeshPhysicalMaterial({

//                color:
//                    0x0a1728,

//                metalness:
//                    0.5,

//                roughness:
//                    0.28,

//                transparent:
//                    true,

//                opacity:
//                    0.94
//            })
//        );


//    glass.userData.card =
//        group;


//    group.add(
//        glass
//    );


//    // Border

//    const border =
//        createBorder(
//            width,
//            height
//        );


//    group.add(
//        border
//    );


//    // Title

//    const titleSprite =
//        createTextSprite(
//            title,
//            34,
//            "#69a9d9"
//        );


//    titleSprite.scale.set(
//        1.2,
//        0.18,
//        1
//    );


//    titleSprite.position.set(
//        0,
//        0.38,
//        0.12
//    );


//    group.add(
//        titleSprite
//    );


//    // Value

//    const valueSprite =
//        createTextSprite(
//            value,
//            70,
//            "#e8f6ff"
//        );


//    valueSprite.scale.set(
//        1.5,
//        0.34,
//        1
//    );


//    valueSprite.position.set(
//        0,
//        -0.02,
//        0.13
//    );


//    group.add(
//        valueSprite
//    );


//    // Subtitle

//    const subtitleSprite =
//        createTextSprite(
//            subtitle,
//            25,
//            "#466984"
//        );


//    subtitleSprite.scale.set(
//        1.0,
//        0.13,
//        1
//    );


//    subtitleSprite.position.set(
//        0,
//        -0.42,
//        0.12
//    );


//    group.add(
//        subtitleSprite
//    );


//    group.userData.valueSprite =
//        valueSprite;


//    group.userData.border =
//        border;


//    group.userData.glass =
//        glass;


//    cards.push(
//        group
//    );


//    scene.add(
//        group
//    );
//}


//// ============================================================
//// STATUS CARD
//// ============================================================

//function createStatusCard(
//    id,
//    title,
//    value
//) {

//    const group =
//        new THREE.Group();


//    group.userData.id =
//        id;


//    const width = 2.55;
//    const height = 0.82;


//    const glass =
//        new THREE.Mesh(

//            new THREE.BoxGeometry(
//                width,
//                height,
//                0.12
//            ),

//            new THREE.MeshPhysicalMaterial({

//                color:
//                    0x0a1728,

//                metalness:
//                    0.5,

//                roughness:
//                    0.28,

//                transparent:
//                    true,

//                opacity:
//                    0.94
//            })
//        );


//    glass.userData.card =
//        group;


//    group.add(
//        glass
//    );


//    const border =
//        createBorder(
//            width,
//            height
//        );


//    group.add(
//        border
//    );


//    const titleSprite =
//        createTextSprite(
//            title,
//            31,
//            "#69a9d9"
//        );


//    titleSprite.scale.set(
//        1.0,
//        0.16,
//        1
//    );


//    titleSprite.position.set(
//        -0.65,
//        0,
//        0.13
//    );


//    group.add(
//        titleSprite
//    );


//    const valueSprite =
//        createTextSprite(
//            value,
//            34,
//            "#9acfff"
//        );


//    valueSprite.scale.set(
//        1.0,
//        0.17,
//        1
//    );


//    valueSprite.position.set(
//        0.78,
//        0,
//        0.13
//    );


//    group.add(
//        valueSprite
//    );


//    group.userData.valueSprite =
//        valueSprite;


//    group.userData.border =
//        border;


//    group.userData.glass =
//        glass;


//    cards.push(
//        group
//    );


//    scene.add(
//        group
//    );
//}


//// ============================================================
//// NOTIFICATION
//// ============================================================

//function createNotificationButton() {

//    notificationButton =
//        new THREE.Group();


//    const glass =
//        new THREE.Mesh(

//            new THREE.BoxGeometry(
//                2.7,
//                0.65,
//                0.1
//            ),

//            new THREE.MeshPhysicalMaterial({

//                color:
//                    0x0b182a,

//                metalness:
//                    0.5,

//                roughness:
//                    0.25,

//                transparent:
//                    true,

//                opacity:
//                    0.94
//            })
//        );


//    glass.userData.notification =
//        true;


//    notificationButton.add(
//        glass
//    );


//    const border =
//        createBorder(
//            2.7,
//            0.65
//        );


//    notificationButton.add(
//        border
//    );


//    const text =
//        createTextSprite(
//            "🔔  УВЕДОМЛЕНИЯ",
//            34,
//            "#75baff"
//        );


//    text.scale.set(
//        1.35,
//        0.19,
//        1
//    );


//    text.position.z =
//        0.13;


//    notificationButton.add(
//        text
//    );


//    scene.add(
//        notificationButton
//    );
//}


//// ============================================================
//// BORDER
//// ============================================================

//function createBorder(
//    width,
//    height
//) {

//    const points = [

//        new THREE.Vector3(
//            -width / 2,
//            -height / 2,
//            0
//        ),

//        new THREE.Vector3(
//            width / 2,
//            -height / 2,
//            0
//        ),

//        new THREE.Vector3(
//            width / 2,
//            height / 2,
//            0
//        ),

//        new THREE.Vector3(
//            -width / 2,
//            height / 2,
//            0
//        ),

//        new THREE.Vector3(
//            -width / 2,
//            -height / 2,
//            0
//        )
//    ];


//    const geometry =
//        new THREE.BufferGeometry()
//            .setFromPoints(
//                points
//            );


//    const material =
//        new THREE.LineBasicMaterial({

//            color:
//                0x258dff,

//            transparent:
//                true,

//            opacity:
//                0.8
//        });


//    const line =
//        new THREE.Line(
//            geometry,
//            material
//        );


//    line.position.z =
//        0.08;


//    return line;
//}


//// ============================================================
//// TEXT
//// ============================================================

//function createTextSprite(
//    text,
//    fontSize,
//    color
//) {

//    const width = 900;
//    const height = 200;


//    const canvas =
//        document.createElement(
//            "canvas"
//        );


//    canvas.width =
//        width;

//    canvas.height =
//        height;


//    const ctx =
//        canvas.getContext(
//            "2d"
//        );


//    ctx.clearRect(
//        0,
//        0,
//        width,
//        height
//    );


//    ctx.font =
//        `700 ${fontSize}px Arial`;


//    ctx.textAlign =
//        "center";


//    ctx.textBaseline =
//        "middle";


//    ctx.fillStyle =
//        color;


//    ctx.shadowColor =
//        color;


//    ctx.shadowBlur =
//        15;


//    ctx.fillText(
//        text,
//        width / 2,
//        height / 2
//    );


//    const texture =
//        new THREE.CanvasTexture(
//            canvas
//        );


//    texture.colorSpace =
//        THREE.SRGBColorSpace;


//    const material =
//        new THREE.SpriteMaterial({

//            map:
//                texture,

//            transparent:
//                true,

//            depthWrite:
//                false
//        });


//    const sprite =
//        new THREE.Sprite(
//            material
//        );


//    sprite.userData.canvas =
//        canvas;

//    sprite.userData.context =
//        ctx;

//    sprite.userData.texture =
//        texture;

//    sprite.userData.fontSize =
//        fontSize;

//    sprite.userData.color =
//        color;


//    return sprite;
//}


//// ============================================================
//// UPDATE TEXT
//// ============================================================

//function updateText(
//    sprite,
//    text,
//    color = null
//) {

//    if (!sprite)
//        return;


//    const canvas =
//        sprite.userData.canvas;

//    const ctx =
//        sprite.userData.context;

//    const texture =
//        sprite.userData.texture;


//    if (!canvas ||
//        !ctx ||
//        !texture)
//        return;


//    const finalColor =
//        color ||
//        sprite.userData.color;


//    ctx.clearRect(
//        0,
//        0,
//        canvas.width,
//        canvas.height
//    );


//    ctx.font =
//        `700 ${sprite.userData.fontSize}px Arial`;


//    ctx.textAlign =
//        "center";


//    ctx.textBaseline =
//        "middle";


//    ctx.fillStyle =
//        finalColor;


//    ctx.shadowColor =
//        finalColor;


//    ctx.shadowBlur =
//        15;


//    ctx.fillText(
//        text,
//        canvas.width / 2,
//        canvas.height / 2
//    );


//    texture.needsUpdate =
//        true;
//}


//// ============================================================
//// STATE
//// ============================================================

//function updateState(newState) {

//    if (!newState) {
//        console.warn("MY HOME 3D: state is empty");
//        return;
//    }

//    console.log("MY HOME 3D DATA:", newState);

//    // Поддерживаем PascalCase от C#
//    // и camelCase на всякий случай.

//    state.IndoorTemperature =
//        Number(
//            newState.IndoorTemperature ??
//            newState.indoorTemperature ??
//            0
//        );

//    state.OutdoorTemperature =
//        Number(
//            newState.OutdoorTemperature ??
//            newState.outdoorTemperature ??
//            0
//        );

//    state.Humidity =
//        Number(
//            newState.Humidity ??
//            newState.humidity ??
//            0
//        );

//    state.GasDetected =
//        Boolean(
//            newState.GasDetected ??
//            newState.gasDetected ??
//            false
//        );

//    state.GasValue =
//        Number(
//            newState.GasValue ??
//            newState.gasValue ??
//            0
//        );

//    state.MotionDetected =
//        Boolean(
//            newState.MotionDetected ??
//            newState.motionDetected ??
//            false
//        );

//    state.SecurityEnabled =
//        Boolean(
//            newState.SecurityEnabled ??
//            newState.securityEnabled ??
//            false
//        );

//    state.StationOnline =
//        Boolean(
//            newState.StationOnline ??
//            newState.stationOnline ??
//            false
//        );


//    console.log("MY HOME 3D STATE:", state);


//    // ========================================================
//    // TEMPERATURE
//    // ========================================================

//    const temperature =
//        getCard("temperature");

//    if (temperature) {

//        updateText(
//            temperature.userData.valueSprite,
//            `${state.IndoorTemperature.toFixed(1)}°C`
//        );
//    }


//    // ========================================================
//    // HUMIDITY
//    // ========================================================

//    const humidity =
//        getCard("humidity");

//    if (humidity) {

//        updateText(
//            humidity.userData.valueSprite,
//            `${Math.round(state.Humidity)}%`
//        );
//    }


//    // ========================================================
//    // OUTDOOR
//    // ========================================================

//    const outdoor =
//        getCard("outdoor");

//    if (outdoor) {

//        updateText(
//            outdoor.userData.valueSprite,
//            `${state.OutdoorTemperature.toFixed(1)}°C`
//        );
//    }


//    // ========================================================
//    // GAS
//    // ========================================================

//    const gas =
//        getCard("gas");

//    if (gas) {

//        updateText(
//            gas.userData.valueSprite,

//            state.GasDetected
//                ? "ОПАСНО"
//                : `${state.GasValue}`,

//            state.GasDetected
//                ? "#ff5c5c"
//                : "#e8f6ff"
//        );

//        setCardColor(
//            gas,

//            state.GasDetected
//                ? 0xff4444
//                : 0x258dff
//        );
//    }


//    // ========================================================
//    // MOTION
//    // ========================================================

//    const motion =
//        getCard("motion");

//    if (motion) {

//        const dangerousMotion =
//            state.MotionDetected &&
//            state.SecurityEnabled;

//        updateText(
//            motion.userData.valueSprite,

//            state.MotionDetected
//                ? "ОБНАРУЖЕНО"
//                : "НЕТ",

//            dangerousMotion
//                ? "#ff6262"
//                : "#9acfff"
//        );

//        setCardColor(
//            motion,

//            dangerousMotion
//                ? 0xff4444
//                : 0x258dff
//        );
//    }


//    // ========================================================
//    // SECURITY
//    // ========================================================

//    const security =
//        getCard("security");

//    if (security) {

//        updateText(
//            security.userData.valueSprite,

//            state.SecurityEnabled
//                ? "ВКЛ"
//                : "ВЫКЛ",

//            state.SecurityEnabled
//                ? "#55e0a0"
//                : "#9acfff"
//        );

//        setCardColor(
//            security,

//            state.SecurityEnabled
//                ? 0x43d99b
//                : 0x258dff
//        );
//    }


//    // ========================================================
//    // STATION
//    // ========================================================

//    const station =
//        getCard("station");

//    if (station) {

//        updateText(
//            station.userData.valueSprite,

//            state.StationOnline
//                ? "ОНЛАЙН"
//                : "ОФЛАЙН",

//            state.StationOnline
//                ? "#55e0a0"
//                : "#ff6464"
//        );

//        setCardColor(
//            station,

//            state.StationOnline
//                ? 0x43d99b
//                : 0xff4444
//        );
//    }


//    updateCoreState();
//}


//// ============================================================
//// CORE STATE
//// ============================================================

//function updateCoreState() {

//    if (!coreGlow)
//        return;


//    let color =
//        0x167cff;


//    if (state.GasDetected) {

//        color =
//            0xff3030;
//    }
//    else if (
//        state.MotionDetected &&
//        state.SecurityEnabled
//    ) {

//        color =
//            0xff5555;
//    }
//    else if (
//        state.SecurityEnabled
//    ) {

//        color =
//            0x43d99b;
//    }


//    coreGlow.material.color.setHex(
//        color
//    );


//    coreRing.material.color.setHex(
//        color
//    );
//}


//// ============================================================
//// CARD COLOR
//// ============================================================

//function setCardColor(
//    card,
//    color
//) {

//    if (!card)
//        return;


//    if (
//        card.userData.border &&
//        card.userData.border.material
//    ) {

//        card.userData.border.material.color.setHex(
//            color
//        );
//    }


//    if (
//        card.userData.glass &&
//        card.userData.glass.material
//    ) {

//        if (
//            card.userData.glass.material.emissive
//        ) {

//            card.userData.glass.material.emissive.setHex(
//                color
//            );

//            card.userData.glass.material.emissiveIntensity =
//                0.04;
//        }
//    }
//}


//// ============================================================
//// GET CARD
//// ============================================================

//function getCard(id) {

//    return cards.find(
//        card =>
//            card.userData.id === id
//    );
//}


//// ============================================================
//// RESPONSIVE
//// ============================================================

//function updateResponsiveLayout() {

//    if (!camera ||
//        !renderer ||
//        !canvas)
//        return;


//    const width =
//        canvas.clientWidth;

//    const height =
//        canvas.clientHeight;


//    if (!width ||
//        !height)
//        return;


//    const aspect =
//        width / height;


//    let viewHeight;


//    // ========================================================
//    // PHONE
//    // ========================================================

//    if (aspect < 0.62) {

//        viewHeight =
//            12.5;


//        layoutPhone();
//    }


//    // ========================================================
//    // TABLET
//    // ========================================================

//    else if (aspect < 1.0) {

//        viewHeight =
//            10;


//        layoutTablet();
//    }


//    // ========================================================
//    // DESKTOP
//    // ========================================================

//    else {

//        viewHeight =
//            8.2;


//        layoutDesktop();
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


//    renderer.setSize(
//        width,
//        height,
//        false
//    );
//}


//// ============================================================
//// DESKTOP
//// ============================================================

//function layoutDesktop() {

//    const temperature =
//        getCard("temperature");

//    const humidity =
//        getCard("humidity");

//    const outdoor =
//        getCard("outdoor");

//    const gas =
//        getCard("gas");

//    const motion =
//        getCard("motion");

//    const security =
//        getCard("security");

//    const station =
//        getCard("station");


//    if (temperature)
//        setCardPosition(
//            temperature,
//            -4.0,
//            1.65,
//            2.0,
//            1
//        );


//    if (humidity)
//        setCardPosition(
//            humidity,
//            4.0,
//            1.65,
//            2.0,
//            1
//        );


//    if (outdoor)
//        setCardPosition(
//            outdoor,
//            -4.0,
//            -0.45,
//            2.0,
//            1
//        );


//    if (gas)
//        setCardPosition(
//            gas,
//            4.0,
//            -0.45,
//            2.0,
//            1
//        );


//    if (security)
//        setCardPosition(
//            security,
//            -1.5,
//            -2.45,
//            2.0,
//            1
//        );


//    if (motion)
//        setCardPosition(
//            motion,
//            1.5,
//            -2.45,
//            2.0,
//            1
//        );


//    if (station)
//        setCardPosition(
//            station,
//            0,
//            3.0,
//            2.0,
//            1
//        );


//    if (notificationButton) {

//        notificationButton.position.set(
//            0,
//            -3.55,
//            2
//        );

//        notificationButton.scale.setScalar(
//            0.95
//        );
//    }


//    if (core) {

//        core.position.set(
//            0,
//            0.05,
//            0
//        );

//        core.scale.setScalar(
//            1
//        );
//    }
//}


//// ============================================================
//// TABLET
//// ============================================================

//function layoutTablet() {

//    const temperature =
//        getCard("temperature");

//    const humidity =
//        getCard("humidity");

//    const outdoor =
//        getCard("outdoor");

//    const gas =
//        getCard("gas");

//    const motion =
//        getCard("motion");

//    const security =
//        getCard("security");

//    const station =
//        getCard("station");


//    if (temperature)
//        setCardPosition(
//            temperature,
//            -3.15,
//            2.15,
//            2.5,
//            0.82
//        );


//    if (humidity)
//        setCardPosition(
//            humidity,
//            3.15,
//            2.15,
//            2.5,
//            0.82
//        );


//    if (outdoor)
//        setCardPosition(
//            outdoor,
//            -3.15,
//            -0.45,
//            2.5,
//            0.82
//        );


//    if (gas)
//        setCardPosition(
//            gas,
//            3.15,
//            -0.45,
//            2.5,
//            0.82
//        );


//    if (security)
//        setCardPosition(
//            security,
//            -1.4,
//            -2.7,
//            2.7,
//            0.82
//        );


//    if (motion)
//        setCardPosition(
//            motion,
//            1.4,
//            -2.7,
//            2.7,
//            0.82
//        );


//    if (station)
//        setCardPosition(
//            station,
//            0,
//            3.55,
//            2.7,
//            0.82
//        );


//    if (notificationButton) {

//        notificationButton.position.set(
//            0,
//            -3.55,
//            2.7
//        );

//        notificationButton.scale.setScalar(
//            0.8
//        );
//    }


//    if (core) {

//        core.position.set(
//            0,
//            0.05,
//            0
//        );

//        core.scale.setScalar(
//            0.82
//        );
//    }
//}


//// ============================================================
//// PHONE
//// ============================================================

//function layoutPhone() {

//    const temperature =
//        getCard("temperature");

//    const humidity =
//        getCard("humidity");

//    const outdoor =
//        getCard("outdoor");

//    const gas =
//        getCard("gas");

//    const motion =
//        getCard("motion");

//    const security =
//        getCard("security");

//    const station =
//        getCard("station");


//    // На телефоне делаем
//    // компактную сетку.
//    //
//    // Все карточки находятся
//    // ПЕРЕД центральным core,
//    // поэтому ничего не пропадает.


//    if (temperature)
//        setCardPosition(
//            temperature,
//            -1.55,
//            3.55,
//            4,
//            0.54
//        );


//    if (humidity)
//        setCardPosition(
//            humidity,
//            1.55,
//            3.55,
//            4,
//            0.54
//        );


//    if (outdoor)
//        setCardPosition(
//            outdoor,
//            -1.55,
//            -2.85,
//            4,
//            0.54
//        );


//    if (gas)
//        setCardPosition(
//            gas,
//            1.55,
//            -2.85,
//            4,
//            0.54
//        );


//    if (security)
//        setCardPosition(
//            security,
//            -1.45,
//            -3.95,
//            4.2,
//            0.67
//        );


//    if (motion)
//        setCardPosition(
//            motion,
//            1.45,
//            -3.95,
//            4.2,
//            0.67
//        );


//    if (station)
//        setCardPosition(
//            station,
//            0,
//            4.55,
//            4.2,
//            0.67
//        );


//    if (notificationButton) {

//        notificationButton.position.set(
//            0,
//            -4.85,
//            4.2
//        );

//        notificationButton.scale.setScalar(
//            0.65
//        );
//    }


//    if (core) {

//        core.position.set(
//            0,
//            0.15,
//            0
//        );

//        core.scale.setScalar(
//            0.67
//        );
//    }
//}


//// ============================================================
//// POSITION
//// ============================================================

//function setCardPosition(
//    card,
//    x,
//    y,
//    z,
//    scale
//) {

//    card.position.set(
//        x,
//        y,
//        z
//    );


//    card.scale.setScalar(
//        scale
//    );


//    card.userData.baseX =
//        x;

//    card.userData.baseY =
//        y;

//    card.userData.baseZ =
//        z;
//}


//// ============================================================
//// POINTER
//// ============================================================

//function onPointerMove(event) {

//    if (!canvas ||
//        !camera)
//        return;


//    const rect =
//        canvas.getBoundingClientRect();


//    mouse.x =
//        (
//            (event.clientX -
//                rect.left) /
//            rect.width
//        ) * 2 - 1;


//    mouse.y =
//        -(
//            (event.clientY -
//                rect.top) /
//            rect.height
//        ) * 2 + 1;


//    raycaster.setFromCamera(
//        mouse,
//        camera
//    );


//    const objects = [];


//    for (
//        const card of cards
//    ) {

//        if (
//            card.children.length
//        ) {

//            objects.push(
//                card.children[0]
//            );
//        }
//    }


//    if (notificationButton) {

//        objects.push(
//            notificationButton.children[0]
//        );
//    }


//    const hits =
//        raycaster.intersectObjects(
//            objects,
//            false
//        );


//    canvas.style.cursor =
//        hits.length
//            ? "pointer"
//            : "default";
//}


//// ============================================================
//// CLICK
//// ============================================================

//function onPointerDown(event) {

//    if (!canvas ||
//        !camera)
//        return;


//    const rect =
//        canvas.getBoundingClientRect();


//    mouse.x =
//        (
//            (event.clientX -
//                rect.left) /
//            rect.width
//        ) * 2 - 1;


//    mouse.y =
//        -(
//            (event.clientY -
//                rect.top) /
//            rect.height
//        ) * 2 + 1;


//    raycaster.setFromCamera(
//        mouse,
//        camera
//    );


//    const objects = [];


//    for (
//        const card of cards
//    ) {

//        objects.push(
//            card.children[0]
//        );
//    }


//    if (notificationButton) {

//        objects.push(
//            notificationButton.children[0]
//        );
//    }


//    const hits =
//        raycaster.intersectObjects(
//            objects,
//            false
//        );


//    if (!hits.length)
//        return;


//    const hit =
//        hits[0].object;


//    if (
//        hit.userData.notification
//    ) {

//        window.location.assign(
//            "/notifications"
//        );

//        return;
//    }
//}


//// ============================================================
//// ANIMATION
//// ============================================================

//function animate() {

//    animationFrame =
//        requestAnimationFrame(
//            animate
//        );


//    if (!scene ||
//        !renderer ||
//        !camera)
//        return;


//    const time =
//        clock.getElapsedTime();


//    // ========================================================
//    // CORE
//    // ========================================================

//    if (core) {

//        core.rotation.y =
//            Math.sin(
//                time * 0.25
//            ) * 0.08;


//        core.position.y =
//            core.userData.baseY +
//            Math.sin(
//                time * 0.8
//            ) * 0.035;
//    }


//    if (coreRing) {

//        coreRing.rotation.z +=
//            0.0025;
//    }


//    if (coreGlow) {

//        coreGlow.material.opacity =
//            0.025 +
//            Math.sin(
//                time * 1.5
//            ) * 0.008;
//    }


//    // ========================================================
//    // CARDS
//    // ========================================================

//    for (
//        const card of cards
//    ) {

//        const baseY =
//            card.userData.baseY ??
//            card.position.y;


//        card.position.y =
//            baseY +
//            Math.sin(
//                time * 0.8 +
//                card.position.x
//            ) * 0.025;
//    }


//    // ========================================================
//    // NOTIFICATIONS
//    // ========================================================

//    if (notificationButton) {

//        notificationButton.position.y +=
//            Math.sin(
//                time * 1.1
//            ) * 0.001;
//    }


//    // ========================================================
//    // CONTROLS
//    // ========================================================

//    if (controls)
//        controls.update();


//    renderer.render(
//        scene,
//        camera
//    );
//}


//// ============================================================
//// DISPOSE
//// ============================================================

//function dispose() {

//    if (animationFrame) {

//        cancelAnimationFrame(
//            animationFrame
//        );

//        animationFrame = null;
//    }


//    if (resizeObserver) {

//        resizeObserver.disconnect();

//        resizeObserver = null;
//    }


//    if (canvas) {

//        canvas.removeEventListener(
//            "pointermove",
//            onPointerMove
//        );

//        canvas.removeEventListener(
//            "pointerdown",
//            onPointerDown
//        );
//    }


//    if (controls) {

//        controls.dispose();

//        controls = null;
//    }


//    if (renderer) {

//        renderer.dispose();

//        renderer = null;
//    }


//    scene = null;

//    camera = null;

//    canvas = null;

//    cards = [];

//    core = null;

//    coreRing = null;

//    coreGlow = null;

//    notificationButton = null;
//}


//// ============================================================
//// PUBLIC
//// ============================================================

//window.myHome3D = {

//    init,

//    updateState,

//    dispose
//};

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let canvas = null;
let clock = null;

let core = null;
let cards = [];
let notification = null;

function makeText(text, fontSize, width, height) {
    const c = document.createElement("canvas");

    c.width = 1024;
    c.height = 256;

    const ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    ctx.font = `700 ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";

    ctx.fillText(text, 512, 128);

    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
    });

    const sprite = new THREE.Sprite(material);

    sprite.scale.set(width, height, 1);

    return sprite;
}

function makeCard(width, height) {
    const group = new THREE.Group();

    const geometry = new THREE.BoxGeometry(
        width,
        height,
        0.10
    );

    const material = new THREE.MeshBasicMaterial({
        color: 0x07111f,
        transparent: true,
        opacity: 0.94
    });

    const mesh = new THREE.Mesh(
        geometry,
        material
    );

    group.add(mesh);

    const edgeGeometry =
        new THREE.EdgesGeometry(geometry);

    const edgeMaterial =
        new THREE.LineBasicMaterial({
            color: 0x1677ff,
            transparent: true,
            opacity: 0.9
        });

    const edges =
        new THREE.LineSegments(
            edgeGeometry,
            edgeMaterial
        );

    group.add(edges);

    return group;
}

function createDataCard(
    title,
    value,
    subtitle
) {
    const card =
        makeCard(3.35, 1.75);

    const titleText =
        makeText(
            title,
            46,
            1.90,
            0.30
        );

    titleText.position.set(
        0,
        0.50,
        0.12
    );

    card.add(titleText);

    const valueText =
        makeText(
            value,
            92,
            2.25,
            0.53
        );

    valueText.position.set(
        0,
        -0.02,
        0.12
    );

    card.add(valueText);

    const subtitleText =
        makeText(
            subtitle,
            32,
            1.55,
            0.21
        );

    subtitleText.position.set(
        0,
        -0.55,
        0.12
    );

    card.add(subtitleText);

    card.userData = {
        valueText
    };

    scene.add(card);

    cards.push(card);

    return card;
}

function createStatusCard(
    title,
    value
) {
    const card =
        makeCard(3.35, 1.05);

    const titleText =
        makeText(
            title,
            39,
            1.45,
            0.25
        );

    titleText.position.set(
        -0.70,
        0,
        0.12
    );

    card.add(titleText);

    const valueText =
        makeText(
            value,
            43,
            1.35,
            0.27
        );

    valueText.position.set(
        0.75,
        0,
        0.12
    );

    card.add(valueText);

    card.userData = {
        valueText
    };

    scene.add(card);

    cards.push(card);

    return card;
}

function createCore() {

    const group =
        new THREE.Group();

    const sphere =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.78,
                48,
                48
            ),
            new THREE.MeshBasicMaterial({
                color: 0x1268d9,
                transparent: true,
                opacity: 0.95
            })
        );

    group.add(sphere);

    const ring1 =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                1.05,
                0.025,
                16,
                80
            ),
            new THREE.MeshBasicMaterial({
                color: 0x1686ff
            })
        );

    ring1.rotation.x =
        Math.PI / 2;

    group.add(ring1);

    const ring2 =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                1.05,
                0.025,
                16,
                80
            ),
            new THREE.MeshBasicMaterial({
                color: 0x65c8ff
            })
        );

    ring2.rotation.y =
        Math.PI / 2;

    group.add(ring2);

    group.userData.baseY = 0;

    scene.add(group);

    core = group;
}

function createNotification() {

    notification =
        makeText(
            "● Система работает нормально",
            40,
            3.4,
            0.28
        );

    scene.add(notification);
}

function changeText(sprite, text, fontSize = 92) {

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

    if (sprite.material.map) {
        sprite.material.map.dispose();
    }

    sprite.material.map =
        texture;

    sprite.material.needsUpdate =
        true;
}

function setupLayout() {

    const width =
        window.innerWidth;

    const mobile =
        width <= 700;

    const tablet =
        width > 700 &&
        width <= 1100;

    /*
     * КАРТОЧКИ:
     *
     *        STATION
     *
     * TEMP       HUMIDITY
     *
     *           CORE
     *
     * OUTDOOR     GAS
     *
     * SECURITY   MOTION
     *
     *       NOTIFICATION
     */

    if (mobile) {

        camera.position.set(
            0,
            0,
            11.8
        );

        cards[0].position.set(
            -1.72,
            2.75,
            3
        );

        cards[1].position.set(
            1.72,
            2.75,
            3
        );

        cards[2].position.set(
            -1.72,
            0.65,
            3
        );

        cards[3].position.set(
            1.72,
            0.65,
            3
        );

        cards[4].position.set(
            -1.72,
            -2.25,
            3
        );

        cards[5].position.set(
            1.72,
            -2.25,
            3
        );

        notification.position.set(
            0,
            -3.65,
            3
        );

        core.scale.setScalar(
            0.80
        );

    }
    else if (tablet) {

        camera.position.set(
            0,
            0,
            10
        );

        cards[0].position.set(
            -2.35,
            2.75,
            3
        );

        cards[1].position.set(
            2.35,
            2.75,
            3
        );

        cards[2].position.set(
            -2.35,
            0.55,
            3
        );

        cards[3].position.set(
            2.35,
            0.55,
            3
        );

        cards[4].position.set(
            -2.35,
            -2.15,
            3
        );

        cards[5].position.set(
            2.35,
            -2.15,
            3
        );

        notification.position.set(
            0,
            -3.55,
            3
        );

        core.scale.setScalar(
            0.82
        );

    }
    else {

        camera.position.set(
            0,
            0,
            9
        );

        cards[0].position.set(
            -2.55,
            2.55,
            3
        );

        cards[1].position.set(
            2.55,
            2.55,
            3
        );

        cards[2].position.set(
            -2.55,
            0.25,
            3
        );

        cards[3].position.set(
            2.55,
            0.25,
            3
        );

        cards[4].position.set(
            -2.55,
            -2.35,
            3
        );

        cards[5].position.set(
            2.55,
            -2.35,
            3
        );

        notification.position.set(
            0,
            -3.65,
            3
        );

        core.scale.setScalar(
            0.90
        );
    }

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

function animate() {

    animationFrame =
        requestAnimationFrame(
            animate
        );

    const time =
        clock.getElapsedTime();

    if (core) {

        core.position.y =
            Math.sin(
                time * 0.8
            ) * 0.06;

        core.rotation.y =
            time * 0.25;
    }

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

function initScene() {

    scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(
            0x050910
        );

    camera =
        new THREE.PerspectiveCamera(
            42,
            1,
            0.1,
            100
        );

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

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;

    controls =
        new OrbitControls(
            camera,
            renderer.domElement
        );

    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;

    controls.minPolarAngle =
        Math.PI / 2;

    controls.maxPolarAngle =
        Math.PI / 2;

    createDataCard(
        "Температура",
        "0°",
        "В доме"
    );

    createDataCard(
        "Влажность",
        "0%",
        "В доме"
    );

    createDataCard(
        "На улице",
        "0°",
        "Температура"
    );

    createDataCard(
        "Газ",
        "0",
        "MQ-135"
    );

    createStatusCard(
        "ОХРАНА",
        "OFF"
    );

    createStatusCard(
        "ДВИЖЕНИЕ",
        "Нет"
    );

    createCore();

    createNotification();

    setupLayout();

    clock =
        new THREE.Clock();

    window.addEventListener(
        "resize",
        resize
    );

    resize();

    animate();
}

window.myHome3D = {

    init(canvasId) {

        if (scene)
            return;

        canvas =
            document.getElementById(
                canvasId
            );

        if (!canvas)
            return;

        initScene();
    },

    updateState(data) {

        if (cards.length < 6)
            return;

        changeText(
            cards[0].userData.valueText,
            `${Number(
                data.IndoorTemperature
            ).toFixed(1)}°`
        );

        changeText(
            cards[1].userData.valueText,
            `${data.Humidity}%`
        );

        changeText(
            cards[2].userData.valueText,
            `${Number(
                data.OutdoorTemperature
            ).toFixed(1)}°`
        );

        changeText(
            cards[3].userData.valueText,
            `${data.GasValue}`
        );

        changeText(
            cards[4].userData.valueText,
            data.SecurityEnabled
                ? "ON"
                : "OFF",
            43
        );

        changeText(
            cards[5].userData.valueText,
            data.MotionDetected
                ? "Да"
                : "Нет",
            43
        );

        if (notification) {

            let text =
                "● Система работает нормально";

            if (data.GasDetected) {
                text =
                    "● ВНИМАНИЕ: обнаружен газ";
            }
            else if (
                data.MotionDetected &&
                data.SecurityEnabled
            ) {
                text =
                    "● Обнаружено движение";
            }

            changeText(
                notification,
                text,
                40
            );
        }
    }
};