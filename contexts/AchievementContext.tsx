import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  condition: (stats: Record<string, any>) => boolean;
}

interface AchievementContextType {
  achievements: Achievement[];
  trackEvent: (key: string, value?: any) => void;
  unlockedCount: number;
  stats: Record<string, any>;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

const ACHIEVEMENTS_DATA: Omit<Achievement, 'unlocked' | 'condition'>[] = [
  {
    id: 'screensaver_master',
    name: 'Screensaver Master',
    description: 'Kept the screensaver active for a while',
    icon: '🌙',
  },
  {
    id: 'corner_hit',
    name: 'Perfect Corner!',
    description: 'Watched the DVD logo hit the corner',
    icon: '🎯',
  },
  {
    id: 'barrel_roll',
    name: 'Do a Barrel Roll!',
    description: 'Did a barrel roll by clicking name 3 times',
    icon: '🔄',
  },
  {
    id: 'gravity_wizard',
    name: 'Gravity Wizard',
    description: 'Played with the gravity effect',
    icon: '🧲',
  },
  {
    id: 'terminal_master',
    name: 'Terminal Master',
    description: 'Used 10 different terminal commands',
    icon: '💻',
  },
  {
    id: '404_explorer',
    name: '404 Explorer',
    description: 'Visited the 404 page',
    icon: '🔍',
  },
  {
    id: 'matrix_hacker',
    name: 'Matrix Hacker',
    description: 'Activated matrix mode',
    icon: '🟢',
  },
  {
    id: 'konami_master',
    name: 'Konami Master',
    description: 'Unlocked the secret with Konami code',
    icon: '🎮',
  },
  {
    id: 'resume_hunter',
    name: 'Resume Hunter',
    description: 'Downloaded resume 3 times',
    icon: '📄',
  },
  {
    id: 'code_reader',
    name: 'Code Reader',
    description: 'Viewed 3 different code snippets',
    icon: '📚',
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Visited at midnight (00:00-02:00)',
    icon: '🦉',
  },
  {
    id: 'developer_mode',
    name: 'Developer Mode',
    description: 'Unlocked developer mode',
    icon: '👨‍💻',
  },
  {
    id: 'logo_clicker',
    name: 'Logo Clicker',
    description: 'Clicked the logo 5 times',
    icon: '🖱️',
  },
  {
    id: 'logo_obsessed',
    name: 'Logo Obsessed',
    description: 'Clicked the logo 10 times',
    icon: '👆',
  },
  {
    id: 'sudo_sandwich',
    name: 'Sudo Sandwich',
    description: 'Used sudo make-me-a-sandwich',
    icon: '🥪',
  },
  {
    id: 'hack_attempt',
    name: 'Hack Attempt',
    description: 'Tried the hack command',
    icon: '💻',
  },
  {
    id: 'bsod_trigger',
    name: 'BSOD Trigger',
    description: 'Triggered a BSOD',
    icon: '💀',
  },
  {
    id: 'fortune_teller',
    name: 'Fortune Teller',
    description: 'Used the fortune command',
    icon: '🔮',
  },
  {
    id: 'coffee_addict',
    name: 'Coffee Addict',
    description: 'Used coffee/brew command',
    icon: '☕',
  },
  {
    id: 'joke_master',
    name: 'Joke Master',
    description: 'Used the joke command',
    icon: '😄',
  },
  {
    id: 'answer_seeker',
    name: 'Answer Seeker',
    description: 'Asked for the answer to life (42)',
    icon: '🤔',
  },
  {
    id: 'whois_expert',
    name: 'Whois Expert',
    description: 'Used whois command',
    icon: '🔍',
  },
  {
    id: 'docker_master',
    name: 'Docker Master',
    description: 'Used docker commands',
    icon: '🐳',
  },
  {
    id: 'game_player',
    name: 'Game Player',
    description: 'Played the snake game',
    icon: '🐍',
  },
  {
    id: 'party_animal',
    name: 'Party Animal',
    description: 'Started the party command',
    icon: '🎉',
  },
  {
    id: 'fire_starter',
    name: 'Fire Starter',
    description: 'Used the fire command',
    icon: '🔥',
  },
  {
    id: 'typing_master',
    name: 'Typing Master',
    description: 'Used the type command',
    icon: '⌨️',
  },
  {
    id: 'cowsay_user',
    name: 'Cowsay User',
    description: 'Used the cowsay command',
    icon: '🐄',
  },
  {
    id: 'easter_egg_hunter',
    name: 'Easter Egg Hunter',
    description: 'Found all easter eggs',
    icon: '🥚',
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Clicked all social links',
    icon: '🦋',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Visited all sections',
    icon: '🗺️',
  },
  {
    id: 'scroll_master',
    name: 'Scroll Master',
    description: 'Scrolled to bottom 3 times quickly',
    icon: '📜',
  },
  {
    id: 'deep_scroller',
    name: 'Deep Scroller',
    description: 'Scrolled more than 5000px',
    icon: '⬇️',
  },
  {
    id: 'error_catcher',
    name: 'Error Catcher',
    description: 'Caught an error notification',
    icon: '🚨',
  }
];

const checkCondition = (id: string, stats: Record<string, any>): boolean => {
  switch (id) {
    case 'screensaver_master':
      return !!stats.screensaver_active;
    case 'corner_hit':
      return !!stats.corner_hit;
    case 'barrel_roll':
      return !!stats.barrel_roll;
    case 'gravity_wizard':
      // Assuming we track gravity interactions
      return (stats.gravity_interactions || 0) >= 5;
    case 'terminal_master':
      return (stats.terminal_commands_used || 0) >= 10;
    case '404_explorer':
      return !!stats.visited_404;
    case 'matrix_hacker':
      return !!stats.matrix_activated;
    case 'konami_master':
      return !!stats.konami_unlocked;
    case 'resume_hunter':
      return (stats.resume_downloads || 0) >= 3;
    case 'code_reader':
      return (stats.code_snippets_viewed || []).length >= 3;
    case 'night_owl': {
      const hour = new Date().getHours();
      return hour >= 0 && hour < 2;
    }
    case 'developer_mode':
      return !!stats.developer_mode;
    case 'logo_clicker':
      return (stats.logo_clicks || 0) >= 5;
    case 'logo_obsessed':
      return (stats.logo_clicks || 0) >= 10;
    case 'sudo_sandwich':
      return !!stats.sudo_sandwich;
    case 'hack_attempt':
      return !!stats.hack_attempted;
    case 'bsod_trigger':
      return !!stats.bsod_triggered;
    case 'fortune_teller':
      return !!stats.fortune_used;
    case 'coffee_addict':
      return !!stats.coffee_used;
    case 'joke_master':
      return !!stats.joke_used;
    case 'answer_seeker':
      return !!stats.answer_42;
    case 'whois_expert':
      return !!stats.whois_used;
    case 'docker_master':
      return !!stats.docker_used;
    case 'game_player':
      return !!stats.snake_played;
    case 'party_animal':
      return !!stats.party_started;
    case 'fire_starter':
      return !!stats.fire_used;
    case 'typing_master':
      return !!stats.typing_test;
    case 'cowsay_user':
      return !!stats.cowsay_used;
    case 'error_catcher':
      return !!stats.error_caught;
    case 'scroll_master':
      return !!stats.scroll_master;
    case 'deep_scroller':
      return (stats.total_scroll_distance || 0) >= 5000;
    case 'social_butterfly':
      return !!stats.social_github_clicked && !!stats.social_linkedin_clicked && !!stats.social_email_clicked;
    case 'explorer':
      const sections = ['about', 'skills', 'projects', 'code-snippets', 'testimonials', 'contact'];
      return sections.every(s => !!stats[`section_${s}_visited`]);
    case 'easter_egg_hunter':
      const eggs = [
        'konami_unlocked', 'sudo_sandwich', 'hack_attempted', 'fortune_used',
        'coffee_used', 'joke_used', 'answer_42', 'whois_used', 'docker_used',
        'snake_played', 'party_started', 'fire_used', 'typing_test', 'cowsay_used',
        'screensaver_active', 'barrel_roll', 'corner_hit'
      ];
      // Use logo_clicks >= 10 for logo_clicked_10 equivalent
      const logoOk = (stats.logo_clicks || 0) >= 10;
      return logoOk && eggs.every(egg => !!stats[egg]);
    default:
      return false;
  }
};

export const AchievementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem('portfolio_stats');
    return saved ? JSON.parse(saved) : {};
  });

  const [unlockedIds, setUnlockedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('portfolio_achievements');
    return saved ? JSON.parse(saved) : [];
  });

  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Update achievements list whenever stats or unlockedIds change
  useEffect(() => {
    const updated = ACHIEVEMENTS_DATA.map(data => {
      const isUnlocked = unlockedIds.includes(data.id);
      return {
        ...data,
        unlocked: isUnlocked,
        condition: (s: Record<string, any>) => checkCondition(data.id, s)
      };
    });
    setAchievements(updated);
  }, [unlockedIds, stats]);

  // Check for new unlocks when stats change
  useEffect(() => {
    let newUnlock = false;
    const newUnlockedIds = [...unlockedIds];

    ACHIEVEMENTS_DATA.forEach(data => {
      if (!newUnlockedIds.includes(data.id)) {
        if (checkCondition(data.id, stats)) {
          newUnlockedIds.push(data.id);
          newUnlock = true;
          
          // Special handling for notification priority
          if (data.id === 'error_catcher') {
             localStorage.setItem('last_unlocked_achievement', 'error_catcher');
          }
        }
      }
    });

    if (newUnlock) {
      setUnlockedIds(newUnlockedIds);
      localStorage.setItem('portfolio_achievements', JSON.stringify(newUnlockedIds));
      
      // Dispatch event for the notification component
      window.dispatchEvent(new Event('achievementsUnlocked'));
      
      // Check for 100% completion (all achievements unlocked)
      if (newUnlockedIds.length === ACHIEVEMENTS_DATA.length) {
         // Play victory music
         const audio = new Audio('/assets/sounds/victory.mp3'); // Victory fanfare
         audio.volume = 0.6;
         audio.play().catch(e => console.log('Victory audio play failed', e));
         
         // Optional: Add a global visual effect or toast for 100% completion here
      }
    }
  }, [stats, unlockedIds]);

  const trackEvent = useCallback((key: string, value?: any) => {
    setStats(prev => {
      const next = { ...prev };
      
      // Handle specific logic if needed, or just overwrite/increment
      if (key === 'logo_clicks') {
        next[key] = (prev[key] || 0) + 1;
      } else if (key === 'terminal_commands_used') {
        // Assuming caller handles the logic of unique commands or we just increment
        next[key] = (prev[key] || 0) + 1;
      } else if (key === 'resume_downloads') {
        next[key] = (prev[key] || 0) + 1;
      } else if (key === 'code_snippets_viewed') {
        const current = prev[key] || [];
        if (!current.includes(value)) {
          next[key] = [...current, value];
        }
      } else if (key === 'total_scroll_distance') {
        next[key] = (prev[key] || 0) + (value || 0);
      } else {
        // Default: set true for booleans or use provided value
        next[key] = value !== undefined ? value : true;
      }

      localStorage.setItem('portfolio_stats', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AchievementContext.Provider value={{ 
      achievements, 
      trackEvent,
      unlockedCount: unlockedIds.length,
      stats
    }}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within AchievementProvider');
  }
  return context;
};
