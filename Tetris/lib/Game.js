import { DOMRender } from './DOMRender.js';
import { CanvasRender } from './CanvasRender.js';


export class Game {
  config = {
    fps: 60,
    slow: 20
  };

  time = {
    now: 0,
    last: window.performance.now(),
    dt: 0
  };

  gameStats = {
    level: 0,
    score: 0,
    lines: 0,
    higherPiece: 20,
    point: {
      '1': 40,
      '2': 100,
      '3': 300,
      '4': 1200
    }
  };

  fieldOptions = {
    w: 10,
    h: 20
  }

  playfield = [];
  emptyLine = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  pieces = {
    I: [
      [1],
      [1],
      [1],
      [1]
    ],
    J: [
      [0, 2],
      [0, 2],
      [2, 2]
    ],
    L: [
      [3, 0],
      [3, 0],
      [3, 3]
    ],
    O: [
      [4, 4],
      [4, 4]
    ],
    T: [
      [0, 5, 0],
      [5, 5, 5]
    ],
    Z: [
      [6, 6, 0],
      [0, 6, 6]
    ],
    S: [
      [0, 7, 7],
      [7, 7, 0]
    ]
  }

  currentPiece = {
    x: 0,
    y: 0,
    color: '',
    map: []
  }

  constructor({ elem = null, elemTable = null, render = 'canvas', cell = { w: 25, h: 25, border: 2 } }) {
    this.params = {
      element: elem,
      elementTable: elemTable,
      width: this.fieldOptions.w,
      height: this.fieldOptions.h,
      cell: cell
    }

    if (render.toLowerCase() == 'dom') {
      this.renderMethod = new DOMRender(this.params);
    } else if (render.toLowerCase() == 'canvas') {
      this.renderMethod = new CanvasRender(this.params);
    }
  }

  input() {
    const move = (e) => {
      switch (e.keyCode) {
        case 37: this.movePiece().left(); break;
        case 38: this.rotatePiece(); break;
        case 39: this.movePiece().right(); break;
        case 40: this.movePiece().down(); break;
      }
    }
    document.addEventListener('keydown', move)
  }

  init() {
    this.input();
    this.startGame();
    this.frame();
    console.log("Let's Play!")
  }

  frame() {
    this.time.now = window.performance.now();
    this.time.dt = this.time.dt + Math.min(1, (this.time.now - this.time.last) / 1000);
    const step = 1 / this.config.fps;
    const slowStep = this.config.slow * step;
    while (this.time.dt > step) {
      this.time.dt = this.time.dt - slowStep;
      this.update();

    }
    this.renderMethod.render(this.exportRenderData());
    this.time.last = this.time.now;
    requestAnimationFrame(() => this.frame());
  }

  update() {
    this.movePiece().down();
  }

  exportRenderData() {
    const field = [];
    // Playfield state
    for (let y = 0; y < this.playfield.length; y++) {
      const row = [];
      for (let x = 0; x < this.playfield[y].length; x++) {
        row[x] = this.playfield[y][x];
      }
      field.push(row);
    }
    // Current active piece
    const { x: pX, y: pY, map, color } = this.currentPiece;
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const cell = map[y][x];
        if (map[y][x] != 0) field[y + pY][x + pX] = map[y][x];
      }
    }
    return field;
  }
  // Game's logic methods

  nextPiece() {
    const pieceName = Object.keys(this.pieces);
    const randomPiece = pieceName[Math.floor(Math.random() * pieceName.length)];
    this.currentPiece.x = Math.floor(this.fieldOptions.w / 2 - 1);
    this.currentPiece.y = 0;
    this.currentPiece.map = this.pieces[randomPiece];
  }

  rotatePiece() {
    const { x: pX, y: pY, map } = this.currentPiece;
    const newMap = [];
    for (let y = 0; y < map[0].length; y++) {
      const row = [];
      for (let x = map.length - 1; x >= 0; x--) {
        row.push(map[x][y]);
      }
      newMap.push(row);
    }

    if (newMap[0].length + pX > this.fieldOptions.w) {
      this.currentPiece.x -= map.length - 1;
    }
    this.currentPiece.map = newMap;
  }

  movePiece() {
    const piece = this.currentPiece;
    return {
      down: () => {
        piece.y++;
        if (this.isCollision()) {
          if (this.gameStats.higherPiece <= 0) {
            this.startGame();
            return;
          }
          piece.y--;
          
          this.gameStats.higherPiece = (piece.y < this.gameStats.higherPiece) ? piece.y : this.gameStats.higherPiece;
          this.addPiece();
          const cleanLines = this.clearLine();
          this.updateScore(cleanLines);
          this.nextPiece();
        }
      },
      left: () => {
        piece.x--;
        if (this.isCollision()) piece.x++;
      },
      right: () => {
        piece.x++;
        if (this.isCollision()) piece.x--;
      }
    }
  }

  isCollision() {
    const piece = this.currentPiece;
    for (let y = 0; y < piece.map.length; y++) {
      for (let x = 0; x < piece.map[y].length; x++) {
        if (piece.map[y][x] &&
          ((this.playfield[y + piece.y] === undefined || this.playfield[y + piece.y][x + piece.x] === undefined) ||
            this.playfield[piece.y + y][piece.x + x])) {
          return true;
        }
      }
    }
    return false;
  }

  addPiece() {
    const { x: pX, y: pY, map } = this.currentPiece;
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x]) this.playfield[y + pY][x + pX] = map[y][x];
      }
    }
  }

  createPlayfield() {
    for (let y = 0; y < this.fieldOptions.h; y++) {
      const row = [];
      for (let x = 0; x < this.fieldOptions.w; x++) {
        row.push(0);
      }
      this.playfield.push(row);
    }
  }

  clearLine() {
    const list = [];
    for (let y = this.gameStats.higherPiece; y < this.playfield.length; y++) {
      let lineCompleted = true;
      for (let x = 0; x < this.playfield[y].length; x++) {
        if (this.playfield[y][x] === 0) {
          lineCompleted = false;
          break;
        }
      }
      if (lineCompleted) {
        list.push(y)
        this.higherPiece--;
      }
    }

    for (let i of list) {
      this.playfield.splice(i, 1);
      this.playfield.unshift(this.emptyLine);
    }

    return list.length;
  }

  updateScore(cleanLines) {
    if (cleanLines > 0) {
      this.gameStats.score += this.gameStats.point[cleanLines] * (this.gameStats.level + 1);
      this.gameStats.lines += cleanLines;
      this.gameStats.level = Math.floor(this.gameStats.lines * 0.1);
      console.log(this.gameStats.score, this.gameStats.lines, this.gameStats.level);
      this.exportScoreData();
    }
  }

  startGame() {
    this.playfield = [];
    this.gameStats.level = 0;
    this.gameStats.lines = 0;
    this.gameStats.score = 0;
    this.gameStats.higherPiece = this.fieldOptions.h;
    this.createPlayfield();
    this.exportScoreData();
    this.nextPiece();
  }

  exportScoreData() {
    this.renderMethod.renderTable(this.gameStats)
  }
}