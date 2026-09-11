window.MyHome3D = {

    scenes: {},

    create: function (id, options = {}) {

        const container = document.getElementById(id);

        if (!container || typeof THREE === "undefined")
            return;

        this.destroy(id);

        const width = container.clientWidth || 800;
        const height = container.clientHeight || 500;

        const scene = new THREE.Scene();

        scene.background = new THREE.Color(
            options.background ?? 0x07090d
        );


        // =========================
        // CAMERA
        // =========================

        const camera = new THREE.PerspectiveCamera(
            45,
            width / height,
            0.1,
            1000
        );

        camera.position.set(
            options.cameraX ?? 0,
            options.cameraY ?? 1.5,
            options.cameraZ ?? 8
        );

        camera.lookAt(0, 0, 0);


        // =========================
        // RENDERER
        // =========================

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        renderer.setSize(width, height);

        renderer.shadowMap.enabled = true;

        renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;

        renderer.outputColorSpace =
            THREE.SRGBColorSpace;

        renderer.domElement.style.display = "block";

        renderer.domElement.style.width = "100%";

        renderer.domElement.style.height = "100%";

        renderer.domElement.style.touchAction = "none";

        container.appendChild(
            renderer.domElement
        );


        // =========================
        // LIGHTS
        // =========================

        const ambient =
            new THREE.AmbientLight(
                0xffffff,
                1.5
            );

        scene.add(ambient);


        const mainLight =
            new THREE.DirectionalLight(
                0xffffff,
                3
            );

        mainLight.position.set(
            4,
            8,
            5
        );

        mainLight.castShadow = true;

        scene.add(mainLight);


        const blueLight =
            new THREE.PointLight(
                0x4d8dff,
                12,
                20
            );

        blueLight.position.set(
            -4,
            4,
            -3
        );

        scene.add(blueLight);


        // =========================
        // FLOOR
        // =========================

        const floor =
            new THREE.Mesh(
                new THREE.PlaneGeometry(
                    20,
                    20
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x0b0e13,
                    roughness: 0.65,
                    metalness: 0.25
                })
            );

        floor.rotation.x =
            -Math.PI / 2;

        floor.position.y =
            -2;

        floor.receiveShadow = true;

        scene.add(floor);


        // =========================
        // GRID
        // =========================

        const grid =
            new THREE.GridHelper(
                20,
                40,
                0x33445d,
                0x151d29
            );

        grid.position.y =
            -1.98;

        grid.material.transparent =
            true;

        grid.material.opacity =
            0.3;

        scene.add(grid);


        // =========================
        // MAIN GROUP
        // =========================

        const group =
            new THREE.Group();

        scene.add(group);


        // =========================
        // ROTATION
        // =========================

        let dragging = false;

        let previousX = 0;

        let previousY = 0;

        let targetRotationX = 0;

        let targetRotationY = 0;


        const pointerDown = (e) => {

            dragging = true;

            previousX = e.clientX;

            previousY = e.clientY;

            try {
                renderer.domElement.setPointerCapture(
                    e.pointerId
                );
            }
            catch { }

        };


        const pointerMove = (e) => {

            if (!dragging)
                return;

            const dx =
                e.clientX - previousX;

            const dy =
                e.clientY - previousY;

            targetRotationY +=
                dx * 0.008;

            targetRotationX +=
                dy * 0.008;


            targetRotationX =
                Math.max(
                    -0.7,
                    Math.min(
                        0.7,
                        targetRotationX
                    )
                );


            previousX =
                e.clientX;

            previousY =
                e.clientY;

        };


        const pointerUp = () => {

            dragging = false;

        };


        renderer.domElement.addEventListener(
            "pointerdown",
            pointerDown
        );

        renderer.domElement.addEventListener(
            "pointermove",
            pointerMove
        );

        renderer.domElement.addEventListener(
            "pointerup",
            pointerUp
        );

        renderer.domElement.addEventListener(
            "pointercancel",
            pointerUp
        );


        // =========================
        // ZOOM
        // =========================

        const wheel = (e) => {

            e.preventDefault();

            camera.position.z +=
                e.deltaY * 0.006;

            camera.position.z =
                Math.max(
                    4,
                    Math.min(
                        12,
                        camera.position.z
                    )
                );

        };


        renderer.domElement.addEventListener(
            "wheel",
            wheel,
            {
                passive: false
            }
        );


        // =========================
        // RESIZE
        // =========================

        const resize = () => {

            const w =
                container.clientWidth;

            const h =
                container.clientHeight;

            if (!w || !h)
                return;

            camera.aspect =
                w / h;

            camera.updateProjectionMatrix();

            renderer.setSize(
                w,
                h
            );

        };


        window.addEventListener(
            "resize",
            resize
        );


        // =========================
        // ANIMATION
        // =========================

        let animationId;


        const animate = () => {

            animationId =
                requestAnimationFrame(
                    animate
                );


            group.rotation.y +=
                (
                    targetRotationY -
                    group.rotation.y
                ) * 0.08;


            group.rotation.x +=
                (
                    targetRotationX -
                    group.rotation.x
                ) * 0.08;


            renderer.render(
                scene,
                camera
            );

        };


        animate();


        // =========================
        // SAVE
        // =========================

        this.scenes[id] = {

            scene,

            camera,

            renderer,

            group,

            resize,

            animationId,

            pointerDown,

            pointerMove,

            pointerUp,

            wheel

        };

    },


    // ==================================================
    // 3D HOUSE
    // ==================================================

    addHome: function (id) {

        const data =
            this.scenes[id];

        if (!data)
            return;


        const home =
            new THREE.Group();


        // BODY

        const building =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    4.5,
                    2.8,
                    3.2
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x18212b,
                    metalness: 0.35,
                    roughness: 0.55
                })
            );


        building.castShadow =
            true;

        building.receiveShadow =
            true;

        home.add(building);


        // ROOF

        const roof =
            new THREE.Mesh(
                new THREE.ConeGeometry(
                    3.4,
                    1.8,
                    4
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x10151b,
                    metalness: 0.45,
                    roughness: 0.4
                })
            );


        roof.rotation.y =
            Math.PI / 4;

        roof.position.y =
            2.3;

        roof.castShadow =
            true;

        home.add(roof);


        // DOOR

        const door =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.75,
                    1.55,
                    0.08
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x080c12,
                    emissive: 0x081522,
                    emissiveIntensity: 0.8
                })
            );


        door.position.set(
            0,
            -0.6,
            1.65
        );


        home.add(door);


        // WINDOWS

        const windowMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x7abfff,
                emissive: 0x245b8c,
                emissiveIntensity: 2
            });


        const windows = [

            [-1.35, 0.35],

            [1.35, 0.35],

            [-1.35, -0.65],

            [1.35, -0.65]

        ];


        windows.forEach(
            position => {

                const window =
                    new THREE.Mesh(
                        new THREE.BoxGeometry(
                            0.7,
                            0.6,
                            0.08
                        ),
                        windowMaterial
                    );


                window.position.set(
                    position[0],
                    position[1],
                    1.65
                );


                home.add(window);

            }
        );


        // HOUSE GLOW

        const glow =
            new THREE.PointLight(
                0x4d8dff,
                3,
                8
            );


        glow.position.set(
            0,
            1,
            2
        );


        home.add(glow);


        data.group.add(
            home
        );

    },


    // ==================================================
    // SENSOR
    // ==================================================

    addSensor: function (
        id,
        x,
        y,
        z,
        color = 0x4d8dff
    ) {

        const data =
            this.scenes[id];

        if (!data)
            return;


        const sensor =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.35,
                    32,
                    32
                ),
                new THREE.MeshStandardMaterial({
                    color: color,
                    emissive: color,
                    emissiveIntensity: 2
                })
            );


        sensor.position.set(
            x,
            y,
            z
        );


        sensor.castShadow =
            true;


        data.group.add(
            sensor
        );


        // GLOW

        const glow =
            new THREE.PointLight(
                color,
                3,
                4
            );


        glow.position.copy(
            sensor.position
        );


        data.group.add(
            glow
        );


        return sensor;

    },


    // ==================================================
    // TV
    // ==================================================

    addTV: function (id) {

        const data =
            this.scenes[id];

        if (!data)
            return;


        const tv =
            new THREE.Group();


        const body =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    5,
                    2.9,
                    0.35
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x11151b,
                    metalness: 0.8,
                    roughness: 0.22
                })
            );


        body.castShadow =
            true;

        tv.add(body);


        const screen =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    4.7,
                    2.55,
                    0.08
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x071321,
                    emissive: 0x0a2340,
                    emissiveIntensity: 1.5
                })
            );


        screen.position.z =
            0.23;


        tv.add(screen);


        const glow =
            new THREE.PointLight(
                0x3388ff,
                5,
                8
            );


        glow.position.set(
            0,
            0,
            0.5
        );


        tv.add(glow);


        const stand =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.35,
                    1.2,
                    0.35
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x171c23
                })
            );


        stand.position.y =
            -2;


        tv.add(stand);


        const base =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    2.2,
                    0.18,
                    1
                ),
                stand.material
            );


        base.position.y =
            -2.55;


        tv.add(base);


        data.group.add(
            tv
        );

    },


    // ==================================================
    // REMOTE
    // ==================================================

    addRemote: function (id) {

        const data =
            this.scenes[id];

        if (!data)
            return;


        const remote =
            new THREE.Group();


        const body =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    1.3,
                    3.7,
                    0.38
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x151a21,
                    metalness: 0.65,
                    roughness: 0.28
                })
            );


        remote.add(body);


        const buttonMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x303743,
                metalness: 0.35,
                roughness: 0.5
            });


        const buttons = [

            [-0.32, 0.82],

            [0.32, 0.82],

            [-0.32, 0.38],

            [0.32, 0.38],

            [0, -0.1],

            [-0.32, -0.65],

            [0.32, -0.65],

            [-0.32, -1.15],

            [0.32, -1.15],

            [-0.32, -1.62],

            [0.32, -1.62]

        ];


        buttons.forEach(
            position => {

                const button =
                    new THREE.Mesh(
                        new THREE.CylinderGeometry(
                            0.15,
                            0.15,
                            0.08,
                            24
                        ),
                        buttonMaterial
                    );


                button.rotation.x =
                    Math.PI / 2;


                button.position.set(
                    position[0],
                    position[1],
                    0.25
                );


                remote.add(button);

            }
        );


        remote.position.set(
            4,
            -0.2,
            0
        );


        remote.rotation.z =
            -0.08;


        data.group.add(
            remote
        );

    },


    // ==================================================
    // THEME
    // ==================================================

    setTheme: function (
        id,
        theme
    ) {

        const data =
            this.scenes[id];

        if (!data)
            return;


        let background;

        let glow;


        switch (theme) {

            case "Cyber":

                background =
                    0x05070c;

                glow =
                    0x4d8dff;

                break;


            case "Minimal":

                background =
                    0xe9edf2;

                glow =
                    0xffffff;

                break;


            case "Matrix":

                background =
                    0x020703;

                glow =
                    0x00ff66;

                break;


            case "Space":

                background =
                    0x050414;

                glow =
                    0x8b6cff;

                break;


            case "Classic":

                background =
                    0x17100b;

                glow =
                    0xffb45c;

                break;


            default:

                background =
                    0x07090d;

                glow =
                    0x4d8dff;

        }


        data.scene.background =
            new THREE.Color(
                background
            );


        data.scene.traverse(
            object => {

                if (
                    object.isMesh &&
                    object.material
                ) {

                    if (
                        object.material.emissive
                    ) {

                        object.material.emissive =
                            new THREE.Color(
                                glow
                            );

                    }

                }

            }
        );

    },


    // ==================================================
    // DESTROY
    // ==================================================

    destroy: function (id) {

        const data =
            this.scenes[id];

        if (!data)
            return;


        cancelAnimationFrame(
            data.animationId
        );


        window.removeEventListener(
            "resize",
            data.resize
        );


        if (data.renderer) {

            data.renderer.domElement
                .removeEventListener(
                    "pointerdown",
                    data.pointerDown
                );

            data.renderer.domElement
                .removeEventListener(
                    "pointermove",
                    data.pointerMove
                );

            data.renderer.domElement
                .removeEventListener(
                    "pointerup",
                    data.pointerUp
                );

            data.renderer.domElement
                .removeEventListener(
                    "pointercancel",
                    data.pointerUp
                );

            data.renderer.domElement
                .removeEventListener(
                    "wheel",
                    data.wheel
                );


            data.renderer.dispose();


            if (
                data.renderer.domElement.parentNode
            ) {

                data.renderer.domElement
                    .parentNode
                    .removeChild(
                        data.renderer.domElement
                    );

            }

        }


        delete this.scenes[id];

    }

};