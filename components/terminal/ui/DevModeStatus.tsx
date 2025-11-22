import React, { useState, useEffect } from 'react';
import { useAchievements } from '../../../contexts/AchievementContext';

export const DevModeStatus: React.FC<{ 
    found: Array<{ key: string; name: string }>; 
    easterEggs: Array<{ key: string; name: string }> 
}> = ({ found, easterEggs }) => {
    const { stats } = useAchievements();
    const [achievementsUnlocked, setAchievementsUnlocked] = useState(() => {
        return localStorage.getItem('achievements_unlocked') === 'true';
    });

    useEffect(() => {
        // Check for changes in localStorage (in case unlocked from another tab/component)
        const checkUnlock = () => {
            const unlocked = localStorage.getItem('achievements_unlocked') === 'true';
            setAchievementsUnlocked(unlocked);
        };
        const interval = setInterval(checkUnlock, 500);
        return () => clearInterval(interval);
    }, []);

    const handleToggle = () => {
        if (!achievementsUnlocked) {
            localStorage.setItem('achievements_unlocked', 'true');
            setAchievementsUnlocked(true);
            // Trigger a custom event to notify Achievements component
            window.dispatchEvent(new Event('achievementsUnlocked'));
        }
    };

    const isDevMode = !!stats.developer_mode;

    return (
        <div className="font-mono text-sm space-y-2">
            <div className="text-green-400 font-bold">Developer Mode Status:</div>
            <div className={isDevMode ? 'text-green-400' : 'text-red-400'}>
                {isDevMode ? '✓ ACTIVE' : '✗ INACTIVE'}
            </div>
            <div className="text-cyan-400 font-bold mt-4">Easter Eggs Found: {found.length}/{easterEggs.length}</div>
            <div className="text-slate-400 text-xs space-y-1">
                {found.map((egg, idx) => (
                    <div key={idx} className="text-green-400">✓ {egg.name}</div>
                ))}
                {easterEggs.filter(egg => !found.some(f => f.key === egg.key)).map((egg, idx) => (
                    <div key={idx} className="text-slate-600">✗ {egg.name}</div>
                ))}
            </div>
            {!isDevMode && (
                <div className="text-yellow-400 text-xs mt-2">💡 Tip: Try the Konami code to unlock developer mode!</div>
            )}
            <div className="text-cyan-400 font-bold mt-4">Achievements Panel:</div>
            <div className="flex items-center gap-3">
                <div className={achievementsUnlocked ? 'text-green-400' : 'text-red-400'}>
                    {achievementsUnlocked ? '✓ UNLOCKED' : '✗ LOCKED'}
                </div>
                {!achievementsUnlocked && (
                    <button
                        onClick={handleToggle}
                        className="px-3 py-1 bg-primary hover:bg-indigo-600 text-white text-xs font-bold rounded transition-colors border border-primary/50 hover:border-primary"
                    >
                        [UNLOCK]
                    </button>
                )}
            </div>
            {achievementsUnlocked && (
                <div className="text-green-400 text-xs mt-1">The achievements button is now visible in the bottom-left corner.</div>
            )}
        </div>
    );
};

