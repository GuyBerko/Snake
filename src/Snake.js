import React, { useEffect, useState } from 'react';
import './Snake.css';

let canvas, ctx;
let x, y, gameLoop, dir, appleTimeOut;
let ax = 5;
let ay = 5;
let snake = [{ x: 15, y: 15 }];
let trail = 5;
let score = 0;
const pSize = 10;
let isGameOver = false;

const Snake = () => {
  const [isPause, setIsPause] = useState(true);

  const playGame = () => {
    //clear the canvas and fill the background color
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const { x: headX, y: headY } = snake[0];
    const maxX = canvas.width / pSize;
    const maxY = canvas.height / pSize;

    //set snake color and print it
    ctx.fillStyle = "red";
    snake.some((point, index) => {
      if (index !== 0 && point.x === headX && point.y === headY) {
        //game over
        return isGameOver = true;
      }
      ctx.fillRect(point.x * pSize, point.y * pSize, 8, 8);
    });

    if (isGameOver) return gameOver();

    switch (dir) {
      case 'up':
        y = headY <= 0 ? maxY - 1 : headY - 1;
        x = headX >= maxX ? 0 : headX;
        snake.unshift({ x, y });
        break;
      case 'down':
        y = headY >= maxY ? 0 : headY + 1;
        x = headX >= maxX ? 0 : headX;
        snake.unshift({ x, y });
        break;
      case 'left':
        x = headX <= 0 ? maxX - 1 : headX - 1;
        y = headY >= maxY ? 0 : headY;
        snake.unshift({ x, y });
        break;
      case 'right':
      default:
        x = headX >= maxX ? 0 : headX + 1;
        y = headY >= maxY ? 0 : headY;
        snake.unshift({ x, y });
        break;
    }

    if (headX === ax && headY === ay) {
      trail++;
      score++;
      setApple(true);
      setScore();
    }
    else {
      setApple(false);
    }

    if (snake.length > trail) snake.splice(snake.length - (snake.length - trail));
  };

  const setApple = (newPosition = false) => {
    if (newPosition) {
      ax = Math.floor(Math.random() * 30);
      ay = Math.floor(Math.random() * 30);
      clearTimeout(appleTimeOut);
      appleTimeOut = setTimeout(setApple.bind(this, true), 3000);
    }

    ctx.fillStyle = "lime";
    ctx.fillRect(ax * pSize, ay * pSize, 8, 8);
  };

  const setScore = () => {
    document.getElementById('scoreBoard').innerHTML = score;
  };

  const setGamePreview = (afterGameOver = false) => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    for (let i = 0; i < 5; i++) {
      ctx.fillRect((snake[0].x + i) * pSize, snake[0].y * pSize, 8, 8);
    }

    ctx.fillStyle = "lime";
    ctx.fillRect((snake[0].x - 4) * pSize, snake[0].y * pSize, 8, 8);

    ctx.font = "30px Arial";
    afterGameOver ? ctx.fillText('Game Over', 75, 50) : ctx.fillText('Snake', 110, 50);

    ctx.font = "18px Arial";
    ctx.fillText("Press any key to start", 65, 80);
  };

  const initGameVariables = () => {
    gameLoop = null;
    trail = 5;
    snake = [{ x: 15, y: 15 }];
    isGameOver = false;
    dir = null;
    score = 0;
  };

  const gameOver = () => {
    clearInterval(gameLoop);
    clearTimeout(appleTimeOut);
    initGameVariables();
    setGamePreview(true);
  };

  const startGame = () => {
    setIsPause(false);
    gameLoop = setInterval(playGame, 1000 / 15);
    setApple(true);
    setScore();
  };

  const onPausePlay = () => {
    if (isPause) startGame();
    else onPause();
  }

  const onPause = () => {
    clearInterval(gameLoop);
    clearTimeout(appleTimeOut);
    ctx.font = "30px Arial";
    ctx.fillText('Game Paused', 75, 50);
    setIsPause(true);
  };

  const onKeyDown = (evt) => {
    if (!gameLoop) {
      startGame();
    }
    switch ((evt ? evt : window.event).keyCode) {
      // left
      case 37:
        dir = (dir !== 'right') ? 'left' : 'right';
        break;

      // up
      case 38:
        dir = (dir !== 'down') ? 'up' : 'down';
        break;

      // right
      case 39:
        dir = (dir !== 'left') ? 'right' : 'left';
        break;

      // down
      case 40:
        dir = (dir !== 'up') ? 'down' : 'up';
        break;

      default:
        dir = 'left';
        break;
    }
  };

  useEffect(() => {
    document.onkeydown = onKeyDown;

    canvas = document.getElementById("snakeCanvas");
    ctx = canvas.getContext('2d');

    console.log('onload');
    setGamePreview();
  }, []);

  return (
    <div className="snake-wrapper">
      <canvas id="snakeCanvas" width="300" height="300"></canvas>
      <div className="actions-wrapper">
        <span className="score">Score: <span id="scoreBoard">0</span></span>
        <button onClick={ onPausePlay } className="play-pause-btn">{ isPause ? 'Play' : 'Pause' }</button>
      </div>
    </div>
  )
}

export default Snake;
