import * as THREE from "three";
import Stats from "stats-js";
import "./main.css";
import { getElementPosition } from "./util";

const query_vars = {};
window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
	query_vars[key] = value;
});

const method = query_vars.method ? query_vars.method : 'fixed';
const scrollCapture = query_vars.scrollCapture ? query_vars.scrollCapture : false;

console.log('method', method);
console.log('scrollCapture', scrollCapture);

if (scrollCapture) {
	document.body.style.overflow = 'hidden';
}

let stats = false;
if (query_vars.stats) {
	stats = new Stats();
	stats.showPanel(1);
	document.body.appendChild(stats.dom);
}

/*
** Initiate ThreejS scene
*/

const camera = new THREE.PerspectiveCamera(
	70,
	document.body.offsetWidth / window.innerHeight,
	0.1,
	1000
);

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: false });

if (method == 'absolute') {
	renderer.domElement.style.position = 'absolute';
}

renderer.setSize(document.body.offsetWidth, window.innerHeight);

function resize() {
	const cameraDistance = 1;
	camera.near = cameraDistance;
	camera.position.z = cameraDistance;
	camera.fov = 2 * Math.atan(1 / (2 * cameraDistance)) * (180 / Math.PI);
	camera.aspect = document.body.offsetWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(document.body.offsetWidth, window.innerHeight);
}

window.addEventListener('DOMContentLoaded', () => {
	window.addEventListener('resize', resize);
	resize();
	if (stats) document.body.appendChild(stats.dom);
	document.body.appendChild(renderer.domElement);
	draw();


	const cubeElements = document.body.querySelectorAll('[data-webgl="cube"]');
	const cubeGeometry = new THREE.BoxBufferGeometry();
	const cubeMat = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
	for (let index = 0; index < cubeElements.length; index++) {
		const element = cubeElements[index];
		if (!element.dataset.initiated) {
			element.dataset.initiated = true;
			const cube = new THREE.Mesh(cubeGeometry, cubeMat);

			scene.add(cube);
			const cubeResize = () => {
				const position = getElementPosition(element);
				console.log(position);
				cube.position.x = position.left;
				cube.position.y = position.top;
				cube.scale.x = position.width;
				cube.scale.y = position.height;
				cube.scale.z = 0.25;
			}
			cubeResize();
			window.addEventListener('resize', cubeResize);
		}
	}
})

/*
** Draw loop
*/
let lastFrame = performance.now();
function draw() {
	if (stats) stats.begin();
	requestAnimationFrame(draw);
	const delta = Math.min(1, Math.max(0, (performance.now() - lastFrame) / 1000));
	lastFrame = performance.now();

	if (scrollCapture) {
		window.scrollBy(scrollBuffer.x, scrollBuffer.y);
		scrollBuffer.x = 0;
		scrollBuffer.y = 0;

		camera.position.y = -window.scrollY / window.innerHeight;
	}

	renderer.render(scene, camera);


	if (stats) stats.end();
};

const scrollBuffer = { x: 0, y: 0 };

function scroll(e) {
	if (scrollCapture) {
		scrollBuffer.x += e.deltaX;
		scrollBuffer.y += e.deltaY;
	}

	let scrollPos = window.scrollY + scrollBuffer.y;

	scrollPos = Math.max(0, scrollPos);
	scrollPos = Math.min(document.body.offsetHeight, scrollPos);

	if (!scrollCapture) camera.position.y = -scrollPos / window.innerHeight;

	if (method == 'absolute') {
		renderer.domElement.style.top = scrollPos + 'px';
	}
}

document.body.addEventListener('wheel', scroll)