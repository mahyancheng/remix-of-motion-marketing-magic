'use strict';
/**
 * The LeadZap site background.
 *
 * The marketing app renders <SiteDitheringBackground/> — @paper-design/shaders-react's
 * Dithering with colorBack #020617, colorFront #fcd200, shape "warp", type "4x4",
 * speed 0.25, at opacity 0.5, fixed behind everything. Every surface token in the
 * design system carries `/ 0.7` alpha specifically so this shows through; without
 * it the whole system reads flat and wrong.
 *
 * This is a dependency-free WebGL reproduction of that: warped fbm noise put through
 * a 4x4 Bayer ordered-dither, same colours and speed. Desktop only, exactly like the
 * original (mobile gets the flat ground), and it degrades to the flat ground if WebGL
 * is unavailable rather than failing visibly.
 */

(function () {
  const BACK = [0x02 / 255, 0x06 / 255, 0x17 / 255];
  const FRONT = [0xfc / 255, 0xd2 / 255, 0x00 / 255];

  const host = document.createElement('div');
  host.id = 'lz-bg';
  document.body.prepend(host);

  // Match the original: no shader on small screens or reduced-motion, just the ground.
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(min-width: 768px)');

  // ADAPTATION for the console. The original evaluates the desktop gate ONCE at
  // import; in the React app that runs after hydration (and defers 500ms), so the
  // viewport is already real. Loaded as a plain <script> the same check can run
  // before first layout, when innerWidth is still 0 — the gate then reads "mobile"
  // and the field never appears at all. The console is also a long-lived app that
  // gets resized, not a page you reload. So: defer the first check past paint, and
  // re-check whenever the viewport crosses the breakpoint.
  let started = false;
  function boot() {
    if (started || !desktop.matches) return;
    started = true;
    start();
  }
  // Belt and braces: matchMedia('change') is the right signal, but it does not fire
  // under every environment (CDP viewport emulation, some embedded webviews), so a
  // plain resize listener backs it up. boot() is idempotent — it self-disarms.
  if (desktop.addEventListener) desktop.addEventListener('change', boot);
  else desktop.addListener(boot);
  window.addEventListener('resize', boot, { passive: true });
  // NOT requestAnimationFrame: rAF is suspended while the document is hidden, and a
  // console is routinely opened in a background tab. Deferring the gate behind rAF
  // meant the field never mounted until the tab was first focused. A timeout still
  // fires when hidden; visibilitychange covers the case where the viewport is only
  // measurable (innerWidth > 0) once the tab is actually shown.
  document.addEventListener('visibilitychange', boot);
  setTimeout(boot, 0);

  function start() {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return; // flat ground stays; nothing looks broken

  const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

  const FRAG = `
precision mediump float;
uniform vec2  uRes;
uniform float uTime;
uniform vec3  uBack;
uniform vec3  uFront;

// value noise + fbm, warped — the "warp" shape of the original
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0,0.0)), u.x),
             mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

// 4x4 Bayer matrix — the "4x4" dither type
float bayer(vec2 c){
  int x = int(mod(c.x, 4.0)), y = int(mod(c.y, 4.0));
  int i = x + y * 4;
  float m[16];
  m[0]=0.0;  m[1]=8.0;  m[2]=2.0;  m[3]=10.0;
  m[4]=12.0; m[5]=4.0;  m[6]=14.0; m[7]=6.0;
  m[8]=3.0;  m[9]=11.0; m[10]=1.0; m[11]=9.0;
  m[12]=15.0;m[13]=7.0; m[14]=13.0;m[15]=5.0;
  float v = 0.0;
  for (int k = 0; k < 16; k++) { if (k == i) v = m[k]; }
  return (v + 0.5) / 16.0;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv * vec2(uRes.x / uRes.y, 1.0) * 2.2;

  // domain warp
  vec2 q = vec2(fbm(p + uTime * 0.06), fbm(p + vec2(5.2, 1.3) - uTime * 0.05));
  vec2 r = vec2(fbm(p + 2.0 * q + vec2(1.7, 9.2) + uTime * 0.04),
                fbm(p + 2.0 * q + vec2(8.3, 2.8) - uTime * 0.03));
  float f = fbm(p + 2.0 * r);

  f = smoothstep(0.35, 0.95, f);
  // ordered dither -> hard two-tone, which is what makes it read as "dithering"
  float d = step(bayer(gl_FragCoord.xy), f);

  gl_FragColor = vec4(mix(uBack, uFront, d), 1.0);
}`;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  gl.uniform3fv(gl.getUniformLocation(prog, 'uBack'), BACK);
  gl.uniform3fv(gl.getUniformLocation(prog, 'uFront'), FRONT);

  // Half-resolution: the dither hides it completely and it keeps a NAS-hosted
  // page cheap on an old laptop.
  function resize() {
    const w = Math.max(1, Math.floor(window.innerWidth / 2));
    const h = Math.max(1, Math.floor(window.innerHeight / 2));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    }
  }
  window.addEventListener('resize', resize);
  resize();

  const start = performance.now();
  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) frame();
  });

  function frame() {
    if (!running) return;
    resize();
    // speed 0.25, matching the original
    gl.uniform1f(uTime, still ? 0 : ((performance.now() - start) / 1000) * 0.25);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!still) requestAnimationFrame(frame);
  }
  frame();
  } // start()
})();
