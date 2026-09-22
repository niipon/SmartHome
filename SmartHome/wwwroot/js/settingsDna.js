

//import * as THREE from "three";

//console.log("=== MY HOME SETTINGS DNA MODULE LOADED ===");

//window.myHomeSettingsDna = {

//    initialized: false,

//    init: function () {

//        console.log("=== SETTINGS DNA INIT ===");

//        if (this.initialized) {
//            console.log("DNA already initialized");
//            return;
//        }

//        const container =
//            document.getElementById("settingsDna");

//        if (!container) {
//            console.error(
//                "MY HOME DNA: #settingsDna not found"
//            );
//            return;
//        }

//        console.log(
//            "MY HOME DNA: container found",
//            container.clientWidth,
//            container.clientHeight
//        );


//        /*
//         * =========================================
//         * CLEAN
//         * =========================================
//         */

//        container.innerHTML = "";


//        /*
//         * =========================================
//         * SCENE
//         * =========================================
//         */

//        const scene =
//            new THREE.Scene();

//        scene.background =
//            new THREE.Color(0x080914);


//        /*
//         * =========================================
//         * CAMERA
//         * =========================================
//         */

//        const camera =
//            new THREE.PerspectiveCamera(
//                42,
//                1,
//                0.1,
//                100
//            );

//        camera.position.set(
//            0,
//            0,
//            19
//        );

//        camera.lookAt(
//            0,
//            0,
//            0
//        );


//        /*
//         * =========================================
//         * RENDERER
//         * =========================================
//         */

//        const renderer =
//            new THREE.WebGLRenderer({

//                antialias: true,

//                alpha: false,

//                powerPreference:
//                    "high-performance"
//            });

//        renderer.setPixelRatio(
//            Math.min(
//                window.devicePixelRatio || 1,
//                2
//            )
//        );

//        renderer.setClearColor(
//            0x080914,
//            1
//        );

//        renderer.outputColorSpace =
//            THREE.SRGBColorSpace;

//        container.appendChild(
//            renderer.domElement
//        );


//        /*
//         * =========================================
//         * LIGHTS
//         * =========================================
//         */

//        const ambient =
//            new THREE.AmbientLight(
//                0xffffff,
//                2.4
//            );

//        scene.add(
//            ambient
//        );


//        const purpleLight =
//            new THREE.PointLight(
//                0x9b5cff,
//                20,
//                45
//            );

//        purpleLight.position.set(
//            5,
//            6,
//            8
//        );

//        scene.add(
//            purpleLight
//        );


//        const blueLight =
//            new THREE.PointLight(
//                0x268cff,
//                16,
//                45
//            );

//        blueLight.position.set(
//            -5,
//            -5,
//            8
//        );

//        scene.add(
//            blueLight
//        );


//        const whiteLight =
//            new THREE.PointLight(
//                0xffffff,
//                4,
//                30
//            );

//        whiteLight.position.set(
//            0,
//            8,
//            5
//        );

//        scene.add(
//            whiteLight
//        );


//        /*
//         * =========================================
//         * DNA
//         * =========================================
//         */

//        const dna =
//            new THREE.Group();

//        dna.scale.set(
//            0.72,
//            0.72,
//            0.72
//        );

//        scene.add(
//            dna
//        );


//        /*
//         * =========================================
//         * DNA PARAMETERS
//         * =========================================
//         */

//        const radius = 2.7;

//        const height = 15;

//        const turns = 3.7;

//        const segments = 220;


//        /*
//         * =========================================
//         * HELIX POINTS
//         * =========================================
//         */

//        const leftPoints = [];

//        const rightPoints = [];


//        for (
//            let i = 0;
//            i <= segments;
//            i++
//        ) {

//            const t =
//                i / segments;

//            const y =
//                -height / 2 +
//                t * height;

//            const angle =
//                t *
//                Math.PI *
//                2 *
//                turns;


//            leftPoints.push(
//                new THREE.Vector3(

//                    Math.cos(angle) *
//                    radius,

//                    y,

//                    Math.sin(angle) *
//                    radius
//                )
//            );


//            rightPoints.push(
//                new THREE.Vector3(

//                    Math.cos(
//                        angle + Math.PI
//                    ) *
//                    radius,

//                    y,

//                    Math.sin(
//                        angle + Math.PI
//                    ) *
//                    radius
//                )
//            );
//        }


//        /*
//         * =========================================
//         * MATERIALS
//         * =========================================
//         */

//        const purpleMaterial =
//            new THREE.MeshStandardMaterial({

//                color: 0xb66cff,

//                emissive: 0x641cff,

//                emissiveIntensity: 1.8,

//                metalness: 0.3,

//                roughness: 0.2
//            });


//        const blueMaterial =
//            new THREE.MeshStandardMaterial({

//                color: 0x42a8ff,

//                emissive: 0x086dff,

//                emissiveIntensity: 1.8,

//                metalness: 0.3,

//                roughness: 0.2
//            });


