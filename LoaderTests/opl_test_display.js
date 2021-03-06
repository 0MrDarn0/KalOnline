import 'systemjs-hot-reloader/default-listener.js';
import { sleep } from '/src/utils/Utils.js';
import 'three';
import OPLLoader from '/src/loaders/OPLLoader.js';
import GBLoader from '/src/loaders/GBLoader.js';

const scene = new THREE.Scene();

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({canvas});

const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 1000);
camera.position.set(150, 150, -150);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const loaderOPL = new OPLLoader();
loaderOPL.load('/data/MAPS/n_031_031.opl', async ({ header, opl }) => {
  const loader = new GBLoader();
  const done = [];
  let mesh;

  for (const { url } of opl) {
    if (done.indexOf(url) !== -1) {
      continue;
    }
    done.push(url);

    if (mesh) {
      mesh.geometry.dispose();
      scene.remove(mesh);
    }

    const { geometry, materials } = await new Promise((resolve, reject) => {
      loader.load(`/${url}`, resolve, undefined, reject);
    });

    const material = new THREE.MultiMaterial(materials);
    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    try {
      renderer.render(scene, camera);
    } catch(error) {
      console.log(error, url);
    }

    await sleep(1000);
  }
  console.log('finish');
});
