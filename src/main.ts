import { WebGLRenderer, PerspectiveCamera } from 'three';

import MainScene from './scenes/MainScene';

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new WebGLRenderer({
  canvas: document.getElementById('app') as HTMLCanvasElement,
  antialias: true,
});

renderer.setSize(width, height);

const mainCamera = new PerspectiveCamera(50, width / height, 0.1, 1000);

function onWindowResize() {
  mainCamera.aspect = window.innerWidth / window.innerHeight;
  mainCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

const mainScene = new MainScene();

const render = () => {
  mainScene.update();
  renderer.render(mainScene, mainCamera);
  requestAnimationFrame(render);
};

const main = async () => {
  await mainScene.load();
  mainScene.initialize();
  render();
};

main();
