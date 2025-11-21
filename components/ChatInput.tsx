import React, { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, onStop, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isLoading) {
      onStop();
      return;
    }
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="p-4 sticky bottom-0 w-full z-30">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative">
        <form 
          onSubmit={handleSubmit} 
          className="relative flex items-end gap-2 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl shadow-black/20 focus-within:bg-white/10 focus-within:border-blue-500/30 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all duration-300 p-2"
        >
          
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ابحث أو اسأل المساعد الذكي..."
            className="w-full bg-transparent text-gray-100 placeholder-gray-400/70 resize-none border-none focus:ring-0 py-3.5 px-4 max-h-[150px] overflow-y-auto scrollbar-hide disabled:opacity-50 disabled:cursor-not-allowed text-base"
            rows={1}
            disabled={isLoading}
          />

          <div className="pb-1 pr-1 pl-1">
            <button
              type={isLoading ? "button" : "submit"}
              onClick={isLoading ? onStop : undefined}
              disabled={!isLoading && !input.trim()}
              className={`p-3 rounded-2xl flex-shrink-0 transition-all duration-200 flex items-center justify-center ${
                isLoading
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20'
                  : (input.trim() 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30' 
                      : 'bg-white/5 text-gray-500 cursor-not-allowed')
              }`}
            >
              {isLoading ? (
                <Square className="w-5 h-5 fill-current animate-pulse" />
              ) : (
                <Send className={`w-5 h-5 ${input.trim() ? 'ml-0.5' : ''} rtl:rotate-180`} />
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4 space-y-1.5">
          <p className="text-gray-500/80 text-[10px] sm:text-xs tracking-wide">
            قد يعرض المساعد الذكي معلومات غير دقيقة، لذا تحقق دائمًا من المصادر.
          </p>
          <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-gray-400/60 font-light border-t border-white/5 pt-2 w-fit mx-auto px-4">
             <span>جميع الحقوق محفوظة لشركة مراد الجهني لتقنية المعلومات العالمية (شركة ذات الشخص الواحد )</span>
             <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};