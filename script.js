/* =========================================================
   RUTWIK VADALI — FULL SYNCED ENGINE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

/* =========================================================
   HELPERS
========================================================= */

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* =========================================================
   LOADER
========================================================= */

(function(){
  document.body.classList.add("loading");

  window.addEventListener("load", () => {
    const loader = $("#loader");
    if(!loader) return;

    setTimeout(()=> loader.style.opacity="0",1200);
    setTimeout(()=>{
      loader.style.display="none";
      document.body.classList.remove("loading");
    },2000);
  });
})();

/* =========================================================
   CANVAS PARTICLE + ROBOT SYSTEM
========================================================= */

(function(){

  const canvas = $("#bg");
  if(!canvas) return;

  const ctx = canvas.getContext("2d");

  let width,height,time=0;
  let mouseX=0, mouseY=0;
  let scrollProgress=0;
  let formationStrength=0;

  function resize(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize",resize);

  window.addEventListener("mousemove",e=>{
    mouseX=e.clientX;
    mouseY=e.clientY;
  });

  window.addEventListener("scroll",()=>{
    const max=document.body.scrollHeight-window.innerHeight;
    scrollProgress=window.scrollY/max;
  });

  /* GRID */

  let gridOffset=0;

  function drawGrid(){
    const size=120;
    gridOffset+=0.4;

    ctx.strokeStyle="rgba(255,255,255,0.04)";
    ctx.lineWidth=1;

    for(let x=-size;x<width+size;x+=size){
      ctx.beginPath();
      ctx.moveTo(x+(gridOffset%size),0);
      ctx.lineTo(x+(gridOffset%size),height);
      ctx.stroke();
    }

    for(let y=-size;y<height+size;y+=size){
      ctx.beginPath();
      ctx.moveTo(0,y+(gridOffset%size));
      ctx.lineTo(width,y+(gridOffset%size));
      ctx.stroke();
    }
  }

  /* ROBOT SHAPE */

  const robotPoints=180;
  let shape=[];

  function generateShape(){
    const size=220;
    shape=[];

    for(let i=0;i<robotPoints;i++){
      const t=i/robotPoints;
      const p=t*4*size;
      let x,y;

      if(p<size){ x=-size/2+p; y=-size/2;}
      else if(p<size*2){ x=size/2; y=-size/2+(p-size);}
      else if(p<size*3){ x=size/2-(p-size*2); y=size/2;}
      else{ x=-size/2; y=size/2-(p-size*3);}

      shape.push({x,y});
    }
  }

  generateShape();

  /* PARTICLES */

  class Particle{
    constructor(){
      this.baseX=Math.random()*width;
      this.baseY=Math.random()*height;
      this.offset=Math.random()*1000;
      this.target=Math.floor(Math.random()*robotPoints);
      this.x=this.baseX;
      this.y=this.baseY;
    }

    update(){
      const cx=width/2;
      const cy=height/2-40;

      const floatX=this.baseX+Math.sin(time*0.01+this.offset)*25;
      const floatY=this.baseY+Math.cos(time*0.01+this.offset)*25;

      const targetX=cx+shape[this.target].x;
      const targetY=cy+shape[this.target].y;

      formationStrength=Math.min(1,scrollProgress*1.5);

      this.x=floatX*(1-formationStrength)+targetX*formationStrength;
      this.y=floatY*(1-formationStrength)+targetY*formationStrength;
    }

    draw(){
      if(formationStrength<0.3){
        ctx.fillStyle="rgb(0,255,255)";
        ctx.shadowColor="rgb(0,255,255)";
        ctx.shadowBlur=8;
      }else{
        ctx.fillStyle="rgb(255,0,150)";
        ctx.shadowColor="rgb(255,0,150)";
        ctx.shadowBlur=14;
      }

      ctx.beginPath();
      ctx.arc(this.x,this.y,2,0,Math.PI*2);
      ctx.fill();
    }
  }

  let particles=[];
  for(let i=0;i<300;i++) particles.push(new Particle());

  /* AURA */

  function drawAura(){
    if(formationStrength<0.4) return;

    const cx=width/2;
    const cy=height/2-40;
    const pulse=Math.sin(time*0.05)*20;

    const gradient=ctx.createRadialGradient(cx,cy,50,cx,cy,240+pulse);
    gradient.addColorStop(0,"rgba(255,0,150,0.45)");
    gradient.addColorStop(1,"rgba(255,0,150,0)");

    ctx.fillStyle=gradient;
    ctx.beginPath();
    ctx.arc(cx,cy,240+pulse,0,Math.PI*2);
    ctx.fill();
  }

  /* EYES */

  let blink=1, blinkTimer=0;

  function drawEyes(){
    if(formationStrength<0.6) return;

    const cx=width/2;
    const cy=height/2-40;

    blinkTimer++;
    if(blinkTimer>200) blink=0;
    if(blinkTimer>220){ blink=1; blinkTimer=0;}

    const dx=(mouseX-cx)*0.02;
    const dy=(mouseY-cy)*0.02;

    ctx.fillStyle="rgb(255,0,150)";
    ctx.shadowColor="rgb(255,0,150)";
    ctx.shadowBlur=30;

    ctx.beginPath();
    ctx.ellipse(cx-60+dx,cy+dy,16,16*blink,0,0,Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(cx+60+dx,cy+dy,16,16*blink,0,0,Math.PI*2);
    ctx.fill();
  }

  /* LOOP */

  function animate(){
    time++;
    ctx.fillStyle="#050816";
    ctx.fillRect(0,0,width,height);

    drawGrid();
    particles.forEach(p=>{p.update();p.draw();});
    drawAura();
    drawEyes();

    requestAnimationFrame(animate);
  }

  animate();

})();

/* =========================================================
   SECTION REVEAL + EXPERIENCE
========================================================= */

(function(){

  const sections=$$(".section");
  const items=$$(".timeline-item");

  function animate(){
    const trigger=window.innerHeight-120;

    sections.forEach(sec=>{
      if(sec.getBoundingClientRect().top<trigger)
        sec.classList.add("active");
    });

    items.forEach((item,index)=>{
      if(item.getBoundingClientRect().top<trigger){
        setTimeout(()=>{
          item.classList.add("active");
          item.style.boxShadow="0 0 25px rgba(255,0,150,0.3)";
        },index*200);
      }
    });
  }

  window.addEventListener("scroll",animate);
  animate();

})();

/* =========================================================
   HERO COUNTER
========================================================= */

(function(){

  const counters=$$(".stat-box h3");

  counters.forEach(counter=>{
    const value=parseInt(counter.innerText);
    if(isNaN(value)) return;

    let count=0;
    const inc=value/50;

    function update(){
      count+=inc;
      if(count<value){
        counter.innerText=Math.floor(count)+"+";
        requestAnimationFrame(update);
      }else{
        counter.innerText=value+"+";
      }
    }

    update();
  });

})();

/* =========================================================
   PROJECT MODAL
========================================================= */

(function(){

  const projectView=$("#projectView");
  const projectTitle=$("#projectTitle");
  const projectDesc=$("#projectDesc");
  const projectImages=$("#projectImages");
  const closeProject=$("#closeProject");

  const projectData={
    excuse:{
      title:"Excuse Generator AI — Intelligent Automation & Backend Orchestration System",
      desc:"Production-focused intelligent automation platform integrating AI generation, backend routing, PDF proof systems and SMS workflow execution pipelines.",
      images:["excuse1.png","excuse2.png","excuse3.png","excuse4.png","excuse5.png"]
    }
  };

  $$(".card").forEach(card=>{
    card.addEventListener("click",function(){
      const key=this.getAttribute("data-project");
      if(!projectData[key]) return;

      const data=projectData[key];

      projectTitle.innerText=data.title;
      projectDesc.innerText=data.desc;
      projectImages.innerHTML="";

      data.images.forEach(src=>{
        const img=document.createElement("img");
        img.src=src;
        projectImages.appendChild(img);
      });

      projectView.style.display="block";
    });
  });

  if(closeProject)
    closeProject.addEventListener("click",()=>projectView.style.display="none");

})();

/* =========================================================
   CERTIFICATE SEE MORE
========================================================= */

(function(){

  const openBtn=$("#openCertificatesPage");
  const page=$("#certificatesPage");
  const closeBtn=$("#closeCertificatesPage");

  if(openBtn && page)
    openBtn.addEventListener("click",()=>page.style.display="block");

  if(closeBtn && page)
    closeBtn.addEventListener("click",()=>page.style.display="none");

})();

/* =========================================================
   IMAGE MODAL
========================================================= */

(function(){

  const imageModal=$("#imageModal");
  const modalImg=$("#modalImg");
  const closeImage=$("#closeImage");

  document.addEventListener("click",e=>{
    if(e.target.tagName==="IMG" &&
      (e.target.classList.contains("cert-img") ||
       e.target.closest("#projectImages"))){

      imageModal.style.display="flex";
      modalImg.src=e.target.src;
    }
  });

  if(closeImage)
    closeImage.addEventListener("click",()=>imageModal.style.display="none");

  if(imageModal)
    imageModal.addEventListener("click",e=>{
      if(e.target===imageModal)
        imageModal.style.display="none";
    });

})();

});
