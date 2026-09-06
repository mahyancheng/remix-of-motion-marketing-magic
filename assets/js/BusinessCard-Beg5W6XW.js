import{j as t,m as j}from"./framer-DpZka1jV.js";import{S as E,L as w}from"./index-BPQYajhV.js";import{r as n}from"./react-core-CHa7jpSz.js";import{aa as _,i as F,x as T}from"./lucide-Cs8cwFTE.js";import"./radix-D8vdvH8O.js";import"./supabase-DaHC9vq2.js";const z=1.5,C=`#version 300 es
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
}`,L=`#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`,R=c=>{const s=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);return s?[parseInt(s[1],16)/255,parseInt(s[2],16)/255,parseInt(s[3],16)/255]:[.5,.5,.5]},N=({smokeColor:c="#fcd200",className:s=""})=>{const x=n.useRef(null),u=n.useRef(null),o=n.useRef(),h=n.useRef(R(c));return n.useEffect(()=>{h.current=R(c)},[c]),n.useEffect(()=>{const r=u.current,i=x.current;if(!r||!i)return;const e=r.getContext("webgl2",{alpha:!0,antialias:!1,preserveDrawingBuffer:!1});if(!e)return;const l=e.createShader(e.VERTEX_SHADER),d=e.createShader(e.FRAGMENT_SHADER);e.shaderSource(l,L),e.compileShader(l),e.shaderSource(d,C),e.compileShader(d);const a=e.createProgram();e.attachShader(a,l),e.attachShader(a,d),e.linkProgram(a);const f=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,f),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,1,-1,-1,1,1,1,-1]),e.STATIC_DRAW);const p=e.getAttribLocation(a,"position");e.enableVertexAttribArray(p),e.vertexAttribPointer(p,2,e.FLOAT,!1,0,0);const y=e.getUniformLocation(a,"resolution"),A=e.getUniformLocation(a,"time"),k=e.getUniformLocation(a,"u_color"),v=()=>{const m=Math.max(1,Math.min(window.devicePixelRatio,z)),S=i.clientWidth,M=i.clientHeight;r.width=Math.max(1,Math.floor(S*m)),r.height=Math.max(1,Math.floor(M*m)),e.viewport(0,0,r.width,r.height)};v();const g=new ResizeObserver(v);g.observe(i);const b=m=>{e.useProgram(a),e.bindBuffer(e.ARRAY_BUFFER,f),e.uniform2f(y,r.width,r.height),e.uniform1f(A,m*.001),e.uniform3fv(k,h.current),e.drawArrays(e.TRIANGLE_STRIP,0,4),o.current=requestAnimationFrame(b)};return o.current=requestAnimationFrame(b),()=>{o.current&&cancelAnimationFrame(o.current),g.disconnect(),e.deleteBuffer(f),e.deleteShader(l),e.deleteShader(d),e.deleteProgram(a)}},[]),t.jsx("div",{ref:x,className:`absolute inset-0 pointer-events-none ${s}`,children:t.jsx("canvas",{ref:u,className:"w-full h-full block"})})},U=()=>t.jsxs("main",{className:"relative min-h-screen flex flex-col items-center justify-center px-4 py-16 gap-10",children:[t.jsx(E,{title:"Mah Yan Cheng · Director | Leadzap Marketing",description:"Digital business card for Mah Yan Cheng, Director at Leadzap Marketing.",path:"/business-card",noindex:!0}),t.jsxs("div",{className:"text-center max-w-2xl",children:[t.jsx("span",{className:"inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase mb-4",children:"Business Card Preview"}),t.jsx("h1",{className:"text-3xl md:text-5xl font-black text-foreground mb-3",children:"Mah Yan Cheng · Director"}),t.jsx("p",{className:"text-muted-foreground",children:"Animated card surface — designed for Apple Wallet-style scan & share."})]}),t.jsxs("div",{className:"grid md:grid-cols-2 gap-8 w-full max-w-5xl",children:[t.jsxs(j.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{duration:.6},className:"group relative aspect-[1.75/1] rounded-2xl overflow-hidden border border-accent/30 shadow-2xl shadow-accent/20 bg-background isolate [&>canvas]:!absolute [&>canvas]:!inset-0 [&>canvas]:!w-full [&>canvas]:!h-full",children:[t.jsx(N,{smokeColor:"#fcd200"}),t.jsx("div",{className:"absolute inset-0 bg-background/55 z-[1] pointer-events-none"}),t.jsxs("div",{className:"relative z-10 h-full flex flex-col items-center justify-center p-8 text-center",children:[t.jsx("img",{src:w,alt:"Leadzap Marketing logo",className:"h-16 md:h-20 w-auto object-contain mb-5 drop-shadow-[0_0_24px_rgba(252,210,0,0.55)]",width:"320",height:"80"}),t.jsx("div",{className:"h-px w-16 bg-accent/50"}),t.jsx("p",{className:"mt-4 text-[10px] md:text-xs text-foreground/80 tracking-[0.25em] uppercase",children:"Digital Marketing · SEO · Ads · Software"})]})]}),t.jsxs(j.div,{initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{duration:.6,delay:.15},className:"group relative aspect-[1.75/1] rounded-2xl overflow-hidden border border-accent/30 shadow-2xl shadow-accent/20 bg-background isolate [&>canvas]:!absolute [&>canvas]:!inset-0 [&>canvas]:!w-full [&>canvas]:!h-full",children:[t.jsx(N,{smokeColor:"#fcd200"}),t.jsx("div",{className:"absolute inset-0 bg-background/65 z-[1] pointer-events-none"}),t.jsxs("div",{className:"relative z-10 h-full flex flex-col justify-between p-6 md:p-8",children:[t.jsxs("div",{className:"flex items-start justify-between gap-4",children:[t.jsxs("div",{children:[t.jsx("h3",{className:"text-xl md:text-2xl font-black text-foreground leading-tight",children:"Mah Yan Cheng"}),t.jsx("p",{className:"text-accent text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase mt-1",children:"Director"})]}),t.jsx("img",{src:w,alt:"Leadzap",className:"h-8 md:h-10 w-auto object-contain",width:"160",height:"40"})]}),t.jsxs("div",{className:"space-y-2 text-xs md:text-sm",children:[t.jsxs("div",{className:"flex items-center gap-2.5 text-foreground/95",children:[t.jsx(_,{className:"w-3.5 h-3.5 text-accent shrink-0"}),t.jsx("span",{children:"011-1133 5119"})]}),t.jsxs("div",{className:"flex items-center gap-2.5 text-foreground/95",children:[t.jsx(F,{className:"w-3.5 h-3.5 text-accent shrink-0"}),t.jsx("span",{children:"yc@leadzap.com.my"})]}),t.jsxs("div",{className:"flex items-center gap-2.5 text-foreground/95",children:[t.jsx(T,{className:"w-3.5 h-3.5 text-accent shrink-0"}),t.jsx("span",{children:"www.leadzap.com.my"})]}),t.jsx("p",{className:"pt-1 text-[10px] md:text-xs text-foreground/60",children:"Leadzap Marketing Sdn Bhd"})]})]})]})]}),t.jsx("p",{className:"text-xs text-muted-foreground/70 max-w-md text-center",children:"Each card has its own live smoke animation — ready for an Apple Wallet scan-and-share experience."})]});export{U as default};
