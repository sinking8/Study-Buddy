import React, { useState, useEffect } from "react";

const SnakeQuizGame = () => {
  const gridSize = 20;
  const tileCount = 20; // canvas width/height divided by gridSize (400 / 20)
  const initialSnake = [{ x: 10, y: 10 }];

  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [foodPositions, setFoodPositions] = useState([]);

  const questions = [
    {
      question: "What is 2 + 2?",
      answers: [
        { text: "4", correct: true },
        { text: "5", correct: false },
        { text: "6", correct: false },
        { text: "3", correct: false },
      ],
    },
    {
      question: "What is the capital of France?",
      answers: [
        { text: "Berlin", correct: false },
        { text: "Madrid", correct: false },
        { text: "Paris", correct: true },
        { text: "Rome", correct: false },
      ],
    },
    {
      question: "What is 5 * 3?",
      answers: [
        { text: "15", correct: true },
        { text: "10", correct: false },
        { text: "20", correct: false },
        { text: "12", correct: false },
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    setQuestionAndFood();

    const gameInterval = setInterval(() => {
      if (!gameOver) {
        updateSnake();
      }
    }, 100);

    return () => clearInterval(gameInterval);
  }, [gameOver, direction]); // Adding direction here to trigger updates on direction change

  const setQuestionAndFood = () => {
    setFoodPositions(
      currentQuestion.answers.map((answer) => ({
        ...answer,
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
      }))
    );
  };

  const updateSnake = () => {
    setSnake((prevSnake) => {
      const newHead = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y,
      };

      // Check for collision with walls or itself
      if (
        newHead.x < 0 ||
        newHead.x >= tileCount ||
        newHead.y < 0 ||
        newHead.y >= tileCount ||
        isSnakeCollision(newHead)
      ) {
        setGameOver(true);
        alert(`Game Over! Your score: ${score}`);
        document.location.reload();
        return prevSnake; // Return the previous snake to prevent state update on game over
      }

      const eatenFoodIndex = foodPositions.findIndex(
        (food) => food.x === newHead.x && food.y === newHead.y
      );

      if (eatenFoodIndex !== -1) {
        const eatenFood = foodPositions[eatenFoodIndex];
        if (eatenFood.correct) {
          setScore((prevScore) => prevScore + 1);
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          if (currentQuestionIndex < questions.length - 1) {
            setQuestionAndFood();
          } else {
            alert(`You answered all questions correctly! Final score: ${score}`);
            document.location.reload();
          }
        } else {
          alert(`Wrong answer! Game Over! Your score: ${score}`);
          document.location.reload();
        }
        return [newHead, ...prevSnake]; // Add new head to snake when food is eaten
      }

      // Move the snake
      const newSnake = [...prevSnake];
      newSnake.pop(); // Remove the last part if no food is eaten
      newSnake.unshift(newHead); // Add new head at the front
      return newSnake;
    });
  };

  const isSnakeCollision = (position) => {
    return snake.some((part) => part.x === position.x && part.y === position.y);
  };
  
const handleKeyDown = (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y === 0) setDirection({ x: 0, y: -1 });
      break;
    case "ArrowDown":
      if (direction.y === 0) setDirection({ x: 0, y: 1 });
      break;
    case "ArrowLeft":
      if (direction.x === 0) setDirection({ x: -1, y: 0 });
      break;
    case "ArrowRight":
      if (direction.x === 0) setDirection({ x: 1, y: 0 });
      break;
    default:
      break;
  }
};

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  const drawTile = (ctx, x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
  };

  const drawSnake = (ctx) => {
    snake.forEach((part) => drawTile(ctx, part.x, part.y, "lime"));
  };

  const drawFood = (ctx) => {
    foodPositions.forEach((food) => {
      drawTile(ctx, food.x, food.y, "red");
      ctx.fillStyle = "white";
      ctx.font = "12px Arial";
      ctx.fillText(food.text, food.x * gridSize + 2, food.y * gridSize + 15);
    });
  };

  useEffect(() => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const gameLoop = () => {
      if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake(ctx);
        drawFood(ctx);
      }
    };

    const gameInterval = setInterval(gameLoop, 20);
    return () => clearInterval(gameInterval);
  }, [foodPositions, snake, gameOver]);

  return (
    <div>
      <div id="score">Score: {score}</div>
      <div id="question">Question: {currentQuestion.question}</div>
      <canvas
        id="gameCanvas"
        width="400"
        height="400"
        style={{ backgroundColor: "#000", border: "2px solid #fff" }}
      />
    </div>
  );
};

export default SnakeQuizGame;
