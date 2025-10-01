const GAME_SPEED = 60; // ความหน่วง (ms)
const GROUND_Y = 10;   
const DISPLAY_WIDTH = 80;
const DISPLAY_HEIGHT = 15;

let score = 0;
let coins = 0;
let dinoY = GROUND_Y;
let isJumping = false;
let jumpVelocity = 0;
let obstacleX = DISPLAY_WIDTH - 1;
let gameLoopInterval;

const display = document.getElementById('game-display');
const scoreElement = document.getElementById('score');
const coinsElement = document.getElementById('coins');
const statusElement = document.getElementById('status');

// สร้าง Skin Dino 
function getDinoShape(y) {
    if (y < GROUND_Y) {
        // กระโดด
        return [
            " _ ",
            "/|\\",
            "/ \\"
        ];
    } else {
        // วิ่งบนพื้น
        return [
            " _ ",
            "/|\\",
            "| |"
        ];
    }
}

// 1. วาดหน้าจอ
function drawScreen() {
    let grid = Array(DISPLAY_HEIGHT).fill().map(() => Array(DISPLAY_WIDTH).fill(' '));

    // วาดพื้น
    for (let x = 0; x < DISPLAY_WIDTH; x++) {
        grid[GROUND_Y + 1][x] = '_';
    }

    // วาดอุปสรรค
    if (obstacleX >= 0 && obstacleX < DISPLAY_WIDTH) {
        grid[GROUND_Y][obstacleX] = '#';
    }

    // วาด Dino
    const dinoShape = getDinoShape(dinoY);
    for (let i = 0; i < dinoShape.length; i++) {
        for (let j = 0; j < dinoShape[i].length; j++) {
            if (dinoShape[i][j] !== ' ') {
                grid[dinoY - dinoShape.length + 1 + i][5 + j] = dinoShape[i][j]; 
            }
        }
    }

    // แปลง Grid เป็น String เพื่อแสดงผล
    display.textContent = grid.map(row => row.join('')).join('\n');
}

// 2. จัดการการกระโดด
function updateJump() {
    if (isJumping) {
        dinoY -= jumpVelocity;
        jumpVelocity -= 1; // แรงโน้มถ่วง

        if (dinoY >= GROUND_Y) {
            dinoY = GROUND_Y;
            isJumping = false;
            jumpVelocity = 0;
        }
    }
}

// 3. จัดการอุปสรรค
function updateObstacle() {
    obstacleX--;
    if (obstacleX < 0) {
        obstacleX = DISPLAY_WIDTH - 1;
        score += 10;
        scoreElement.textContent = score;
    }
}

// 4. ตรวจสอบการชน 
function checkCollision() {
    // ตำแหน่ง Dino x=5 ถึง x=8
    if (obstacleX >= 5 && obstacleX <= 8 && dinoY >= GROUND_Y - 2) {
        gameOver();
        return true;
    }
    return false;
}

// 5. ลูปหลักของเกม
function gameLoop() {
    updateJump();
    updateObstacle();

    if (checkCollision()) {
        clearInterval(gameLoopInterval);
        return;
    }

    drawScreen();
}

// 6. การเริ่มต้นและจบเกม
function startGame() {
    score = 0;
    dinoY = GROUND_Y;
    isJumping = false;
    obstacleX = DISPLAY_WIDTH - 1;
    scoreElement.textContent = score;
    statusElement.textContent = 'กำลังเล่น...';
    
    gameLoopInterval = setInterval(gameLoop, GAME_SPEED);
}

function gameOver() {
    statusElement.textContent = 'เกมโอเวอร์! กด Spacebar เพื่อเริ่มใหม่';
}

// 7. จัดการ Input (Spacebar)
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault(); 
        if (!isJumping) {
            if (gameLoopInterval) {
                // ถ้าเกมเริ่มแล้ว
                isJumping = true;
                jumpVelocity = 7; 
            } else {
                // ถ้าเกมจบแล้ว หรือยังไม่เริ่ม
                startGame();
            }
        }
    }
});

// เริ่มต้นวาดหน้าจอ
drawScreen();
