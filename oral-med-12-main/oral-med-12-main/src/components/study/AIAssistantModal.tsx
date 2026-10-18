import React, { useState } from 'react';
import { useLearning } from '../../context/LearningContext';
import { X, Sparkles, Send, BookOpen, Bot, User, Loader2 } from 'lucide-react';
import { askOralMedicineTutor } from '../../services/geminiService';

export const AIAssistantModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen } = useLearning();
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your Oral Medicine Study Mentor for Lecture 2 (Ulcerative, Vesicular, and Bullous Lesions). How can I assist your diagnostic or pharmacological understanding today?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAiModalOpen) return null;

  const quickPrompts = [
    'How do I clinically differentiate EM from SJS/TEN?',
    'Explain CMV latency in endothelial cells & Valganciclovir dosing',
    'Why is Metronidazole effective in NUG despite poor solo spirochete activity?',
    'What defines Herpangina vs Primary Herpetic Gingivostomatitis?',
    'Describe the biopsy hallmarks of Plasma Cell Stomatitis',
    'How does Fusobacterium necrophorum cause Noma / Cancrum Oris?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = { sender: 'user' as const, text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputValue('');
    setIsLoading(true);

    try {
      const response = await askOralMedicineTutor(textToSend);
      setMessages((prev) => [...prev, { sender: 'ai', text: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'An error occurred while querying lecture materials. Please check your network or try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Oral Medicine AI Study Mentor
                <span className="text-[11px] font-mono text-teal-400 font-normal">Gemini 2.5 Flash</span>
              </h2>
              <p className="text-xs text-slate-400">Grounded exclusively in Lecture 2 Slides & Clinical Nuances</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-teal-900/50 border border-teal-700/60 text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-xs text-teal-400 italic">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing lecture slides and synthesizing clinical rationale...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="p-2.5 bg-slate-950/90 border-t border-slate-800 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] text-slate-500 whitespace-nowrap font-medium flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Quick Prompts:
          </span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about CMV, Coxsackie, NUG/NUP, EM, SJS/TEN, or PCS..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
