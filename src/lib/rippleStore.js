const t0 = performance.now();
export const now = () => (performance.now() - t0) / 1000;

const MAX = 8;

export const rippleStore = {
  MAX,
  head: 0,
  ripples: Array.from({ length: MAX }, () => ({
    x: 0.5, y: 0.5, start: -1000, strength: 0,
  })),

  // clientX / clientY in CSS pixels
  spawn(clientX, clientY, strength = 1) {
    const r = this.ripples[this.head];
    r.x = clientX / window.innerWidth;
    r.y = 1 - clientY / window.innerHeight;   // flip Y for GL
    r.start = now();
    r.strength = strength;
    this.head = (this.head + 1) % MAX;
  },
};