//        const connectorMaterial =
//            new THREE.MeshStandardMaterial({

//                color: 0xd39aff,

//                emissive: 0x7028ff,

//                emissiveIntensity: 1.4,

//                metalness: 0.3,

//                roughness: 0.2
//            });


//        /*
//         * =========================================
//         * MAIN HELIX
//         * =========================================
//         */

//        const leftCurve =
//            new THREE.CatmullRomCurve3(
//                leftPoints
//            );

//        const rightCurve =
//            new THREE.CatmullRomCurve3(
//                rightPoints
//            );


//        const leftTube =
//            new THREE.Mesh(

//                new THREE.TubeGeometry(
//                    leftCurve,
//                    700,
//                    0.13,
//                    14,
//                    false
//                ),

//                purpleMaterial
//            );


//        const rightTube =
//            new THREE.Mesh(

//                new THREE.TubeGeometry(
//                    rightCurve,
//                    700,
//                    0.13,
//                    14,
//                    false
//                ),

//                blueMaterial
//            );


//        dna.add(
//            leftTube
//        );

//        dna.add(
//            rightTube
//        );


//        /*
//         * =========================================
//         * DNA NODES
//         * =========================================
//         */

//        const nodeGeometry =
//            new THREE.SphereGeometry(
//                0.23,
//                20,
//                20
//            );


//        for (
//            let i = 0;
//            i <= segments;
//            i += 5
//        ) {

//            const leftNode =
//                new THREE.Mesh(
//                    nodeGeometry,
//                    purpleMaterial
//                );

//            leftNode.position.copy(
//                leftPoints[i]
//            );

//            dna.add(
//                leftNode
//            );


//            const rightNode =
//                new THREE.Mesh(
//                    nodeGeometry,
//                    blueMaterial
//                );

//            rightNode.position.copy(
//                rightPoints[i]
//            );

//            dna.add(
//                rightNode
//            );
//        }


//        /*
//         * =========================================
//         * DNA CONNECTIONS
//         * =========================================
//         */

//        for (
//            let i = 0;
//            i <= segments;
//            i += 7
//        ) {

//            const a =
//                leftPoints[i];

//            const b =
//                rightPoints[i];


//            const direction =
//                new THREE.Vector3()
//                    .subVectors(
//                        b,
//                        a
//                    );


//            const length =
//                direction.length();


//            const geometry =
//                new THREE.CylinderGeometry(
//                    0.06,
//                    0.06,
//                    length,
//                    10
//                );


//            const connector =
//                new THREE.Mesh(
//                    geometry,
//                    connectorMaterial
//                );


//            connector.position
//                .copy(
//                    new THREE.Vector3()
//                        .addVectors(
//                            a,
//                            b
//                        )
//                        .multiplyScalar(
//                            0.5
//                        )
//                );


//            connector.quaternion
//                .setFromUnitVectors(

//                    new THREE.Vector3(
//                        0,
//                        1,
//                        0
//                    ),

//                    direction.normalize()
//                );


//            dna.add(
//                connector
//            );
//        }


//        /*
//         * =========================================
//         * INNER PARTICLES
//         * =========================================
//         */

//        const innerGeometry =
//            new THREE.SphereGeometry(
//                0.06,
//                8,
//                8
//            );


//        const innerMaterial =
//            new THREE.MeshBasicMaterial({
//                color: 0xe0c4ff
//            });


//        for (
//            let i = 0;
//            i < 120;
//            i++
//        ) {

//            const t =
//                Math.random();

//            const y =
//                -height / 2 +
//                t * height;

//            const angle =
//                t *
//                Math.PI *
//                2 *
//                turns;


//            const distance =
//                Math.random() * 1.8;


//            const particle =
//                new THREE.Mesh(
//                    innerGeometry,
//                    innerMaterial
//                );


//            particle.position.set(

//                Math.cos(angle) *
//                distance,

//                y,

//                Math.sin(angle) *
//                distance
//            );


//            dna.add(
//                particle
//            );
//        }


//        /*
//         * =========================================
//         * BACKGROUND PARTICLES
//         * =========================================
//         */

//        const particleCount =
//            500;


//        const positions =
//            new Float32Array(
//                particleCount * 3
//            );


//        for (
//            let i = 0;
//            i < particleCount;
//            i++
//        ) {

//            positions[i * 3] =
//                (Math.random() - 0.5) *
//                28;

//            positions[i * 3 + 1] =
//                (Math.random() - 0.5) *
//                22;

//            positions[i * 3 + 2] =
//                (Math.random() - 0.5) *
//                16;
//        }


//        const particleGeometry =
//            new THREE.BufferGeometry();


//        particleGeometry.setAttribute(

//            "position",

//            new THREE.BufferAttribute(
//                positions,
//                3
//            )
//        );


//        const particleMaterial =
//            new THREE.PointsMaterial({

//                color: 0x9270ff,

//                size: 0.035,

//                transparent: true,

//                opacity: 0.7,

//                depthWrite: false
//            });


