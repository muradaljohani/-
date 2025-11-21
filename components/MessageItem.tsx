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
    <div className={`flex w-full ${isUser ? 'justify-start' : 'justify-end'} mb-6`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] gap-3 ${isUser ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-gray-700' : 'bg-blue-600 shadow-lg shadow-blue-600/20'
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-gray-300" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col min-w-0 rounded-2xl p-4 ${
          isUser 
            ? 'bg-gray-800 text-white rounded-tr-none' 
            : 'bg-gradient-to-br from-blue-900/40 to-gray-800/40 border border-gray-700/50 text-gray-100 rounded-tl-none backdrop-blur-sm'
        }`}>
          <div className="prose prose-invert prose-sm max-w-none break-words leading-relaxed">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {/* Sources Section (Only for Model) */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <SourcesDisplay sources={message.sources} />
          )}
          
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-blue-400 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};
