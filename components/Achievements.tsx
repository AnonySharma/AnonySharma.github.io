import React, { useState, useEffect } from 'react';
import { Trophy, X, Sparkles } from 'lucide-react';
import { useAchievements } from '../contexts/AchievementContext';

const Achievements: React.FC = () => {
  const { achievements, unlockedCount } = useAchievements();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationQueue, setNotificationQueue] = useState<string[]>([]);
  const [currentNotification, setCurrentNotification] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('achievements_unlocked') === 'true';
  });

  // Check if achievements are unlocked on mount
  useEffect(() => {
    const checkUnlock = () => {
      const unlocked = localStorage.getItem('achievements_unlocked') === 'true';
      setIsUnlocked(unlocked);
    };
    checkUnlock();
    
    // Listen for unlock event from terminal
    const handleUnlock = () => {
      setIsUnlocked(true);
    };
    window.addEventListener('achievementsUnlocked', handleUnlock);
    
    // Check periodically in case it's unlocked from terminal
    const interval = setInterval(checkUnlock, 1000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('achievementsUnlocked', handleUnlock);
    };
  }, []);

  // Effect to detect new unlocks and add to queue (backup method)
  useEffect(() => {
    const prevCount = parseInt(localStorage.getItem('prev_achievement_count') || '0', 10);
    
    // Only process if there are new unlocks
    if (unlockedCount > prevCount) {
      // Small delay to let event listener handle it first
      const timeoutId = setTimeout(() => {
        const newlyUnlocked = achievements.filter(
          a => a.unlocked && !localStorage.getItem(`notified_${a.id}`)
        );

        if (newlyUnlocked.length > 0) {
          const newIds = newlyUnlocked.map(a => a.id);
          
          setNotificationQueue(prev => {
            // Filter out IDs that are already in the queue or currently being shown
            const uniqueNew = newIds.filter(id => !prev.includes(id) && id !== currentNotification);
            if (uniqueNew.length === 0) return prev;
            
            // Mark as notified
            uniqueNew.forEach(id => localStorage.setItem(`notified_${id}`, 'true'));
            return [...prev, ...uniqueNew];
          });
        }
      }, 200);
      
      // Update the previous count
      localStorage.setItem('prev_achievement_count', unlockedCount.toString());
      
      return () => clearTimeout(timeoutId);
    }
  }, [achievements, unlockedCount, currentNotification]);

  // Effect to process the queue
  useEffect(() => {
    if (currentNotification === null && notificationQueue.length > 0) {
      const nextId = notificationQueue[0];
      setCurrentNotification(nextId);
      setNotificationQueue(prev => prev.slice(1));
      
      const timer = setTimeout(() => {
        setCurrentNotification(null);
      }, 4000); // Reduced from 8 seconds to 4 seconds
      
      return () => clearTimeout(timer);
    }
  }, [notificationQueue, currentNotification]);

  // Listen for achievement unlock events (primary method)
  useEffect(() => {
    const handleAchievementUnlock = (event: Event) => {
      const customEvent = event as CustomEvent<{ newlyUnlockedIds?: string[] }>;
      const newlyUnlockedIds = customEvent.detail?.newlyUnlockedIds;
      
      if (newlyUnlockedIds && newlyUnlockedIds.length > 0) {
        // Add newly unlocked achievements to queue immediately
        setNotificationQueue(prev => {
          const uniqueNew = newlyUnlockedIds.filter(
            id => !prev.includes(id) && id !== currentNotification && !localStorage.getItem(`notified_${id}`)
          );
          if (uniqueNew.length === 0) return prev;
          
          // Mark as notified to prevent duplicates
          uniqueNew.forEach(id => localStorage.setItem(`notified_${id}`, 'true'));
          
          return [...prev, ...uniqueNew];
        });
      }
    };
    
    window.addEventListener('achievementsUnlocked', handleAchievementUnlock);
    return () => window.removeEventListener('achievementsUnlocked', handleAchievementUnlock);
  }, [currentNotification]);

  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);
  const progress = (unlockedCount / achievements.length) * 100;

  // Don't render if not unlocked
  if (!isUnlocked) {
    return null;
  }

  return (
    <>
      {/* Achievement Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 p-3 bg-slate-800 border border-slate-700 rounded-full hover:bg-slate-700 transition-all hover:scale-110 group"
        title="View Achievements"
      >
        <Trophy size={20} className="text-yellow-400 group-hover:text-yellow-300" />
        {unlockedCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unlockedCount}
          </span>
        )}
      </button>

      {/* Achievement Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Trophy className="text-yellow-400" size={24} />
                  Achievements
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  {unlockedCount} of {achievements.length} unlocked ({Math.round(progress)}%)
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 bg-slate-950">
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Achievements List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Unlocked */}
              {unlocked.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-green-400 mb-3 uppercase tracking-wider">
                    Unlocked ({unlocked.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {unlocked.map(ach => (
                      <div
                        key={ach.id}
                        className="bg-slate-800 border border-green-500/30 rounded-lg p-4 flex items-start gap-3"
                      >
                        <span className="text-2xl">{ach.icon}</span>
                        <div className="flex-1">
                          <div className="font-bold text-white">{ach.name}</div>
                          <div className="text-sm text-slate-400">{ach.description}</div>
                        </div>
                        <Sparkles size={16} className="text-green-400 flex-shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locked */}
              {locked.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                    Locked ({locked.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {locked.map(ach => (
                      <div
                        key={ach.id}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-start gap-3 opacity-60"
                      >
                        <span className="text-2xl grayscale">{ach.icon}</span>
                        <div className="flex-1">
                          <div className="font-bold text-slate-500">{ach.name}</div>
                          <div className="text-sm text-slate-600">???</div>
                        </div>
                        <div className="text-slate-700 text-xs">🔒</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Achievement Notification */}
      {currentNotification && (
        <div className="fixed top-20 right-6 z-[9999] animate-in slide-in-from-right pointer-events-none">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg shadow-xl border-2 border-yellow-300 pointer-events-auto">
            <div className="flex items-center gap-3">
              <Trophy size={32} />
              <div>
                <div className="font-bold">Achievement Unlocked!</div>
                <div className="text-sm opacity-90">
                  {achievements.find(a => a.id === currentNotification)?.name}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Achievements;

