
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot, Copy, Check, Share2 } from 'lucide-react';
import { Message, Role } from '../types';
import { SourcesDisplay } from './SourcesDisplay';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const handleCopy = async () => {
    if (message.content) {
      try {
        await navigator.clipboard.writeText(message.content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const handleShare = async () => {
    if (!message.content) return;

    const shareText = `${message.content}\n\nتمت المشاركة عبر مساعد مراد الجهني الذكي:\nhttps://murad-group.com`;
    const shareData = {
      title: 'مساعد مراد الجهني الذكي',
      text: shareText,
      url: 'https://murad-group.com',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard if Web Share API is not supported
        await navigator.clipboard.writeText(shareText);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-start' : 'justify-end'} mb-8 group`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] gap-4 ${isUser ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg backdrop-blur-md ${
          isUser 
            ? 'bg-gray-800/40 text-gray-300' 
            : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-blue-500/20'
        }`}>
          {isUser ? (
            <User className="w-5 h-5" />
          ) : (
            <Bot className="w-6 h-6" />
          )}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col min-w-0 rounded-2xl p-5 shadow-xl transition-all duration-200 ${
          isUser 
            ? 'bg-white/5 border border-white/10 text-gray-100 rounded-tr-none backdrop-blur-md' 
            : 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/20 text-white rounded-tl-none backdrop-blur-md drop-shadow-sm'
        }`}>
          {/* Render Attachment (Image) */}
          {message.attachment && message.attachment.type === 'image' && (
            <div className="mb-4">
              <img 
                src={message.attachment.url || `data:${message.attachment.mimeType};base64,${message.attachment.data}`}
                alt="User attachment" 
                className="rounded-xl max-h-64 w-auto border border-white/10 object-cover shadow-md"
                loading="lazy"
              />
            </div>
          )}

          <div className="prose prose-invert prose-sm md:prose-base max-w-none break-words leading-relaxed text-gray-100/90">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {/* Sources Section (Only for Model) */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <SourcesDisplay sources={message.sources} />
          )}
          
          {message.isStreaming && (
            <div className="flex items-center gap-1 mt-2">
               <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
               <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
               <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          )}

          {/* Actions (Share & Copy) - Only for AI responses */}
          {!isUser && message.content && (
            <div className="mt-3 flex justify-end items-center gap-2 border-t border-white/5 pt-2">
              
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-blue-300 transition-all duration-200 active:scale-95"
                title="مشاركة"
              >
                {isShared ? (
                   <>
                    <Check className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-green-400">تم</span>
                   </>
                ) : (
                   <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span>مشاركة</span>
                   </>
                )}
              </button>
              
              <div className="h-3 w-[1px] bg-white/10 mx-1"></div>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-blue-300 transition-all duration-200 active:scale-95"
                title="نسخ النص"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-green-400">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>نسخ النص</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