//        const particles =
//            new THREE.Points(
//                particleGeometry,
//                particleMaterial
//            );


//        scene.add(
//            particles
//        );


//        /*
//         * =========================================
//         * DRAG
//         * =========================================
//         */

//        let dragging = false;

//        let previousX = 0;

//        let previousY = 0;


//        container.addEventListener(
//            "pointerdown",
//            event => {

//                dragging = true;

//                previousX =
//                    event.clientX;

//                previousY =
//                    event.clientY;

//                container.setPointerCapture(
//                    event.pointerId
//                );
//            }
//        );


//        container.addEventListener(
//            "pointermove",
//            event => {

//                if (!dragging)
//                    return;


//                const dx =
//                    event.clientX -
//                    previousX;

//                const dy =
//                    event.clientY -
//                    previousY;


//                dna.rotation.y +=
//                    dx * 0.008;


//                dna.rotation.x +=
//                    dy * 0.004;


//                dna.rotation.x =
//                    Math.max(
//                        -1.1,
//                        Math.min(
//                            1.1,
//                            dna.rotation.x
//                        )
//                    );


//                previousX =
//                    event.clientX;

//                previousY =
//                    event.clientY;
//            }
//        );


//        function stopDrag() {
//            dragging = false;
//        }


//        container.addEventListener(
//            "pointerup",
//            stopDrag
//        );

//        container.addEventListener(
//            "pointercancel",
//            stopDrag
//        );


//        /*
//         * =========================================
//         * RESIZE
//         * =========================================
//         */

//        function resize() {

//            const width =
//                container.clientWidth ||
//                window.innerWidth;

//            const height =
//                container.clientHeight ||
//                window.innerHeight;


//            renderer.setSize(
//                width,
//                height,
//                false
//            );


//            camera.aspect =
//                width / height;


//            camera.updateProjectionMatrix();
//        }


//        resize();

//        setTimeout(
//            resize,
//            100
//        );

//        setTimeout(
//            resize,
//            500
//        );


//        window.addEventListener(
//            "resize",
//            resize
//        );


//        /*
//         * =========================================
//         * ANIMATION
//         * =========================================
//         */

//        const clock =
//            new THREE.Clock();


//        function animate() {

//            requestAnimationFrame(
//                animate
//            );


//            const time =
//                clock.getElapsedTime();


//            if (!dragging) {

//                dna.rotation.y +=
//                    0.0025;
//            }


//            dna.position.y =
//                Math.sin(
//                    time * 0.7
//                ) * 0.12;


//            particles.rotation.y =
//                time * 0.008;


//            renderer.render(
//                scene,
//                camera
//            );
//        }


//        animate();


//        /*
//         * =========================================
//         * DONE
//         * =========================================
//         */

//        this.initialized = true;

//        console.log(
//            "=== MY HOME 3D DNA INITIALIZED ==="
//        );
//    }
//};

////console.log("=== MY HOME SETTINGS JS LOADED ===");
////console.log("THREE =", typeof THREE);

////window.myHomeSettingsDna = {

////    init: function () {

////        console.log("=== DNA INIT START ===");

////        const container =
////            document.getElementById("settingsDna");

////        console.log(
////            "settingsDna =",
////            container
////        );

////        if (!container) {

////            console.error(
////                "settingsDna container not found"
////            );

////            return;
////        }

////        console.log(
////            "size =",
////            container.clientWidth,
////            container.clientHeight
////        );

////        container.innerHTML = "";

////        // =========================================
////        // SCENE
////        // =========================================

////        const scene =
////            new THREE.Scene();

////        scene.background =
////            new THREE.Color(0x080914);

////        // =========================================
////        // CAMERA
////        // =========================================

////        const camera =
////            new THREE.PerspectiveCamera(
////                45,
////                1,
////                0.1,
////                100
////            );

////        camera.position.set(
////            0,
////            0,
////            18
////        );

////        camera.lookAt(
////            0,
////            0,
////            0
////        );

////        // =========================================
////        // RENDERER
////        // =========================================

////        const renderer =
////            new THREE.WebGLRenderer({
////                antialias: true,
////                alpha: false
////            });

////        renderer.setPixelRatio(
////            Math.min(
////                window.devicePixelRatio,
////                2
////            )
////        );

////        renderer.setClearColor(
////            0x080914,
////            1
////        );

////        renderer.outputColorSpace =
////            THREE.SRGBColorSpace;

////        container.appendChild(
////            renderer.domElement
////        );

////        // =========================================
////        // LIGHTS
////        // =========================================

////        const ambientLight =
////            new THREE.AmbientLight(
////                0xffffff,
////                2.5
////            );

////        scene.add(
////            ambientLight
////        );


////        const purpleLight =
////            new THREE.PointLight(
////                0x9b5cff,
////                15,
////                40
////            );

////        purpleLight.position.set(
////            5,
////            5,
////            8
////        );

////        scene.add(
////            purpleLight
////        );


