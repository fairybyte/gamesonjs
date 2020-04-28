
export class CanvasRender {

  constructor({ map, score, width, height, color }) {
    this.mapElement = map;
    this.renderMatrix = [];
    this.scoreElement = score;
    this.width = width;
    this.height = height;
    this.color = color;
    this.cellElem = {
      w: 20,
      h: 20
    }
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.cellElem.w * this.width;
    this.canvas.height = this.cellElem.h * this.height;
    this.context = this.canvas.getContext('2d');
    this.mapElement.style.cssText = `
      display: flex;
      flex-flow: row wrap;
      width: ${this.canvas.width}px;
      height: ${this.canvas.height}px;
      border:2px solid gray;
    `;
    this.mapElement.appendChild(this.canvas);
  }

  render(data) {
    this._draw(data.map);
    this._drawScore(data.score);
  }

  _draw(map) {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const cell = map[y][x];
        if (cell.snake) {
          this._drawCell(x * this.cellElem.w, y * this.cellElem.h, this.cellElem.w, this.cellElem.h, this.color.snake)
        } else if (cell.fruit) {
          this._drawCell(x * this.cellElem.w, y * this.cellElem.h, this.cellElem.w, this.cellElem.h, this.color.fruit)
        } else {
          this.context.clearRect(x * this.cellElem.w, y * this.cellElem.h, this.cellElem.w, this.cellElem.h)
        }
      }
    }
  }

  _drawCell(x, y, w, h, colorID) {
    this.context.fillStyle = colorID;
    this.context.fillRect(x, y, w, h);
  }

  _drawScore(score) {
    this.context.strokeStyle = '#F00';
    this.context.font = 'bold 24px "Press Start 2P"';
    this.context.textBaseline = 'top';
    this.context.fillText(`SCORE:${score}`, this.canvas.width / 2.5,20);
  }
}