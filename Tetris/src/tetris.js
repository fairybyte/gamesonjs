import {Game} from './lib/Game.js';

const tetris = new Game({
  elem: document.querySelector('.field'),
  elemTable: document.querySelector('.table'),
  render: 'dom'
});
window.tetris = tetris;

tetris.init();