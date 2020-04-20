import {Game} from './lib/Game.js';


const map = document.querySelector('.field');
const score = document.querySelector('.score');
const Snake = new Game({
  mapElem: map,
  scoreElem: score,
  render: 'canvas'
});

window.snake = Snake;

Snake.init();