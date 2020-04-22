export class DOMRender {
  constructor({ element, width, height }) {
    this.element = element;
    this.renderElem = document.createElement('div');
    this.renderElem.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      overflow: hidden;
      border: 1px solid #f2f2f2;
    `
    this.element.appendChild(this.renderElem);
  }

  rect(x, y, width, height, color) {
    const rect = document.createElement('div');
    rect.style.cssText = `
      position:absolute;
      top: ${y}px;
      left: ${x}px;
      width: ${width}px;
      height: ${height}px;
      background: ${color};
    `
    this.renderElem.appendChild(rect);
  }

  circle(x, y, r, color) {
    const circle = document.createElement('div');
    circle.style.cssText = `
      position:relative;
      top: ${y}px;
      left: ${x}px;
      width:${r * 2}px;
      height:${r * 2}px;
      background: ${color};
      border-radius:${r}px;
      `
    this.renderElem.appendChild(circle);
  }

  text(string, x, y, color, size) {
    const textElem = document.createElement('div');
    textElem.style.cssText = `
      position: absolute;
      top: ${y}px;
      left: ${x}px;
      color: ${color};
      font: Bold ${size}px Arial;
      text-align: center;
    `;
    textElem.textContent = string;
    this.renderElem.appendChild(textElem);
  }

  clear() {
    if (this.renderElem.firstElementChild) {
      this.renderElem.innerHTML = '';
    }
  }
}