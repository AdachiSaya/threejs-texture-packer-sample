import * as THREE from 'three';
import { TextureData } from './textureAtlas';

export class Image extends THREE.Object3D {
	mesh: THREE.Mesh;
	container: THREE.Object3D;
	texture?: THREE.Texture;
	width: number = 0;
	height: number = 0;
	anchor: THREE.Vector2 = new THREE.Vector2(0.5, 0.5);
	textureData?: TextureData;

	constructor(textureData: TextureData, anchor: THREE.Vector2 = new THREE.Vector2(0.5, 0.5)) {
		super();
		this.mesh = new THREE.Mesh();
		this.container = new THREE.Object3D();
		this.container.add(this.mesh);
		this.add(this.container);
		this.init(textureData, anchor);
	}

	protected init(textureData: TextureData, anchor: THREE.Vector2 = new THREE.Vector2(0.5, 0.5)) {
		this.createMesh(textureData.texture, textureData.textureWidth, textureData.textureHeight);
		this.textureData = textureData;
		this.anchor = anchor;
		this.width = textureData.width;
		this.height = textureData.height;
		// オフセットの反映
		this.mesh.position.x = -this.textureData.offset.x - (this.width * 0.5);
		this.mesh.position.y = -this.textureData.offset.y - (this.height * 0.5);
		// アートボードの中心が回転の基準になるようにしている
		this.container.position.x = this.width * (0.5 - this.anchor.x);
		this.container.position.y = -this.height * (0.5 - this.anchor.y);

	}

	protected createMesh(tex: THREE.Texture, width: number, height: number) {
		this.texture = tex;
		this.width = width;
		this.height = height;
		this.mesh.geometry = new THREE.PlaneGeometry(this.width, this.height);
		this.mesh.material = new THREE.MeshBasicMaterial({
			map: tex,
			transparent: true,
			side: THREE.FrontSide, // 裏面も表示したいときはTHREE.DoubleSideにしてください
			depthTest: false,
		});
	}
}
