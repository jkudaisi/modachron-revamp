import * as THREE from 'three';
const cv=document.getElementById('rail');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile=matchMedia('(max-width: 760px)').matches;
let r;try{r=new THREE.WebGLRenderer({canvas:cv,antialias:!mobile,alpha:true,powerPreference:'high-performance'})}catch(e){cv.remove()}
if(r){
r.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:1.75));r.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x0e0e0e,7,15);
const cam=new THREE.PerspectiveCamera(mobile?52:40,1,.1,50);
const R=mobile?3.1:3.6,N=8,looks=[1,2,3,4,5,6,7,8];
const world=new THREE.Group();scene.add(world);world.position.set(mobile?0:1.4,mobile?.9:.4,0);
scene.add(new THREE.AmbientLight(0xffffff,.55));
const key=new THREE.DirectionalLight(0xfff1d6,1.4);key.position.set(3,5,6);scene.add(key);
const gold=new THREE.PointLight(0xffbb00,18,12);gold.position.set(-3,2,2);scene.add(gold);
const chrome=new THREE.MeshStandardMaterial({color:0xd9d4c8,metalness:1,roughness:.25});
const rail=new THREE.Mesh(new THREE.TorusGeometry(R,.035,12,160),chrome);rail.rotation.x=Math.PI/2;rail.position.y=1.55;world.add(rail);
const loader=new THREE.TextureLoader();const ring=new THREE.Group();world.add(ring);const items=[];
const hangerMat=new THREE.MeshStandardMaterial({color:0xFFBB00,metalness:.7,roughness:.3});
for(let i=0;i<N;i++){
  const a=i/N*Math.PI*2,pivot=new THREE.Group();pivot.position.set(Math.sin(a)*R,1.55,Math.cos(a)*R);pivot.rotation.y=a;ring.add(pivot);
  const hook=new THREE.Mesh(new THREE.TorusGeometry(.09,.012,8,24,Math.PI*1.4),hangerMat);hook.rotation.z=-.2;hook.position.y=.02;pivot.add(hook);
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,1.05,8),hangerMat);bar.rotation.z=Math.PI/2;bar.position.y=-.14;pivot.add(bar);
  const tex=loader.load(`img/look${looks[i]}.webp`);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
  const card=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.6),new THREE.MeshStandardMaterial({map:tex,roughness:.85,side:THREE.DoubleSide}));
  card.position.y=-.98;pivot.add(card);items.push(pivot);
}
const floor=new THREE.Mesh(new THREE.CircleGeometry(9,64),new THREE.MeshStandardMaterial({color:0x121110,roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.4;world.add(floor);
function size(){const w=cv.clientWidth,h=cv.clientHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
size();addEventListener('resize',size);
cam.position.set(0,1.3,mobile?10.5:9.2);cam.lookAt(0,.2,0);
let mx=0,my=0,tx=0,ty=0,spin=0,last=scrollY,vel=0,visible=true;
addEventListener('pointermove',e=>{tx=e.clientX/innerWidth*2-1;ty=e.clientY/innerHeight*2-1},{passive:true});
new IntersectionObserver(es=>visible=es[0].isIntersecting).observe(cv);
let lost=false;cv.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true});cv.addEventListener('webglcontextrestored',()=>{lost=false});
const clock=new THREE.Clock();
function frame(){
  const dt=Math.min(clock.getDelta(),.05);
  const sy=scrollY;vel+=(sy-last)*.0009;last=sy;vel*=.9;
  spin+=dt*.12+vel;ring.rotation.y=spin+sy*.0025;
  mx+=(tx-mx)*.06;my+=(ty-my)*.06;
  world.rotation.x=my*.08;world.rotation.z=-mx*.05;
  items.forEach((p,i)=>{p.rotation.z=Math.sin(clock.elapsedTime*1.2+i)*.025-vel*2+mx*.06;p.rotation.x=-my*.05});
  cam.position.x=mx*.5;cam.lookAt(0,.2,0);
  r.render(scene,cam);
}
if(reduced){loader.manager.onLoad=()=>{ring.rotation.y=.3;r.render(scene,cam)};}
else r.setAnimationLoop(()=>{if(visible&&!lost&&!document.hidden)frame()});
}
