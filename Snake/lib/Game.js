import { DOMRender } from './DOMRender.js';
import { CanvasRender } from './CanvasRender.js';

let requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame;

export class Game {

  config = {
    fps: 60,
    slow: 1
  }

  time = {
    now: 0,
    last: window.performance.now(),
    dt: 0
  }

  inputMap = [];

  snake = {
    color: '#a7a7a7',
    x: 0,
    y: 0,
    len: 3,
    direction: 'right'
  }

  fruit = {
    color: '#fff',
    x: 0,
    y: 0
  }

  score = 0;

  constructor({ mapElem, scoreElem, render }) {

    this.map = {
      width: 40,
      height: 40,
      arr: []
    }

    this.params = {
      map: mapElem,
      score: scoreElem,
      width: this.map.width,
      height: this.map.height,
      color: {
        snake: '#fff',
        fruit: '#fff'
      }
    }
    if (render.toLowerCase() == 'dom') {
      this.renderMethod = new DOMRender(this.params);
    } else if (render.toLowerCase() == 'canvas') {
      this.renderMethod = new CanvasRender(this.params);
    }
  
  }

  input() {
    const mapper = (e) => {
      this.inputMap[e.keyCode] = (e.type == 'keydown');
    }

    window.addEventListener('keydown', mapper);
    window.addEventListener('keyup', mapper)
  }

  init() {
    this.input();
    this.createMap();
    this.startGame();
    this.frame();
  }

  frame() {
    this.time.now = window.performance.now();
    this.time.dt = this.time.dt + Math.min(1, (this.time.now - this.time.last) / 1000);
    const step = 1 / this.config.fps;
    const slowStep = this.config.slow * step;
    while (this.time.dt > step) {
      this.time.dt = this.time.dt - slowStep;
      this.update();
      // this.render();
    }
    this.renderMethod.render(this.exportRenderData());
    this.time.last = this.time.now;
    requestAnimationFrame(() => this.frame());
  }

  update() {
    this.snakeContoller();
    this.snakeMove();

    if (this.snake.x >= this.map.width) {
      this.snake.x = 0;
    } else if (this.snake.x < 0) {
      this.snake.x = this.map.width - 1;
    }

    if (this.snake.y >= this.map.height) {
      this.snake.y = 0;
    } else if (this.snake.y < 0) {
      this.snake.y = this.map.height - 1;
    }

    if (this.snake.x == this.fruit.x && this.snake.y == this.fruit.y) {
      this.map.arr[this.fruit.y][this.fruit.x].fruit = false;
      this.spawnFruit();
      this.map.arr[this.fruit.y][this.fruit.x].fruit = true;
      this.snake.len++;
      this.score++;
    }

    this.map.arr[this.snake.y][this.snake.x].snake += this.snake.len;
    this.map.arr[this.fruit.y][this.fruit.x].fruit = true;

    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const cell = this.map.arr[y][x];
        if (cell.snake) {
          cell.snake--;
          if (this.map.arr[this.snake.y][this.snake.x].snake > this.snake.len) {
            this.startGame();
          }
        }
      }

    }
  }

  exportRenderData() {
    return {
      map: this.map.arr,
      score: this.score
    }
  }

  // createScoreTable() {
  //   const textTable = document.createElement('p');
  //   textTable.insertAdjacentHTML('afterbegin', 'Score:<span>0</span>');
  //   this.table.appendChild(textTable);
  // }

  // renderScoreTable() {
  //   this.table.querySelector('span').textContent = this.score;
  // }

  startGame() {
    this.score = 0;
    this.config.slow = 5;
    this.clearMap();
    this.spawnSnake();
    this.spawnFruit();
  }

  createMap() {
    for (let y = 0; y < this.map.height; y++) {
      const row = [];
      for (let x = 0; x < this.map.width; x++) {
        const cell = {
          snake: 0,
          fruit: false
        }
        row.push(cell);
      }
      this.map.arr.push(row);
    }
  }

  clearMap() {
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const cell = this.map.arr[y][x];
        cell.snake = 0;
        cell.fruit = false;
      }
    }
  }

  spawnSnake() {
    this.snake.len = 3;
    this.snake.x = Math.floor(Math.random() * this.map.width);
    this.snake.y = Math.floor(Math.random() * this.map.height);
    this.snake.direction = ['left', 'right', 'up', 'down'][Math.floor(Math.random() * 4)];
  }

  spawnFruit() {
    let x = Math.floor(Math.random() * this.map.width);
    let y = Math.floor(Math.random() * this.map.height);
    while (this.map.arr[y][x].snake) {
      x = Math.floor(Math.random() * this.map.width);
      y = Math.floor(Math.random() * this.map.height);
    }
    this.fruit.x = x;
    this.fruit.y = y;
  }

  snakeContoller() {
    if (this.inputMap[38] && this.snake.direction != 'down') {
      this.snake.direction = 'up';
    } else if (this.inputMap[40] && this.snake.direction != 'up') {
      this.snake.direction = 'down'
    }

    if (this.inputMap[37] && this.snake.direction != 'right') {
      this.snake.direction = 'left';
    } else if (this.inputMap[39] && this.snake.direction != 'left') {
      this.snake.direction = 'right'
    }
  }

  snakeMove() {
    switch (this.snake.direction) {
      case 'left': this.snake.x--; break;
      case 'right': this.snake.x++; break;
      case 'up': this.snake.y--; break;
      case 'down': this.snake.y++; break;
    }
  }
}