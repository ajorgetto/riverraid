const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const planeImg = new Image();
const enemyImg = new Image();
const fuelImg = new Image();

planeImg.src = 'image/bob-esponja.png'; // Imagem do avião
enemyImg.src = 'image/plankton.png'; // Imagem do inimigo
fuelImg.src = 'image/hamburguer-siri.png';   // Imagem do combustível

let plane = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    fuel: 100,
    lives: 3
};

let bullets = [];
let enemies = [];
let fuelItems = [];
let score = 0;
let gameOver = false;
let gameStartTime, gameEndTime;

function startGame() {
    gameStartTime = new Date();
    gameLoop();
    setInterval(shoot, 500); // Dispara tiros continuamente a cada 500ms
}

function gameLoop() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        movePlane();
        updateBullets();
        updateEnemies();
        updateFuelItems();
        checkCollisions();
        updateFuel();
        displayStats();
        requestAnimationFrame(gameLoop);
    }
}

function movePlane() {
    if (keys['ArrowLeft'] && plane.x > 0) plane.x -= plane.speed;
    if (keys['ArrowRight'] && plane.x + plane.width < canvas.width) plane.x += plane.speed;
    if (keys['ArrowUp'] && plane.y > 0) plane.y -= plane.speed;
    if (keys['ArrowDown'] && plane.y + plane.height < canvas.height) plane.y += plane.speed;
    drawPlane();
}

function drawPlane() {
    ctx.drawImage(planeImg, plane.x, plane.y, plane.width, plane.height);
}

function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= 7;
        if (bullet.y < 0) bullets.splice(index, 1);
        drawBullet(bullet);
    });
}

function drawBullet(bullet) {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

function updateEnemies() {
    if (Math.random() < 0.02) {
        enemies.push({ x: Math.random() * (canvas.width - 50), y: -50, width: 50, height: 50 });
    }

    enemies.forEach((enemy, index) => {
        enemy.y += 3;
        if (enemy.y > canvas.height) enemies.splice(index, 1);
        drawEnemy(enemy);
    });
}

function drawEnemy(enemy) {
    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
}

function updateFuelItems() {
    if (Math.random() < 0.01) {
        fuelItems.push({ x: Math.random() * (canvas.width - 30), y: -30, width: 30, height: 30 });
    }

    fuelItems.forEach((fuelItem, index) => {
        fuelItem.y += 2;
        if (fuelItem.y > canvas.height) fuelItems.splice(index, 1);
        drawFuelItem(fuelItem);
    });
}

function drawFuelItem(fuelItem) {
    ctx.drawImage(fuelImg, fuelItem.x, fuelItem.y, fuelItem.width, fuelItem.height);
}

function checkCollisions() {
    enemies.forEach((enemy, index) => {
        if (plane.x < enemy.x + enemy.width &&
            plane.x + plane.width > enemy.x &&
            plane.y < enemy.y + enemy.height &&
            plane.y + plane.height > enemy.y) {
            enemies.splice(index, 1);
            plane.lives--;
            if (plane.lives <= 0) endGame();
        }

        bullets.forEach((bullet, bIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                enemies.splice(index, 1);
                bullets.splice(bIndex, 1);
                score += 10;
            }
        });
    });

    fuelItems.forEach((fuelItem, index) => {
        if (plane.x < fuelItem.x + fuelItem.width &&
            plane.x + plane.width > fuelItem.x &&
            plane.y < fuelItem.y + fuelItem.height &&
            plane.y + plane.height > fuelItem.y) {
            fuelItems.splice(index, 1);
            plane.fuel = Math.min(plane.fuel + 30, 100); // Restaura combustível
        }
    });
}

function updateFuel() {
    plane.fuel -= 0.05; // O combustível agora diminui mais lentamente
    if (plane.fuel <= 0) endGame();
}

function displayStats() {
    document.getElementById('score').innerText = `Pontuação: ${score}`;
    document.getElementById('fuel').innerText = `Combustível: ${plane.fuel.toFixed(1)}%`;
    document.getElementById('lives').innerText = `Vidas: ${plane.lives}`;
}

function endGame() {
    gameEndTime = new Date();
    gameOver = true;
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalScore').innerText = `Sua pontuação: ${score}`;
    saveGameStats();
}

function saveGameStats() {
    const gameTime = (gameEndTime - gameStartTime) / 1000;
    const stats = {
        startTime: gameStartTime,
        endTime: gameEndTime,
        score: score,
        gameTime: gameTime,
        enemiesDestroyed: score / 10,  // Example calculation
        bulletsFired: bullets.length,
        distance: plane.y
    };
    console.log('Game Stats:', stats);
}

function restartGame() {
    plane = { ...plane, x: canvas.width / 2 - 25, y: canvas.height - 60, fuel: 100, lives: 3 };
    bullets = [];
    enemies = [];
    fuelItems = [];
    score = 0;
    gameOver = false;
    document.getElementById('gameOver').style.display = 'none';
    startGame();
}

let keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function shoot() {
    bullets.push({ x: plane.x + plane.width / 2 - 2.5, y: plane.y, width: 5, height: 10 });
}

// Iniciar o jogo ao carregar a página
window.onload = startGame;
