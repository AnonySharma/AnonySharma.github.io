import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { sendMessageStream } from '../services/geminiService';
import { ChatMessage } from '../types';
import { GenerateContentResponse } from '@google/genai';

const AiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I'm Ankit's AI Avatar. Ask me about his experience at Salesforce, his coding skills, or his time at IIT BHU.",
      timestamp: new Date(),
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Add placeholder for AI response
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: new Date(), isStreaming: true }]);
      
      const streamResult = await sendMessageStream(userMsg.text);
      
      let fullText = "";
      
      for await (const chunk of streamResult) {
        const chunkResponse = chunk as GenerateContentResponse;
        const text = chunkResponse.text;
        if (text) {
            fullText += text;
            setMessages(prev => {
                const newArr = [...prev];
                const lastMsg = newArr[newArr.length - 1];
                if (lastMsg.role === 'model' && lastMsg.isStreaming) {
                    lastMsg.text = fullText;
                }
                return newArr;
            });
        }
      }
      
      // Finalize
      setMessages(prev => {
          const newArr = [...prev];
          const lastMsg = newArr[newArr.length - 1];
          lastMsg.isStreaming = false;
          return newArr;
      });

    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "I'm having trouble connecting to my brain (Gemini API). Please try again later.", 
        timestamp: new Date() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px] transition-all animate-in slide-in-from-bottom-10 fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-indigo-600 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                 <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Ankit's AI Avatar</h3>
                <p className="text-indigo-100 text-xs flex items-center gap-1">
                   <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                   Powered by Gemini
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}>
                  {msg.text}
                  {msg.isStreaming && <span className="inline-block w-1 h-4 ml-1 bg-white align-middle animate-pulse">|</span>}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my experience..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="p-2 bg-primary text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full shadow-lg hover:shadow-primary/50 transition-all hover:scale-110 active:scale-95"
      >
        {isOpen ? (
             <X size={24} className="text-white" />
        ) : (
            <>
                <MessageSquare size={24} className="text-white absolute group-hover:scale-0 transition-transform duration-200" />
                <Sparkles size={24} className="text-white absolute scale-0 group-hover:scale-100 transition-transform duration-200" />
            </>
        )}
      </button>
    </div>
  );
};

export default AiChat;