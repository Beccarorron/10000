import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import * as CANNON from 'cannon-es';

export class Dice {
	constructor() {
		this.scoreResult = document.querySelector('#score-result');
		this.updateSceneSize = this.updateSceneSize.bind(this);
		this.render = this.render.bind(this);
		window.addEventListener('resize', this.updateSceneSize);
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			0.1,
			300
		);
		this.physicsWorld = new CANNON.World({
			allowSleep: true,
			gravity: new CANNON.Vec3(0, -50, 0),
		});
		this.params = {
			numberOfDice: 6,
			segments: 40,
			edgeRadius: 0.07,
			notchRadius: 0.12,
			notchDepth: 0.1,
		};
		this.boxGeometry = new THREE.BoxGeometry(
			1,
			1,
			1,
			this.params.segments,
			this.params.segments,
			this.params.segments
		);

		this.canvasEl = document.querySelector('#canvas');
		this.rollResults = [];
		this.diceMesh = [];
		this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		this.topLight = new THREE.PointLight(0xffffff, 0.5);
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			canvas: this.canvasEl,
		});

		this.diceArray = [];

		this.diceEvent = [];
		this.baseGeometry = new THREE.PlaneGeometry(
			1 - 2 * this.params.edgeRadius,
			1 - 2 * this.params.edgeRadius
		);
	}

	initScene() {
		this.scene = new THREE.Scene();
		window.addEventListener('resize', this.updateSceneSize);
		this.renderer.shadowMap.enabled = true;
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.scene.add(this.ambientLight);
		this.scene.add(this.camera);
		this.camera.position.set(0, 0.5, 4).multiplyScalar(7);

		this.updateSceneSize();

		this.topLight.position.set(10, 15, 0);
		this.topLight.castShadow = true;
		this.topLight.shadow.mapSize.width = 2048;
		this.topLight.shadow.mapSize.height = 2048;
		this.topLight.shadow.camera.near = 5;
		this.topLight.shadow.camera.far = 400;
		this.scene.add(this.topLight);
		this.createFloor();
		this.diceMesh = this.createDiceMesh();

		for (let i = 0; i < this.params.numberOfDice; i++) {
			this.diceArray.push(this.createDice());
			this.addDiceEvents(this.diceArray[i]);
			console.log(this.diceArray[i]);
		}
		this.render();
	}
	createBoxGeometry() {
		let positionAttr = this.boxGeometry.attributes.position;

		const subCubeHalfSize = 0.5 - this.params.edgeRadius;

		for (let i = 0; i < positionAttr.count; i++) {
			let position = new THREE.Vector3().fromBufferAttribute(positionAttr, i);

			const subCube = new THREE.Vector3(
				Math.sign(position.x),
				Math.sign(position.y),
				Math.sign(position.z)
			).multiplyScalar(subCubeHalfSize);
			let addition = new THREE.Vector3().subVectors(position, subCube);

			if (
				Math.abs(position.x) > subCubeHalfSize &&
				Math.abs(position.y) > subCubeHalfSize &&
				Math.abs(position.z) > subCubeHalfSize
			) {
				addition.normalize().multiplyScalar(this.params.edgeRadius);
				position = subCube.add(addition);
			} else if (
				Math.abs(position.x) > subCubeHalfSize &&
				Math.abs(position.y) > subCubeHalfSize
			) {
				addition.z = 0;
				addition.normalize().multiplyScalar(this.params.edgeRadius);
				position.x = subCube.x + addition.x;
				position.y = subCube.y + addition.y;
			} else if (
				Math.abs(position.x) > subCubeHalfSize &&
				Math.abs(position.z) > subCubeHalfSize
			) {
				addition.y = 0;
				addition.normalize().multiplyScalar(this.params.edgeRadius);
				position.x = subCube.x + addition.x;
				position.z = subCube.z + addition.z;
			} else if (
				Math.abs(position.y) > subCubeHalfSize &&
				Math.abs(position.z) > subCubeHalfSize
			) {
				addition.x = 0;
				addition.normalize().multiplyScalar(this.params.edgeRadius);
				position.y = subCube.y + addition.y;
				position.z = subCube.z + addition.z;
			}

			const notchWave = (v) => {
				v = (1 / this.params.notchRadius) * v;
				v = Math.PI * Math.max(-1, Math.min(1, v));
				return this.params.notchDepth * (Math.cos(v) + 1);
			};
			const notch = (pos) => notchWave(pos[0]) * notchWave(pos[1]);
			const offset = 0.23;

			if (position.y === 0.5) {
				position.y -= notch([position.x, position.z]);
			} else if (position.x === 0.5) {
				position.x -= notch([position.y + offset, position.z + offset]);
				position.x -= notch([position.y - offset, position.z - offset]);
			} else if (position.z === 0.5) {
				position.z -= notch([position.x - offset, position.y + offset]);
				position.z -= notch([position.x, position.y]);
				position.z -= notch([position.x + offset, position.y - offset]);
			} else if (position.z === -0.5) {
				position.z += notch([position.x + offset, position.y + offset]);
				position.z += notch([position.x + offset, position.y - offset]);
				position.z += notch([position.x - offset, position.y + offset]);
				position.z += notch([position.x - offset, position.y - offset]);
			} else if (position.x === -0.5) {
				position.x += notch([position.y + offset, position.z + offset]);
				position.x += notch([position.y + offset, position.z - offset]);
				position.x += notch([position.y, position.z]);
				position.x += notch([position.y - offset, position.z + offset]);
				position.x += notch([position.y - offset, position.z - offset]);
			} else if (position.y === -0.5) {
				position.y += notch([position.x + offset, position.z + offset]);
				position.y += notch([position.x + offset, position.z]);
				position.y += notch([position.x + offset, position.z - offset]);
				position.y += notch([position.x - offset, position.z + offset]);
				position.y += notch([position.x - offset, position.z]);
				position.y += notch([position.x - offset, position.z - offset]);
			}

			positionAttr.setXYZ(i, position.x, position.y, position.z);
		}

		this.boxGeometry.deleteAttribute('normal');
		this.boxGeometry.deleteAttribute('uv');
		this.boxGeometry = BufferGeometryUtils.mergeVertices(this.boxGeometry);

		this.boxGeometry.computeVertexNormals();

		return this.boxGeometry;
	}
	createInnerGeometry() {
		const offset = 0.48;
		return BufferGeometryUtils.mergeGeometries(
			[
				this.baseGeometry.clone().translate(0, 0, offset),
				this.baseGeometry.clone().translate(0, 0, -offset),
				this.baseGeometry
					.clone()
					.rotateX(0.5 * Math.PI)
					.translate(0, -offset, 0),
				this.baseGeometry
					.clone()
					.rotateX(0.5 * Math.PI)
					.translate(0, offset, 0),
				this.baseGeometry
					.clone()
					.rotateY(0.5 * Math.PI)
					.translate(-offset, 0, 0),
				this.baseGeometry
					.clone()
					.rotateY(0.5 * Math.PI)
					.translate(offset, 0, 0),
			],
			false
		);
	}
	createDiceMesh() {
		const boxMaterialOuter = new THREE.MeshStandardMaterial({
			color: 0xffffff,
		});
		const boxMaterialInner = new THREE.MeshStandardMaterial({
			color: 0x000000,
			roughness: 0,
			metalness: 1,
			side: THREE.DoubleSide,
		});
		const diceMesh = new THREE.Mesh();
		const innerMesh = new THREE.Mesh(
			this.createInnerGeometry(),
			boxMaterialInner
		);
		const outerMesh = new THREE.Mesh(
			this.createBoxGeometry(),
			boxMaterialOuter
		);
		outerMesh.castShadow = true;
		diceMesh.add(innerMesh, outerMesh);
		this.scene.add(diceMesh);
		return diceMesh;
	}
	showRollResults(score) {
		if (this.scoreResult.innerHTML === '') {
			this.scoreResult.innerHTML += score;
			this.rollResults.push(score);
		} else {
			this.scoreResult.innerHTML += '+' + score;
			this.rollResults.push(score);
		}
	}

	render() {
		this.physicsWorld.fixedStep();

		for (const dice of this.diceArray) {
			dice.mesh.position.copy(dice.body.position);

			dice.mesh.quaternion.copy(dice.body.quaternion);
		}

		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this.render);
	}
	updateSceneSize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
	initPhysics() {
		this.physicsWorld.defaultContactMaterial.restitution = 0.3;
	}
	createFloor() {
		const floor = new THREE.Mesh(
			new THREE.PlaneGeometry(1000, 1000),
			new THREE.ShadowMaterial({
				opacity: 0.1,
			})
		);
		floor.receiveShadow = true;
		floor.position.y = -7;
		floor.quaternion.setFromAxisAngle(
			new THREE.Vector3(-1, 0, 0),
			Math.PI * 0.5
		);
		this.scene.add(floor);

		const floorBody = new CANNON.Body({
			type: CANNON.Body.STATIC,
			shape: new CANNON.Plane(),
		});
		floorBody.position.copy(floor.position);
		floorBody.quaternion.copy(floor.quaternion);
		this.physicsWorld.addBody(floorBody);
	}
	createDice() {
		const mesh = this.diceMesh.clone();
		this.scene.add(mesh);
		const body = new CANNON.Body({
			mass: 1,
			shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
			sleepTimeLimit: 0.1,
		});

		this.physicsWorld.addBody(body);

		return { mesh, body };
	}
	addDiceEvents() {
		let movingDiceCount = this.diceArray.length;
		dice.body.addEventListener('sleep', (e) => {
			dice.body.allowSleep = false;

			const euler = new CANNON.Vec3();
			e.target.quaternion.toEuler(euler);

			const eps = 0.1;
			let isZero = (angle) => Math.abs(angle) < eps;
			let isHalfPi = (angle) => Math.abs(angle - 0.5 * Math.PI) < eps;
			let isMinusHalfPi = (angle) => Math.abs(0.5 * Math.PI + angle) < eps;
			let isPiOrMinusPi = (angle) =>
				Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps;

			if (isZero(euler.z)) {
				if (isZero(euler.x)) {
					this.showRollResults(1);
					console.log('landed on 1');
				} else if (isHalfPi(euler.x)) {
					this.showRollResults(4);
					console.log('landed on 4');
				} else if (isMinusHalfPi(euler.x)) {
					this.showRollResults(3);
					console.log('landed on 3');
				} else if (isPiOrMinusPi(euler.x)) {
					this.showRollResults(6);
					console.log('landed on 6');
				} else {
					// landed on edge => wait to fall on side and fire the event again
					dice.body.allowSleep = true;
					return;
				}
				movingDiceCount--;
			} else if (isHalfPi(euler.z)) {
				this.showRollResults(2);
				console.log('landed on 2');
				movingDiceCount--;
			} else if (isMinusHalfPi(euler.z)) {
				this.showRollResults(5);
				console.log('landed on 5');
				movingDiceCount--;
			} else {
				// landed on edge => wait to fall on side and fire the event again
				dice.body.allowSleep = true;
				return;
			}

			if (movingDiceCount === 0) {
				this.diceEvent = this.rollResults;
			}
		});
	}
	throwDice() {
		this.scoreResult.innerHTML = '';

		this.diceArray.forEach((d, dIdx) => {
			d.body.velocity.setZero();
			d.body.angularVelocity.setZero();

			d.body.position = new CANNON.Vec3(6, dIdx * 1.5, 0);
			d.mesh.position.copy(d.body.position);

			d.mesh.rotation.set(
				2 * Math.PI * Math.random(),
				0,
				2 * Math.PI * Math.random()
			);
			d.body.quaternion.copy(d.mesh.quaternion);

			const force = 3 + 5 * Math.random();
			d.body.applyImpulse(
				new CANNON.Vec3(-force, force, 0),
				new CANNON.Vec3(0, 0, 0.2)
			);
			d.body.allowSleep = true;
		});
	}
}
