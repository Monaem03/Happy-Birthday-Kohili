const scenes = [
  {image:"images/scene1-arrival.jpg", kicker:"CHAPTER 01 · THE ARRIVAL", title:"Then, you walked in…", text:" surprise-এর দিকে এগিয়ে এলো Kohili। 💗", note:"একটা সুন্দর শুরু। তোমার আসাটাই যেন গল্পের সবচেয়ে সুন্দর মুহূর্ত।", fx:"hearts", duration:5000},
  {image:"images/scene2-candles.jpg", kicker:"CHAPTER 02 · MAKE A WISH", title:"Close your eyes, Kohili…", text:"একটা ইচ্ছা করো… এবার candle নিভিয়ে দাও। 🕯️", note:"তোমার মনের প্রতিটি ভালো ইচ্ছা একদিন পূরণ হোক। 🤲", fx:"blow", duration:5000},
  {image:"images/scene3-cutting.jpg", kicker:"CHAPTER 03 · CAKE CUTTING", title:"One cake, one memory", text:"একসাথে cake কাটার এই ছোট্ট মুহূর্তটা থাকুক মনে। 🎂", note:"একটা slice cake-এর, আর এক টুকরো স্মৃতির। 🎂", fx:"confetti", duration:5000},
  {image:"images/scene4-feeding.jpg", kicker:"CHAPTER 04 · A SWEET BITE", title:"A little sweetness for you", text:"Monaem, Kohili-কে cake খাওয়ায়… তারপর Kohili-র পালা! 🍰", note:"আজকের দিনে calorie count নেই—শুধু cake আর হাসি। 😄💗", fx:"cake", duration:5000},
  {image:"images/scene5-ending.jpg", kicker:"CHAPTER 05 · ALWAYS WISHING", title:"Happy Birthday, Kohili!", text:"তোমার আগামী দিনগুলো সুখ, শান্তি ও ভালোবাসায় ভরে উঠুক। — Monaem ❤️", note:"আল্লাহ তোমাকে সুস্থ, সুখী ও সফল রাখুন। সবসময় হাসিখুশি থেকো। 🤲", fx:"ending", duration:5000}
];
const frame=document.getElementById("movieFrame"), image=document.getElementById("movieImage");
const kicker=document.getElementById("sceneKicker"), title=document.getElementById("sceneTitle"), text=document.getElementById("sceneText");
const count=document.getElementById("sceneCount"), fill=document.getElementById("timelineFill"), timeNow=document.getElementById("timeNow");
const playBtn=document.getElementById("playBtn"), chapters=[...document.querySelectorAll(".chapter")], particles=document.getElementById("particles");
const actionFx=document.getElementById("actionFx"), movieEnd=document.getElementById("movieEnd"), toast=document.getElementById("noteToast");
const music=document.getElementById("music"), musicBtn=document.getElementById("musicBtn");
let index=0, playing=false, timer=null, sceneStarted=0, raf=null, totalElapsed=0;
const totalDuration=scenes.reduce((sum,s)=>sum+s.duration,0);
music.loop=true;

async function startMusic(){try{await music.play();musicBtn.textContent="♫ Music On"}catch{musicBtn.textContent="♫ Tap for music"}}
// Music starts only when the birthday movie is started by the user.
musicBtn.addEventListener("click",async()=>{if(music.paused)await startMusic();else{music.pause();musicBtn.textContent="♫ Music Off"}});

