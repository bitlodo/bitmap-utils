import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//@ts-ignore
import MondrianLayout from "../../../../utils/MondrianLayout.js";

//ambient occlusion dependencies
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { SAOPass } from 'three/addons/postprocessing/SAOPass.js';
import { SSAARenderPass } from "three/examples/jsm/Addons.js";

interface ThreeJSRendererProps {
    data: number[] | null;
    style?: any | {};
    onTxHover?: (tx: number) => void;
    onTxSelect?: (tx: number) => void;
}

function ThreeJSRenderer({ data, style, onTxHover, onTxSelect }: ThreeJSRendererProps, ref: any) {

    const canvasDiv = useRef<HTMLDivElement>(null);
    const stage = useRef<Stage | null>(null);

    // Prevent color changes when using composer
    THREE.ColorManagement.enabled = false;

    useImperativeHandle(ref, () => {
        return {
            resetCamera: () => stage.current?.resetCamera(),
        };
    })

    useEffect(() => {
        if (canvasDiv.current === null) return;
        if (stage.current !== null) {
            if (stage.current.data == data) return;

            stage.current.dispose();
            stage.current = null;

            while (canvasDiv.current.firstChild) {
                canvasDiv.current.removeChild(canvasDiv.current.firstChild);
            }
        }

        if (data == null) return;

        stage.current = new Stage(data, { width: canvasDiv.current.clientWidth, height: canvasDiv.current.clientHeight }, onTxHover, onTxSelect);

        const canvas = stage.current.renderer.domElement;
        canvas.style.position = "absolute";
        canvasDiv.current.appendChild(canvas);

    }, [data]);

    //cleanup
    useEffect(() => {
        return () => {
            if (stage.current !== null) {
                stage.current.dispose();
                stage.current = null;
            }

            if (canvasDiv.current !== null) {
                while (canvasDiv.current.firstChild) {
                    canvasDiv.current.removeChild(canvasDiv.current.firstChild);
                }
            }
        };
    }, []);

    return (<div ref={canvasDiv} style={{ ...style }} />)
};

class Stage {
    data!: number[];
    renderer!: THREE.WebGLRenderer;
    scene!: THREE.Scene;
    sceneContainer!: THREE.Group;
    camera!: THREE.PerspectiveCamera;
    cameraControls!: OrbitControls;
    mondrian!: MondrianLayout;
    mondrianSlots!: { position: { x: number, y: number }, r: number }[];
    canvasSize: { width: number, height: number };
    cubeInstance!: THREE.InstancedMesh;
    composer?: EffectComposer;
    light?: THREE.DirectionalLight;
    animFrame?: number;
    selection: { hover: number, selected: number } = { hover: -1, selected: -1 }
    raycaster = new THREE.Raycaster(undefined, undefined, 0.001, 1000000);
    pointerDelta = new THREE.Vector2();
    pointer = new THREE.Vector2();
    pointerDragThreshold: number = 6; //pixels
    onTxHoverCallback?: (tx: number) => void;
    onTxSelectCallback?: (tx: number) => void;
    colorSettings = { default: new THREE.Color('#ffa500'), hover: new THREE.Color('#ffc622'), selected: new THREE.Color('#fe5900') }

    constructor(data: number[], canvasSize: { width: number, height: number }, onTxHoverCallback?: (tx: number) => void, onTxSelectCallback?: (tx: number) => void) {
        this.data = data;
        this.canvasSize = canvasSize;
        this.onTxHoverCallback = onTxHoverCallback;
        this.onTxSelectCallback = onTxSelectCallback;

        this.calculateBlockLayout();
        this.initializeStage();
        this.generateGeometry()
        this.registerEvents();
        this.initAnimation();
    }

