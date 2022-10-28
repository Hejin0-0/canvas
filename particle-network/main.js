import utils from "./utils.js";

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

class Particle {
	constructor(x, y, radius, velocity) {
		// [particles.push~] 에서 넘겨받은 값을 각각에 저장해서 draw 함수에 넘겨줌.
		this.x = x;
		this.y = y;
		this.radius = radius; // 반지름
		this.velocity = velocity; // x, y의 -2 ~ 2 사이의 랜덤한 속도로 움직임
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		// x, y, radius, 'startAngle', 'endAngle', 'counterclockwise'
		ctx.fillStyle = "#fff";
		ctx.fill();
		ctx.closePath();
	}

	animate() {
		if (
			// 화면 밖으로 사라지면 화면 내 랜덤한 위치에 생성
			this.x < 0 ||
			this.x > innerWidth ||
			this.y < 0 ||
			this.y > innerHeight
		) {
			this.x = utils.randomFloatBetween(0, innerWidth);
			this.y = utils.randomFloatBetween(0, innerHeight);
		}
		(mouse.isActive ? particles.concat(mouse) : particles).forEach(
			(particle) => {
				// mouse가 canvas 안에 있을 때(True) particles 배열 안에 mouse를 concat으로 추가해서
				// TOTAL + 1로 순회하게 만들어 주고 없을 때(flase) particles 50개만 forEach문을 순회
				const distance = utils.distance(
					// 내 particle 과 다른 particle 사이의 거리 구하기
					particle.x,
					particle.y,
					this.x,
					this.y
				);
				if (distance < 200) {
					// 200 반경 안에 들어오면 선을 그리기
					const from = { x: this.x, y: this.y };
					// 시작점 - 내 particle의 x, y좌표
					const to = { x: particle.x, y: particle.y };
					// 끝점 - 다른 particle의 x, y좌표
					new Line(from, to, distance).draw();
					// distance => opacity
				}
			}
		);

		this.x += this.velocity.x;
		this.y += this.velocity.y;

		this.draw();
	}
}

class Line {
	constructor(from, to, distance) {
		this.from = from;
		this.to = to;
		this.distance = distance;
	}

	draw() {
		ctx.beginPath();
		ctx.moveTo(this.from.x, this.from.y); //선을 그릴 위치로 이동
		ctx.lineTo(this.to.x, this.to.y); //선이 끝날 위치 지정
		ctx.strokeStyle = `rgba(255, 215, 0, ${1 - this.distance / 200})`; // 선 style
		// 현재 거리 distance가 200과 가까워 지게 되면 값이 0에 수렴해 선이 점점 흐려짐
		ctx.lineWidth = 1;
		ctx.stroke(); // 선 그리기
	}
}

const TOTAL = 150;
let particles = [];
let mouse = { x: 0, y: 0, isActive: false }; // 내 mouse x, y좌표
for (let i = 0; i < TOTAL; i++) {
	const x = utils.randomFloatBetween(0, innerWidth); // 0부터 innerWidth 사이 Random
	const y = utils.randomFloatBetween(0, innerHeight); // 0부터 innerHeight 사이 Random
	const radius = utils.randomFloatBetween(0.5, 2);
	const velocity = {
		x: utils.randomFloatBetween(-2, 2),
		y: utils.randomFloatBetween(-2, 2),
	};
	particles.push(new Particle(x, y, radius, velocity)); // x, y, radius.. 이 값을 class Particle 에 전달
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// canvas 그리고 지우고 할 수 있도록 만들어 줌
	particles.forEach((particle) => particle.animate());
	// particles 배열을 순회하면서 각각 class Particle 안에서 정의한 animate 함수를 실행

	window.requestAnimationFrame(render); // 재귀함수, 콜백 인자.. 스스로 계속 실행
}

window.addEventListener("resize", () => {
	// canvas 크기에 따라 계속 변경
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});
canvas.addEventListener("mouseenter", () => (mouse.isActive = true));
canvas.addEventListener("mouseleave", () => (mouse.isActive = false));
canvas.addEventListener("mousemove", (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

render();
