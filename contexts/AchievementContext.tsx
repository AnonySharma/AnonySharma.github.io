import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  condition: () => boolean;
}

interface AchievementContextType {
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  checkAchievements: () => void;
  unlockedCount: number;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'terminal_master',
    name: 'Terminal Master',
    description: 'Used 10 different terminal commands',
    icon: '💻',
    unlocked: false,
    condition: () => {
      const count = parseInt(localStorage.getItem('terminal_commands_used') || '0');
      return count >= 10;
    }
  },
  {
    id: '404_explorer',
    name: '404 Explorer',
    description: 'Visited the 404 page',
    icon: '🔍',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('visited_404') === 'true';
    }
  },
  {
    id: 'matrix_hacker',
    name: 'Matrix Hacker',
    description: 'Activated matrix mode',
    icon: '🟢',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('matrix_activated') === 'true';
    }
  },
  {
    id: 'konami_master',
    name: 'Konami Master',
    description: 'Unlocked the secret with Konami code',
    icon: '🎮',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('konami_unlocked') === 'true';
    }
  },
  {
    id: 'resume_hunter',
    name: 'Resume Hunter',
    description: 'Downloaded resume 3 times',
    icon: '📄',
    unlocked: false,
    condition: () => {
      const count = parseInt(localStorage.getItem('resume_downloads') || '0');
      return count >= 3;
    }
  },
  {
    id: 'code_reader',
    name: 'Code Reader',
    description: 'Viewed all code snippets',
    icon: '📚',
    unlocked: false,
    condition: () => {
      const viewed = JSON.parse(localStorage.getItem('code_snippets_viewed') || '[]');
      return viewed.length >= 3;
    }
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Visited at midnight (00:00-02:00)',
    icon: '🦉',
    unlocked: false,
    condition: () => {
      const hour = new Date().getHours();
      return hour >= 0 && hour < 2;
    }
  },
  {
    id: 'developer_mode',
    name: 'Developer Mode',
    description: 'Unlocked developer mode with Konami code',
    icon: '🍪',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('developer_mode') === 'true';
    }
  },
  {
    id: 'logo_clicker',
    name: 'Logo Clicker',
    description: 'Clicked the logo 5 times',
    icon: '🖱️',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('logo_clicked_5') === 'true';
    }
  },
  {
    id: 'logo_obsessed',
    name: 'Logo Obsessed',
    description: 'Clicked the logo 10 times (seriously?)',
    icon: '👆',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('logo_clicked_10') === 'true';
    }
  },
  {
    id: 'sudo_sandwich',
    name: 'Sudo Sandwich',
    description: 'Used sudo make-me-a-sandwich',
    icon: '🥪',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('sudo_sandwich') === 'true';
    }
  },
  {
    id: 'hack_attempt',
    name: 'Hack Attempt',
    description: 'Tried the hack command',
    icon: '💻',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('hack_attempted') === 'true';
    }
  },
  {
    id: 'bsod_trigger',
    name: 'BSOD Trigger',
    description: 'Triggered a BSOD (blue screen of death)',
    icon: '💀',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('bsod_triggered') === 'true';
    }
  },
  {
    id: 'fortune_teller',
    name: 'Fortune Teller',
    description: 'Used the fortune command',
    icon: '🔮',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('fortune_used') === 'true';
    }
  },
  {
    id: 'coffee_addict',
    name: 'Coffee Addict',
    description: 'Used coffee/brew command',
    icon: '☕',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('coffee_used') === 'true';
    }
  },
  {
    id: 'joke_master',
    name: 'Joke Master',
    description: 'Used the joke command',
    icon: '😄',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('joke_used') === 'true';
    }
  },
  {
    id: 'answer_seeker',
    name: 'Answer Seeker',
    description: 'Asked for the answer to life (42)',
    icon: '🤔',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('answer_42') === 'true';
    }
  },
  {
    id: 'whois_expert',
    name: 'Whois Expert',
    description: 'Used whois command',
    icon: '🔍',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('whois_used') === 'true';
    }
  },
  {
    id: 'docker_master',
    name: 'Docker Master',
    description: 'Used docker commands',
    icon: '🐳',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('docker_used') === 'true';
    }
  },
  {
    id: 'game_player',
    name: 'Game Player',
    description: 'Played the snake game',
    icon: '🐍',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('snake_played') === 'true';
    }
  },
  {
    id: 'party_animal',
    name: 'Party Animal',
    description: 'Started the party command',
    icon: '🎉',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('party_started') === 'true';
    }
  },
  {
    id: 'fire_starter',
    name: 'Fire Starter',
    description: 'Used the fire command',
    icon: '🔥',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('fire_used') === 'true';
    }
  },
  {
    id: 'typing_master',
    name: 'Typing Master',
    description: 'Used the type command (WPM test)',
    icon: '⌨️',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('typing_test') === 'true';
    }
  },
  {
    id: 'cowsay_user',
    name: 'Cowsay User',
    description: 'Used the cowsay command',
    icon: '🐄',
    unlocked: false,
    condition: () => {
      return localStorage.getItem('cowsay_used') === 'true';
    }
  },
  {
    id: 'easter_egg_hunter',
    name: 'Easter Egg Hunter',
    description: 'Found all easter eggs',
    icon: '🥚',
    unlocked: false,
    condition: () => {
      const easterEggs = [
        'konami_unlocked',
        'logo_clicked_10',
        'sudo_sandwich',
        'hack_attempted',
        'fortune_used',
        'coffee_used',
        'joke_used',
        'answer_42',
        'whois_used',
        'docker_used',
        'snake_played',
        'party_started',
        'fire_used',
        'typing_test',
        'cowsay_used'
      ];
      return easterEggs.every(egg => localStorage.getItem(egg) === 'true');
    }
  }
];

export const AchievementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      const savedIds = JSON.parse(saved);
      return ACHIEVEMENTS.map(ach => ({
        ...ach,
        unlocked: savedIds.includes(ach.id)
      }));
    }
    return ACHIEVEMENTS;
  });

  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const updated = prev.map(ach => 
        ach.id === id && !ach.unlocked 
          ? { ...ach, unlocked: true }
          : ach
      );
      const unlockedIds = updated.filter(a => a.unlocked).map(a => a.id);
      localStorage.setItem('achievements', JSON.stringify(unlockedIds));
      return updated;
    });
  };

  const checkAchievements = () => {
    setAchievements(prev => {
      const updated = prev.map(ach => {
        if (ach.unlocked) return ach;
        if (ach.condition()) {
          return { ...ach, unlocked: true };
        }
        return ach;
      });
      const unlockedIds = updated.filter(a => a.unlocked).map(a => a.id);
      localStorage.setItem('achievements', JSON.stringify(unlockedIds));
      return updated;
    });
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  useEffect(() => {
    checkAchievements();
    const interval = setInterval(checkAchievements, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AchievementContext.Provider value={{ achievements, unlockAchievement, checkAchievements, unlockedCount }}>
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

