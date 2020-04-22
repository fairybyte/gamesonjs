export class CanvasRender {
  constructor({ element, width, height }) {
    this.element = element;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.element.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.cssText = 'border: 1px solid #f2f2f2';
  }

  rect(x, y, width, height, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  circle(x, y, r, color) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
    this.ctx.fill();
  }

  text(string, x, y, color, size) {
    this.ctx.fillStyle = color;
    this.ctx.font = `Bold ${size}px Arial`;
    this.ctx.textBaseline = 'top';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(string, x, y);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}