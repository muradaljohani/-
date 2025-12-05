
import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, ShieldCheck, Image as ImageIcon, X, AlertOctagon } from 'lucide-react';
import { Attachment } from '../types';
import { PolicyModal } from './PolicyModal';
import { Footer } from './Footer';

interface ChatInputProps {
  onSend: (message: string, attachment?: Attachment) => void;
  onStop: () => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, onStop, isLoading }) => {
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Footer Policy States
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  // --- AI FIREWALL LOGIC ---
  const validateInput = (text: string): boolean => {
      const maliciousPatterns = [
          /<script\b[^>]*>([\s\S]*?)<\/script>/gim, // XSS
          /(drop|delete|update|insert)\s+table/gim, // SQL Injection
          /javascript:/gim, // JS Protocol
          /union\s+select/gim // SQL Union
      ];

      for (const pattern of maliciousPatterns) {
          if (pattern.test(text)) {
              setSecurityAlert("⛔ تم حظر هذا المدخل بواسطة نظام حماية ميلاف (Google Security Shield).");
              setTimeout(() => setSecurityAlert(null), 4000);
              return false;
          }
      }
      return true;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isLoading) {
      onStop();
      return;
    }
    
    if (!validateInput(input)) return;

    if (input.trim() || attachment) {
      onSend(input.trim(), attachment || undefined);
      setInput('');
      setAttachment(null);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type (images only)
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة فقط');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        // Extract base64 data (remove "data:image/png;base64," prefix)
        const base64Data = result.split(',')[1];
        
        setAttachment({
          type: 'image',
          data: base64Data,
          mimeType: file.type,
          url: result // Use full data URI for preview
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset input value so same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <>
    <div className="p-3 sm:p-4 sticky bottom-0 w-full z-50 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent pb-safe">
      <div className="max-w-3xl mx-auto relative pb-2">
        
        {/* Security Alert Toast */}
        {securityAlert && (
            <div className="absolute -top-16 left-0 right-0 mx-auto w-max bg-red-900/90 text-white px-4 py-2 rounded-xl border border-red-500/50 flex items-center gap-2 shadow-xl animate-fade-in-up z-50 backdrop-blur-md">
                <AlertOctagon className="w-5 h-5 text-red-400" />
                <span className="text-sm font-bold">{securityAlert}</span>
            </div>
        )}

        {/* Image Preview */}
        {attachment && (
          <div className="mb-2 relative w-fit animate-fade-in-up">
            <img 
              src={attachment.url} 
              alt="Preview" 
              className="h-16 sm:h-20 w-auto rounded-xl border border-white/10 shadow-lg object-cover" 
            />
            <button 
              onClick={removeAttachment}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <form 
          onSubmit={handleSubmit} 
          className={`relative flex items-end gap-2 bg-white/5 backdrop-blur-2xl rounded-3xl border shadow-2xl shadow-black/20 focus-within:bg-white/10 transition-all duration-300 p-1.5 sm:p-2 ${securityAlert ? 'border-red-500/50 ring-1 ring-red-500/30' : 'border-white/10 focus-within:border-blue-500/30 focus-within:ring-1 focus-within:ring-blue-500/20'}`}
        >
          
          {/* Image Upload Button */}
          <div className="pb-1 pl-1">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-2xl text-gray-400 hover:text-blue-300 hover:bg-white/5 transition-all duration-200 touch-manipulation"
              title="إرفاق صورة"
              disabled={isLoading}
            >
              <ImageIcon className="w-6 h-6 sm:w-5 sm:h-5" />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ابحث أو اسأل المساعد الذكي..."
            className="w-full bg-transparent text-gray-100 placeholder-gray-400/70 resize-none border-none focus:ring-0 py-3.5 px-2 max-h-[120px] sm:max-h-[150px] overflow-y-auto scrollbar-hide disabled:opacity-50 disabled:cursor-not-allowed text-base leading-relaxed"
            rows={1}
            disabled={isLoading}
            style={{ minHeight: '50px' }} // Ensure touch target size
            autoComplete="off"
            autoCorrect="off"
            enterKeyHint="send"
          />

          <div className="pb-1 pr-1">
            <button
              type={isLoading ? "button" : "submit"}
              onClick={isLoading ? onStop : undefined}
              disabled={!isLoading && !input.trim() && !attachment}
              className={`p-3 rounded-2xl flex-shrink-0 transition-all duration-200 flex items-center justify-center touch-manipulation ${
                isLoading
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20'
                  : (input.trim() || attachment
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30' 
                      : 'bg-white/5 text-gray-500 cursor-not-allowed')
              }`}
            >
              {isLoading ? (
                <Square className="w-5 h-5 fill-current animate-pulse" />
              ) : (
                <Send className={`w-5 h-5 ${(input.trim() || attachment) ? 'ml-0.5' : ''} rtl:rotate-180`} />
              )}
            </button>
          </div>
        </form>
        
        {/* Mobile Footer Info */}
        <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 w-full mb-2">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] sm:text-xs text-gray-500/80">
             <div className="flex items-center gap-1 text-emerald-500/80">
                 <ShieldCheck className="w-3 h-3"/>
                 <span>Google Security Shield Active</span>
             </div>
             <span className="opacity-50">•</span>
             <button onClick={() => setIsPolicyOpen(true)} className="hover:text-blue-300 transition-colors">سياسة الخصوصية</button>
             <span className="opacity-50">•</span>
             <button onClick={() => window.location.href='mailto:support@murad-group.com'} className="hover:text-blue-300 transition-colors">اتصل بنا</button>
          </div>
        </div>
        
        <Footer compact className="bg-transparent border-t border-white/5 pt-2 mt-2" />
      </div>
    </div>
    
    <PolicyModal isOpen={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
    </>
  );
};
