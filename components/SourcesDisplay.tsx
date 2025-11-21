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
    <div className="mt-3 pt-3 border-t border-gray-700/50">
      <div className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
        <Globe className="w-3 h-3" />
        المصادر
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {uniqueSources.map((source, idx) => (
          <a
            key={idx}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors border border-gray-700 group"
          >
            <div className="bg-gray-700 p-1 rounded-full group-hover:bg-gray-600 transition-colors">
              <ExternalLink className="w-3 h-3 text-gray-300" />
            </div>
            <span className="text-xs text-blue-400 truncate flex-1 group-hover:underline group-hover:text-blue-300">
              {source.title || source.uri}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};
