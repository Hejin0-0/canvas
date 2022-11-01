import { Tree } from "./tree.js";

class App {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);

		this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
		// 레티나 디스플레이에서도 잘 보이기 위해서. 값이 1보다 크면 캔버스의 사이즈와 비율을 2배, 1 이하면 1배로 설정

		window.addEventListener("resize", this.resize.bind(this), false);
		window.addEventListener("click", this.click.bind(this), false);
		this.resize();
		this.setBtn();

		// canvas 너비 /2 지점에 Tree 생성
		// new Tree(this.ctx, this.stageWidth / 2, this.stageHeight);
	}

	setBtn() {
		this.nightBtn = document.querySelector(".night");
		this.dayBtn = document.querySelector(".day");

		this.day = true;

		this.nightBtn.addEventListener(
			"click",
			this.nightBtnHandler.bind(this),
			false
		);
		this.dayBtn.addEventListener(
			"click",
			this.dayBtnHandler.bind(this),
			false
		);
	}

	nightBtnHandler() {
		this.resize();
		this.dayBtn.classList.add("show");
		this.nightBtn.classList.remove("show");
		document.body.classList.add("black");
		this.day = false;
	}

	dayBtnHandler() {
		this.resize();
		this.dayBtn.classList.remove("show");
		this.nightBtn.classList.add("show");
		document.body.classList.remove("black");
		this.day = true;
	}

	resize() {
		// body의 너비와 높이
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		// 디스플레이 비율에 맞추어 캔버스 사이즈와 비율 조정
		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;
		this.ctx.scale(this.pixelRatio, this.pixelRatio);

		// 리사이즈시 캔버스를 비워줌
		// 이전 사이즈일 때 그려진 내용들이 현재 사이즈에서 어색하게 보이는 것을 방지
		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
	}

	click(event) {
		// 마우스 x 좌표와 화면의 가장 밑 좌표인 this.stageHeight를 사용해 Tree 객체 생성
		const { clientX } = event;
		if (event.target.className !== "material-icons")
			new Tree(this.ctx, clientX, this.stageHeight, this.day);
	}
}

window.onload = () => {
	new App();
};
