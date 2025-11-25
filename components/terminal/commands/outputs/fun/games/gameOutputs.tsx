import React from 'react';

export const TypeGameScoreOutput: React.FC<{ score: string }> = ({ score }) => {
    return <span className="text-green-400">{score}</span>;
};

export const GameOverScoreOutput: React.FC<{ score: number }> = ({ score }) => {
    return <span className="text-green-400">Game Over! Score: {score}</span>;
};

