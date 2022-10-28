const canvas = document.querySelector("canvas"); // selectors
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
//contextid.. getContext =>그릴 수 있도록 도와주는 함수 호출

const TOTAL = 80;
const petalArray = [];

const petalImg = new Image(); // img 불러오기
petalImg.src = "./petal.png"; // petalImg에 ~.png 넣기
// 이렇게만 했을 때 draw가 안 됨. img를 다 불러오기 전에 render()을 실행하기 때문인데 이를 방지하기 위해
// onload를 이용해 img가 불러와 졌을 때 render()가 실행되도록 함.
petalImg.onload = () => {
	for (let i = 0; i < TOTAL; i++) {
		petalArray.push(new Petal());
	}
	render();
};

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// x, y, canvas.width, canvas.height.. clearRect=> 지우개 역할
	petalArray.forEach((petal) => {
		petal.animate();
		//배열안의 petal 를 불러와 아래 클래스에서 만든 animete() 실행
	});

	window.requestAnimationFrame(render); // 재귀함수
}

window.addEventListener("resize", () => {
	// type, listener()
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

// 벚꽃 잎  class
class Petal {
	constructor() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height * 2 - canvas.height;
		this.w = 30 + Math.random() * 15;
		this.h = 20 + Math.random() * 10;
		this.opacity = this.w / 45; // w의 최대값이 45 이라서
		this.xSpeed = 2 + Math.random(); // 2~3 px 사이값
		this.ySpeed = 1 + Math.random(); // 1~2 px 사이값
		this.flip = Math.random(); // 날리면서 크기를 늘렸다 줄였다 하는 옵션
		this.flipSpeed = Math.random() * 0.03;
	}

	draw() {
		if (this.y > canvas.height || this.x > canvas.width) {
			// 벽에 닿았을 때
			this.x = -petalImg.width;
			this.y = Math.random() * canvas.height * 2 - canvas.height;
			this.xSpeed = 2 + Math.random();
			this.ySpeed = 1 + Math.random() * 0.5;
			this.flip = Math.random();
		}
		ctx.globalAlpha = this.opacity;
		// img가 그려지기 전에 이를 적용하면 opacity가 적용되어 img가 그려짐
		ctx.drawImage(
			petalImg,
			this.x,
			this.y,
			this.w * (0.66 + Math.abs(Math.cos(this.flip)) / 3),
			this.h * (0.8 + Math.abs(Math.sin(this.flip)) / 2)
			// img, 시작하는 위치 x, y, 꽃잎의 가로세로 길이
		);
	}

	animate() {
		this.x += this.xSpeed;
		this.y += this.ySpeed;
		this.draw();
		this.flip += this.flipSpeed;
	}
}
