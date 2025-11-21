import React, { useState, useRef, useEffect } from 'react';
import { Send, StopCircle, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
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
    <div className="p-4 bg-gray-900/90 backdrop-blur-lg border-t border-gray-800 sticky bottom-0 w-full">
      <div className="max-w-3xl mx-auto relative">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-gray-800 rounded-2xl border border-gray-700 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all p-2">
          
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ابحث أو اسأل أي شيء..."
            className="w-full bg-transparent text-gray-100 placeholder-gray-400 resize-none border-none focus:ring-0 py-3 px-3 max-h-[150px] overflow-y-auto scrollbar-hide"
            rows={1}
            disabled={disabled}
          />

          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className={`p-3 rounded-xl flex-shrink-0 transition-all duration-200 ${
              input.trim() && !disabled
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
               <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
               <Send className={`w-5 h-5 ${input.trim() ? 'ml-0.5' : ''} rtl:rotate-180`} />
            )}
          </button>
        </form>
        <p className="text-center text-gray-500 text-xs mt-2">
          قد يعرض المساعد الذكي معلومات غير دقيقة، لذا تحقق دائمًا من المصادر.
        </p>
      </div>
    </div>
  );
};
