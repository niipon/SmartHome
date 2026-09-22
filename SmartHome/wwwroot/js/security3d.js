import * as THREE from "three";

window.myHomeSecurity3d = {

    scene: null,
    camera: null,
    renderer: null,

    root: null,
    shield: null,
    core: null,

    shieldMaterial: null,
    shieldEdgeMaterial: null,

    rings: [],
    particles: [],

    backgroundParticles: null,

    animationId: null,

    pointerDown: false,

    startX: 0,
    startY: 0,

    targetRotationX: 0,
    targetRotationY: 0,

    rotationX: 0,
    rotationY: 0,

    securityEnabled: false,
    motionDetected: false,


    init() {

        const container =
            document.getElementById("security3d");

        if (!container)
            return;


        // =============================
        // SCENE
        // =============================

        this.scene = new THREE.Scene();

        this.scene.background =
            new THREE.Color(0x050b10);


        // =============================
        // CAMERA
        // =============================

        this.camera =
            new THREE.PerspectiveCamera(
                45,
                container.clientWidth /
                container.clientHeight,
                0.1,
                100
            );

        this.camera.position.set(
            0,
            0,
            17
        );


        // =============================
        // RENDERER
        // =============================

        this.renderer =
            new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });

        this.renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        this.renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );

        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;

        container.appendChild(
            this.renderer.domElement
        );


        // =============================
        // LIGHTS
        // =============================

        const ambient =
            new THREE.AmbientLight(
                0xffffff,
                1.1
            );

        this.scene.add(ambient);


        const cyanLight =
            new THREE.PointLight(
                0x00eaff,
                8,
                30
            );

        cyanLight.position.set(
            -6,
            5,
            8
        );

        this.scene.add(
            cyanLight
        );


        const blueLight =
            new THREE.PointLight(
                0x168cff,
                7,
                30
            );

        blueLight.position.set(
            6,
            -4,
            7
        );

        this.scene.add(
            blueLight
        );


        // =============================
        // ROOT
        // =============================

        this.root =
            new THREE.Group();

        this.scene.add(
            this.root
        );


        this.createShield();

        this.createRings();

        this.createOrbitNodes();

        this.createParticles();

        this.setupPointer(container);

        window.addEventListener(
            "resize",
            () => this.resize()
        );

        this.animate();
    },


    // =============================
    // SHIELD
    // =============================

    createShield() {

        const shape =
            new THREE.Shape();


        shape.moveTo(0, 3.2);

        shape.bezierCurveTo(
            1.8,
            2.8,
            2.6,
            2.2,
            2.6,
            1.0
        );

        shape.bezierCurveTo(
            2.6,
            -1.2,
            1.4,
            -2.7,
            0,
            -3.6
        );

        shape.bezierCurveTo(
            -1.4,
            -2.7,
            -2.6,
            -1.2,
            -2.6,
            1.0
        );

        shape.bezierCurveTo(
            -2.6,
            2.2,
            -1.8,
            2.8,
            0,
            3.2
        );


        const geometry =
            new THREE.ExtrudeGeometry(
                shape,
                {
                    depth: 0.55,

                    bevelEnabled: true,

                    bevelSegments: 5,

                    bevelSize: 0.12,

                    bevelThickness: 0.12
                }
            );


        geometry.center();


        this.shieldMaterial =
            new THREE.MeshPhysicalMaterial({

                color: 0x00dff5,

                emissive: 0x007c99,

                emissiveIntensity: 1.5,

                metalness: 0.7,

                roughness: 0.18,

                transparent: true,

                opacity: 0.82,

                side: THREE.DoubleSide
            });


        this.shield =
            new THREE.Mesh(
                geometry,
                this.shieldMaterial
            );


        this.root.add(
            this.shield
        );


        // EDGE

        const edges =
            new THREE.EdgesGeometry(
                geometry
            );


        this.shieldEdgeMaterial =
            new THREE.LineBasicMaterial({

                color: 0x65f6ff,

                transparent: true,

                opacity: 0.95
            });


        const edge =
            new THREE.LineSegments(
                edges,
                this.shieldEdgeMaterial
            );


        this.root.add(
            edge
        );


        // =============================
        // CORE
        // =============================

        const coreGeometry =
            new THREE.IcosahedronGeometry(
                0.72,
                2
            );


        const coreMaterial =
            new THREE.MeshStandardMaterial({

                color: 0x8cffff,

                emissive: 0x00cfff,

                emissiveIntensity: 3,

                metalness: 0.45,

                roughness: 0.12
            });


        this.core =
            new THREE.Mesh(
                coreGeometry,
                coreMaterial
            );


        this.root.add(
            this.core
        );
    },


    // =============================
    // RINGS
    // =============================

    createRings() {

        const configs = [

            {
                radius: 4.2,
                tube: 0.035,
                rotation: [1.1, 0.3, 0],
                color: 0x00eaff
            },

            {
                radius: 4.7,
                tube: 0.025,
                rotation: [0.2, 1.2, 0.4],
                color: 0x238dff
            },

            {
                radius: 5.3,
                tube: 0.018,
                rotation: [1.4, 0, 1.1],
                color: 0x54cfff
            }
        ];


        configs.forEach(config => {

            const geometry =
                new THREE.TorusGeometry(
                    config.radius,
                    config.tube,
                    12,
                    160
                );


            const material =
                new THREE.MeshBasicMaterial({

                    color: config.color,

                    transparent: true,

                    opacity: 0.65
                });


            const ring =
                new THREE.Mesh(
                    geometry,
                    material
                );


            ring.rotation.set(
                ...config.rotation
            );


            this.root.add(
                ring
            );


            this.rings.push(
                ring
            );
        });
    },


    // =============================
    // ORBIT NODES
    // =============================

    createOrbitNodes() {

        const geometry =
            new THREE.SphereGeometry(
                0.11,
                16,
                16
            );


        for (let i = 0; i < 14; i++) {

            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        i % 2 === 0
                            ? 0x00eaff
                            : 0x3b9cff
                });


            const node =
                new THREE.Mesh(
                    geometry,
                    material
                );


            node.userData.angle =
                (i / 14) *
                Math.PI *
                2;

            node.userData.radius =
                4.1 +
                (i % 3) * 0.65;

            node.userData.speed =
                0.15 +
                (i % 4) * 0.04;

            node.userData.offset =
                (i % 2) * 1.5;


            this.root.add(
                node
            );


            this.particles.push(
                node
            );
        }
    },


    // =============================
    // BACKGROUND PARTICLES
    // =============================

    createParticles() {

        const geometry =
            new THREE.BufferGeometry();

        const positions = [];


        for (let i = 0; i < 350; i++) {

            positions.push(
                (Math.random() - 0.5) * 28,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 12
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

                color: 0x36cfff,

                size: 0.025,

                transparent: true,

                opacity: 0.5
            });


        this.backgroundParticles =
            new THREE.Points(
                geometry,
                material
            );


        this.scene.add(
            this.backgroundParticles
        );
    },


    // =============================
    // POINTER
    // =============================

    setupPointer(container) {

        container.addEventListener(
            "pointerdown",
            e => {

                this.pointerDown = true;

                this.startX =
                    e.clientX;

                this.startY =
                    e.clientY;
            }
        );


        container.addEventListener(
            "pointermove",
            e => {

                if (!this.pointerDown)
                    return;


                const dx =
                    e.clientX -
                    this.startX;

                const dy =
                    e.clientY -
                    this.startY;


                this.targetRotationY +=
                    dx * 0.006;

                this.targetRotationX +=
                    dy * 0.004;


                this.startX =
                    e.clientX;

                this.startY =
                    e.clientY;
            }
        );


        container.addEventListener(
            "pointerup",
            () => {

                this.pointerDown = false;
            }
        );


        container.addEventListener(
            "pointercancel",
            () => {

                this.pointerDown = false;
            }
        );
    },


    // =============================
    // STATE
    // =============================

    setState(enabled, motion) {

        this.securityEnabled =
            enabled;

        this.motionDetected =
            motion;


        if (!this.shieldMaterial)
            return;


        if (enabled) {

            this.shieldMaterial.color
                .setHex(0x00dff5);

            this.shieldMaterial.emissive
                .setHex(0x007c99);

            this.shieldMaterial.emissiveIntensity =
                motion ? 2.5 : 1.5;


            this.shieldEdgeMaterial.color
                .setHex(
                    motion
                        ? 0xff557d
                        : 0x65f6ff
                );

        }
        else {

            this.shieldMaterial.color
                .setHex(0x263c48);

            this.shieldMaterial.emissive
                .setHex(0x071a22);

            this.shieldMaterial.emissiveIntensity =
                0.5;


            this.shieldEdgeMaterial.color
                .setHex(0x42616b);
        }
    },


    // =============================
    // RESIZE
    // =============================

    resize() {

        const container =
            document.getElementById(
                "security3d"
            );

        if (!container ||
            !this.camera ||
            !this.renderer)
            return;


        const width =
            container.clientWidth;

        const height =
            container.clientHeight;


        this.camera.aspect =
            width / height;

        this.camera.updateProjectionMatrix();


        this.renderer.setSize(
            width,
            height
        );
    },


    // =============================
    // ANIMATION
    // =============================

    animate() {

        this.animationId =
            requestAnimationFrame(
                () => this.animate()
            );


        const time =
            performance.now() * 0.001;


        // плавное вращение пальцем

        this.rotationX +=
            (this.targetRotationX -
                this.rotationX) * 0.08;

        this.rotationY +=
            (this.targetRotationY -
                this.rotationY) * 0.08;


        this.root.rotation.x =
            this.rotationX;

        this.root.rotation.y =
            this.rotationY;


        // постоянное движение

        this.root.rotation.y +=
            0.0018;


        this.root.position.y =
            Math.sin(time * 0.8) *
            0.12;


        // shield

        if (this.shield) {

            this.shield.rotation.z =
                Math.sin(time * 0.7) *
                0.025;
        }


        // core

        if (this.core) {

            this.core.rotation.x +=
                0.012;

            this.core.rotation.y +=
                0.018;


            const scale =
                1 +
                Math.sin(time * 2.5) *
                0.08;


            this.core.scale.set(
                scale,
                scale,
                scale
            );
        }


        // rings

        if (this.rings.length >= 3) {

            this.rings[0].rotation.z +=
                0.002;

            this.rings[0].rotation.x +=
                0.001;


            this.rings[1].rotation.y -=
                0.002;

            this.rings[1].rotation.z +=
                0.001;


            this.rings[2].rotation.x +=
                0.0015;

            this.rings[2].rotation.y +=
                0.001;
        }


        // orbit nodes

        this.particles.forEach(
            node => {

                const angle =
                    node.userData.angle +
                    time *
                    node.userData.speed;


                const radius =
                    node.userData.radius;


                node.position.x =
                    Math.cos(angle) *
                    radius;


                node.position.z =
                    Math.sin(angle) *
                    radius;


                node.position.y =
                    Math.sin(
                        angle * 1.7 +
                        node.userData.offset
                    ) * 1.8;
            }
        );


        // background

        if (this.backgroundParticles) {

            this.backgroundParticles.rotation.y =
                time * 0.015;

            this.backgroundParticles.rotation.x =
                Math.sin(time * 0.1) *
                0.08;
        }


        // motion pulse

        if (
            this.motionDetected &&
            this.securityEnabled &&
            this.shieldMaterial
        ) {

            this.shieldMaterial.emissiveIntensity =
                1.8 +
                Math.sin(time * 8) *
                0.8;
        }


        this.renderer.render(
            this.scene,
            this.camera
        );
    }
};