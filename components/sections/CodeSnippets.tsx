import React, { useState } from 'react';
import { Code2, Copy, Check, X, Sparkles } from 'lucide-react';
import { useAchievements } from '../../contexts/AchievementContext';
import { use3DCard } from '../hooks/use3DCard';
import SectionWrapper from '../layout/SectionWrapper';
import { useSpring, animated } from '@react-spring/web';

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  explanation?: string;
}

const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: '1',
    title: 'Binary Search (My ICPC Go-To)',
    description: 'The algorithm that got me to rank 61 in ICPC Regionals',
    language: 'cpp',
    code: `int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1; // Not found (but we always find it 😎)
}`,
    explanation: 'This works, I have no idea why sometimes.'
  },
  {
    id: '2',
    title: 'React Hook (The One That Works)',
    description: 'A custom hook that actually works on the first try',
    language: 'javascript',
    code: `function useWhyDidYouUpdate(name, props) {
    const previous = useRef();
    useEffect(() => {
        if (previous.current) {
            const allKeys = Object.keys({...previous.current, ...props});
            const changesObj = {};
            allKeys.forEach(key => {
                if (previous.current[key] !== props[key]) {
                    changesObj[key] = {
                        from: previous.current[key],
                        to: props[key]
                    };
                }
            });
            if (Object.keys(changesObj).length) {
                console.log('[why-did-you-update]', name, changesObj);
            }
        }
        previous.current = props;
    });
    // TODO: Understand this code
}`,
    explanation: 'Copied from Stack Overflow. Works perfectly.'
  },
  {
    id: '3',
    title: 'SQL Query (The Optimized One)',
    description: 'Reduced query time from 2.5s to 300ms',
    language: 'sql',
    code: `-- Before: SELECT * FROM users WHERE status = 'active'
-- After: This beauty 👇

SELECT id, name, email 
FROM users 
WHERE status = 'active' 
  AND created_at > NOW() - INTERVAL '1 year'
ORDER BY created_at DESC
LIMIT 100;

-- Index on (status, created_at) makes it fly 🚀
-- Also, never SELECT * in production (learned the hard way)`,
    explanation: 'The index was the real MVP here.'
  }
];

// Simple syntax highlighting
const highlightCode = (code: string, language: string): string => {
  const lines = code.split('\n');
  return lines.map((line, idx) => {
    let highlighted = line;
    
    // C++ highlighting
    if (language === 'cpp') {
      highlighted = highlighted
        .replace(/\b(int|return|while|if|else|const|vector)\b/g, '<span class="text-blue-400">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-green-400">$1</span>')
        .replace(/\/\/.*$/g, '<span class="text-slate-500">$&</span>')
        .replace(/["']([^"']*)["']/g, '<span class="text-yellow-400">$&</span>');
    }
    
    // JavaScript highlighting
    if (language === 'javascript') {
      highlighted = highlighted
        .replace(/\b(function|const|let|var|if|else|return|useEffect|useRef|forEach|Object|keys)\b/g, '<span class="text-blue-400">$1</span>')
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-purple-400">$1</span>')
        .replace(/\/\/.*$/g, '<span class="text-slate-500">$&</span>')
        .replace(/["']([^"']*)["']/g, '<span class="text-yellow-400">$&</span>');
    }
    
    // SQL highlighting
    if (language === 'sql') {
      highlighted = highlighted
        .replace(/\b(SELECT|FROM|WHERE|AND|ORDER BY|LIMIT|INTERVAL|NOW)\b/gi, '<span class="text-blue-400">$1</span>')
        .replace(/--.*$/g, '<span class="text-slate-500">$&</span>')
        .replace(/["']([^"']*)["']/g, '<span class="text-yellow-400">$&</span>');
    }
    
    return `<span class="line-number text-slate-600 select-none">${String(idx + 1).padStart(3, ' ')}</span> ${highlighted}`;
  }).join('\n');
};

