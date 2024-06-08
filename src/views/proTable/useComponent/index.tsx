import { useEffect, useRef } from "react";
import "./index.less";
import * as THREE from "three";
const UseComponent = () => {
	const scene = new THREE.Scene();
	let camera: THREE.PerspectiveCamera;
	const render = new THREE.WebGLRenderer();
	render.setClearColor(0xfff6e6);
	render.shadowMap.enabled = true;
	render.shadowMap.type = THREE.PCFSoftShadowMap;
	// render.setSize(500, 500);
	const threeDom = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (threeDom.current) {
			console.log(threeDom.current, "threeDom.current");
			threeDom.current.appendChild(render.domElement);
			render.setSize(threeDom.current.clientWidth, threeDom.current.clientHeight);
			camera = new THREE.PerspectiveCamera(60, threeDom.current.clientWidth / threeDom.current.clientHeight, 0.1, 1000);
			// camera.position.set(0, 0, 100);
			camera.position.set(0, 30, 50);
			camera.lookAt(new THREE.Vector3(0, 15, 0));
			render.setAnimationLoop(animate);
		}
	}, []);
	//Square
	const geometry = new THREE.BoxGeometry(5, 5, 5);
	// const geometry = new THREE.OctahedronGeometry(200);
	const color = new THREE.Color("#7833aa");
	const material = new THREE.MeshBasicMaterial({ color: color.getHex(), wireframe: true });
	// const material = new THREE.MeshLambertMaterial();
	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	const shadowMaterial = new THREE.ShadowMaterial({ color: 0xeeeeee });
	shadowMaterial.opacity = 0.5;
	const groundMesh = new THREE.Mesh(new THREE.BoxGeometry(100, 0.1, 100), shadowMaterial);
	groundMesh.receiveShadow = true;
	scene.add(groundMesh);

	// A simple geometric shape with a flat material
	const shapeOne = new THREE.Mesh(
		new THREE.OctahedronGeometry(10, 1),
		new THREE.MeshStandardMaterial({
			color: 0xff0051,
			// shading: THREE.FlatShading,
			metalness: 0,
			roughness: 0.8
		})
	);
	shapeOne.position.y += 10;
	shapeOne.rotateZ(Math.PI / 3);
	shapeOne.castShadow = true;
	scene.add(shapeOne);

	// Add a second shape
	const shapeTwo = new THREE.Mesh(
		new THREE.OctahedronGeometry(5, 1),
		new THREE.MeshStandardMaterial({
			color: 0x47689b,
			// shading: THREE.FlatShading ,
			metalness: 0,
			roughness: 0.8
		})
	);
	shapeTwo.position.y += 5;
	shapeTwo.position.x += 15;
	shapeTwo.rotateZ(Math.PI / 5);
	shapeTwo.castShadow = true;
	scene.add(shapeTwo);

	// add light
	const light1 = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(light1);

	const pointLight = new THREE.PointLight(0xffffff, 1);
	pointLight.position.set(25, 50, 25);
	pointLight.castShadow = true;
	pointLight.shadow.mapSize.width = 1024;
	pointLight.shadow.mapSize.height = 1024;
	scene.add(pointLight);

	function animate() {
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		render.render(scene, camera);
	}
	// useEffect(() => {}, []);
	return (
		<div className="card content-box">
			<span className="text">Promise Execise 🍓🍇🍈🍉</span>
			<div ref={threeDom} id="three"></div>
		</div>
	);
};

export default UseComponent;
