
// Confetti animation
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const confettiColors = ['#ff4e50', '#f9d423', '#ffd200', '#42e695', '#3bb2b8', '#f7971e', '#f953c6', '#43cea2'];
    let confetti = [];
    for (let i = 0; i < 120; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            r: 6 + Math.random() * 8,
            d: Math.random() * 1.5 + 1,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngle: 0,
            tiltAngleInc: Math.random() * 0.07 + 0.03
        });
    }
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach(c => {
            ctx.beginPath();
            ctx.lineWidth = c.r;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.r);
            ctx.stroke();
        });
        updateConfetti();
        requestAnimationFrame(drawConfetti);
    }
    function updateConfetti() {
        confetti.forEach(c => {
            c.y += c.d;
            c.tiltAngle += c.tiltAngleInc;
            c.tilt = Math.sin(c.tiltAngle) * 12;
            if (c.y > canvas.height) {
                c.x = Math.random() * canvas.width;
                c.y = -10;
            }
        });
    }
    drawConfetti();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

window.onload = startConfetti;

document.getElementById('surprise-btn').addEventListener('click', function() {
    const surprise = document.getElementById('surprise');
    surprise.style.display = 'block';
    surprise.innerHTML = '🎈🎁 Wishing you a day filled with joy, laughter, and cake! 🎉🥳<br><span style="font-size:1.2em;">Scroll down for a mini game!</span>';
    document.getElementById('game-section').style.display = 'block';
    showSparkles();
});

// Sparkle (freckles) animation
function showSparkles() {
    const container = document.getElementById('sparkle-container');
    container.innerHTML = '';
    const colors = ['#00c3ff', '#ffff1c', '#fff', '#ffb347', '#ffe680'];
    for (let i = 0; i < 40; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 90 + '%';
        sparkle.style.top = (30 + Math.random() * 40) + '%';
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.width = sparkle.style.height = (8 + Math.random() * 10) + 'px';
        sparkle.style.opacity = 0.7 + Math.random() * 0.3;
        sparkle.style.position = 'absolute';
        sparkle.style.borderRadius = '50%';
        sparkle.style.zIndex = 10;
        sparkle.style.boxShadow = `0 0 12px 2px ${sparkle.style.background}`;
        sparkle.style.animation = `sparkle-pop 1.2s ${Math.random()}s ease-out forwards`;
        container.appendChild(sparkle);
    }
    setTimeout(() => { container.innerHTML = ''; }, 1800);
}

// Start Game button logic
document.getElementById('start-game-btn').addEventListener('click', function() {
    startCakeGame();
});

// --- Catch the Falling Cake Game (with emoji cakes) ---
function startCakeGame() {
    const canvas = document.getElementById('cake-canvas');
    const ctx = canvas.getContext('2d');
    const scoreDiv = document.getElementById('cake-score');
    const resultDiv = document.getElementById('cake-result');
    let plate = { x: 130, y: 370, w: 70, h: 22, speed: 8 };
    let cakes = [];
    let score = 0;
    let gameOver = false;
    let timeLeft = 20;
    let gameInterval, cakeInterval, timerInterval;

    function drawPlate() {
        ctx.save();
        ctx.shadowColor = '#7f53ac';
        ctx.shadowBlur = 12;
        ctx.fillStyle = 'rgba(100,125,222,0.85)';
        ctx.beginPath();
        ctx.ellipse(plate.x + plate.w/2, plate.y + plate.h/2, plate.w/2, plate.h/2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(plate.x + plate.w/2, plate.y + plate.h/2, plate.w/2, plate.h/2, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }

    function drawCakeEmoji(cake) {
        ctx.font = `${cake.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.save();
        ctx.shadowColor = '#ff6a88';
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.95;
        ctx.fillText('🎂', cake.x + cake.size/2, cake.y);
        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // fun background dots
        for (let i = 0; i < 12; i++) {
            ctx.save();
            ctx.globalAlpha = 0.08;
            ctx.beginPath();
            ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, 18+Math.random()*18, 0, 2*Math.PI);
            ctx.fillStyle = ['#7f53ac','#647dee','#ff6a88','#e0c3fc'][Math.floor(Math.random()*4)];
            ctx.fill();
            ctx.restore();
        }
        drawPlate();
        cakes.forEach(drawCakeEmoji);
    }

    function update() {
        cakes.forEach(cake => {
            cake.y += cake.speed;
        });
        // Remove cakes that are out of bounds or caught
        cakes = cakes.filter(cake => {
            if (
                cake.y + cake.size > plate.y &&
                cake.x + cake.size > plate.x &&
                cake.x < plate.x + plate.w
            ) {
                // caught
                score++;
                return false;
            }
            if (cake.y > canvas.height) return false;
            return true;
        });
    }

    function gameLoop() {
        if (gameOver) return;
        update();
        draw();
        scoreDiv.innerHTML = `<span style="color:#7f53ac;font-weight:bold;">Score:</span> ${score} <span style="color:#647dee;">|</span> <span style="color:#ff6a88;">Time:</span> ${timeLeft}s`;
    }

    function spawnCake() {
        const size = 36 + Math.random() * 10;
        const x = Math.random() * (canvas.width - size);
        cakes.push({ x, y: -size, size, speed: 2.5 + Math.random() * 1.5 });
    }

    function endGame() {
        gameOver = true;
        clearInterval(gameInterval);
        clearInterval(cakeInterval);
        clearInterval(timerInterval);
        draw();
        resultDiv.innerHTML = `🎉 Game Over! You caught <span style="color:#ff6a88;">${score}</span> cakes! <br> ${score >= 10 ? 'Amazing! Have a sweet year ahead! 🎂' : 'Try again for a higher score!'} `;
    }

    function movePlate(e) {
        if (gameOver) return;
        if (e.key === 'ArrowLeft') plate.x -= plate.speed;
        if (e.key === 'ArrowRight') plate.x += plate.speed;
        if (plate.x < 0) plate.x = 0;
        if (plate.x + plate.w > canvas.width) plate.x = canvas.width - plate.w;
    }

    function mouseMovePlate(e) {
        if (gameOver) return;
        const rect = canvas.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        plate.x = mouseX - plate.w / 2;
        if (plate.x < 0) plate.x = 0;
        if (plate.x + plate.w > canvas.width) plate.x = canvas.width - plate.w;
    }

    // Reset
    cakes = [];
    score = 0;
    gameOver = false;
    timeLeft = 20;
    plate.x = 130;
    resultDiv.textContent = '';
    scoreDiv.textContent = 'Score: 0 | Time: 20s';
    draw();

    document.addEventListener('keydown', movePlate);
    canvas.addEventListener('mousemove', mouseMovePlate);

    gameInterval = setInterval(gameLoop, 20);
    cakeInterval = setInterval(spawnCake, 700);
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            endGame();
            document.removeEventListener('keydown', movePlate);
            canvas.removeEventListener('mousemove', mouseMovePlate);
        }
    }, 1000);
}
