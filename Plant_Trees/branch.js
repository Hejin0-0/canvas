export class Branch {
	constructor(startX, startY, endX, endY, lineWidth, color) {
		this.startX = startX;
		this.startY = startY;
		this.endX = endX;
		this.endY = endY;
		this.color = color;
		this.lineWidth = lineWidth;

		this.frame = 10; // 가지를 100등분으로 나누기 위한 변수
		this.cntFrame = 0; // 현재 frame

		// 가지의 길이를 frame으로 나누어 구간별 길이를 구함
		this.gapX = (this.endX - this.startX) / this.frame;
		this.gapY = (this.endY - this.startY) / this.frame;

		// 구간별 가지가 그려질 때 끝 좌표
		this.currentX = this.startX;
		this.currentY = this.startY;

		this.setColor();
	}

	draw(ctx) {
		// 현재 frame인 cntFrame이 설정한 frame과 같다면 true return
		if (this.cntFrame === this.frame) return true;

		ctx.beginPath();

		// 구간별 길이를 더해주어 다음 구간의 끝 좌표를 구함
		this.currentX += this.gapX;
		this.currentY += this.gapY;

		ctx.moveTo(this.startX, this.startY); // 선의 시작 위치 지정
		ctx.lineTo(this.currentX, this.currentY); // 끝 좌표를 currentX,Y로

		if (this.lineWidth < 3) {
			ctx.lineWidth = 0.5;
		} else if (this.lineWidth < 7) {
			ctx.lineWidth = this.lineWidth * 0.7;
		} else if (this.lineWidth < 10) {
			ctx.lineWidth = this.lineWidth * 0.9;
		} else {
			ctx.lineWidth = this.lineWidth;
		}

		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;

		ctx.stroke();
		ctx.closePath();

		this.cntFrame++; // 현재 프레임수 증가

		// 다 안그렸으면 false를 리턴
		return false;
	}

	setColor() {
		if (this.color !== "#000000") {
			if (this.lineWidth >= 10) {
				this.color = "#FFFFFF";
			} else {
				let num = Math.floor((this.lineWidth / 10) * 15).toString(16);
				this.color = this.color.replace(/0/gi, num);
			}
		}
	}
}