    initializeStage() {
        // Create a renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.canvasSize.width, this.canvasSize.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);

        // Create a scene
        this.scene = new THREE.Scene();

        // Create a camera
        this.camera = new THREE.PerspectiveCamera(15, this.canvasSize.width / this.canvasSize.height, 0.1, 1000);
        this.camera.position.set(0, 1, 0);

        this.cameraControls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    calculateBlockLayout() {
        var blockWeight = 0;
        for (const squareSize of this.data) {
            blockWeight += (squareSize * squareSize);
        }
        const blockWidth = Math.ceil(Math.sqrt(blockWeight));

        this.mondrian = new MondrianLayout(blockWidth, blockWidth);
        this.mondrianSlots = [];

        for (var i = 0; i < this.data.length; i++) {
            let slot = this.mondrian.place(this.data[i]);
            this.mondrianSlots.push(slot);
        }
    }

    generateGeometry() {

        var mat = new THREE.MeshPhongMaterial();
        // var mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        cubeGeometry.translate(0.5, 0.5, 0.5);

        this.cubeInstance = new THREE.InstancedMesh(cubeGeometry, mat, this.data.length);
        this.cubeInstance.frustumCulled = false
        this.cubeInstance.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
        this.cubeInstance.castShadow = true;
        this.cubeInstance.receiveShadow = true;

        this.sceneContainer = new THREE.Group();
        this.scene.add(this.sceneContainer);

        this.sceneContainer.add(this.cubeInstance);

        const matrix = new THREE.Matrix4();
        for (var i = 0; i < this.data.length; i++) {

            var scaleValue = this.mondrianSlots[i].r - 0.5;

            let pos = new THREE.Vector3(this.mondrianSlots[i].position.x, 0, this.mondrianSlots[i].position.y);
            let sca = new THREE.Vector3(scaleValue, scaleValue, scaleValue);
            let rot = new THREE.Quaternion();

            matrix.compose(pos, rot, sca);

            this.cubeInstance.setColorAt(i, this.colorSettings.default);
            this.cubeInstance.setMatrixAt(i, matrix);
        }

        const layoutSize = this.mondrian.getSize();
        const maxHeight = [...this.data].sort().reverse()[0]; //get the largest tx size

        //move contents to the center of scene
        this.sceneContainer.position.set(-layoutSize.width / 2, 0, -layoutSize.height / 2);

        const maxSize = Math.max(layoutSize.width, layoutSize.height);
        this.camera.position.set(maxSize, maxSize, maxSize);

        const groundGeometry = new THREE.PlaneGeometry(maxSize * 2, maxSize * 2);
        const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.1 });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.receiveShadow = true;
        groundMesh.rotation.x = -90 * (Math.PI / 180);
        this.scene.add(groundMesh);

        this.light = new THREE.DirectionalLight(new THREE.Color('white'), 0.4);
        this.light.castShadow = true;
        this.light.shadow.mapSize.set(2048, 2048);
        this.light.shadow.camera.near = 0.1;
        this.light.shadow.camera.far = 100;
        this.light.shadow.camera.left = -maxSize;
        this.light.shadow.camera.right = maxSize;
        this.light.shadow.camera.top = maxSize;
        this.light.shadow.camera.bottom = -maxSize;
        this.light.shadow.camera.updateProjectionMatrix();

        this.scene.add(this.light);

        const aLight = new THREE.AmbientLight(new THREE.Color('white'), 3);
        this.scene.add(aLight);

        this.camera.updateProjectionMatrix();

        this.composer = new EffectComposer(this.renderer)
        this.composer.setSize(this.canvasSize.width, this.canvasSize.height)

