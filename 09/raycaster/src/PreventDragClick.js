export class PreventDragClick {
  constructor(canvas) {
    // 드래그 방지 이벤트
    this.mouseMoved;
    let clickStaryX;
    let clickStaryY;
    let clickStartTime; // 클릭이 유지된 시간

    canvas.addEventListener('mousedown', (e) => {
      clickStaryX = e.clientX;
      clickStaryY = e.clientY;
      clickStartTime = Date.now();
    });

    canvas.addEventListener('mouseup', (e) => {
      const xGap = Math.abs(e.clientX - clickStaryX);
      const yGap = Math.abs(e.clientY - clickStaryY);
      const timeGap = Date.now() - clickStartTime;

      if (xGap > 5 || yGap > 5 || timeGap > 500) {
        this.mouseMoved = true;
      } else {
        this.mouseMoved = false;
      }
    });
  }
}
