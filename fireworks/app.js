const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2,
};

// Event Listeners
addEventListener("resize", () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	init();
});

const gravity = 0.01;
const friction = 0.98;

// Object
class Particle {
	constructor(x, y, radius, color, velocity) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.velocity = velocity;
		this.alpha = 1;
	}

	draw() {
		ctx.save();
		ctx.globalAlpha = this.alpha;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}

	update() {
		this.draw();
		this.velocity.x *= friction;
		this.velocity.y *= friction;
		this.velocity.y += gravity;
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.alpha -= 0.005;
	}
}

// Implementation
let particles;

function init() {
	particles = [];
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	particles.forEach((particle, i) => {
		if (particle.alpha > 0) {
			particle.update();
		} else {
			particles.splice(i, 1);
		}
	});
}

init();
animate();

window.addEventListener("click", (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;

	const particleCount = 500;
	const angleIncrement = (Math.PI * 2) / particleCount;
	const power = 15;

	for (let i = 0; i < particleCount; i++) {
		particles.push(
			new Particle(
				mouse.x,
				mouse.y,
				5,
				`hsl(${Math.random() * 360}, 50%, 50%)`,
				{
					x: Math.cos(angleIncrement * i) * Math.random() * power,
					y: Math.sin(angleIncrement * i) * Math.random() * power,
				}
			)
		);
	}
});
