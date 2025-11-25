import React from 'react';

export const SudoSandwichOutput: React.FC = () => {
    return <span className="text-green-400">Okay. 🥪</span>;
};

export const SudoPermissionDeniedOutput: React.FC = () => {
    return <span className="text-red-400 font-bold">Permission denied: You are not in the sudoers file. This incident will be reported.</span>;
};

export const VimOutput: React.FC = () => {
    return <span className="text-yellow-400">Vim/Emacs not found. To exit this thought loop, simply click the close button on the top right.</span>;
};

export const TouchGrassOutput: React.FC = () => {
    return <span className="text-green-500">System overheating. User needs sunlight. Opening maps...</span>;
};

export const TouchErrorOutput: React.FC = () => {
    return <span className="text-pink-400">Hey! Don't touch me! 😡</span>;
};

export const YeetOutput: React.FC = () => {
    return <span className="text-yellow-400">YEET! 👋</span>;
};

export const IncognitoOnOutput: React.FC = () => {
    return <span className="text-slate-500">Going dark... (Incognito Mode Active)</span>;
};

export const IncognitoOffOutput: React.FC = () => {
    return <span className="text-green-400">Welcome back to the grid.</span>;
};