////        const blueLight =
////            new THREE.PointLight(
////                0x2196ff,
////                12,
////                40
////            );

////        blueLight.position.set(
////            -5,
////            -4,
////            6
////        );

////        scene.add(
////            blueLight
////        );

////        // =========================================
////        // DNA GROUP
////        // =========================================

////        const dna =
////            new THREE.Group();

////        dna.position.set(
////            0,
////            0,
////            0
////        );

////        dna.scale.set(
////            0.7,
////            0.7,
////            0.7
////        );

////        scene.add(
////            dna
////        );

////        // =========================================
////        // DNA SETTINGS
////        // =========================================

////        const radius = 2.6;
////        const height = 14;
////        const turns = 3.5;
////        const segments = 180;

////        const leftPoints = [];
////        const rightPoints = [];

////        // =========================================
////        // MATERIALS
////        // =========================================

////        const purpleMaterial =
////            new THREE.MeshStandardMaterial({

////                color: 0xb46cff,

////                emissive: 0x6d20ff,

////                emissiveIntensity: 2,

////                metalness: 0.25,

////                roughness: 0.2
////            });


////        const blueMaterial =
////            new THREE.MeshStandardMaterial({

////                color: 0x43a9ff,

////                emissive: 0x126cff,

////                emissiveIntensity: 2,

////                metalness: 0.25,

////                roughness: 0.2
////            });


////        const connectionMaterial =
////            new THREE.MeshStandardMaterial({

////                color: 0xc084ff,

////                emissive: 0x6d2cff,

////                emissiveIntensity: 1.5,

////                metalness: 0.3,

////                roughness: 0.2
////            });

////        // =========================================
////        // DNA POINTS
////        // =========================================

////        for (
////            let i = 0;
////            i <= segments;
////            i++
////        ) {

////            const t =
////                i / segments;

////            const y =
////                -height / 2 +
////                t * height;

////            const angle =
////                t *
////                Math.PI *
////                2 *
////                turns;


////            const x1 =
////                Math.cos(angle) *
////                radius;

////            const z1 =
////                Math.sin(angle) *
////                radius;


////            const x2 =
////                Math.cos(
////                    angle + Math.PI
////                ) *
////                radius;

////            const z2 =
////                Math.sin(
////                    angle + Math.PI
////                ) *
////                radius;


////            leftPoints.push(
////                new THREE.Vector3(
////                    x1,
////                    y,
////                    z1
////                )
////            );


////            rightPoints.push(
////                new THREE.Vector3(
////                    x2,
////                    y,
////                    z2
////                )
////            );
////        }

////        // =========================================
////        // DNA HELIXES
////        // =========================================

////        const curve1 =
////            new THREE.CatmullRomCurve3(
////                leftPoints
////            );

////        const curve2 =
////            new THREE.CatmullRomCurve3(
////                rightPoints
////            );


////        const tube1 =
////            new THREE.Mesh(

////                new THREE.TubeGeometry(
////                    curve1,
////                    500,
////                    0.12,
////                    12,
////                    false
////                ),

////                purpleMaterial
////            );


////        const tube2 =
////            new THREE.Mesh(

////                new THREE.TubeGeometry(
////                    curve2,
////                    500,
////                    0.12,
////                    12,
////                    false
////                ),

////                blueMaterial
////            );


////        dna.add(
////            tube1
////        );

////        dna.add(
////            tube2
////        );

////        // =========================================
////        // DNA NODES
////        // =========================================

////        const sphereGeometry =
////            new THREE.SphereGeometry(
////                0.22,
////                20,
////                20
////            );


////        for (
////            let i = 0;
////            i <= segments;
////            i += 6
////        ) {

////            const left =
////                new THREE.Mesh(
////                    sphereGeometry,
////                    purpleMaterial
////                );

////            left.position.copy(
////                leftPoints[i]
////            );

////            dna.add(
////                left
////            );


////            const right =
////                new THREE.Mesh(
////                    sphereGeometry,
////                    blueMaterial
////                );

////            right.position.copy(
////                rightPoints[i]
////            );

////            dna.add(
////                right
////            );
////        }

////        // =========================================
////        // DNA CONNECTIONS
////        // =========================================

////        for (
////            let i = 0;
////            i <= segments;
////            i += 8
////        ) {

////            const a =
////                leftPoints[i];

////            const b =
////                rightPoints[i];


////            const direction =
////                new THREE.Vector3()
////                    .subVectors(
////                        b,
////                        a
////                    );


////            const length =
////                direction.length();


////            const geometry =
////                new THREE.CylinderGeometry(
////                    0.055,
////                    0.055,
////                    length,
////                    8
////                );


////            const connection =
////                new THREE.Mesh(
////                    geometry,
////                    connectionMaterial
////                );


////            connection.position.copy(

////                new THREE.Vector3()
////                    .addVectors(
////                        a,
////                        b
////                    )
////                    .multiplyScalar(
////                        0.5
////                    )
////            );


////            connection.quaternion.setFromUnitVectors(

