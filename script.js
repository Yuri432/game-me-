// 1. กำหนดตัวแปร Canvas และสถานะเกม
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const GROUND_Y = GAME_HEIGHT - 50; 

let score = 0;
let coins = 0;
let isJumping = false;
let velocityY = 0;
let positionY = GROUND_Y;
let obstacleX = GAME_WIDTH;
let gameLoopInterval = null;
let gameRunning = false;

// 2. โหลดรูปภาพ
const dinoImg = new Image();
dinoImg.src = 'character.png'; 
const obstacleImg = new Image();
obstacleImg.src = 'obstacle.png'; 
const backgroundImg = new Image();
backgroundImg.src = 'background.jpg'; // ฉากหลัง

// รอให้รูปภาพโหลดก่อนเริ่มวาด (สำคัญสำหรับเกมกราฟิก)
let assetsLoaded = false;
let imagesToLoad = 3; 

function assetLoaded() {
    imagesToLoad--;
    if (imagesToLoad === 0) {
        assetsLoaded = true;
        draw(); // วาดหน้าจอเริ่มต้น
    }
}

dinoImg.onload = assetLoaded;
obstacleImg.onload = assetLoaded;
backgroundImg.onload = assetLoaded;

// 3. ฟังก์ชันการวาด
function draw() {
    if (!assetsLoaded) return;
    
    // วาดพื้นหลัง (ใช้รูปภาพ)
    // การใช้ repeat-x หรือการวาดหลายครั้งเพื่อจำลองการเลื่อนฉากหลัง (Parallax)
    ctx.drawImage(backgroundImg, 0, 0, GAME_WIDTH, GAME_HEIGHT);

    // วาดพื้นดิน
    ctx.fillStyle = 'green';
    ctx.fillRect(0, GROUND_Y + 5, GAME_WIDTH, 50);

    // วาดตัวละคร (ใช้รูปภาพ)
    ctx.drawImage(dinoImg, 50, positionY - 50, 50, 50); 
    
    // วาดสิ่งกีดขวาง (ใช้รูปภาพ)
    ctx.drawImage(obstacleImg, obstacleX, GROUND_Y - 30, 30, 30); 
}

// 4. ลอจิกการอัปเดตเกม
function update() {
    // อัปเดตการกระโดด
    if (isJumping || positionY < GROUND_Y) {
        positionY += velocityY;
        velocityY += 1.5; 
        if (positionY >= GROUND_Y) {
            positionY = GROUND_Y;
            isJumping = false;
            velocityY = 0;
        }
    }

    // อัปเดตสิ่งกีดขวาง
    obstacleX -= 8; 
    if (obstacleX < -30) {
        obstacleX = GAME_WIDTH;
        score += 1;
        coins += 5; // ได้เงินทุกครั้งที่ผ่านสิ่งกีดขวาง
        document.getElementById('score').textContent = score;
        document.getElementById('coins').textContent = coins;
    }

    // ตรวจสอบการชน (Hitboxes)
    const dinoHitbox = { x: 50, y: positionY - 50, w: 50, h: 50 };
    const obsHitbox = { x: obstacleX, y: GROUND_Y - 30, w: 30, h: 30 };

    if (dinoHitbox.x < obsHitbox.x + obsHitbox.w &&
        dinoHitbox.x + dinoHitbox.w > obsHitbox.x &&
        dinoHitbox.y < obsHitbox.y + obsHitbox.h &&
        dinoHitbox.y + dinoHitbox.h > obsHitbox.y) {
        gameOver();
        return;
    }
}

// 5. ลูปหลัก
function gameLoop() {
    update();
    draw();
}

// 6. การควบคุมเกม
function startGame() {
    if (gameRunning) return;
    score = 0;
    coins = 0;
    positionY = GROUND_Y;
    obstacleX = GAME_WIDTH;
    document.getElementById('score').textContent = score;
    document.getElementById('coins').textContent = coins;
    document.getElementById('status').textContent = 'กำลังเล่น...';
    gameLoopInterval = setInterval(gameLoop, 30);
    gameRunning = true;
}

function gameOver() {
    clearInterval(gameLoopInterval);
    gameLoopInterval = null;
    gameRunning = false;
    document.getElementById('status').textContent = 'เกมโอเวอร์! กด Spacebar เพื่อเริ่มใหม่';
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' || event.key === ' ') {
        if (!gameRunning) {
            startGame();
        } else if (!isJumping && positionY >= GROUND_Y) {
            isJumping = true;
            velocityY = -20;
        }
    }
});

// 7. ลอจิกสำหรับเมนู (Shop/Redeem)
function openMenu(tabName) {
    clearInterval(gameLoopInterval); // หยุดเกม
    document.getElementById('game-menu').style.display = 'block';
    
    // ซ่อนเนื้อหาทั้งหมด
    document.querySelectorAll('.menu-tab').forEach(tab => {
        tab.style.display = 'none';
    });

    // แสดงเนื้อหาตามที่เลือก
    document.getElementById(tabName + '-content').style.display = 'block';
}

function closeMenu() {
    document.getElementById('game-menu').style.display = 'none';
    // ไม่ต้องเริ่มเกมทันที ให้ผู้เล่นกด Spacebar เริ่มเอง
}

function buyItem(itemId) {
    if (itemId === 'light_skin' && coins >= 5000) {
        coins -= 5000;
        document.getElementById('coins').textContent = coins;
        alert('ซื้อสกินแสงสำเร็จ! (แต่ยังไม่มีโค้ดเปลี่ยนสกินจริง)');
    } else {
        alert('เงินไม่พอ หรือไอเทมไม่มี!');
    }
}

function redeemCode() {
    const code = document.getElementById('redeem-code-input').value.toUpperCase();
    if (code === 'GEMINI2025') {
        coins += 10000;
        document.getElementById('coins').textContent = coins;
        alert('แลกโค้ดสำเร็จ! ได้รับ 10000 เงิน!');
    } else {
        alert('โค้ดไม่ถูกต้อง!');
    }
}
