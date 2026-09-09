// Fixed 960x540 stage, scaled to fit the window. One scene at a time.
export const W = 960, H = 540;
export const stage = document.getElementById('stage');

function fit() {
  const s = Math.min(innerWidth / W, innerHeight / H);
  const x = Math.floor((innerWidth - W * s) / 2), y = Math.floor((innerHeight - H * s) / 2);
  stage.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
}
addEventListener('resize', fit);
fit();

let current = null, last = 0;

// A scene is { enter(root), update?(dt), exit?() }.
export function go(scene) {
  if (current && current.exit) current.exit();
  stage.innerHTML = '';
  current = scene;
  const root = document.createElement('div');
  root.className = 'scene';
  stage.appendChild(root);
  scene.enter(root);
}

function loop(t) {
  const dt = Math.min(0.05, (t - last) / 1000);
  last = t;
  if (current && current.update) current.update(dt);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
