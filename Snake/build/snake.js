!function(t){var e={};function i(s){if(e[s])return e[s].exports;var h=e[s]={i:s,l:!1,exports:{}};return t[s].call(h.exports,h,h.exports,i),h.l=!0,h.exports}i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var h in t)i.d(s,h,function(e){return t[e]}.bind(null,h));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";i.r(e);class s{constructor({map:t,score:e,width:i,height:s,color:h}){this.mapElement=t,this.renderMatrix=[],this.scoreElement=e,this.width=i,this.height=s,this.color=h,this._createMap(),this._createTableScore()}render(t){this._drawDOM(t.map),this._renderTableScore(t.score)}_drawDOM(t){for(let e=0;e<t.length;e++)for(let i=0;i<t[e].length;i++){const s=t[e][i];s.snake?this.renderMatrix[e][i].style.background=this.color.snake:s.fruit?this.renderMatrix[e][i].style.background=this.color.fruit:this.renderMatrix[e][i].style.background=null}}_createMap(){const t=20,e=20,i=`\n      width: ${t}px;\n      height: ${e}px;\n    `;this.mapElement.style.cssText=`\n      width: ${t*this.width}px;\n      height: ${e*this.height}px;\n      border: 2px solid gray;\n\n      display: flex;\n      flex-flow: row wrap;\n    `;for(let t=0;t<this.height;t++){const t=[];for(let e=0;e<this.width;e++){const e=document.createElement("div");e.style.cssText=i,t.push(e),this.mapElement.appendChild(e)}this.renderMatrix.push(t)}}_createTableScore(){const t=document.createElement("p");t.insertAdjacentHTML("afterbegin","Score:<span>0</span>"),this.scoreElement.appendChild(t)}_renderTableScore(t){this.scoreElement.querySelector("span").textContent=t}}class h{constructor({map:t,score:e,width:i,height:s,color:h}){this.mapElement=t,this.renderMatrix=[],this.scoreElement=e,this.width=i,this.height=s,this.color=h,this.cellElem={w:20,h:20},this.canvas=document.createElement("canvas"),this.canvas.width=this.cellElem.w*this.width,this.canvas.height=this.cellElem.h*this.height,this.context=this.canvas.getContext("2d"),this.mapElement.style.cssText=`\n      display: flex;\n      flex-flow: row wrap;\n      width: ${this.canvas.width}px;\n      height: ${this.canvas.height}px;\n      border:2px solid gray;\n    `,this.mapElement.appendChild(this.canvas)}render(t){this._draw(t.map),this._drawScore(t.score)}_draw(t){for(let e=0;e<t.length;e++)for(let i=0;i<t[e].length;i++){const s=t[e][i];s.snake?this._drawCell(i*this.cellElem.w,e*this.cellElem.h,this.cellElem.w,this.cellElem.h,this.color.snake):s.fruit?this._drawCell(i*this.cellElem.w,e*this.cellElem.h,this.cellElem.w,this.cellElem.h,this.color.fruit):this.context.clearRect(i*this.cellElem.w,e*this.cellElem.h,this.cellElem.w,this.cellElem.h)}}_drawCell(t,e,i,s,h){this.context.fillStyle=h,this.context.fillRect(t,e,i,s)}_drawScore(t){this.context.strokeStyle="#F00",this.context.font='bold 24px "Press Start 2P"',this.context.textBaseline="top",this.context.fillText("SCORE:"+t,this.canvas.width/2.5,20)}}let r=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;const n=document.querySelector(".field"),a=document.querySelector(".score"),o=new class{constructor({mapElem:t,scoreElem:e,render:i}){this.map={width:40,height:40,arr:[]},this.params={map:t,score:e,width:this.map.width,height:this.map.height,color:{snake:"#fff",fruit:"#fff"}},"dom"==i.toLowerCase()?this.renderMethod=new s(this.params):"canvas"==i.toLowerCase()&&(this.renderMethod=new h(this.params)),this.config={fps:60,slow:1},this.time={now:0,last:window.performance.now(),dt:0},this.inputMap=[],this.snake={color:"#a7a7a7",x:0,y:0,len:3,direction:"right"},this.fruit={color:"#fff",x:0,y:0},this.score=0}input(){const t=t=>{this.inputMap[t.keyCode]="keydown"==t.type};window.addEventListener("keydown",t),window.addEventListener("keyup",t)}init(){this.input(),this.createMap(),this.startGame(),this.frame()}frame(){this.time.now=window.performance.now(),this.time.dt=this.time.dt+Math.min(1,(this.time.now-this.time.last)/1e3);const t=1/this.config.fps,e=this.config.slow*t;for(;this.time.dt>t;)this.time.dt=this.time.dt-e,this.update();this.renderMethod.render(this.exportRenderData()),this.time.last=this.time.now,r(()=>this.frame())}update(){this.snakeContoller(),this.snakeMove(),this.snake.x>=this.map.width?this.snake.x=0:this.snake.x<0&&(this.snake.x=this.map.width-1),this.snake.y>=this.map.height?this.snake.y=0:this.snake.y<0&&(this.snake.y=this.map.height-1),this.snake.x==this.fruit.x&&this.snake.y==this.fruit.y&&(this.map.arr[this.fruit.y][this.fruit.x].fruit=!1,this.spawnFruit(),this.map.arr[this.fruit.y][this.fruit.x].fruit=!0,this.snake.len++,this.score++),this.map.arr[this.snake.y][this.snake.x].snake+=this.snake.len,this.map.arr[this.fruit.y][this.fruit.x].fruit=!0;for(let t=0;t<this.map.height;t++)for(let e=0;e<this.map.width;e++){const i=this.map.arr[t][e];i.snake&&(i.snake--,this.map.arr[this.snake.y][this.snake.x].snake>this.snake.len&&this.startGame())}}exportRenderData(){return{map:this.map.arr,score:this.score}}startGame(){this.score=0,this.config.slow=5,this.clearMap(),this.spawnSnake(),this.spawnFruit()}createMap(){for(let t=0;t<this.map.height;t++){const t=[];for(let e=0;e<this.map.width;e++){const e={snake:0,fruit:!1};t.push(e)}this.map.arr.push(t)}}clearMap(){for(let t=0;t<this.map.height;t++)for(let e=0;e<this.map.width;e++){const i=this.map.arr[t][e];i.snake=0,i.fruit=!1}}spawnSnake(){this.snake.len=3,this.snake.x=Math.floor(Math.random()*this.map.width),this.snake.y=Math.floor(Math.random()*this.map.height),this.snake.direction=["left","right","up","down"][Math.floor(4*Math.random())]}spawnFruit(){let t=Math.floor(Math.random()*this.map.width),e=Math.floor(Math.random()*this.map.height);for(;this.map.arr[e][t].snake;)t=Math.floor(Math.random()*this.map.width),e=Math.floor(Math.random()*this.map.height);this.fruit.x=t,this.fruit.y=e}snakeContoller(){this.inputMap[38]&&"down"!=this.snake.direction?this.snake.direction="up":this.inputMap[40]&&"up"!=this.snake.direction&&(this.snake.direction="down"),this.inputMap[37]&&"right"!=this.snake.direction?this.snake.direction="left":this.inputMap[39]&&"left"!=this.snake.direction&&(this.snake.direction="right")}snakeMove(){switch(this.snake.direction){case"left":this.snake.x--;break;case"right":this.snake.x++;break;case"up":this.snake.y--;break;case"down":this.snake.y++}}}({mapElem:n,scoreElem:a,render:"canvas"});window.snake=o,o.init()}]);