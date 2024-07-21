import { useEffect, useRef } from "react";
import "./index.less";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import * as dat from "dat.gui";

const UseComponent = () => {
	// render.setSize(500, 500);
	const threeDom = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!threeDom.current) return;

		if (threeDom.current.childNodes[0]) {
			threeDom.current.childNodes[0].remove();
		}

		const scene = new THREE.Scene();

		const render = new THREE.WebGLRenderer();
		render.setClearColor(0xfff6e6);
		render.shadowMap.enabled = true;

		const axesHelps = new THREE.AxesHelper(50);
		scene.add(axesHelps);

		const griderHelper = new THREE.GridHelper(50);
		scene.add(griderHelper);

		threeDom.current.appendChild(render.domElement);

		render.setSize(threeDom.current.clientWidth, threeDom.current.clientHeight);
		const camera = new THREE.PerspectiveCamera(50, threeDom.current.clientWidth / threeDom.current.clientHeight, 0.1, 1000);
		camera.position.set(50, 50, 50);
		camera.lookAt(new THREE.Vector3(0, 15, 0));

		const ortcontrol = new OrbitControls(camera, render.domElement);
		ortcontrol.update();

		const stats = new Stats();
		stats.showPanel(1);
		stats.dom.style.position = "relative";
		stats.dom.style.top = -threeDom.current.clientHeight + "px";
		threeDom.current.appendChild(stats.dom);

		//Square
		const geometry = new THREE.BoxGeometry(5, 5, 5);

		// const geometry = new THREE.OctahedronGeometry(200);
		const color = new THREE.Color("#7833aa");
		const material = new THREE.MeshBasicMaterial({ color: color.getHex() });
		// const material = new THREE.MeshLambertMaterial();

		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		const planeGeometry = new THREE.PlaneGeometry(30, 30);
		const planeMaterial = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			side: THREE.DoubleSide
		});
		const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		scene.add(plane);
		plane.rotation.x = -0.5 * Math.PI;
		plane.receiveShadow = true;

		const sphereGeometry = new THREE.SphereGeometry(5);
		const sphereMaterial = new THREE.MeshStandardMaterial({
			color: 0x0000ff,
			wireframe: false
		});
		const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		scene.add(sphere);
		sphere.position.set(-10, 10, 0);
		sphere.castShadow = true;

		const ambientLight = new THREE.AmbientLight(0x333333);
		scene.add(ambientLight);

		const directionLight = new THREE.DirectionalLight(0xffffff, 0.8);
		scene.add(directionLight);
		directionLight.position.set(-30, 50, 0);
		directionLight.castShadow = true;
		directionLight.shadow.camera.bottom = -10;

		const directionLightHelper = new THREE.DirectionalLightHelper(directionLight, 5);
		scene.add(directionLightHelper);

		const directionShadowHelper = new THREE.CameraHelper(directionLight.shadow.camera);
		scene.add(directionShadowHelper);

		const gui = new dat.GUI();
		const options = {
			boxColor: "#ffea00"
		};
		gui.addColor(options, "boxColor").onChange(function (e) {
			cube.material.color.set(e);
		});

		render.setAnimationLoop(animate);

		const mousePosition = new THREE.Vector2();

		window.addEventListener("mousemove", mouseMove);

		function mouseMove(e: MouseEventInit) {
			if (!threeDom.current || !e.clientX || !e.clientY) return;
			mousePosition.x = (e.clientX / threeDom.current.clientWidth) * 2 - 1;
			mousePosition.y = -(e.clientY / threeDom.current.clientHeight) * 2 + 1;
		}
		return () => window.removeEventListener("mousemove", mouseMove);
		function animate() {
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;
			render.render(scene, camera);
			// stats.update();
		}
	}, [threeDom.current]);

	// useEffect(() => {}, []);
	return (
		<div className="card content-box">
			<span className="text">Promise Execise 🍓🍇🍈🍉</span>
			<div style={{ position: "relative" }} ref={threeDom} id="three"></div>
		</div>
	);
};

export default UseComponent;