////                new THREE.Vector3(
////                    0,
////                    1,
////                    0
////                ),

////                direction.normalize()
////            );


////            dna.add(
////                connection
////            );
////        }

////        // =========================================
////        // PARTICLES
////        // =========================================

////        const particleGeometry =
////            new THREE.BufferGeometry();

////        const particleCount = 350;

////        const positions =
////            new Float32Array(
////                particleCount * 3
////            );


////        for (
////            let i = 0;
////            i < particleCount;
////            i++
////        ) {

////            positions[i * 3] =
////                (Math.random() - 0.5) *
////                25;

////            positions[i * 3 + 1] =
////                (Math.random() - 0.5) *
////                20;

////            positions[i * 3 + 2] =
////                (Math.random() - 0.5) *
////                12;
////        }


////        particleGeometry.setAttribute(

////            "position",

////            new THREE.BufferAttribute(
////                positions,
////                3
////            )
////        );


////        const particleMaterial =
////            new THREE.PointsMaterial({

////                color: 0x8060ff,

////                size: 0.035,

////                transparent: true,

////                opacity: 0.7
////            });


////        const particles =
////            new THREE.Points(
////                particleGeometry,
////                particleMaterial
////            );


////        scene.add(
////            particles
////        );

////        // =========================================
////        // MOUSE CONTROL
////        // =========================================

////        let dragging = false;

////        let previousX = 0;
////        let previousY = 0;


////        container.addEventListener(
////            "pointerdown",
////            function (event) {

////                dragging = true;

////                previousX =
////                    event.clientX;

////                previousY =
////                    event.clientY;

////                container.setPointerCapture(
////                    event.pointerId
////                );
////            }
////        );


////        container.addEventListener(
////            "pointermove",
////            function (event) {

////                if (!dragging) {
////                    return;
////                }


////                const dx =
////                    event.clientX -
////                    previousX;

////                const dy =
////                    event.clientY -
////                    previousY;


////                dna.rotation.y +=
////                    dx * 0.008;

////                dna.rotation.x +=
////                    dy * 0.004;


////                previousX =
////                    event.clientX;

////                previousY =
////                    event.clientY;
////            }
////        );


////        container.addEventListener(
////            "pointerup",
////            function () {

////                dragging = false;
////            }
////        );


////        container.addEventListener(
////            "pointercancel",
////            function () {

////                dragging = false;
////            }
////        );

////        // =========================================
////        // RESIZE
////        // =========================================

////        function resize() {

////            const width =
////                container.clientWidth ||
////                window.innerWidth;

////            const height =
////                container.clientHeight ||
////                window.innerHeight;


////            renderer.setSize(
////                width,
////                height,
////                false
////            );


////            camera.aspect =
////                width / height;


////            camera.updateProjectionMatrix();
////        }


////        resize();


////        setTimeout(
////            resize,
////            100
////        );


////        setTimeout(
////            resize,
////            500
////        );


////        window.addEventListener(
////            "resize",
////            resize
////        );

////        // =========================================
////        // ANIMATION
////        // =========================================

////        const clock =
////            new THREE.Clock();


////        function animate() {

////            requestAnimationFrame(
////                animate
////            );


////            const time =
////                clock.getElapsedTime();


////            if (!dragging) {

////                dna.rotation.y +=
////                    0.002;
////            }


////            particles.rotation.y =
////                time * 0.01;


////            renderer.render(
////                scene,
////                camera
////            );
////        }


////        animate();

////        // =========================================
////        // RED TEST SPHERE
////        // =========================================

////        const testGeometry =
////            new THREE.SphereGeometry(
////                2,
////                32,
////                32
////            );


////        const testMaterial =
////            new THREE.MeshBasicMaterial({

////                color: 0xff0000
////            });


////        const testSphere =
////            new THREE.Mesh(
////                testGeometry,
////                testMaterial
////            );


////        testSphere.position.set(
////            0,
////            0,
////            0
////        );


////        scene.add(
////            testSphere
////        );


////        console.log(
////            "TEST SPHERE ADDED"
////        );


////        console.log(
////            "MY HOME 3D DNA INITIALIZED"
////        );
////    }
////};


import * as THREE from "three";

console.log("=== MY HOME SETTINGS DNA MODULE LOADED ===");

