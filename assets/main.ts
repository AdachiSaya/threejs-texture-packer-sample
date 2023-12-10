import * as THREE from 'three';
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { TextureAtlas } from './textureAtlas';
import { Image } from './image';

export class Main {
	stats?: Stats;
	camera?: THREE.Camera;
	scene?: THREE.Scene;
	renderer?: THREE.Renderer;
	images: Array<Image> = [];
	textureAtlas: TextureAtlas = new TextureAtlas("/puzzle_textures.json");

	async init(element: HTMLElement) {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		// Scene
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x000000);

		// Camera
		this.camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 0.1, 5000);
		this.camera.position.set(0, 0, 1000);
		const rad = (45 / 2) * (Math.PI / 180);
		let distance = (windowHeight / 2) / Math.tan(rad);
		this.camera.position.set(0, 0, distance);
		(this.camera as THREE.PerspectiveCamera).aspect = windowWidth / windowHeight;
		(this.camera as THREE.PerspectiveCamera).updateProjectionMatrix();

		// Renderer
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
		});
		this.renderer.setSize(windowWidth, windowHeight);

		// Controller
		const controls = new OrbitControls(this.camera!, this.renderer.domElement);
		controls.enabled = true;
		controls.target.set(0, 0, 0);
		controls.update();

		// Stats
		this.stats = new Stats();
		this.stats.showPanel(0);
		document.body.appendChild(this.stats.dom);

		await this.load();
		element.appendChild(this.renderer.domElement);
		requestAnimationFrame(this.update);
	}

	/**
	 * load
	 */
	async load() {
		await this.textureAtlas!.load();
		const dataList = this.textureAtlas!.textureDataList;
		for (const key in dataList) {
			const image = new Image(dataList[key]);
			this.images.push(image);
			this.scene!.add(image);
		}
	}

	/**
	 * update
	 */
	update = () => {
		this.stats?.begin();
		this.renderer?.render(this.scene!, this.camera!);
		this.stats?.end();
		requestAnimationFrame(this.update);
	};
}