const CodeSnippets: React.FC = () => {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);
  const [copied, setCopied] = useState(false);
  const { trackEvent } = useAchievements();

  const modalSpring = useSpring({
    opacity: selectedSnippet ? 1 : 0,
    scale: selectedSnippet ? 1 : 0.9,
    config: { tension: 300, friction: 30 },
  });

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    trackEvent('code_snippet_copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setSelectedSnippet(null);
    setCopied(false);
  };

  return (
    <SectionWrapper id="code-snippets" variant="dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <Code2 size={40} className="text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Code Snippets
            </h2>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Some of my favorite code snippets. Some work, some don't. All have stories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CODE_SNIPPETS.map((snippet, index) => {
            const card3D = use3DCard({ intensity: 12, enableGlow: true });
            return (
              <animated.button
                key={snippet.id}
                ref={card3D.ref as any}
                style={{
                  ...card3D.style,
                  animationDelay: `${index * 100}ms`,
                }}
                onMouseMove={card3D.onMouseMove as any}
                onMouseLeave={card3D.onMouseLeave}
                onMouseEnter={card3D.onMouseEnter}
                onClick={() => {
                  setSelectedSnippet(snippet);
                  trackEvent('code_snippets_viewed', snippet.id);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSnippet(snippet);
                  trackEvent('code_snippets_viewed', snippet.id);
                }}
                className="relative text-left bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm transition-all hover:border-primary/50 touch-manipulation group overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-primary/20"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Glow effect */}
                <animated.div 
                  className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
                  style={card3D.glowStyle as any}
                />
                
                {/* Language badge */}
                <div className="relative z-10 mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/30 text-primary text-xs font-semibold rounded-lg backdrop-blur-sm">
                    <Sparkles size={12} />
                    {snippet.language.toUpperCase()}
                  </span>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {snippet.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {snippet.description}
                  </p>
                  
                  {/* Preview code snippet */}
                  <div className="mt-4 p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                    <pre className="text-xs font-mono text-slate-500 overflow-hidden">
                      <code className="line-clamp-3">{snippet.code.split('\n').slice(0, 3).join('\n')}...</code>
                    </pre>
                  </div>
                </div>
                
                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
              </animated.button>
            );
          })}
        </div>

        {/* Enhanced Code Viewer Modal */}
        {selectedSnippet && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={handleClose}
          >
            <animated.div
              style={modalSpring}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-primary/20 border border-primary/30 text-primary text-xs font-semibold rounded-lg">
                        {selectedSnippet.language.toUpperCase()}
                      </span>
                      <h3 className="text-2xl font-bold text-white">{selectedSnippet.title}</h3>
                    </div>
                  <p className="text-sm text-slate-400">{selectedSnippet.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(selectedSnippet.code)}
                      className="p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg transition-all touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center group"
                    title="Copy code"
                  >
                      {copied ? (
                        <Check size={20} className="text-green-400" />
                      ) : (
                        <Copy size={20} className="text-slate-300 group-hover:text-primary transition-colors" />
                      )}
                  </button>
                  <button
                      onClick={handleClose}
                      className="p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg transition-all text-slate-300 hover:text-white touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                      <X size={20} />
                  </button>
                  </div>
                </div>
              </div>
              
              {/* Code content */}
              <div className="flex-1 overflow-auto p-6 bg-[#0a0a0a]">
                <pre className="text-sm font-mono text-slate-300 leading-relaxed">
                  <code 
                    dangerouslySetInnerHTML={{ 
                      __html: highlightCode(selectedSnippet.code, selectedSnippet.language) 
                    }}
                    className="block"
                  />
                </pre>
                {selectedSnippet.explanation && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-l-4 border-primary rounded-lg backdrop-blur-sm">
                    <p className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-lg">💡</span>
                      <span className="italic">{selectedSnippet.explanation}</span>
                    </p>
                  </div>
                )}
              </div>
            </animated.div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default CodeSnippets;

