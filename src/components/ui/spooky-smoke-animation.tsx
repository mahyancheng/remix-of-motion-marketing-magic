import React, { useEffect, useRef } from 'react';

// ==========================================
// 🚀 性能配置
// ==========================================
const MAX_DPR = 1.5; // 限制像素比，既保证清晰度又能极大降低 GPU 负担

const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_color;

#define FC gl_FragCoord.xy
#define R resolution
#define T (time+660.)

float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1,-1.2,.2,1.2)*2.;a*=.5;}return t;}

void main(){
  vec2 uv=(FC-.5*R)/R.y;
  vec3 col=vec3(1);
  uv.x+=.25;
  uv*=vec2(2,1);

  float n=fbm(uv*.28-vec2(T*.01,0));
  n=noise(uv*3.+n*2.);

  col.r-=fbm(uv+vec2(0,T*.015)+n);
  col.g-=fbm(uv*1.003+vec2(0,T*.015)+n+.003);
  col.b-=fbm(uv*1.006+vec2(0,T*.015)+n+.006);

  col=mix(col, u_color, dot(col,vec3(.21,.71,.07)));

  col=mix(vec3(.08),col,min(time*.1,1.));
  col=clamp(col,.08,1.);
  O=vec4(col,1);
}`;

class Renderer {
  private readonly vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;
  private readonly vertices = [-1, 1, -1, -1, 1, 1, 1, -1];

  private gl: WebGL2RenderingContext | null;
  private canvas: HTMLCanvasElement;
  private program: WebGLProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private color: [number, number, number] = [0.5, 0.5, 0.5];

  constructor(canvas: HTMLCanvasElement, fragmentSource: string) {
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl2", { 
      alpha: false, 
      antialias: false, // 背景效果通常不需要抗锯齿，节省性能
      preserveDrawingBuffer: false 
    });
    
    if (this.gl) {
      this.setup(fragmentSource);
      this.init();
    }
  }

  updateColor(newColor: [number, number, number]) {
    this.color = newColor;
  }

  updateScale() {
    if (!this.gl) return;
    const dpr = Math.max(1, Math.min(window.devicePixelRatio, MAX_DPR));
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private compile(shader: WebGLShader, source: string) {
    const gl = this.gl;
    if (!gl) return;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  }

  // 🚨 核心优化：深度清理 WebGL 资源，防止内存泄漏
  reset() {
    const gl = this.gl;
    if (!gl) return;

    if (this.buffer) gl.deleteBuffer(this.buffer);
    if (this.vs) gl.deleteShader(this.vs);
    if (this.fs) gl.deleteShader(this.fs);
    if (this.program) gl.deleteProgram(this.program);
    
    this.gl = null;
    this.program = null;
    this.buffer = null;
  }

  private setup(fragmentSource: string) {
    const gl = this.gl;
    if (!gl) return;
    this.vs = gl.createShader(gl.VERTEX_SHADER);
    this.fs = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!this.vs || !this.fs || !program) return;
    
    this.compile(this.vs, this.vertexSrc);
    this.compile(this.fs, fragmentSource);
    
    this.program = program;
    gl.attachShader(program, this.vs);
    gl.attachShader(program, this.fs);
    gl.linkProgram(program);
  }

  private init() {
    const { gl, program } = this;
    if (!gl || !program) return;
    
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // 提前获取 Uniform 位置，避免在渲染循环中调用 getUniformLocation
    (program as any).u_res = gl.getUniformLocation(program, "resolution");
    (program as any).u_time = gl.getUniformLocation(program, "time");
    (program as any).u_color = gl.getUniformLocation(program, "u_color");
  }

  render(now = 0) {
    const { gl, program, buffer, canvas } = this;
    if (!gl || !program) return;
    
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.uniform2f((program as any).u_res, canvas.width, canvas.height);
    gl.uniform1f((program as any).u_time, now * 1e-3);
    gl.uniform3fv((program as any).u_color, this.color);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

// 提取工具函数到外部
const hexToRgb = (hex: string): [number, number, number] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : null;
};

interface AnimatedBackgroundProps {
  smokeColor?: string;
}

export const SmokeBackground: React.FC<AnimatedBackgroundProps> = ({
  smokeColor = "#808080",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const renderer = new Renderer(canvasRef.current, fragmentShaderSource);
    rendererRef.current = renderer;

    const handleResize = () => renderer.updateScale();
    window.addEventListener('resize', handleResize);
    handleResize();

    const loop = (now: number) => {
      renderer.render(now);
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      renderer.reset();
      rendererRef.current = null;
    };
  }, []);

  // 独立处理颜色更新
  useEffect(() => {
    const rgbColor = hexToRgb(smokeColor);
    if (rendererRef.current && rgbColor) {
      rendererRef.current.updateColor(rgbColor);
    }
  }, [smokeColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }} // 建议设为 -1，确保在所有内容之下
    />
  );
};