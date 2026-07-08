const envelope = document.getElementById("envelope");
const flap = document.querySelector(".flap");
const letter = document.querySelector(".letter");
const music = document.getElementById("music");
const message = document.getElementById("message");

const bowWrapper = document.getElementById("bowWrapper");
const arrow = document.getElementById("arrow");
const stageShooting = document.getElementById("stage-shooting");
const stageQuestion = document.getElementById("stage-question");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");

const text = `ถึง... คนพิเศษของเค้า ❤️
ขอบคุณสำหรับทุก ๆ รอยยิ้ม และทุกช่วงเวลาดี ๆ ที่มีให้กันนะ
อยู่เป็นความสุขของกันและกันแบบนี้ไปนาน ๆ เลยนะค้าบ ✨`;

let opened = false;
let index = 0;
let canShoot = true;

function typeWriter() {
    if (index < text.length) {
        message.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, 40);
    } else {
        setTimeout(() => {
            gsap.to(stageShooting, { opacity: 0, duration: 0.8, onComplete: () => {
                stageShooting.classList.add("hidden");
                stageQuestion.classList.remove("hidden");
                gsap.from(stageQuestion, { opacity: 0, scale: 0.8, duration: 0.5 });
            }});
        }, 2500);
    }
}

// 1. ระบบหมุนคันธนูตามเมาส์
document.addEventListener("mousemove", (e) => {
    if (!canShoot) return;
    
    const bowRect = bowWrapper.getBoundingClientRect();
    const bowCenterX = bowRect.left + bowRect.width / 2;
    const bowCenterY = bowRect.top + bowRect.height / 2;
    
    const deltaX = e.clientX - bowCenterX;
    const deltaY = e.clientY - bowCenterY;
    
    const angleRad = Math.atan2(deltaY, deltaX);
    let angleDeg = angleRad * (180 / Math.PI) + 90;
    
    bowWrapper.style.transform = `rotate(${angleDeg}deg)`;
});

// 2. ระบบกดยิงธนู
document.addEventListener("click", (e) => {
    if (!canShoot || e.target.closest('#gallery') || e.target.closest('.buttons')) return;
    canShoot = false;

    if (music) { music.play().catch(() => {}); }

    gsap.to(arrow, {
        y: -window.innerHeight,
        duration: 0.6,
        ease: "power2.in",
        onComplete: () => {
            gsap.to(bowWrapper, { opacity: 0, duration: 0.3 });
            openEnvelope();
        }
    });
});

// 3. ฟังก์ชันกางซองจดหมายและดันการ์ดข้อความขึ้น (แก้บั๊กเลเยอร์เรียบร้อย)
function openEnvelope() {
    if (opened) return;
    opened = true;

    envelope.classList.add("open");

    // เปิดฝาซองขึ้นด้านบน
    gsap.to(flap, {
        rotationX: -180,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
            letter.style.zIndex = "6"; // ดันกระดาษขึ้นมาเหนือขอบฝาซอง
        }
    });

    // ดันกระดาษขึ้นมา
    // ค้นหาท่อนนี้ในฟังก์ชัน openEnvelope() ของไฟล์ script.js แล้วอัปเดตตรง onComplete ครับ
gsap.to(letter, {
    y: -240,
    duration: 1.2,
    delay: 0.4,
    ease: "back.out(1.4)",
    onStart: () => {
        letter.style.zIndex = "4";
    },
    onComplete: () => {
        const front = document.querySelector(".front");
        const waxSeal = document.querySelector(".wax-seal");
        
        // เฟดหน้าซองและตราครั่งออกไป
        gsap.to([front, waxSeal, flap], { 
            opacity: 0, 
            duration: 0.5, 
            pointerEvents: "none" 
        });

        // สั่งให้ปุ่มแสดงผลนุ่มๆ หลังจากที่จดหมายเด้งขึ้นมาสุดทางแล้ว
        const buttons = document.querySelector(".buttons");
        if (buttons) {
            buttons.style.visibility = "visible";
            buttons.style.opacity = "1";
        }
    }
});

    setTimeout(typeWriter, 1200);
    setInterval(createHeart, 300);
}

// 4. ปุ่ม NO วิ่งหนีเมาส์
document.addEventListener("mousemove", (e) => {
    if (stageQuestion.classList.contains("hidden")) return;

    const btnRect = noBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    
    const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
    
    if (distance < 100) {
        const padding = 50;
        const newX = Math.random() * (window.innerWidth - btnRect.width - padding * 2) + padding;
        const newY = Math.random() * (window.innerHeight - btnRect.height - padding * 2) + padding;
        
        noBtn.style.position = "fixed";
        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;
    }
});

yesBtn.addEventListener("click", () => {
    alert("Yayyy! I love you too! ❤️🌸 มารักกันนานๆ นะ");
    for(let i=0; i<30; i++) { setTimeout(createHeart, i * 50); }
});

/* ---------- เอฟเฟกต์ตกแต่งอื่นๆ ---------- */
function createHeart() {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerHTML = "❤️";
    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.fontSize = (20 + Math.random() * 30) + "px";
    heart.style.animationDuration = (3 + Math.random() * 3) + "s";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}

const stars = document.getElementById("stars");
for (let i = 0; i < 100; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";
    star.style.animationDelay = Math.random() * 2 + "s";
    stars.appendChild(star);
}

function createFlower() {
    const flower = document.createElement("div");
    flower.className = "flower";
    flower.innerHTML = "🌸";
    flower.style.left = Math.random() * window.innerWidth + "px";
    flower.style.animationDuration = (5 + Math.random() * 4) + "s";
    document.body.appendChild(flower);
    setTimeout(() => flower.remove(), 9000);
}
setInterval(createFlower, 700);

function createSpark() {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.left = Math.random() * window.innerWidth + "px";
    s.style.top = Math.random() * window.innerHeight + "px";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
}
setInterval(createSpark, 150);

const cursor = document.createElement("div");
cursor.className = "cursor";
document.body.appendChild(cursor);
document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX - 9 + "px";
    cursor.style.top = e.clientY - 9 + "px";
});

/* ---------- แกลเลอรีรูปภาพ ---------- */
const photos = ["assets/photo1.jpg","assets/photo2.png","assets/photo3.png","assets/photo4.png","assets/photo5.png","assets/photo6.png","assets/photo7.png"];
let current = 0;
const gallery = document.getElementById("gallery");
const galleryImage = document.getElementById("galleryImage");

document.getElementById("galleryBtn").onclick = (e) => {
    e.stopPropagation();
    gallery.style.display = "flex";
    galleryImage.src = photos[current];
}
document.getElementById("closeGallery").onclick = () => { gallery.style.display = "none"; }
document.getElementById("next").onclick = () => { current = (current + 1) % photos.length; galleryImage.src = photos[current]; }
document.getElementById("prev").onclick = () => { current = (current - 1 + photos.length) % photos.length; galleryImage.src = photos[current]; }
document.getElementById("musicBtn").onclick = (e) => {
    e.stopPropagation();
    if (music.paused) music.play(); else music.pause();
}
