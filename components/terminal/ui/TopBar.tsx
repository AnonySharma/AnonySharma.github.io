import React from 'react';
import { X, Maximize2, Minimize2, Activity, Wifi, Battery, Cpu } from 'lucide-react';

interface TopBarProps {
  onClose: () => void;
  isMaximized: boolean;
  setIsMaximized: (v: boolean) => void;
  phase: string;
  path: string[];
}

export const TopBar: React.FC<TopBarProps> = ({ onClose, isMaximized, setIsMaximized, phase, path }) => {
  return (
    <div className="absolute top-0 left-0 right-0 h-8 bg-[#16161e] flex items-center justify-between px-4 border-b border-[#414868] select-none z-[120]">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" onClick={onClose}></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer" onClick={() => setIsMaximized(!isMaximized)}></div>
        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer"></div>
      </div>
      <div className="text-xs text-slate-500 flex items-center gap-2">
        <Activity size={12} className={phase === 'boot' ? 'animate-spin' : ''} />
        <span>ankit@portfolio: {path.join('/')}</span>
      </div>
      <div className="flex gap-2">
        <div className="text-xs text-slate-600 flex items-center gap-2 mr-2">
          <Wifi size={12} />
          <Battery size={12} />
          <Cpu size={12} />
        </div>
        <button onClick={() => setIsMaximized(!isMaximized)} className="text-slate-500 hover:text-white">
          {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
        <button onClick={onClose} className="text-slate-500 hover:text-white">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
