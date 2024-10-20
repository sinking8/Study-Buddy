import React, { useState, useEffect } from 'react';

const SnakeGame = () => {
  // Board dimensions
  const width = 30; // Increased width
  const height = 30; // Increased height
  
  // Initial Snake state
  const [snake, setSnake] = useState([{ x: 15, y: 15 }]);
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [foodOptions, setFoodOptions] = useState([]);
  const [correctFood, setCorrectFood] = useState({});
  const [question, setQuestion] = useState('');
  const [level, setLevel] = useState(1);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Questions and correct answers (can be fetched from an API)
  const quiz = [
    {
      question: 'What is 2 + 2?',
      options: [{ x: 5, y: 5, label: '3' }, { x: 25, y: 10, label: '4' }],
      answer: { x: 25, y: 10, label: '4' }
    },
    {
      question: 'What is the capital of France?',
      options: [{ x: 3, y: 25, label: 'Berlin' }, { x: 10, y: 5, label: 'Paris' }],
      answer: { x: 10, y: 5, label: 'Paris' }
    },
    {
      question: 'What color is the sky?',
      options: [{ x: 7, y: 20, label: 'Blue' }, { x: 20, y: 15, label: 'Green' }],
      answer: { x: 7, y: 20, label: 'Blue' }
    }
  ];

  // Initialize quiz question and food options for the current level
  useEffect(() => {
    if (level > quiz.length) {
      setGameCompleted(true); // All questions are answered
    } else {
      setQuestion(quiz[level - 1].question);
      setFoodOptions(quiz[level - 1].options);
      setCorrectFood(quiz[level - 1].answer);
    }
  }, [level]);

  // Handle arrow key inputs
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  };

  // Update snake position and check if it eats the correct food
  useEffect(() => {
    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };
      newSnake.unshift(head); // Add new head
      newSnake.pop(); // Remove tail
      setSnake(newSnake);

      // Check if snake eats correct food
      if (head.x === correctFood.x && head.y === correctFood.y) {
        alert('Correct! Moving to the next level.');
        setLevel((prevLevel) => prevLevel + 1); // Move to next level
      } else if (foodOptions.some(food => food.x === head.x && food.y === head.y && food !== correctFood)) {
        alert('Wrong food! Try again.');
        setSnake([{ x: 15, y: 15 }]); // Reset snake position
        setDirection({ x: 0, y: 0 }); // Stop movement
      }
    };

    const interval = setInterval(moveSnake, 200); // Game tick speed
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [snake, direction, correctFood]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div>
      <h1>Snake Quiz Game</h1>
      {gameCompleted ? (
        <h2>Congratulations! You have completed all the levels!</h2>
      ) : (
        <>
          <h2>Level {level}</h2>
          <p>{question}</p>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${width}, 20px)`, gridGap: '2px' }}>
            {Array.from({ length: height }).map((_, y) =>
              Array.from({ length: width }).map((_, x) => {
                let backgroundColor = 'white';
                let foodLabel = '';

                // Check if part of the snake
                if (snake.some(part => part.x === x && part.y === y)) {
                  backgroundColor = 'green';
                }

                // Check if there's food at this position and set the food label
                const food = foodOptions.find(food => food.x === x && food.y === y);
                if (food) {
                  backgroundColor = 'red';
                  foodLabel = food.label;
                }

                return (
                  <div 
                    key={`${x}-${y}`} 
                    style={{ 
                      width: 20, 
                      height: 20, 
                      backgroundColor, 
                      border: '1px solid black', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      fontSize: '12px',
                      color: 'white'
                    }}
                  >
                    {foodLabel}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SnakeGame;
