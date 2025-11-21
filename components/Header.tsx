import React from 'react';
import { Sparkles, Code } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 p-4 sticky top-0 z-20 shadow-lg shadow-black/5">
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative bg-gray-900/50 border border-white/10 p-2.5 rounded-xl">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2 tracking-wide">
            مساعد مراد الجهني الذكي
          </h1>
          <p className="text-xs text-gray-300/80 flex items-center gap-1.5">
             تطوير المبرمج مراد الجهني <Code className="w-3 h-3 text-blue-400" />
          </p>
        </div>
      </div>
    </header>
  );
};