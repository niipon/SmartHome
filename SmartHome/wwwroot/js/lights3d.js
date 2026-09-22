import * as THREE from "three";

let scene;
let camera;
let renderer;
let lampGroup;

let bulb;
let filament;
let socket;
let glow;

let targetRotationX = 0;
let targetRotationY = 0;

let rotationX = 0;
let rotationY = 0;

let pointerDown = false;
let lastX = 0;
let lastY = 0;


/* =========================
   СОЗДАНИЕ ЛАМПОЧКИ
========================= */

function createBulb() {

    lampGroup = new THREE.Group();

    /*
     * КОЛБА
     */

    const bulbGeometry =
        new THREE.SphereGeometry(
            1.35,
            48,
            48
        );

    const bulbMaterial =
        new THREE.MeshPhysicalMaterial({

            color: 0xffc04a,

            emissive: 0xff8c00,

            emissiveIntensity: 1.5,

            transparent: true,

            opacity: 0.9,

            roughness: 0.15,

            metalness: 0.05
        });

    bulb =
        new THREE.Mesh(
            bulbGeometry,
            bulbMaterial
        );

    bulb.scale.y = 1.15;

    lampGroup.add(bulb);


    /*
     * СПИРАЛЬ
     */

    filament =
        new THREE.Group();

    const filamentMaterial =
        new THREE.MeshStandardMaterial({

            color: 0xffffd0,

            emissive: 0xffa800,

            emissiveIntensity: 5
        });

    const points = [];

    for (let i = 0; i <= 100; i++) {

        const t = i / 100;

        const y =
            -0.65 + t * 1.45;

        const radius =
            0.42 - t * 0.12;

        const angle =
            t * Math.PI * 10;

        const x =
            Math.cos(angle) * radius;

        const z =
            Math.sin(angle) * radius;

        points.push(
            new THREE.Vector3(
                x,
                y,
                z
            )
        );
    }

    const curve =
        new THREE.CatmullRomCurve3(
            points
        );

    const geometry =
        new THREE.TubeGeometry(
            curve,
            100,
            0.045,
            10,
            false
        );

    const mesh =
        new THREE.Mesh(
            geometry,
            filamentMaterial
        );

    filament.add(mesh);

    lampGroup.add(filament);


    /*
     * ЦОКОЛЬ
     */

    socket =
        new THREE.Group();

    const socketMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x777777,

            metalness: 0.9,

            roughness: 0.25
        });

    const socketGeometry =
        new THREE.CylinderGeometry(
            0.7,
            0.8,
            0.7,
            32
        );

    const socketBody =
        new THREE.Mesh(
            socketGeometry,
            socketMaterial
        );

    socketBody.position.y = -1.55;

    socket.add(socketBody);


    /*
     * РЕЗЬБА
     */

    for (let i = 0; i < 5; i++) {

        const ringGeometry =
            new THREE.TorusGeometry(
                0.76,
                0.045,
                12,
                32
            );

        const ring =
            new THREE.Mesh(
                ringGeometry,
                socketMaterial
            );

        ring.position.y =
            -1.28 - i * 0.11;

        socket.add(ring);
    }

    lampGroup.add(socket);


    /*
     * СВЕЧЕНИЕ
     */

    const glowGeometry =
        new THREE.SphereGeometry(
            1.75,
            32,
            32
        );

    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color: 0xffa928,

            transparent: true,

            opacity: 0.14,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });

    glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );

    lampGroup.add(glow);


    /*
     * СВЕТ
     */

    const pointLight =
        new THREE.PointLight(
            0xffb52e,
            8,
            15
        );

    pointLight.position.set(
        0,
        0,
        0
    );

    lampGroup.add(pointLight);


    scene.add(lampGroup);
}


/* =========================
   ФОН
========================= */

function createBackground() {

    const geometry =
        new THREE.BufferGeometry();

    const positions = [];

    for (let i = 0; i < 700; i++) {

        positions.push(
            (Math.random() - 0.5) * 35,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 20
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

            color: 0xd59b43,

            size: 0.025,

            transparent: true,

            opacity: 0.55
        });

    const particles =
        new THREE.Points(
            geometry,
            material
        );

    scene.add(particles);
}


/* =========================
   RESIZE
========================= */

function resize() {

    const container =
        document.getElementById(
            "lights3d"
        );

    if (!container || !camera || !renderer)
        return;

    const width =
        container.clientWidth;

    const height =
        container.clientHeight;

    if (height === 0)
        return;

    camera.aspect =
        width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
        width,
        height
    );
}


/* =========================
   ВРАЩЕНИЕ
========================= */

