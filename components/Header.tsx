import React from 'react';
import { Sparkles, Search } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 p-4 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            مساعد مراد الجهني الذكي
          </h1>
          <p className="text-xs text-gray-400 flex items-center gap-1">
             مدعوم بواسطة Gemini 2.5 Flash <Search className="w-3 h-3" />
          </p>
        </div>
      </div>
    </header>
  );
};
