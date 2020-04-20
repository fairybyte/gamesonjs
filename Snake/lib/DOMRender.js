
export class DOMRender {
  
  constructor({ map, score, width, height, color}) {
    this.mapElement = map;
    this.renderMatrix = [];
    this.scoreElement = score;
    this.width = width;
    this.height = height;
    this.color = color;
    this._createMap();
    this._createTableScore();
  }

  render(data) {
    this._drawDOM(data.map);
    this._renderTableScore(data.score);
  }

  _drawDOM(map) {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const cell = map[y][x];
        if (cell.snake) {
          this.renderMatrix[y][x].style.background = this.color.snake;
        } else if (cell.fruit) {
          this.renderMatrix[y][x].style.background = this.color.fruit;
        } else {
          this.renderMatrix[y][x].style.background = null;
        }
      }
    }
  }

  _createMap() {
    const cellElem = {
      width: 20,
      height: 20
    }

    const cellStyleText = `
      width: ${cellElem.width}px;
      height: ${cellElem.height}px;
    `

    this.mapElement.style.cssText = `
      width: ${cellElem.width * this.width}px;
      height: ${cellElem.height * this.height}px;
      border: 2px solid gray;

      display: flex;
      flex-flow: row wrap;
    `

    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('div');
        cell.style.cssText = cellStyleText;
        row.push(cell);
        this.mapElement.appendChild(cell);
      }
      this.renderMatrix.push(row);
    }
  }

  _createTableScore() {
    const textTable = document.createElement('p');
    textTable.insertAdjacentHTML('afterbegin', 'Score:<span>0</span>');
    this.scoreElement.appendChild(textTable);
  }

  _renderTableScore(score) {
    this.scoreElement.querySelector('span').textContent = score;
  }
}