import { useEffect, useRef, useState } from 'react';
import './styles.css';

interface Position {
  x: number;
  y: number;
  dir: 'DOWN' | 'UP' | 'LEFT' | 'RIGHT';
}

function getPosition(currPos: Position): Position {
  switch (currPos.dir) {
    case 'DOWN':
      return { x: currPos.x, y: currPos.y + 1, dir: currPos.dir };
    case 'UP':
      return { x: currPos.x, y: currPos.y - 1, dir: currPos.dir };
    case 'LEFT':
      return { x: currPos.x - 1, y: currPos.y, dir: currPos.dir };
    case 'RIGHT':
      return { x: currPos.x + 1, y: currPos.y, dir: currPos.dir };

    default:
      new Error('WTF');
      return currPos;
  }
}

function drawSnake(ctx: CanvasRenderingContext2D, element: Position) {
  const size = 39;

  ctx.fillStyle = '#000000';
  ctx.fillRect(element.x * 40 + 1, element.y * 40 + 1, size, size);
}

function drawFood(ctx: CanvasRenderingContext2D, element: Position) {
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(element.x * 40 + 10, element.y * 40 + 10, 20, 20);
}

function drawScore(ctx: CanvasRenderingContext2D, score: number) {
  ctx.font = '30px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(score.toString(), 200, 30);
  ctx.strokeText(score.toString(), 200, 30);
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let dirImport: Position['dir'] = 'RIGHT';
let grow = false;

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowRight':
      dirImport = 'RIGHT';
      break;
    case 'ArrowLeft':
      dirImport = 'LEFT';
      break;
    case 'ArrowDown':
      dirImport = 'DOWN';
      break;
    case 'ArrowUp':
      dirImport = 'UP';
      break;

    default:
      break;
  }
});

export default function App() {
  const canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>;

  const [snake, setSnake] = useState<Array<Position>>([
    { x: 3, y: 0, dir: 'RIGHT' },
    { x: 2, y: 0, dir: 'RIGHT' },
    { x: 1, y: 0, dir: 'RIGHT' },
  ]);

  const [food, setFood] = useState<Array<Position>>([]);

  useEffect(() => {
    //handle draw
    const context = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;

    context.clearRect(0, 0, 400, 400);

    if (snake.length > 0) {
      const index = food.findIndex((f) => f.x === snake[0].x && f.y === snake[0].y);

      if (index >= 0) {
        food.splice(index, 1);
        grow = true;
      }

      snake.forEach((s) => {
        drawSnake(context, s);
      });
    }
    drawScore(context, snake.length - 3);

    food.forEach((element) => {
      drawFood(context, element);
    });

    //handle game ticks
    let timer = setTimeout(() => {
      if (Math.random() > 0.8) {
        const newFood: Position = {
          x: randInt(0, 9),
          y: randInt(0, 9),
          dir: 'RIGHT',
        };
        if (snake.findIndex((s) => s.x === newFood.x && s.y === newFood.y) < 0) setFood([...food, newFood]);
      }

      if (snake.length < 1) new Error('snake too small');

      let passArray = snake.slice(0, snake.length - 1);
      if (grow) {
        passArray = snake.slice();
        grow = false;
      }

      setSnake([getPosition({ x: snake[0].x, y: snake[0].y, dir: dirImport }), ...passArray]);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [snake]);

  return (
    <div className="App">
      <canvas height="400" width="400" style={{ borderWidth: 1, borderColor: 'black', borderStyle: 'solid' }} ref={canvasRef}></canvas>
    </div>
  );
}
