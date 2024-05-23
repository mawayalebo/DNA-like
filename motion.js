// Initialize the canvas
const canvas = document.getElementById('motionCanvas');
const ctx = canvas.getContext('2d');

// Function to resize the canvas to fit the window
function resizeCanvas() {
    canvas.width = window.innerWidth ;
    canvas.height = window.innerHeight;
}

// Call resizeCanvas initially and on window resize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Mouse position
let mouseX = canvas.width ;
let mouseY = canvas.height;

canvas.addEventListener('mousemove', function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

const dots = [];
const numDots = 1000;
const colors = ['#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33A6', '#33FFF3'];

// Create initial dots
for (let i = 0; i < numDots; i++) {
    dots.push({
        offsetX: (i / numDots) * 9 * Math.PI,  
        yOffset: Math.random() * 1000,
        color: colors[i % colors.length],
        speed: 0.5 + Math.random() * 2,  
        amplitude: 100,  
        frequency: 0.07,  
        centerY: canvas.height /2 
    });
}

function drawMotion() {
    // Set the fading effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw each dot
    dots.forEach((dot, index) => {
        // DNA structure motion
        const time = Date.now() / 1000;  // Current time in seconds
        const phase = dot.offsetX + time * dot.speed;  // Phase shift for smooth motion
        const centerX = canvas.width / 50 + index  * Math.PI;  // Start position for each helix

        // Calculate direction vector towards the mouse
        const dx = mouseX - centerX;
        const dy = mouseY - dot.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Normalize direction vector
        const dirX = dx /distance;
        const dirY = dy / distance;

        // Move the dot towards the mouse
        dot.x = centerX + dirX * dot.amplitude * Math.cos(phase);
        dot.y = dot.centerY + dirY * dot.amplitude * Math.sin(phase);

        // Draw the dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2, false);
        ctx.fillStyle = dot.color;
        ctx.fill();

        // Interaction effect: change size and color when near mouse
        if (Math.hypot(mouseX - dot.x, mouseY - dot.y) < 50) {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 6, 0, Math.PI * 2, false);  
            ctx.fillStyle = dot.color;  
            ctx.fill();

            //Draw a connecting line
            ctx.strokeStyle = dot.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(dot.x, dot.y);
            ctx.stroke();
        }
    });

    // Loop the animation
    requestAnimationFrame(drawMotion);
}

// Start the animation
drawMotion();
