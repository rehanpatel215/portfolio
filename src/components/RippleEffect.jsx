import React, { forwardRef, useMemo } from "react";
import { Effect, BlendFunction } from "postprocessing";
import { Uniform, Vector4 } from "three";
import { rippleStore, now } from "../lib/rippleStore.js";

const fragmentShader = /* glsl */ `
  uniform float uNow;
  uniform float uAspect;
  uniform vec4  uRipples[8];   // x, y, startTime, strength

  const float SPEED = 0.5;     // how fast rings expand
  const float FREQ  = 48.0;    // number of rings
  const float SHARP = 9.0;     // ring thickness
  const float DECAY = 1.2;     // fade over time
  const float AMP   = 0.02;    // distortion strength
  const float LIFE  = 3.2;     // seconds a ripple lives

  // returns: xy = uv offset, z = crest highlight
  vec3 ripples(vec2 uv) {
    vec2 offset = vec2(0.0);
    float crest = 0.0;
    for (int i = 0; i < 8; i++) {
      vec4 r = uRipples[i];
      float age = uNow - r.z;
      if (age < 0.0 || age > LIFE) continue;

      vec2 d = (uv - r.xy) * vec2(uAspect, 1.0);
      float dist = length(d);
      float radius = age * SPEED;
      float ring = exp(-abs(dist - radius) * SHARP);
      float wave = sin((dist - radius) * FREQ);
      float fade = exp(-age * DECAY)
                 * smoothstep(0.0, 0.1, age)
                 * (1.0 - smoothstep(LIFE - 0.6, LIFE, age));
      float k = wave * ring * fade * r.w;

      vec2 dir = d / (dist + 1e-5);
      offset += dir * vec2(1.0 / uAspect, 1.0) * k * AMP;
      crest  += max(k, 0.0);
    }
    return vec3(offset, crest);
  }

  void mainUv(inout vec2 uv) {
    uv += ripples(uv).xy;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float crest = ripples(uv).z;
    outputColor = vec4(inputColor.rgb + crest * 0.10, inputColor.a); // soft light on crests
  }
`;

class RippleEffectImpl extends Effect {
  constructor() {
    super("RippleEffect", fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ["uNow", new Uniform(0)],
        ["uAspect", new Uniform(1)],
        ["uRipples", new Uniform(
          Array.from({ length: 8 }, () => new Vector4(0.5, 0.5, -1000, 0))
        )],
      ]),
    });
  }

  update(_renderer, inputBuffer) {
    this.uniforms.get("uNow").value = now();
    this.uniforms.get("uAspect").value = inputBuffer.width / inputBuffer.height;

    const arr = this.uniforms.get("uRipples").value;
    rippleStore.ripples.forEach((r, i) => arr[i].set(r.x, r.y, r.start, r.strength));
  }
}

export const RippleEffect = forwardRef((_, ref) => {
  const effect = useMemo(() => new RippleEffectImpl(), []);
  return <primitive ref={ref} object={effect} dispose={null} />;
});
