//==============================
// Wedding Invitation
//==============================

// تاریخ مراسم
const weddingDate = new Date("2027-03-21T19:30:00").getTime();

//==============================
// شمارش معکوس
//==============================

const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

function updateCountdown(){

const now = new Date().getTime();

const distance = weddingDate - now;

if(distance <= 0){

document.querySelector(".timer").innerHTML =
"<h2>💍 امروز جشن ماست 💍</h2>";

clearInterval(timer);

return;

}

days.innerHTML =
Math.floor(distance/(1000*60*60*24));

hours.innerHTML =
Math.floor((distance%(1000*60*60*24))/(1000*60*60));

minutes.innerHTML =
Math.floor((distance%(1000*60*60))/(1000*60));

seconds.innerHTML =
Math.floor((distance%(1000*60))/1000);

}

const timer = setInterval(updateCountdown,1000);

updateCountdown();

//==============================
// حذف Loader
//==============================

window.onload = ()=>{

setTimeout(()=>{

loader.style.opacity="0";

loader.style.pointerEvents="none";

setTimeout(()=>{

loader.remove();

},700);

},1500);

};

//==============================
// موزیک
//==============================

const music=document.getElementById("music");

const play=document.getElementById("play");

play.onclick=()=>{

if(music.paused){

music.play();

play.innerHTML="⏸ توقف موسیقی";

}else{

music.pause();

play.innerHTML="🎵 پخش موسیقی";

}

};

//==============================
// دکمه بازگشت بالا
//==============================

const topButton=document.getElementById("topButton");

window.addEventListener("scroll",()=>{

if(window.scrollY>300){

topButton.style.display="block";

}else{

topButton.style.display="none";

}

});

topButton.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};
//==============================
// آپلود عکس
//==============================

const uploadBtn = document.getElementById("uploadBtn");
const photo = document.getElementById("photo");

if(uploadBtn){

uploadBtn.onclick = async ()=>{

if(photo.files.length===0){

alert("ابتدا یک عکس انتخاب کنید.");

return;

}

const formData = new FormData();

formData.append("file",photo.files[0]);

try{

const res = await fetch("/upload",{

method:"POST",

body:formData

});

if(res.ok){

alert("✅ عکس با موفقیت ارسال شد.");

// باز کردن چت تلگرام شما
window.open("https://t.me/hanieh_jewelry_designer","_blank");

}else{

alert("خطا در ارسال عکس");

}

}catch(err){

alert("ارتباط با سرور برقرار نشد.");

}

};

}

//==============================
// افکت نمایش بخش‌ها
//==============================

const observer = new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";

}

});

});

document.querySelectorAll("section").forEach(section=>{

section.style.opacity="0";

section.style.transform="translateY(60px)";

section.style.transition=".8s";

observer.observe(section);

});

//==============================
// دکمه اشتراک گذاری
//==============================

function shareInvitation(){

if(navigator.share){

navigator.share({

title:"دعوت عروسی هانیه و حسن",

text:"با افتخار شما را به مراسم خود دعوت می‌کنیم.",

url:"https://DigiPostal.ir/chag05j"

});

}else{

navigator.clipboard.writeText("https://DigiPostal.ir/chag05j");

alert("لینک دعوت‌نامه کپی شد.");

}

}

//==============================
// افکت قلب هنگام لمس (اندروید)
//==============================

document.addEventListener("touchstart",e=>{

const heart=document.createElement("div");

heart.innerHTML="❤️";

heart.style.position="fixed";

heart.style.left=e.touches[0].clientX+"px";

heart.style.top=e.touches[0].clientY+"px";

heart.style.fontSize="22px";

heart.style.pointerEvents="none";

heart.style.transition="1.5s";

heart.style.zIndex="99999";

document.body.appendChild(heart);

setTimeout(()=>{

heart.style.transform="translateY(-120px) scale(1.8)";

heart.style.opacity="0";

},50);

setTimeout(()=>{

heart.remove();

},1500);

});

//==============================
// پایان
//==============================

console.log("Wedding Invitation Loaded Successfully");
