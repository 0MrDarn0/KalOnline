import 'systemjs-hot-reloader/default-listener.js';
import 'three';
import GTXLoader from '/src/loaders/GTXLoader.js';
import KCMLoader from '/src/loaders/KCMLoader.js';
import { padStr, loadGTX, textureToImage } from '/src/utils/Utils.js';

const TEXTURE_WIDTH = 8192;
const TEXTURE_HEIGHT = 8192;

const canvas = document.createElement('canvas');
canvas.width = TEXTURE_WIDTH;
canvas.height = TEXTURE_HEIGHT;
canvas.style.width = '512px';
const context = canvas.getContext('2d');

document.body.appendChild(canvas);

const loaderKCM = new KCMLoader();
const loaderGTX = new GTXLoader();
loaderKCM.load('/data/MAPS/n_031_031.kcm', async ({ textureMaps }) => {
  let first = true;
  for (const { alphaMap, textureID, firstLayer } of textureMaps) {
    const textureUrl = `/data/MAPS/Tex/b_${padStr(Math.max(textureID, 1), 3)}.GTX`;

    const textureImage = textureToImage(await loadGTX(textureUrl));
    const texturePattern = context.createPattern(textureImage, 'repeat');
    const alphaImage = createAlphaMap(alphaMap, 256, 256);

    if (first) {
      context.fillStyle = texturePattern;
      context.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);

      first = false;
    } else {
      const image = combineAlphaPattern(alphaImage, texturePattern, TEXTURE_WIDTH, TEXTURE_HEIGHT);

      context.drawImage(image, 0, 0);
    }
  }
});

function createAlphaMap(map, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  const imageData = context.getImageData(0, 0, width, height);

  for (let x = 0; x < width; x ++) {
    for (let y = 0; y < height; y ++) {
      const index = y * width + x;
      const color = map[index];

      imageData.data[index * 4 + 3] = color;
    }
  }

  context.putImageData(imageData, 0, 0);

  return canvas;
}

function combineAlphaPattern(alpha, pattern, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  context.drawImage(alpha, 0, 0, width, height);

  context.globalCompositeOperation = 'source-in';

  context.fillStyle = pattern;
  context.fillRect(0, 0, width, height);

  return canvas;
}
