(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduced)document.documentElement.classList.add('reduced');
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('solid',scrollY>40),{passive:true});
let lenis=null;
if(!reduced&&window.Lenis){lenis=new Lenis({lerp:.1});window.__lenis=lenis;
  const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf);
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{offset:-60})}}));}
if(window.gsap&&!reduced){gsap.registerPlugin(ScrollTrigger);if(lenis)lenis.on('scroll',ScrollTrigger.update);
  gsap.from('h1 span, h1 em',{y:80,opacity:0,duration:1.1,stagger:.12,ease:'power4.out',delay:.2});
  gsap.from('.hero .lede,.hero .stores,.hero .kicker',{y:20,opacity:0,duration:.9,stagger:.1,delay:.6});
  document.querySelectorAll('.reveal').forEach(el=>gsap.to(el,{opacity:1,y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
}else document.querySelectorAll('.reveal').forEach(el=>{el.style.opacity=1;el.style.transform='none'});

// fit card reveal
const fc=document.querySelector('.fitcard');if(fc){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){fc.classList.add('on');document.getElementById('ring').classList.add('on');io.disconnect()}}),{threshold:.3});io.observe(fc)}
// demo swipe deck
const looks=[
 {img:'look1',n:'Pattern play',s:'Warm, out with friends',casual:-1,fit:-.5,color:1},
 {img:'look3',n:'Soft tailoring',s:'Cool morning, coffee then work',casual:.5,fit:-1,color:.3},
 {img:'look6',n:'Clean black',s:'Evening, gallery opening',casual:.5,fit:1,color:-1},
 {img:'look4',n:'Statement coat',s:'Cold and clear, city day',casual:.8,fit:-.3,color:1},
 {img:'look7',n:'Prep layers',s:'Mild, campus run',casual:-.3,fit:-.5,color:.6},
 {img:'look8',n:'Stair-side varsity',s:'Breezy, weekend',casual:-1,fit:-1,color:.2},
];
const deck=document.getElementById('deck');if(!deck)return;
const prof={casual:0,fit:0,color:0};let i=0;
function draw(cv,c){const x=cv.getContext('2d'),w=cv.width=640,h=cv.height=854;
  const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#24221f');g.addColorStop(1,'#121110');x.fillStyle=g;x.fillRect(0,0,w,h);
  x.fillStyle=c[0];x.beginPath();x.moveTo(230,120);x.lineTo(410,120);x.lineTo(520,200);x.lineTo(480,300);x.lineTo(440,270);x.lineTo(440,460);x.lineTo(200,460);x.lineTo(200,270);x.lineTo(160,300);x.lineTo(120,200);x.closePath();x.fill();
  x.fillStyle='rgba(0,0,0,.18)';x.fillRect(316,120,8,340);
  x.fillStyle=c[1];x.beginPath();x.moveTo(210,470);x.lineTo(430,470);x.lineTo(450,720);x.lineTo(345,720);x.lineTo(320,540);x.lineTo(295,720);x.lineTo(190,720);x.closePath();x.fill();
  x.fillStyle=c[2];x.beginPath();x.ellipse(250,740,62,20,0,0,7);x.ellipse(395,740,62,20,0,0,7);x.fill();}
function setBars(){const p=(v)=>50+Math.max(-1,Math.min(1,v/3))*45+'%';
  document.getElementById('pCasual').style.left=p(prof.casual);document.getElementById('pFit').style.left=p(prof.fit);document.getElementById('pColor').style.left=p(prof.color);}
function make(k){const L=looks[k%looks.length],el=document.createElement('div');el.className='card';el.tabIndex=-1;
  el.innerHTML='<img alt="" draggable="false" src="img/'+L.img+'.webp"><span class="shade"></span><span class="stamp l">LOVE</span><span class="stamp r">NOPE</span><span class="tag"></span><span class="sub"></span>';
  el.querySelector('.tag').textContent=L.n;el.querySelector('.sub').textContent=L.s;el.setAttribute('aria-label','Demo look: '+L.n);el._l=L;return el;}
function fill(){while(deck.children.length<3){const el=make(i++);deck.prepend(el)}
  [...deck.children].forEach((c,j,a)=>{const d=a.length-1-j;c.style.transform=`translateY(${d*12}px) scale(${1-d*.04})`;c.style.zIndex=10-d;c.style.transition='transform .4s'});bind(deck.lastElementChild);}
function swipe(el,dir){const L=el._l,s=dir>0?1:-1;prof.casual+=L.casual*s;prof.fit+=L.fit*s;prof.color+=L.color*s;setBars();
  el.style.transition='transform .45s ease-in,opacity .45s';el.style.transform=`translateX(${dir*140}%) rotate(${dir*25}deg)`;el.style.opacity=0;
  setTimeout(()=>{el.remove();fill()},420);}
function bind(el){if(el._b)return;el._b=1;let sx=0,dx=0,down=false;
  el.addEventListener('pointerdown',e=>{down=true;sx=e.clientX;el.setPointerCapture(e.pointerId);el.style.transition='none'});
  el.addEventListener('pointermove',e=>{if(!down)return;dx=e.clientX-sx;el.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;
    el.querySelector('.l').style.opacity=Math.max(0,dx/120);el.querySelector('.r').style.opacity=Math.max(0,-dx/120)});
  const up=()=>{if(!down)return;down=false;if(Math.abs(dx)>90)swipe(el,Math.sign(dx));else{el.style.transition='transform .3s';el.style.transform='';el.querySelectorAll('.stamp').forEach(s=>s.style.opacity=0)}dx=0};
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);}
document.getElementById('btnYes').onclick=()=>swipe(deck.lastElementChild,1);
document.getElementById('btnNo').onclick=()=>swipe(deck.lastElementChild,-1);
fill();setBars();

// creator form: real endpoint is same-origin /api/creator-apply on modachron.com (no CORS), so preview hands off
const f=document.getElementById('apply'),msg=document.getElementById('formMsg');
const live=/(^|\.)modachron\.com$/.test(location.hostname);
f.addEventListener('submit',async e=>{e.preventDefault();msg.textContent='';
  const fullName=f.cName.value.trim(),handle=f.cHandle.value.trim().replace(/^@/,''),platform=f.cPlat.value,email=f.cEmail.value.trim().toLowerCase();
  if(!fullName)return msg.textContent='Please enter your full name.';
  if(!handle)return msg.textContent='Please enter your handle.';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return msg.textContent='Please enter a valid email address.';
  if(!live){msg.textContent='Preview build: taking you to the live application form on modachron.com.';setTimeout(()=>location.href='https://modachron.com/creators',1200);return;}
  const b=f.querySelector('button');b.disabled=true;
  try{const r=await fetch('/api/creator-apply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fullName,handle,platform,email})});
    const j=await r.json();if(!r.ok||!j.success)throw new Error(j.message||'Failed to submit your application.');
    f.reset();msg.textContent='Application received. We will be in touch within 48 hours.';}
  catch(err){msg.textContent=err.message||'Something went wrong. Please try again.'}finally{b.disabled=false}});
['cName','cHandle','cPlat','cEmail'].forEach(id=>f[id]=document.getElementById(id));
})();