function animate() {

    requestAnimationFrame(animate);

    if (!lampGroup)
        return;


    /*
     * Автоматическое вращение
     */

    if (!pointerDown) {

        targetRotationY += 0.003;

        targetRotationX =
            Math.sin(
                performance.now() * 0.0007
            ) * 0.08;
    }


    rotationY +=
        (targetRotationY - rotationY) * 0.06;

    rotationX +=
        (targetRotationX - rotationX) * 0.06;


    lampGroup.rotation.y =
        rotationY;

    lampGroup.rotation.x =
        rotationX;


    /*
     * Плавное движение
     */

    lampGroup.position.y =
        Math.sin(
            performance.now() * 0.001
        ) * 0.1;


    /*
     * Пульсация свечения
     */

    const pulse =
        1 +
        Math.sin(
            performance.now() * 0.003
        ) * 0.08;

    glow.scale.set(
        pulse,
        pulse,
        pulse
    );


    renderer.render(
        scene,
        camera
    );
}


/* =========================
   MOUSE
========================= */

function pointerStart(event) {

    pointerDown = true;

    lastX = event.clientX;
    lastY = event.clientY;
}

function pointerMove(event) {

    if (!pointerDown)
        return;

    const dx =
        event.clientX - lastX;

    const dy =
        event.clientY - lastY;

    targetRotationY +=
        dx * 0.008;

    targetRotationX +=
        dy * 0.005;

    lastX = event.clientX;
    lastY = event.clientY;
}

function pointerEnd() {

    pointerDown = false;
}


/* =========================
   TOUCH
========================= */

function touchStart(event) {

    if (!event.touches.length)
        return;

    pointerDown = true;

    lastX =
        event.touches[0].clientX;

    lastY =
        event.touches[0].clientY;
}

function touchMove(event) {

    if (!pointerDown)
        return;

    if (!event.touches.length)
        return;

    const x =
        event.touches[0].clientX;

    const y =
        event.touches[0].clientY;

    const dx =
        x - lastX;

    const dy =
        y - lastY;

    targetRotationY +=
        dx * 0.008;

    targetRotationX +=
        dy * 0.005;

    lastX = x;
    lastY = y;
}

function touchEnd() {

    pointerDown = false;
}


/* =========================
   MY HOME LIGHTS 3D
========================= */

window.myHomeLights3d = {

    init() {

        const container =
            document.getElementById(
                "lights3d"
            );

        if (!container) {

            console.error(
                "MY HOME LIGHTS: #lights3d NOT FOUND"
            );

            return;
        }


        console.log(
            "=== MY HOME LIGHTS 3D LOADED ==="
        );


        /*
         * SCENE
         */

        scene =
            new THREE.Scene();

        scene.background =
            new THREE.Color(
                0x0d0b06
            );


        /*
         * CAMERA
         */

        camera =
            new THREE.PerspectiveCamera(
                45,
                1,
                0.1,
                100
            );

        camera.position.set(
            0,
            0,
            7
        );


        /*
         * RENDERER
         */

        renderer =
            new THREE.WebGLRenderer({

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
            container.clientWidth,
            container.clientHeight
        );

        renderer.outputColorSpace =
            THREE.SRGBColorSpace;


        container.appendChild(
            renderer.domElement
        );


        /*
         * ОСВЕЩЕНИЕ СЦЕНЫ
         */

        const ambient =
            new THREE.AmbientLight(
                0xffdca0,
                1.5
            );

        scene.add(ambient);


        const mainLight =
            new THREE.PointLight(
                0xffa928,
                5,
                15
            );

        mainLight.position.set(
            3,
            4,
            5
        );

        scene.add(mainLight);


        const blueLight =
            new THREE.PointLight(
                0x5c6cff,
                1.5,
                15
            );

        blueLight.position.set(
            -4,
            1,
            -4
        );

        scene.add(blueLight);


        /*
         * СОЗДАЁМ ЛАМПОЧКУ
         */

        createBulb();

        createBackground();


        /*
         * MOUSE
         */

        container.addEventListener(
            "mousedown",
            pointerStart
        );

        window.addEventListener(
            "mousemove",
            pointerMove
        );

        window.addEventListener(
            "mouseup",
            pointerEnd
        );


        /*
         * TOUCH
         */

        container.addEventListener(
            "touchstart",
            touchStart,
            { passive: true }
        );

        container.addEventListener(
            "touchmove",
            touchMove,
            { passive: true }
        );

        container.addEventListener(
            "touchend",
            touchEnd
        );


        window.addEventListener(
            "resize",
            resize
        );


        resize();

        animate();
    },


    setState(count) {

        if (!bulb || !glow)
            return;

        if (count > 0) {

            bulb.material.emissiveIntensity =
                1.5;

            glow.material.opacity =
                0.14;

        } else {

            bulb.material.emissiveIntensity =
                0.25;

            glow.material.opacity =
                0.03;
        }
    }
};