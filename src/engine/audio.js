import { save } from './save.js';

let ac = null;
function ctx() {
  if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
  if (ac.state === 'suspended') ac.resume();
  return ac;
}

function tone(freq, dur, type = 'square', vol = 0.08, delay = 0) {
  if (save.muted) return;
  try {
    const c = ctx(), o = c.createOscillator(), g = c.createGain();
    const t = c.currentTime + delay;
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur);
  } catch (e) { /* no audio */ }
}

export const sfx = {
  tap() { tone(700, 0.05, 'square', 0.05); },
  good() { [523, 659, 784].forEach((f, i) => tone(f, 0.14, 'square', 0.07, i * 0.09)); },
  bad() { tone(200, 0.2, 'sawtooth', 0.05); tone(150, 0.25, 'sawtooth', 0.05, 0.12); },
  ding() { tone(1400, 0.5, 'triangle', 0.1); tone(2100, 0.4, 'triangle', 0.05, 0.01); },
  fanfare() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.16, 'square', 0.07, i * 0.11)); },
  pop() { tone(900, 0.06, 'triangle', 0.08); tone(1300, 0.08, 'triangle', 0.06, 0.05); },
};
