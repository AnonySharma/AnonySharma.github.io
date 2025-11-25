import React, { useState, useEffect } from 'react';

export const SnakeGame: React.FC<{ onExit: (score: number) => void }> = ({ onExit }) => {
    const WIDTH = 20;
    const HEIGHT = 15;
    const INITIAL_SNAKE = [[5, 5]];
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState([10, 10]);
    const [dir, setDir] = useState([1, 0]); // [x, y]
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (gameOver) return;

            setSnake(prev => {
                const newHead = [prev[0][0] + dir[0], prev[0][1] + dir[1]];
                
                // Check walls
                if (newHead[0] < 0 || newHead[0] >= WIDTH || newHead[1] < 0 || newHead[1] >= HEIGHT) {
                    setGameOver(true);
                    return prev;
                }

                // Check self collision
                for (let part of prev) {
                    if (newHead[0] === part[0] && newHead[1] === part[1]) {
                        setGameOver(true);
                        return prev;
                    }
                }

                const newSnake = [newHead, ...prev];
                
                // Check food
                if (newHead[0] === food[0] && newHead[1] === food[1]) {
                    setScore(s => s + 1);
                    // Random food
                    setFood([Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT)]);
                } else {
                    newSnake.pop();
                }
                
                return newSnake;
            });
        }, 150);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp' && dir[1] !== 1) setDir([0, -1]);
            if (e.key === 'ArrowDown' && dir[1] !== -1) setDir([0, 1]);
            if (e.key === 'ArrowLeft' && dir[0] !== 1) setDir([-1, 0]);
            if (e.key === 'ArrowRight' && dir[0] !== -1) setDir([1, 0]);
            
            if ((e.ctrlKey && e.key === 'c') || (e.metaKey && e.key === 'c')) {
                if (window.getSelection()?.toString()) return;
                onExit(score);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            clearInterval(interval);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [dir, gameOver, food, score, onExit]);

    // Render grid
    let gridString = "";
    // Top Border
    gridString += " +" + "-".repeat(WIDTH) + "+\n";
    
    for (let y = 0; y < HEIGHT; y++) {
        gridString += " |";
        for (let x = 0; x < WIDTH; x++) {
            let isSnake = false;
            for (let s of snake) {
                if (s[0] === x && s[1] === y) {
                    isSnake = true;
                    break;
                }
            }
            if (isSnake) gridString += "O";
            else if (x === food[0] && y === food[1]) gridString += "*";
            else gridString += " ";
        }
        gridString += "|\n";
    }
    
    // Bottom Border
    gridString += " +" + "-".repeat(WIDTH) + "+";

    return (
        <div className="my-4 font-mono leading-none inline-block bg-slate-900 p-4 border border-slate-700 rounded">
            <div className="text-center mb-2 text-yellow-400 font-bold">SCORE: {score}</div>
            <pre className="text-green-400">{gridString}</pre>
            {gameOver && (
                <div className="text-red-500 font-bold mt-2 text-center">
                    GAME OVER! Press Ctrl+C to exit.
                </div>
            )}
             <div className="text-xs text-slate-500 mt-2 text-center">Use Arrow Keys to Move</div>
        </div>
    );
};

