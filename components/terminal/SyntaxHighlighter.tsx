
import React from 'react';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
}

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({ code, language }) => {
  if (language === 'json') {
    return <HighlightJSON json={code} />;
  }
  if (language === 'md' || language === 'markdown' || language === 'txt') {
    return <HighlightMarkdown markdown={code} />;
  }
  return <div className="whitespace-pre-wrap font-mono text-slate-300">{code}</div>;
};

const HighlightJSON = ({ json }: { json: string }) => {
  // Simple regex tokenizer for JSON
  const tokens = json.split(/(".*?"|:|{|}|\[|\]|,|\d+)/g).filter(t => t !== undefined && t !== '');
  
  return (
    <div className="font-mono whitespace-pre-wrap text-sm sm:text-base">
      {tokens.map((token, i) => {
        if (token.startsWith('"')) {
          // Heuristic: if followed by colon (ignoring whitespace), it's a key
          const nextToken = tokens.slice(i + 1).find(t => t.trim().length > 0);
          if (nextToken && nextToken.startsWith(':')) {
             return <span key={i} className="text-blue-400 font-semibold">{token}</span>; // Key
          }
          return <span key={i} className="text-green-400">{token}</span>; // String value
        }
        if (/^\d+$/.test(token)) return <span key={i} className="text-orange-400">{token}</span>; // Numbers
        if (['{', '}', '[', ']'].includes(token)) return <span key={i} className="text-yellow-500">{token}</span>; // Brackets
        return <span key={i} className="text-slate-300">{token}</span>; // Punctuation/Whitespace
      })}
    </div>
  );
};

const HighlightMarkdown = ({ markdown }: { markdown: string }) => {
    const lines = markdown.split('\n');
    return (
        <div className="font-mono whitespace-pre-wrap text-sm sm:text-base space-y-0.5">
            {lines.map((line, i) => {
                // Headers
                if (line.trim().startsWith('# ')) return <div key={i} className="text-blue-400 font-bold text-lg underline decoration-blue-400/50 mt-2 mb-1">{line}</div>;
                if (line.trim().startsWith('## ')) return <div key={i} className="text-cyan-400 font-bold text-base mt-2 mb-1">{line}</div>;
                
                // List items
                if (line.trim().startsWith('- ')) {
                    return (
                        <div key={i} className="pl-4 flex items-start">
                            <span className="text-yellow-500 mr-2">•</span> 
                            <span><FormatLine line={line.substring(line.indexOf('-') + 1)} /></span>
                        </div>
                    );
                }
                
                // Key-Value pairs (e.g. "Label: Value")
                if (line.includes(':') && !line.includes('http')) {
                    const parts = line.split(':');
                    if (parts.length > 1 && parts[0].length < 20) {
                        return (
                            <div key={i}>
                                <span className="text-yellow-400 font-semibold">{parts[0]}:</span>
                                <FormatLine line={parts.slice(1).join(':')} />
                            </div>
                        )
                    }
                }

                return <div key={i}><FormatLine line={line} /></div>;
            })}
        </div>
    )
}

const FormatLine = ({ line }: { line: string }) => {
    // Simple parser for **bold** and *italic* and `code`
    // Note: robust parsing requires a real AST parser, this is a visual hack for the portfolio
    const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
    return (
        <span className="text-slate-300">
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <span key={i} className="text-yellow-200 font-bold">{part.slice(2, -2)}</span>
                }
                if (part.startsWith('`') && part.endsWith('`')) {
                    return <span key={i} className="bg-slate-800 text-green-300 px-1 rounded text-sm font-mono">{part.slice(1, -1)}</span>
                }
                return <span key={i}>{part}</span>
            })}
        </span>
    )
}
