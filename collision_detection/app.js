// Initial Setup
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

// Variables
const mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2,
};

const colors = ["#2185C5", "7ECEFD", "#FF7F66"];

// Event Listeners
addEventListener("mousemove", (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

addEventListener("resize", () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	init();
});

// Utility Functions
function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
	const xDist = x2 - x1;
	const yDist = y2 - y1;

	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function rotateVelocities(velocity, theta) {
	const rotatedVelocity = {
		x: velocity.x * Math.cos(theta) - velocity.y * Math.sin(theta),
		y: velocity.x * Math.sin(theta) + velocity.y * Math.cos(theta),
	};
	return rotatedVelocity;
}

// Objects
class Particle {
	constructor(x, y, radius, color) {
		this.x = x;
		this.y = y;
		this.velocity = {
			x: (Math.random() - 0.5) * 3,
			y: (Math.random() - 0.5) * 3,
		};
		this.radius = radius;
		this.color = color;
		this.mass = 1;
		this.opacity = 0;

		this.update = (particles) => {
			this.draw();

			for (let i = 0; i < particles.length; i++) {
				if (this === particles[i]) continue;
				if (
					distance(this.x, this.y, particles[i], particles[i].y) -
						this.radius * 2 <
					0
				) {
					resolveCollision(this, particles[i]);
				}
			}

			if (
				this.x - this.radius <= 0 ||
				this.x + this.radius >= innerWidth
			) {
				this.velocity.x = -this.velocity.x;
			}
			if (
				this.y - this.radius <= 0 ||
				this.y + this.radius >= innerHeight
			) {
				this.velocity.y = -this.velocity.y;
			}

			// mouse collision detection
			if (
				distance(mouse.x, mouse.y, this.x, this.y) < 80 &&
				this.opacity < 0.2
			) {
				this.opacity += 0.02;
			} else if (this.opacity > 0) {
				this.opacity -= 0.02;

				this.opacity = Math.max(0, this.opacity);
			}

			this.x += this.velocity.x;
			this.y += this.velocity.y;
		};

		this.draw = () => {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			ctx.save();
			ctx.globalAlpha = this.opacity;
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.restore();
			ctx.strokeStyle = this.color;
			ctx.stroke();
			ctx.closePath();
		};
	}
}

// Implementation
let particles;

function init() {
	particles = [];
	let radius = 15;

	for (let i = 0; i < 400; i++) {
		let x = randomIntFromRange(radius, innerWidth - radius);
		let y = randomIntFromRange(radius, innerHeight - radius);

		if (particles.length >= 1) {
			for (let j = 0; j < particles.length; j++) {
				if (
					distance(x, y, particles[j].x, particles[j].y) -
						radius * 2 <
					0
				) {
					x = randomIntFromRange(radius, innerWidth - radius);
					y = randomIntFromRange(radius, innerHeight - radius);

					j = -1;
					continue;
				}
			}
		}

		particles.push(new Particle(x, y, radius, randomColor(colors)));
	}
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	particles.forEach((particle) => {
		particle.update(particles);
	});
}

init();
animate();
