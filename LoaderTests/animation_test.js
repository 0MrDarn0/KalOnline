import 'mrdoob/three.js';
import 'mrdoob/three.js/controls/EditorControls';
import GBObject from '../src/GBObject.js';

let model = {
	formation: [
		new GBObject('../DATA/Model/Clothes/Cm_0_a01.gb'), 
		new GBObject('../DATA/Model/Clothes/Cm_0_p01.gb'), 
		new GBObject('../DATA/Model/Clothes/Cm_0_f01.gb'), 
		new GBObject('../DATA/Model/Clothes/Cm_0_g01.gb'), 
		new GBObject('../DATA/Model/Clothes/Cm_0_s01.gb'), 
		new GBObject('../DATA/Model/Clothes/Cm_0_h01.gb')
	], 
	bone: new GBObject('../DATA/Model/Motion/tm_bone.gb'), 
	animation: new GBObject('../DATA/Model/Motion/Tm_0_A_02.gb'), 
};

function createGeometry (formation, bone, animation) {
	return new Promise ((resolve, reject) => {
		(async () => {
			let {geometry: {bones: pieceBone}} = await bone.load();
			let {geometry: {animation: pieceAnimation}} = await animation.load();

			let geometry = new THREE.Geometry();
			let materials = [];

			for (let piece of formation) {
				let {geometry: pieceGeometry, materials: pieceMaterials} = await piece.load();

				geometry.merge(pieceGeometry, new THREE.Matrix4(), materials.length);
				materials.push(...pieceMaterials);

				geometry.skinWeights.push(...pieceGeometry.skinWeights);
				geometry.skinIndices.push(...pieceGeometry.skinIndices);
			}

			geometry.computeBoundingSphere();
			geometry.bones = pieceBone;

			for (let material of materials) {
				material.skinning = true;
			}

			console.log(materials);

			let material = new THREE.MeshFaceMaterial(materials);
			let mesh = new THREE.SkinnedMesh(geometry, material);

			animation = new THREE.Animation(mesh, pieceAnimation);

			resolve({mesh, animation});
		}());
	});
}

let clock = new THREE.Clock();

let scene = new THREE.Scene();

let canvas = document.getElementById('canvas');
let renderer = new THREE.WebGLRenderer({canvas});

let camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 1000);
camera.position.x = 50;
camera.position.y = 50;
camera.position.z = -50;
camera.lookAt(new THREE.Vector3(0, 0, 0));

let controls = new THREE.EditorControls(camera, canvas);

let promise = createGeometry(model.formation, model.bone, model.animation);
promise.then(({mesh, animation}) => {
	scene.add(mesh);
	animation.play(0);
});

(function animate () {
    requestAnimationFrame(animate);

	let delta = clock.getDelta();
	THREE.AnimationHandler.update(delta);

	renderer.render(scene, camera);
}());
