export class DOMRender {
  renderField = [];
  constructor({ element, elementTable, width, height, cell }) {
    this.element = element;
    this.tableElem = elementTable;
    this.cell = cell;
    this.width = width;
    this.height = height;
    this._createMapDOM();
    this._createDOMTable();
  }

  _createMapDOM() {
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('div');

        cell.style.cssText = `
          width: ${this.cell.w}px;
          height: ${this.cell.h}px;
        `
        row.push(cell);
        this.element.appendChild(cell);
      }
      this.renderField.push(row);
    }

    this.element.style.cssText = `
      display: flex;
      flex-flow: row wrap;

      width: ${(this.cell.w) * this.width}px;
      border: 1px solid black;
    `
  }

  _drawDOM(field) {
    for (let y = 0; y < field.length; y++) {
      for (let x = 0; x < field[y].length; x++) {
        const cell = field[y][x];
        if (field[y][x]) {
          this._renderCell(y, x, field[y][x]);
        }
      }
    }
  }

  _clearDOM(field) {
    for (let y = 0; y < field.length; y++) {
      for (let x = 0; x < field[y].length; x++) {
        if (!field[y][x]) this.renderField[y][x].style.background = null;
        if (!field[y][x]) this.renderField[y][x].style.outline = null;
      }
    }
  }

  _renderCell(y, x, colorID) {
    switch (colorID) {
      case 1: this.renderField[y][x].style.background = '#008cff'; break;
      case 2: this.renderField[y][x].style.background = '#4400ff'; break;
      case 3: this.renderField[y][x].style.background = '#ff8800'; break;
      case 4: this.renderField[y][x].style.background = '#ffd900'; break;
      case 5: this.renderField[y][x].style.background = '#51ff00'; break;
      case 6: this.renderField[y][x].style.background = '#b700ff'; break;
      case 7: this.renderField[y][x].style.background = '#ff0037'; break;
    }
    this.renderField[y][x].style.outline = `${this.cell.border}px solid black`;
  }

  render(datafield) {
    this._drawDOM(datafield);
    this._clearDOM(datafield);
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