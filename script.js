/* =========================================================
   FUTURISTIC LOADER CONTROL
========================================================= */

document.body.classList.add("loading");

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.style.transition = "opacity 1s ease, transform 1s ease";
    loader.style.opacity = "0";
    loader.style.transform = "scale(1.2)";
  }, 1500);

  setTimeout(() => {
    loader.style.display = "none";
    document.body.classList.remove("loading");
  }, 2600);
});


/* =========================================================
   CANVAS SYSTEM (ORIGINAL ROBOT ANIMATION)
========================================================= */

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let width, height;
let time = 0;
let scrollProgress = 0;
let mouseX = 0;
let mouseY = 0;

function resize(){
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

window.addEventListener("mousemove", e=>{
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener("scroll", ()=>{
  const max = document.body.scrollHeight - window.innerHeight;
  scrollProgress = window.scrollY / max;
});


/* ================= GRID ================= */

let gridOffset = 0;

function drawGrid(){
  const size = 120;
  gridOffset += 0.4;

  ctx.strokeStyle="rgba(255,255,255,0.05)";
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


/* ================= ROBOT SHAPE ================= */

const robotPoints = 160;
let shape=[];

function generateShape(){
  const size=200;
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


/* ================= PARTICLES ================= */

class Particle{
  constructor(){
    this.baseX=Math.random()*width;
    this.baseY=Math.random()*height;
    this.offset=Math.random()*1000;
    this.target=Math.floor(Math.random()*robotPoints);
  }

  update(){
    const centerX=width/2;
    const centerY=height/2-50;

    const floatX=this.baseX+Math.sin(time*0.01+this.offset)*20;
    const floatY=this.baseY+Math.cos(time*0.01+this.offset)*20;

    const targetX=centerX+shape[this.target].x;
    const targetY=centerY+shape[this.target].y;

    const strength=Math.min(1,scrollProgress*1.2);

    this.x=floatX*(1-strength)+targetX*strength;
    this.y=floatY*(1-strength)+targetY*strength;
    this.state=strength>0.5;
  }

  draw(){
    if(this.state){
      ctx.fillStyle="rgb(255,0,150)";
      ctx.shadowColor="rgb(255,0,150)";
      ctx.shadowBlur=12;
    } else {
      ctx.fillStyle="rgb(0,255,255)";
      ctx.shadowColor="rgb(0,255,255)";
      ctx.shadowBlur=6;
    }

    ctx.beginPath();
    ctx.arc(this.x,this.y,2,0,Math.PI*2);
    ctx.fill();
  }
}

let particles=[];
for(let i=0;i<260;i++) particles.push(new Particle());


/* ================= AURA ================= */

function drawAura(){
  const cx=width/2;
  const cy=height/2-50;
  const pulse=Math.sin(time*0.05)*15;

  const gradient=ctx.createRadialGradient(cx,cy,50,cx,cy,220+pulse);
  gradient.addColorStop(0,"rgba(255,0,150,0.4)");
  gradient.addColorStop(1,"rgba(255,0,150,0)");

  ctx.fillStyle=gradient;
  ctx.beginPath();
  ctx.arc(cx,cy,220+pulse,0,Math.PI*2);
  ctx.fill();
}


/* ================= EYES ================= */

let blink=1;
let blinkTimer=0;

function drawEyes(){
  const cx=width/2;
  const cy=height/2-50;

  blinkTimer++;
  if(blinkTimer>220) blink=0;
  if(blinkTimer>235){ blink=1; blinkTimer=0;}

  const dx=(mouseX-cx)*0.03;
  const dy=(mouseY-cy)*0.03;

  ctx.fillStyle="rgb(255,0,150)";
  ctx.shadowColor="rgb(255,0,150)";
  ctx.shadowBlur=30;

  ctx.beginPath();
  ctx.ellipse(cx-50+dx,cy+dy,14,14*blink,0,0,Math.PI*2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(cx+50+dx,cy+dy,14,14*blink,0,0,Math.PI*2);
  ctx.fill();
}


/* ================= MAIN LOOP ================= */

function animate(){
  time++;
  ctx.fillStyle="#050816";
  ctx.fillRect(0,0,width,height);

  drawGrid();

  particles.forEach(p=>{
    p.update();
    p.draw();
  });

  if(scrollProgress>0.4){
    drawAura();
    drawEyes();
  }

  requestAnimationFrame(animate);
}
animate();


/* =========================================================
   SECTION SCROLL ANIMATIONS
========================================================= */

const sections = document.querySelectorAll(".section");
const timelineItems = document.querySelectorAll(".timeline-item");

function animateOnScroll(){
  const trigger = window.innerHeight - 120;

  sections.forEach(section=>{
    if(section.getBoundingClientRect().top < trigger){
      section.classList.add("active");
    }
  });

  timelineItems.forEach((item,index)=>{
    if(item.getBoundingClientRect().top < trigger){
      setTimeout(()=>{
        item.classList.add("active");
      }, index * 200);
    }
  });
}

window.addEventListener("scroll", animateOnScroll);
window.addEventListener("load", animateOnScroll);


/* =========================================================
   PROJECT MODAL SYSTEM
========================================================= */

const projectData = {
  excuse: {
    title: "Excuse Generator AI",
    desc: `
AI-powered automation integrating:
• Intelligent content generation
• Backend orchestration
• PDF generation
• SMS workflow systems
• Scalable modular architecture
    `,
    images: ["excuse1.png","excuse2.png","excuse3.png","excuse4.png"]
  }
};

document.querySelectorAll(".card").forEach(card=>{
  card.addEventListener("click",()=>{
    const key = card.dataset.project;
    if(!key) return;

    const data = projectData[key];

    document.getElementById("projectTitle").innerText = data.title;
    document.getElementById("projectDesc").innerText = data.desc;

    const imgContainer = document.getElementById("projectImages");
    imgContainer.innerHTML = "";

    data.images.forEach(src=>{
      const img = document.createElement("img");
      img.src = src;
      imgContainer.appendChild(img);
    });

    document.getElementById("projectView").style.display="block";
  });
});

document.getElementById("closeProject").onclick=()=>{
  document.getElementById("projectView").style.display="none";
};


/* =========================================================
   IMAGE POPUP SYSTEM
========================================================= */

const imageModal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");

document.addEventListener("click", function(e){
  if(e.target.tagName === "IMG" && e.target.closest("#projectImages")){
    imageModal.style.display="flex";
    modalImg.src=e.target.src;
  }
});

document.getElementById("closeImage").onclick=()=>{
  imageModal.style.display="none";
};

imageModal.onclick=(e)=>{
  if(e.target===imageModal){
    imageModal.style.display="none";
  }
};