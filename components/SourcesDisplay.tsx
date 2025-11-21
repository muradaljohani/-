import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { SearchSource } from '../types';

interface SourcesDisplayProps {
  sources: SearchSource[];
}

export const SourcesDisplay: React.FC<SourcesDisplayProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  // Deduplicate sources based on URI
  const uniqueSources = sources.filter((source, index, self) =>
    index === self.findIndex((t) => (
      t.uri === source.uri
    ))
  );

  return (
    <div className="mt-4 pt-3 border-t border-white/10">
      <div className="text-xs font-medium text-blue-300/80 mb-2.5 flex items-center gap-1.5">
        <Globe className="w-3.5 h-3.5" />
        المصادر والمراجع
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {uniqueSources.map((source, idx) => (
          <a
            key={idx}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/20 hover:bg-white/5 transition-all duration-200 border border-white/5 hover:border-white/10 group"
          >
            <div className="bg-white/5 p-1.5 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-300" />
            </div>
            <span className="text-xs text-gray-300 truncate flex-1 group-hover:text-blue-200 font-light">
              {source.title || source.uri}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};