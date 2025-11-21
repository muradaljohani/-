import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import { Message, Role } from '../types';
import { SourcesDisplay } from './SourcesDisplay';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

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
            : 'bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 text-gray-50 rounded-tl-none backdrop-blur-md'
        }`}>
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
        </div>
      </div>
    </div>
  );
};