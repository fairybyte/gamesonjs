export class CanvasRender {

  constructor({ element, elementTable, width, height, cell }) {
    this.elem = element;
    this.tableElem = elementTable;
    this.cell = cell;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.cell.w * width;
    this.canvas.height = this.cell.h * height;
    this.context = this.canvas.getContext('2d');
    this.elem.style.cssText = `
      display: flex;
      flex-flow: row wrap;
      width: ${this.canvas.width}px;
      border: 1px solid black;
    `
    this.elem.appendChild(this.canvas);
    this._createDOMTable();
  }

  render(field) {
    this._clear();
    this._draw(field);
  }
  _draw(field) {
    for (let y = 0; y < field.length; y++) {
      for (let x = 0; x < field[0].length; x++) {
        if (field[y][x]) {
          this._renderCell(x * this.cell.w, y * this.cell.h, this.cell.w, this.cell.h, field[y][x]);
        }
      }
    }
  }

  _clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  _renderCell(x, y, w, h, colorID) {
    switch (colorID) {
      case 1: this.context.fillStyle = '#008cff'; break;
      case 2: this.context.fillStyle = '#4400ff';; break;
      case 3: this.context.fillStyle = '#ff8800'; break;
      case 4: this.context.fillStyle = '#ffd900'; break;
      case 5: this.context.fillStyle = '#51ff00'; break;
      case 6: this.context.fillStyle = '#b700ff'; break;
      case 7: this.context.fillStyle = '#ff0037'; break;
    }
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 2;
    this.context.fillRect(x, y, w, h);
    this.context.strokeRect(x, y, w, h);

  }

  _createDOMTable() {
    this.tableElem.insertAdjacentHTML('afterbegin', `
          <p>Score: <span>0</span></p>
          <p>Lines: <span>0</span></p>
          <p>Level: <span>0</span></p>`);

    this.tableElem.style.cssText = `
      position:relative;
      color: #fff;
      font-size: 16px;
      text-aligin: center;
      border: 1px solid black;
      margin-left: 20px;
    `

  }

  renderTable(data) {
    const tableScore = this.tableElem.querySelectorAll('p span');
    tableScore[0].textContent = data.score;
    tableScore[1].textContent = data.lines;
    tableScore[2].textContent = data.level;
    
  }
}