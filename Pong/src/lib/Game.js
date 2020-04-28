import { CanvasRender } from './CanvasRender.js';
import { DOMRender } from './DOMRender.js';

export class Game {

  inputMap = [];

  ball = {
    x: 0,
    y: 0,
    r: 5,
    color: 'white',
    vx: 3,
    vy: 0,
    maxV: 3
  };

  players = {
    0: {
      x: 0,
      y: 150,
      color: 'white',
      score: 0,
      direction: 'none'
    },
    1: {
      x: 0,
      y: 150,
      color: 'white',
      score: 0,
      direction: 'none'
    },
    speed: 10,
    height: 100,
    width: 10
  }

  constructor({ element, width, height, render }) {
    const params = { element, width, height }
    this.width = width;
    this.height = height;
    this.renderMethod = (render === 'canvas') ? new CanvasRender(params) : new DOMRender(params);
  }

  input() {
    const getKey = (e) => {
      this.inputMap[e.keyCode] = (e.type === 'keydown');
    }
    document.addEventListener('keydown', getKey);
    document.addEventListener('keyup', getKey);
  }

  init() {
    this.input();
    this.startGame();
    this.frame();
  }

  frame() {
    this.renderMethod.clear();
    this.update();
    this.render();
    window.requestAnimationFrame(() => this.frame());
  }

  render() {
    this.renderMethod.circle(this.ball.x, this.ball.y, this.ball.r, this.ball.color);
    this.renderMethod.rect(this.players[0].x, this.players[0].y, this.players.width, this.players.height, this.players[0].color);
    this.renderMethod.rect(this.players[1].x, this.players[1].y, this.players.width, this.players.height, this.players[1].color);
    this.renderMethod.text(`${this.players[0].score} : ${this.players[1].score}`, this.width / 2, 10, 'white', 28);
  }

  update() {

    if (this.inputMap[87]) {
      this.players[0].y = Math.max(this.players[0].y - this.players.speed, 0);
      this.players[0].direction = 'up';
    } else if (this.inputMap[83]) {
      this.players[0].y = Math.min(this.players[0].y + this.players.speed, this.height - this.players.height);
      this.players[0].direction = 'down';
    } else {
      this.players[0].direction = 'none';
    }

    if (this.inputMap[38]) {
      this.players[1].y = Math.max(this.players[1].y - this.players.speed, 0);
      this.players[1].direction = 'up';
    } else if (this.inputMap[40]) {
      this.players[1].y = Math.min(this.players[1].y + this.players.speed, this.height - this.players.height);
      this.players[1].direction = 'down';
    } else {
      this.players[1].direction = 'none';
    }

    if ((this.collision(this.ball, this.players[1])) || (this.collision(this.ball, this.players[0]))) {
      const activePlayer = (this.ball.vx > 0) ? this.players[1] : this.players[0];
      if (activePlayer.direction == 'up') {
        this.ball.vy = -5;
      } else if (activePlayer.direction == 'down') {
        this.ball.vy = 5;
      } else {
        this.ball.vy = 0;
      }
      this.ball.vx *= -1;
    }

    if (this.ball.x >= this.width) {
      this.players[0].score++;
      this.startGame();
    } else if (this.ball.x < 0) {
      this.players[1].score++;
      this.startGame();
    }

    // Wall
    if (this.ball.y >= this.height || this.ball.y <= 0) {
      this.ball.vy *= -1;
    }
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

  }

  // Game logic method
  collision(a, b) {
    const h = this.players.height;
    if (a.x == b.x && (a.y >= b.y && a.y <= (b.y + h))) {
      return true;
    }
    return false;
  }

  startGame() {
    this.ball.y = this.height / 2;
    this.ball.x = Math.floor(this.width / 2);
    this.ball.vy = 0;
    this.ball.vx = [-5, 5][Math.floor(Math.random() * 2)];
    this.players[0].x = 0;
    this.players[0].y = this.width / 2 - this.players.height;
    this.players[1].x = this.width - 10;
    this.players[1].y = this.width / 2 - this.players.height;
  }
}