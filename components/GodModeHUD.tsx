
import React, { useState, useEffect } from 'react';
import { Shield, Activity, Users, Globe, Edit3, X, Zap, Command, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApexDashboard } from './Apex/ApexDashboard';

export const GodModeHUD: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [liveEditMode, setLiveEditMode] = useState(false);
  const [isApexOpen, setIsApexOpen] = useState(false);
  const [stats, setStats] = useState({ activeUsers: 142, serverLoad: 12, rpm: 450 });

  if (!isAdmin) return null;

  // Real-Time Sim
  useEffect(() => {
    const interval = setInterval(() => {
        setStats(prev => ({
            activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
            serverLoad: Math.min(100, Math.max(5, prev.serverLoad + Math.floor(Math.random() * 3) - 1)),
            rpm: prev.rpm + Math.floor(Math.random() * 10) - 5
        }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Live Editor Logic
  const toggleLiveEdit = () => {
      const newMode = !liveEditMode;
      setLiveEditMode(newMode);
      document.body.contentEditable = newMode ? 'true' : 'false';
      if (newMode) {
          alert('GOD MODE: Site is now editable. Click text to change. (Changes persist in session only)');
      } else {
          document.body.contentEditable = 'false';
      }
  };

  return (
    <>
    <div className={`fixed bottom-4 left-4 z-[9999] transition-all duration-500 font-mono ${isExpanded ? 'w-80' : 'w-16'}`}>
        <div className={`bg-black/80 backdrop-blur-xl border border-red-500/50 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.3)] overflow-hidden transition-all duration-500`}>
            
            {/* Header / Toggle */}
            <div 
                className="h-16 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <Shield className={`w-8 h-8 text-red-500 transition-all ${liveEditMode ? 'animate-pulse' : ''}`} />
                {isExpanded && (
                    <span className="absolute left-16 text-red-500 font-bold text-lg tracking-widest">GOD MODE</span>
                )}
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="p-4 space-y-4 border-t border-white/10 animate-fade-in-up">
                    
                    {/* APEX CONSOLE LAUNCHER */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsApexOpen(true); }}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50 transition-all"
                    >
                        <Monitor className="w-4 h-4"/> LAUNCH APEX CONSOLE
                    </button>

                    {/* Live Editor */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); toggleLiveEdit(); }}
                        className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                            liveEditMode 
                            ? 'bg-red-600 text-white border-red-500 animate-pulse' 
                            : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                        }`}
                    >
                        <Edit3 className="w-4 h-4"/>
                        {liveEditMode ? 'LIVE EDITING ACTIVE' : 'ENABLE SITE EDITOR'}
                    </button>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-black/40 p-2 rounded-lg border border-white/5 text-center">
                            <Users className="w-4 h-4 text-blue-400 mx-auto mb-1"/>
                            <div className="text-lg font-bold text-white">{stats.activeUsers}</div>
                            <div className="text-[9px] text-gray-500">ACTIVE USERS</div>
                        </div>
                        <div className="bg-black/40 p-2 rounded-lg border border-white/5 text-center">
                            <Activity className="w-4 h-4 text-emerald-400 mx-auto mb-1"/>
                            <div className="text-lg font-bold text-white">{stats.serverLoad}%</div>
                            <div className="text-[9px] text-gray-500">SERVER LOAD</div>
                        </div>
                        <div className="bg-black/40 p-2 rounded-lg border border-white/5 text-center">
                            <Globe className="w-4 h-4 text-amber-400 mx-auto mb-1"/>
                            <div className="text-lg font-bold text-white">{stats.rpm}</div>
                            <div className="text-[9px] text-gray-500">REQ / MIN</div>
                        </div>
                        <div className="bg-black/40 p-2 rounded-lg border border-white/5 text-center">
                            <Zap className="w-4 h-4 text-purple-400 mx-auto mb-1"/>
                            <div className="text-lg font-bold text-white">0ms</div>
                            <div className="text-[9px] text-gray-500">LATENCY</div>
                        </div>
                    </div>

                    <div className="text-[9px] text-red-900/50 text-center font-bold mt-2">
                        AUTHORIZED PERSONNEL ONLY
                    </div>
                </div>
            )}
        </div>
    </div>
    
    <ApexDashboard isOpen={isApexOpen} onClose={() => setIsApexOpen(false)} />
    </>
  );
};
