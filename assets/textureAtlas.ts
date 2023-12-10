import Path from "path";
import { Texture, TextureLoader, Vector2 } from "three";

interface TextureAtlasJsonData {
	filename: string;
	frame: {
		x: number,
		y: number,
		w: number,
		h: number;
	},
	rotated: boolean,
	trimmed: boolean,
	spriteSourceSize: {
		x: number,
		y: number,
		w: number,
		h: number;
	},
	sourceSize: {
		w: number,
		h: number;
	};
}

interface TexturePackerJsonData {
	frames: { [key: string]: TextureAtlasJsonData; };
	meta: {
		app: string;
		version: string;
		image: string;
		format: string;
		size: {
			w: number,
			h: number;
		},
		scale: string,
		smartupdate: string;
	};
}

export class TextureData {
	key: string;
	texture: Texture;
	data: TextureAtlasJsonData;
	width: number;
	height: number;
	offset: Vector2;
	textureWidth: number;
	textureHeight: number;
	scale: number;

	constructor(key: string, texture: Texture, data: TextureAtlasJsonData, scale: number = 1) {
		this.scale = scale;
		this.key = key;
		this.texture = texture;
		this.data = data;
		this.textureWidth = data.frame.w / this.scale;
		this.textureHeight = data.frame.h / this.scale;
		this.texture.repeat.set(data.frame.w / texture.image.width, data.frame.h / texture.image.height);
		this.texture.offset.set(
			data.frame.x / texture.image.width,
			1 - data.frame.h / texture.image.height - data.frame.y / texture.image.height
		);
		this.texture.needsUpdate = true;
		this.width = data.sourceSize.w / this.scale;
		this.height = data.sourceSize.h / this.scale;
		this.offset = new Vector2(-this.textureWidth / 2, -this.textureHeight / 2);
		this.offset.x -= data.spriteSourceSize.x / this.scale;
		this.offset.y += (data.spriteSourceSize.y / this.scale + data.spriteSourceSize.h / this.scale) - this.height;
	}

	clone() {
		return new TextureData(this.key, this.texture, this.data);
	}
}

export class TextureAtlas {
	path: string;
	json?: TexturePackerJsonData;
	textureDataList: { [key: string]: TextureData; } = {};

	constructor(path: string) {
		this.path = path;
	}

	async load() {
		return new Promise<void>(async resolve => {
			this.json = await (await fetch(this.path)).json();
			const imagePath = this.getImagePath(this.json, this.path);
			const loader = new TextureLoader();
			loader.load(
				imagePath,
				(texture: Texture) => {
					this.init(texture);
					resolve();
				},
			);
		});
	}

	protected init(texture: Texture) {
		if (!this.json) return;
		Object.keys(this.json?.frames).forEach((key: string) => {
			const t = texture.clone();
			const data = new TextureData(key, t, this.json!.frames[key], Number(this.json!.meta.scale));
			this.textureDataList[key] = data;
		});
	}

	protected getImagePath(json: any, path: string): string {
		const dir = Path.dirname(path);
		return Path.join(dir, json.meta.image);
	}

}