        const renderPass = new SSAARenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass)

        const SAO = new SAOPass(this.scene, this.camera)
        SAO.params.saoIntensity = 0.005
        SAO.params.saoScale = 50
        SAO.params.saoKernelRadius = 30
        SAO.params.saoMinResolution = 0.00005
        SAO.params.saoBlurRadius = 10;
        SAO.params.saoBlurStdDev = 5;
        SAO.params.saoBlurDepthCutoff = 0.00005;

        this.composer.addPass(SAO)

        this.fitCameraToSelection(this.camera, this.cameraControls, maxSize, maxHeight, 1.5);

        this.cameraControls.saveState();
    }

    registerEvents() {
        this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.renderer.domElement.addEventListener('pointerup', this.onPointerUp.bind(this));
        this.renderer.domElement.addEventListener('pointermove', this.onPointerMove.bind(this));
    }

    isPointerDragging(e: PointerEvent) {
        return this.pointerDelta.distanceTo({ x: e.screenX, y: e.screenY }) > this.pointerDragThreshold;
    }

    onPointerDown(e: PointerEvent) {
        this.pointerDelta.set(e.screenX, e.screenY);
    }

    onPointerUp(e: PointerEvent) {

        //if drag screen, skip click selection event
        if (this.isPointerDragging(e)) return;

        if (this.selection.hover >= 0 && this.selection.hover != this.selection.selected) {
            this.selection.selected = this.selection.hover;
            this.onTxSelectCallback?.(this.selection.hover)
        } else if (this.selection.hover == -1 && this.selection.selected >= 0) {
            this.selection.selected = -1;
            this.onTxSelectCallback?.(-1)
        }

        this.UpdateColors();
    }

    onPointerMove(e: PointerEvent) {
        this.cameraControls.enableRotate = this.isPointerDragging(e);

        this.pointer.x = (e.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.pointer.y = -(e.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObject(this.cubeInstance);
        this.cubeInstance.computeBoundingBox();

        if (intersects.length === 0 && this.selection.hover >= 0) {
            this.selection.hover = -1;
            this.onTxHoverCallback?.(-1)
            this.UpdateColors();
        }
        else if (intersects.length > 0) {
            //get pointer collision point and subtract normal direction / 4, to make sure the reference point is inside the cube
            var localPoint = intersects[0].object.worldToLocal(intersects[0].point).sub(intersects[0].normal?.divideScalar(4) ?? new THREE.Vector3());
            var point = { x: Number((localPoint.x).toFixed(1)), y: 0, z: Number((localPoint.z).toFixed(1)) };

            for (var i = 0; i < this.mondrianSlots.length; i++) {

                if (this.selection.hover == i) continue;

                var s = this.mondrianSlots[i];
                var containsX = point.x > s.position.x && point.x < s.position.x + s.r;
                var containsZ = point.z > s.position.y && point.z < s.position.y + s.r;

                if (containsX && containsZ) {
                    this.selection.hover = i;
                    this.onTxHoverCallback?.(i)
                    this.UpdateColors();
                    break;
                }
            }
        }
    }

    initAnimation() {

        //helper objects
        const dummy = new THREE.Object3D();
        const matrix = new THREE.Matrix4();

        // Function to animate
        const animate = () => {

            this.animFrame = requestAnimationFrame(animate);

            this.cameraControls.update();

            matrix.extractRotation(this.camera.matrixWorld);
            dummy.position.set(10, 0, 0);
            dummy.position.applyMatrix4(matrix);

            this.light?.position.set(-dummy.position.x, 20, -dummy.position.z);

            if (this.composer) {
                this.composer?.render();
            } else {
                this.renderer.render(this.scene, this.camera);
            }
        }

        animate();
    }

    UpdateColors() {
        for (var i = 0; i < this.data.length; i++) {
            if (this.selection.selected == i) {
                this.cubeInstance.setColorAt(i, this.colorSettings.selected);
            } else if (this.selection.hover == i) {
                this.cubeInstance.setColorAt(i, this.colorSettings.hover);
            } else {
                this.cubeInstance.setColorAt(i, this.colorSettings.default);
            }
        }

        if (this.cubeInstance.instanceColor)
            this.cubeInstance.instanceColor.needsUpdate = true;
    }

    resetCamera() {
        this.cameraControls.reset();
    }

    fitCameraToSelection(camera: THREE.PerspectiveCamera, controls: OrbitControls, maxSize: number, maxHeight: number, fitOffset = 1.2) {

        // const size = new THREE.Vector3();
        const center = new THREE.Vector3();

        const fitHeightDistance = maxSize / (2 * Math.atan(Math.PI * camera.fov / 360));
        const fitWidthDistance = fitHeightDistance / camera.aspect;
        const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

        const direction = controls.target.clone()
            .sub(camera.position)
            .normalize()
            .multiplyScalar(distance);

        controls.maxDistance = distance * 10;
        controls.target.copy(center).add(new THREE.Vector3(0, maxHeight / 2, 0));

        this.camera.near = distance / 100;
        this.camera.far = distance * 100;
        this.camera.updateProjectionMatrix();

        this.camera.position.copy(controls.target).sub(direction);
    }

    dispose() {
        if (!this.animFrame) return;
        cancelAnimationFrame(this.animFrame)
        this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown.bind(this));
        this.renderer.domElement.removeEventListener('pointerup', this.onPointerUp.bind(this));
        this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove.bind(this));
    }
}

export default forwardRef(ThreeJSRenderer);