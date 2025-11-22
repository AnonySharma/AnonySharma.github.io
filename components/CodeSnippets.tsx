import React, { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';
import { useAchievements } from '../contexts/AchievementContext';

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

const CodeSnippets: React.FC = () => {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);
  const [copied, setCopied] = useState(false);
  const { trackEvent } = useAchievements();

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="code-snippets" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Code2 size={32} className="text-primary" />
            Code Snippets
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Some of my favorite code snippets. Some work, some don't. All have stories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {CODE_SNIPPETS.map((snippet) => (
            <button
              key={snippet.id}
              onClick={() => {
                setSelectedSnippet(snippet);
                trackEvent('code_snippets_viewed', snippet.id);
              }}
              className="text-left bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded">
                  {snippet.language}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{snippet.title}</h3>
              <p className="text-sm text-slate-400">{snippet.description}</p>
            </button>
          ))}
        </div>

        {/* Code Viewer Modal */}
        {selectedSnippet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedSnippet.title}</h3>
                  <p className="text-sm text-slate-400">{selectedSnippet.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(selectedSnippet.code)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    title="Copy code"
                  >
                    {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-slate-300" />}
                  </button>
                  <button
                    onClick={() => setSelectedSnippet(null)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-300"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-6 bg-[#0a0a0a]">
                <pre className="text-sm font-mono text-slate-300">
                  <code>{selectedSnippet.code}</code>
                </pre>
                {selectedSnippet.explanation && (
                  <div className="mt-4 p-4 bg-slate-800/50 border-l-4 border-primary rounded">
                    <p className="text-sm text-slate-300 italic">💡 {selectedSnippet.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CodeSnippets;