window.myHomeSettingsDna = {

    initialized: false,

    init: function () {

        if (this.initialized) {
            console.log("MY HOME DNA ALREADY INITIALIZED");
            return;
        }

        const container = document.getElementById("settingsDna");

        if (!container) {
            console.error("MY HOME DNA: #settingsDna NOT FOUND");
            return;
        }

        console.log("=== SETTINGS DNA INIT ===");

        // --------------------------------------------------
        // SCENE
        // --------------------------------------------------

        const scene = new THREE.Scene();

        scene.background = new THREE.Color(0x080914);

        // --------------------------------------------------
        // CAMERA
        // --------------------------------------------------

        const camera = new THREE.PerspectiveCamera(
            42,
            container.clientWidth / container.clientHeight,
            0.1,
            100
        );

        camera.position.set(0, 0, 19);

        // --------------------------------------------------
        // RENDERER
        // --------------------------------------------------

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );

        renderer.outputColorSpace = THREE.SRGBColorSpace;

        container.innerHTML = "";
        container.appendChild(renderer.domElement);

        // --------------------------------------------------
        // LIGHTS
        // --------------------------------------------------

        const ambient = new THREE.AmbientLight(
            0x7777aa,
            1.4
        );

        scene.add(ambient);

        const purpleLight = new THREE.PointLight(
            0x8d5cff,
            7,
            30
        );

        purpleLight.position.set(5, 4, 7);
        scene.add(purpleLight);

        const blueLight = new THREE.PointLight(
            0x358cff,
            6,
            30
        );

        blueLight.position.set(-5, -2, 5);
        scene.add(blueLight);

        const whiteLight = new THREE.PointLight(
            0xffffff,
            2,
            20
        );

        whiteLight.position.set(0, 5, 4);
        scene.add(whiteLight);

        // --------------------------------------------------
        // DNA GROUP
        // --------------------------------------------------

        const dna = new THREE.Group();

        dna.scale.set(
            0.72,
            0.72,
            0.72
        );

        scene.add(dna);

        // --------------------------------------------------
        // DNA SETTINGS
        // --------------------------------------------------

        const radius = 2.7;
        const height = 15;
        const turns = 3.7;
        const segments = 220;

        const pointsA = [];
        const pointsB = [];

        for (let i = 0; i <= segments; i++) {

            const t = i / segments;

            const y =
                (t - 0.5) * height;

            const angle =
                t * Math.PI * 2 * turns;

            const x =
                Math.cos(angle) * radius;

            const z =
                Math.sin(angle) * radius;

            pointsA.push(
                new THREE.Vector3(
                    x,
                    y,
                    z
                )
            );

            pointsB.push(
                new THREE.Vector3(
                    -x,
                    y,
                    -z
                )
            );
        }

        // --------------------------------------------------
        // DNA STRANDS
        // --------------------------------------------------

        const curveA =
            new THREE.CatmullRomCurve3(pointsA);

        const curveB =
            new THREE.CatmullRomCurve3(pointsB);

        const strandGeometryA =
            new THREE.TubeGeometry(
                curveA,
                segments,
                0.055,
                8,
                false
            );

        const strandGeometryB =
            new THREE.TubeGeometry(
                curveB,
                segments,
                0.055,
                8,
                false
            );

        const purpleMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x9a6cff,
                emissive: 0x5c28c9,
                emissiveIntensity: 1.5,
                metalness: 0.35,
                roughness: 0.25
            });

        const blueMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x4d9cff,
                emissive: 0x174fba,
                emissiveIntensity: 1.5,
                metalness: 0.35,
                roughness: 0.25
            });

        const strandA =
            new THREE.Mesh(
                strandGeometryA,
                purpleMaterial
            );

        const strandB =
            new THREE.Mesh(
                strandGeometryB,
                blueMaterial
            );

        dna.add(strandA);
        dna.add(strandB);

        // --------------------------------------------------
        // DNA ATOMS
        // --------------------------------------------------

        const normalAtomGeometry =
            new THREE.SphereGeometry(
                0.12,
                16,
                16
            );

        const purpleAtomMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xa979ff,
                emissive: 0x6e36d8,
                emissiveIntensity: 2.2
            });

        const blueAtomMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x62a8ff,
                emissive: 0x245fd4,
                emissiveIntensity: 2.2
            });

        for (
            let i = 0;
            i <= segments;
            i += 5
        ) {

            const t = i / segments;

            const y =
                (t - 0.5) * height;

            const angle =
                t * Math.PI * 2 * turns;

            const x =
                Math.cos(angle) * radius;

            const z =
                Math.sin(angle) * radius;

            const atomA =
                new THREE.Mesh(
                    normalAtomGeometry,
                    purpleAtomMaterial
                );

            atomA.position.set(
                x,
                y,
                z
            );

            dna.add(atomA);

            const atomB =
                new THREE.Mesh(
                    normalAtomGeometry,
                    blueAtomMaterial
                );

            atomB.position.set(
                -x,
                y,
                -z
            );

            dna.add(atomB);
        }

        // --------------------------------------------------
        // DNA CONNECTORS
        // --------------------------------------------------

        const connectorGeometry =
            new THREE.CylinderGeometry(
                0.035,
                0.035,
                1,
                8
            );

        const connectorMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xb7a9ff,
                emissive: 0x49358c,
                emissiveIntensity: 1.2
            });

        for (
            let i = 0;
            i <= segments;
            i += 7
        ) {

            const t = i / segments;

            const y =
                (t - 0.5) * height;

            const angle =
                t * Math.PI * 2 * turns;

            const x =
                Math.cos(angle) * radius;

            const z =
                Math.sin(angle) * radius;

            const start =
                new THREE.Vector3(
                    x,
                    y,
                    z
                );

            const end =
                new THREE.Vector3(
                    -x,
                    y,
                    -z
                );

            const middle =
                new THREE.Vector3()
                    .addVectors(start, end)
                    .multiplyScalar(0.5);

            const direction =
                new THREE.Vector3()
                    .subVectors(end, start);

            const length =
                direction.length();

            const connector =
                new THREE.Mesh(
                    connectorGeometry.clone(),
                    connectorMaterial
                );

            connector.position.copy(middle);

            connector.scale.y =
                length;

            connector.quaternion.setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                direction.normalize()
            );

            dna.add(connector);
        }

        // --------------------------------------------------
        // NAVIGATION ATOMS
        // --------------------------------------------------

        const navigationAtoms = [];

        function createNavigationAtom(
            name,
            route,
            color,
            emissive,
            position
        ) {

            const group =
                new THREE.Group();

            group.position.copy(position);

            group.userData = {
                navigation: true,
                name: name,
                route: route
            };

            // Main atom
            const atomGeometry =
                new THREE.SphereGeometry(
                    0.34,
                    32,
                    32
                );

            const atomMaterial =
                new THREE.MeshStandardMaterial({
                    color: color,
                    emissive: emissive,
                    emissiveIntensity: 3,
                    metalness: 0.2,
                    roughness: 0.18
                });

            const atom =
                new THREE.Mesh(
                    atomGeometry,
                    atomMaterial
                );

            atom.userData = group.userData;

            group.add(atom);

            // Outer ring
            const ringGeometry =
                new THREE.TorusGeometry(
                    0.55,
                    0.025,
                    10,
                    48
                );

            const ringMaterial =
                new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.75
                });

            const ring =
                new THREE.Mesh(
                    ringGeometry,
                    ringMaterial
                );

            ring.rotation.x =
                Math.PI / 2;

            group.add(ring);

            // Glow sphere
            const glowGeometry =
                new THREE.SphereGeometry(
                    0.7,
                    16,
                    16
                );

            const glowMaterial =
                new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.08,
                    depthWrite: false
                });

            const glow =
                new THREE.Mesh(
                    glowGeometry,
                    glowMaterial
                );

            group.add(glow);

            dna.add(group);

            navigationAtoms.push(group);

            return group;
        }

        // --------------------------------------------------
        // NAVIGATION POSITIONS
        // --------------------------------------------------

        createNavigationAtom(
            "HOME",
            "/",
            0xa36cff,
            0x712eff,
            new THREE.Vector3(
                -3.45,
                4.8,
                0.3
            )
        );

        createNavigationAtom(
            "SECURITY",
            "/security",
            0x4d9cff,
            0x1769e8,
            new THREE.Vector3(
                3.45,
                0,
                0.3
            )
        );

        createNavigationAtom(
            "USERS",
            "/users",
            0x55e6c1,
            0x12b894,
            new THREE.Vector3(
                -3.45,
                -4.8,
                0.3
            )
        );

        // --------------------------------------------------
        // NAVIGATION LABELS
        // --------------------------------------------------

        function createLabel(
            text,
            position
        ) {

            const canvas =
                document.createElement("canvas");

            canvas.width = 512;
            canvas.height = 128;

            const context =
                canvas.getContext("2d");

            context.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            context.font =
                "700 42px Arial";

            context.textAlign =
                "center";

            context.textBaseline =
                "middle";

            context.fillStyle =
                "rgba(255,255,255,0.92)";

            context.fillText(
                text,
                canvas.width / 2,
                canvas.height / 2
            );

            const texture =
                new THREE.CanvasTexture(
                    canvas
                );

            texture.colorSpace =
                THREE.SRGBColorSpace;

            const material =
                new THREE.SpriteMaterial({
                    map: texture,
                    transparent: true,
                    depthTest: false
                });

            const sprite =
                new THREE.Sprite(material);

            sprite.scale.set(
                2.0,
                0.5,
                1
            );

            sprite.position.copy(position);

            sprite.position.x +=
                position.x < 0
                    ? -1.05
                    : 1.05;

            sprite.userData.label = true;

            dna.add(sprite);
        }

        createLabel(
            "HOME",
            new THREE.Vector3(
                -3.45,
                4.8,
                0.3
            )
        );

        createLabel(
            "SECURITY",
            new THREE.Vector3(
                3.45,
                0,
                0.3
            )
        );

        createLabel(
            "USERS",
            new THREE.Vector3(
                -3.45,
                -4.8,
                0.3
            )
        );

        // --------------------------------------------------
        // BACKGROUND PARTICLES
        // --------------------------------------------------

        const particleCount = 450;

        const particlePositions =
            new Float32Array(
                particleCount * 3
            );

        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            particlePositions[i * 3] =
                (Math.random() - 0.5) * 30;

            particlePositions[i * 3 + 1] =
                (Math.random() - 0.5) * 22;

            particlePositions[i * 3 + 2] =
                (Math.random() - 0.5) * 15 - 3;
        }

        const particleGeometry =
            new THREE.BufferGeometry();

        particleGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(
                particlePositions,
                3
            )
        );

        const particleMaterial =
            new THREE.PointsMaterial({
                color: 0x7468a8,
                size: 0.025,
                transparent: true,
                opacity: 0.45
            });

        const particles =
            new THREE.Points(
                particleGeometry,
                particleMaterial
            );

        scene.add(particles);

        // --------------------------------------------------
        // TOUCH / MOUSE ROTATION
        // --------------------------------------------------

        let dragging = false;

        let previousX = 0;
        let previousY = 0;

        let rotationVelocityX = 0;
        let rotationVelocityY = 0;

        renderer.domElement.addEventListener(
            "pointerdown",
            function (event) {

                dragging = true;

                previousX = event.clientX;
                previousY = event.clientY;

                renderer.domElement.setPointerCapture(
                    event.pointerId
                );
            }
        );

        renderer.domElement.addEventListener(
            "pointermove",
            function (event) {

                if (!dragging)
                    return;

                const deltaX =
                    event.clientX - previousX;

                const deltaY =
                    event.clientY - previousY;

                previousX =
                    event.clientX;

                previousY =
                    event.clientY;

                rotationVelocityY =
                    deltaX * 0.006;

                rotationVelocityX =
                    deltaY * 0.006;

                dna.rotation.y +=
                    rotationVelocityY;

                dna.rotation.x +=
                    rotationVelocityX;

                dna.rotation.x =
                    Math.max(
                        -0.65,
                        Math.min(
                            0.65,
                            dna.rotation.x
                        )
                    );
            }
        );

        function stopDragging(event) {

            dragging = false;

            try {
                renderer.domElement.releasePointerCapture(
                    event.pointerId
                );
            }
            catch { }
        }

        renderer.domElement.addEventListener(
            "pointerup",
            stopDragging
        );

        renderer.domElement.addEventListener(
            "pointercancel",
            stopDragging
        );

        // --------------------------------------------------
        // NAVIGATION CLICK / TOUCH
        // --------------------------------------------------

        const raycaster =
            new THREE.Raycaster();

        const pointer =
            new THREE.Vector2();

        renderer.domElement.addEventListener(
            "pointerup",
            function (event) {

                if (
                    Math.abs(rotationVelocityX) > 0.025 ||
                    Math.abs(rotationVelocityY) > 0.025
                ) {
                    return;
                }

                const rect =
                    renderer.domElement.getBoundingClientRect();

                pointer.x =
                    ((event.clientX - rect.left) /
                        rect.width) * 2 - 1;

                pointer.y =
                    -((event.clientY - rect.top) /
                        rect.height) * 2 + 1;

                raycaster.setFromCamera(
                    pointer,
                    camera
                );

                const objects = [];

                navigationAtoms.forEach(
                    atom => {

                        atom.traverse(
                            child => {

                                if (
                                    child.isMesh
                                ) {
                                    objects.push(
                                        child
                                    );
                                }

                            }
                        );

                    }
                );

                const intersections =
                    raycaster.intersectObjects(
                        objects,
                        false
                    );

                if (
                    intersections.length === 0
                ) {
                    return;
                }

                let object =
                    intersections[0].object;

                while (
                    object &&
                    !object.userData.navigation
                ) {
                    object =
                        object.parent;
                }

                if (
                    !object ||
                    !object.userData.route
                ) {
                    return;
                }

                console.log(
                    "MY HOME NAVIGATION:",
                    object.userData.name
                );

                window.location.href =
                    object.userData.route;
            }
        );

        // --------------------------------------------------
        // RESIZE
        // --------------------------------------------------

        function resize() {

            const width =
                container.clientWidth;

            const height =
                container.clientHeight;

            if (!width || !height)
                return;

            camera.aspect =
                width / height;

            camera.updateProjectionMatrix();

            renderer.setSize(
                width,
                height
            );
        }

        window.addEventListener(
            "resize",
            resize
        );

        resize();

        // --------------------------------------------------
        // ANIMATION
        // --------------------------------------------------

        const clock =
            new THREE.Clock();

        function animate() {

            requestAnimationFrame(
                animate
            );

            const elapsed =
                clock.getElapsedTime();

            if (!dragging) {

                dna.rotation.y +=
                    0.0015;

            }

            // Navigation atom animation
            navigationAtoms.forEach(
                (atom, index) => {

                    const pulse =
                        1 +
                        Math.sin(
                            elapsed * 2.2 +
                            index
                        ) * 0.08;

                    atom.scale.set(
                        pulse,
                        pulse,
                        pulse
                    );
                }
            );

            particles.rotation.y =
                elapsed * 0.008;

            renderer.render(
                scene,
                camera
            );
        }

        animate();

        this.initialized = true;

        console.log(
            "=== MY HOME 3D DNA INITIALIZED ==="
        );
    }
};

