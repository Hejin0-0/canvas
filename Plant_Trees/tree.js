import { Branch } from "./branch.js";

export class Tree {
	constructor(ctx, posX, posY) {
		this.ctx = ctx;
		this.posX = posX;
		this.posY = posY;
		this.branches = []; // 가지들을 담을 배열
		this.depth = 11; // 나뭇가지의 분기(하나의 가지당 가지 5개씩 생성)

		this.cntDepth = 0; // depth별로 그리기 위해 현재 depth 변수 선언
		this.animation = null; // 현재 동작하는 애니메이션

		this.init();
	}

	init() {
		// depth별로 가지를 저장하기 위해 branches에 depth만큼 빈배열 추가
		for (let i = 0; i < this.depth; i++) {
			this.branches.push([]);
		}
		// 시작 각도는 -90도를 주어 아래에서 위로 나무 기둥이 자라도록 함
		// 시작 depth = - 으로 줌
		this.growBranch(this.posX, this.posY, -90, 0);
		this.draw();
	}

	growBranch(startX, startY, angle, depth) {
		// 매개변수 angle, depth 추가

		if (depth === this.depth) return;

		// 가지 생성
		// 아래에서 위 방향으로 draw ->  startY 값에서 길이 값을 뺀 endY 를 구해야 함

		// random 함수를 만들어 가지들의 길이를 랜덤으로 주고
		// depth가 0 즉, 나무 기둥을 그릴땐 최소, 최대 길이를 달리함
		const len = depth === 0 ? this.random(10, 13) : this.random(0, 11);

		// 현재 depth의 역을 곱해주어 depth가 점점 늘어날 수록 길이가 가늘게 함
		const endX = startX + this.cos(angle) * len * (this.depth - depth);
		const endY = startY + this.sin(angle) * len * (this.depth - depth);

		// depth에 해당하는 위치의 배열에 가지를 추가
		this.branches[depth].push(
			new Branch(startX, startY, endX, endY, this.depth - depth)
		);

		this.growBranch(endX, endY, angle - this.random(15, 23), depth + 1);
		this.growBranch(endX, endY, angle + this.random(15, 23), depth + 1);
		// branches에 가지가 push되면 생성된 가지의 끝부분을 시작으로 각도를 랜덤하게.
		// 좌우 각도를 주어 가지 2개를 또 생성
		// 마지막 depth까지 재귀호출되면 return
	}

	draw() {
		// 다 그렸으면 requestAnimationFrame을 중단해 메모리 누수가 없게 함.
		if (this.cntDepth === this.depth) {
			cancelAnimationFrame(this.animation);
		}
		// 가지들을 canvas에 draw
		// 가지를 생성해 좌표를 branches 배열에 넣고, branch의 draw()를 호출해 draw
		for (let i = 0; i < this.branches.length; i++) {
			let pass = true;

			for (let j = 0; j < this.branches[i].length; j++) {
				pass = this.branches[i][j].draw(this.ctx);
			}
			if (!pass) break;
			this.cntDepth++;
		}
		this.animation = requestAnimationFrame(this.draw.bind(this));
	}

	cos(angle) {
		return Math.cos(this.degToRad(angle));
	}
	sin(angle) {
		return Math.sin(this.degToRad(angle));
	}
	degToRad(angle) {
		return (angle / 180.0) * Math.PI;
	}
	// random 함수 추가
	random(min, max) {
		return min + Math.floor(Math.random() * (max - min + 1));
	}
}