function clearFx(){particles.innerHTML="";actionFx.innerHTML="";movieEnd.classList.add("hidden")}
function spawnParticles(kind="hearts",amount=22){
 const set=kind==="confetti"?["🎉","✨","💗","🌸","💖"]:["💗","♡","✨","💕"];
 for(let i=0;i<amount;i++){const el=document.createElement("span");el.className="particle";el.textContent=set[Math.floor(Math.random()*set.length)];el.style.left=Math.random()*100+"%";el.style.setProperty("--duration",(3+Math.random()*3)+"s");el.style.fontSize=(13+Math.random()*18)+"px";particles.appendChild(el);setTimeout(()=>el.remove(),6500)}
}
function runFx(scene){
 clearFx();
 if(scene.fx==="hearts")spawnParticles("hearts",15);
 if(scene.fx==="blow"){actionFx.innerHTML='<div class="fx-word">Make a wish ✨</div><div class="breath">💨</div>';setTimeout(()=>{if(index===1){actionFx.innerHTML='<div class="fx-word">Wish made! 🕯️💨</div>';spawnParticles("hearts",16)}},2400)}
 if(scene.fx==="confetti"){spawnParticles("confetti",35);actionFx.innerHTML='<div class="fx-word">Together ❤️</div>'}
 if(scene.fx==="cake"){actionFx.innerHTML='<div class="fx-word">One sweet bite 🍰</div>';spawnParticles("hearts",20)}
 if(scene.fx==="ending"){spawnParticles("confetti",40);movieEnd.classList.remove("hidden")}
}
function showScene(i,fromAuto=false){
 index=(i+scenes.length)%scenes.length;const s=scenes[index];
 frame.classList.add("changing");clearFx();
 setTimeout(()=>{image.src=s.image;kicker.textContent=s.kicker;title.textContent=s.title;text.textContent=s.text;count.textContent=`SCENE 0${index+1} / 0${scenes.length}`;
 chapters.forEach((c,n)=>c.classList.toggle("active",n===index));
 frame.classList.remove("changing");frame.classList.remove("playing");void image.offsetWidth;frame.classList.add("playing");runFx(s);
 if(!fromAuto)totalElapsed=scenes.slice(0,index).reduce((sum,x)=>sum+x.duration,0);
 },180);
}
function stopMovie(){playing=false;music.pause();if(timer)clearTimeout(timer);if(raf)cancelAnimationFrame(raf);timer=null;raf=null;playBtn.textContent="▶ Play movie";frame.classList.remove("playing")}
function updateProgress(){if(!playing)return;const currentElapsed=totalElapsed+(performance.now()-sceneStarted);fill.style.width=Math.min(100,currentElapsed/totalDuration*100)+"%";const sec=Math.floor(currentElapsed/1000);timeNow.textContent=`00:${String(Math.min(25,sec)).padStart(2,"0")}`;raf=requestAnimationFrame(updateProgress)}
function advance(){if(!playing)return;totalElapsed=scenes.slice(0,index+1).reduce((sum,s)=>sum+s.duration,0);if(index===scenes.length-1){stopMovie();fill.style.width="100%";timeNow.textContent="00:25";playBtn.textContent="↺ Watch again";return}showScene(index+1,true);sceneStarted=performance.now();timer=setTimeout(advance,scenes[index].duration);if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(updateProgress)}
function playMovie(){stopMovie();totalElapsed=scenes.slice(0,index).reduce((sum,s)=>sum+s.duration,0);showScene(index,true);sceneStarted=performance.now();playing=true;playBtn.textContent="Ⅱ Pause movie";timer=setTimeout(advance,scenes[index].duration);raf=requestAnimationFrame(updateProgress);startMusic()}
document.getElementById("startBtn").addEventListener("click",()=>{document.getElementById("movie").scrollIntoView({behavior:"smooth"});playMovie()});
playBtn.addEventListener("click",()=>playing?stopMovie():playMovie());
document.getElementById("restartBtn").addEventListener("click",()=>{index=0;totalElapsed=0;fill.style.width="0%";timeNow.textContent="00:00";playMovie()});
chapters.forEach((c)=>c.addEventListener("click",()=>{stopMovie();totalElapsed=0;showScene(Number(c.dataset.index));fill.style.width=(index+1)/scenes.length*100+"%";timeNow.textContent="00:"+String(index*5).padStart(2,"0")}));
document.getElementById("soundBtn").addEventListener("click",()=>{toast.textContent=scenes[index].note;toast.classList.remove("hidden");setTimeout(()=>toast.classList.add("hidden"),3500)});
showScene(0);
