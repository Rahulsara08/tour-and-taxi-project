import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const QUICK_TEMPLATES = [
  {
    label: "🗺️ Udaipur Itinerary",
    prompt: "Generate a 3-day tourist itinerary for Udaipur detailing the must-visit lakes, palaces, driving routes, and estimated taxi fares from Jaipur."
  },
  {
    label: "🏰 Jaipur Heritage Tour",
    prompt: "Create a 2-day heritage sightseeing guide for Jaipur. Recommend key forts, palace details, and local Rajasthani food hubs."
  },
  {
    label: "🏜️ Jaisalmer Desert Plan",
    prompt: "Give me a custom itinerary for a 2-day Jaisalmer desert safari. Include sand dune camping, camel rides, and sunset viewpoints."
  },
  {
    label: "🚗 Outstation Toll Helper",
    prompt: "What are the typical driving routes, toll charges, and driver allowances when traveling outstation from Jaipur to Jodhpur?"
  }
];

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Namaste! I am the AI Assistant for Shri Gurukripa Tours & Taxi. How can I help you plan your journey across Rajasthan today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-ai-chat-assistant', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat-assistant', handleOpenChat);
  }, []);

  const executeChatQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;
    setIsLoading(true);
    const newMessages = [...messages, { role: 'user' as const, content: queryText }];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      
      const data = await response.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
      } else {
        throw new Error('No reply from Server.');
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I am having trouble connecting right now. Please call us at 9950072777 for immediate assistance.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryText = input.trim();
    if (!queryText) return;
    setInput('');
    await executeChatQuery(queryText);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-slate-800 transition-all z-40 flex items-center justify-center ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageSquare size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 flex items-center justify-between to-slate-800 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Travel Assistant</h3>
                  <p className="text-xs text-slate-300">Shri Gurukripa Expert</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user' 
                      ? 'bg-orange-600 text-white rounded-br-none' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Templates Actions Row */}
            <div className="px-3 py-2 bg-slate-100 border-t border-gray-150 overflow-x-auto flex gap-2 scrollbar-none whitespace-nowrap select-none">
              {QUICK_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.label}
                  type="button"
                  onClick={() => executeChatQuery(tmpl.prompt)}
                  className="bg-white border border-gray-200 text-gray-700 text-[10px] font-bold px-2.5 py-1.5 rounded-full hover:border-orange-500 hover:text-orange-600 transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0 shadow-sm"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>

            {/* Input area */}
            <div className="p-3 bg-white border-t border-gray-100">
              <form onSubmit={handleSend} className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about fares, tours, or routes..."
                  className="flex-1 pl-4 pr-12 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
