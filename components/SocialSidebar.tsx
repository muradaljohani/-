
import React from 'react';
import { Twitter, Linkedin } from 'lucide-react';

export const SocialSidebar: React.FC = () => {
  return (
    <div className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 pl-0">
      {/* Twitter / X */}
      <a 
        href="https://x.com/IpMurad" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 bg-black/30 hover:bg-black text-gray-400 hover:text-white rounded-r-xl backdrop-blur-md border-y border-r border-white/10 transition-all duration-300 group shadow-lg hover:w-14"
        title="Twitter / X"
      >
        <Twitter className="w-6 h-6 transition-transform group-hover:scale-110" />
      </a>

      {/* LinkedIn */}
      <a 
        href="https://www.linkedin.com/in/murad-aljohani-a3a183155/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 bg-black/30 hover:bg-[#0077b5] text-gray-400 hover:text-white rounded-r-xl backdrop-blur-md border-y border-r border-white/10 transition-all duration-300 group shadow-lg hover:w-14"
        title="LinkedIn"
      >
        <Linkedin className="w-6 h-6 transition-transform group-hover:scale-110" />
      </a>
    </div>
  );
};
