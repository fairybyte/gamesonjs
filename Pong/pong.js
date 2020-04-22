import {Game} from './lib/Game.js';

const Pong = new Game({
  element: document.querySelector('.root'),
  width: 640,
  height:  480,
  render: 'dom'
});

window.pong = Pong;

Pong.init();