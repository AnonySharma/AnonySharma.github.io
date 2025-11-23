import React from 'react';
import { X, Maximize2, Minimize2, Activity, Wifi, Battery, Cpu } from 'lucide-react';
import { PROFILE_CONFIG } from '../../../config';

interface TopBarProps {
  onClose: () => void;
  onMinimize?: () => void;
  isMaximized: boolean;
  setIsMaximized: (v: boolean) => void;
  phase: string;
  path: string[];
}

export const TopBar: React.FC<TopBarProps> = ({ onClose, onMinimize, isMaximized, setIsMaximized, phase, path }) => {
  return (
    <div className="absolute top-0 left-0 right-0 h-8 bg-[#16161e] flex items-center justify-between px-4 border-b border-[#414868] select-none z-[120]">
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center" 
          onClick={onClose} 
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          title="Close"
        ></div>
        <div 
          className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center" 
          onClick={onMinimize}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onMinimize) onMinimize();
          }}
          title="Minimize"
        ></div>
        <div 
          className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center" 
          onClick={() => setIsMaximized(!isMaximized)}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMaximized(!isMaximized);
          }}
          title="Maximize"
        ></div>
      </div>
      <div className="text-xs text-slate-500 flex items-center gap-2">
        <Activity size={12} className={phase === 'boot' ? 'animate-spin' : ''} />
        <span>{PROFILE_CONFIG.terminal.username}@{PROFILE_CONFIG.terminal.hostname}: {path.join('/')}</span>
      </div>
      <div className="flex gap-2">
        <div className="text-xs text-slate-600 flex items-center gap-2 mr-2">
          <Wifi size={12} />
          <Battery size={12} />
          <Cpu size={12} />
        </div>
        <button 
          onClick={() => setIsMaximized(!isMaximized)} 
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsMaximized(!isMaximized);
          }}
          className="text-slate-500 hover:text-white p-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
        <button 
          onClick={onClose} 
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="text-slate-500 hover:text-white p-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
