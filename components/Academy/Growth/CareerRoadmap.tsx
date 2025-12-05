
import React, { useState } from 'react';
import { Check, Lock, Play, ChevronDown, Trophy, Zap, ArrowDown } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { GrowthManager, CareerPath } from '../../../services/Academy/Growth/GrowthEngines';

export const CareerRoadmap: React.FC = () => {
    const { user } = useAuth();
    const manager = GrowthManager.getInstance();
    
    // In real app, we'd select a path or show all. For demo, we show the first one.
    const paths = manager.getCareerPaths(user!);
    const [activePath, setActivePath] = useState<CareerPath>(paths[0]);

    return (
        <div className="space-y-8 animate-fade-in-up font-sans" dir="rtl">
            
            {/* Path Selector Header */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {paths.map(path => (
                    <button 
                        key={path.id}
                        onClick={() => setActivePath(path)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all min-w-[200px] ${activePath.id === path.id ? 'bg-blue-600 text-white border-blue-500 shadow-lg scale-105' : 'bg-[#1e293b] text-gray-400 border-white/5 hover:bg-white/5'}`}
                    >
                        <span className="text-2xl">{path.icon}</span>
                        <div className="text-right">
                            <div className="text-xs font-bold uppercase tracking-wider opacity-70">مسار مهني</div>
                            <div className="font-bold text-sm whitespace-nowrap">{path.title}</div>
                        </div>
                    </button>
                ))}
            </div>

            {/* The Map */}
            <div className="bg-[#1e293b] rounded-3xl border border-white/5 p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                
                <div className="max-w-2xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-white mb-2">{activePath.title}</h2>
                        <p className="text-gray-400">{activePath.description}</p>
                        
                        <div className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer">
                            <Zap className="w-4 h-4 fill-white"/> فتح المسار الكامل (Bundle)
                        </div>
                    </div>

                    <div className="space-y-0 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-8 bottom-8 right-8 w-1 bg-gray-700 rounded-full"></div>

                        {activePath.nodes.map((node, index) => (
                            <div key={node.id} className="relative flex gap-8 pb-12 last:pb-0 group">
                                {/* Node Icon */}
                                <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all shadow-xl ${
                                    node.status === 'completed' ? 'bg-emerald-500 border-emerald-600 text-white' :
                                    node.status === 'unlocked' ? 'bg-blue-600 border-blue-400 text-white animate-pulse' :
                                    'bg-gray-800 border-gray-700 text-gray-500'
                                }`}>
                                    {node.status === 'completed' ? <Check className="w-8 h-8"/> : 
                                     node.status === 'unlocked' ? <Play className="w-8 h-8 ml-1"/> : 
                                     <Lock className="w-6 h-6"/>}
                                </div>

                                {/* Content Card */}
                                <div className={`flex-1 p-6 rounded-2xl border transition-all ${
                                    node.status === 'locked' ? 'bg-white/5 border-white/5 opacity-60' :
                                    'bg-gradient-to-br from-[#0f172a] to-[#1e293b] border-white/10 shadow-lg hover:border-blue-500/30'
                                }`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                                                node.type === 'Project' ? 'bg-purple-500/20 text-purple-400' : 
                                                node.type === 'Exam' ? 'bg-red-500/20 text-red-400' : 
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                {node.type === 'Course' ? 'دورة تدريبية' : node.type === 'Project' ? 'مشروع عملي' : 'اختبار نهائي'}
                                            </span>
                                            <h3 className="text-xl font-bold text-white mt-2 mb-1">{node.title}</h3>
                                            <p className="text-xs text-gray-400">المرحلة {index + 1} من {activePath.totalLevels}</p>
                                        </div>
                                        {node.status === 'unlocked' && (
                                            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold text-sm transition-colors shadow-lg">
                                                بدء
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Final Reward */}
                        <div className="relative flex gap-8 pt-12">
                            <div className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 border-amber-500 bg-amber-500/20 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                                <Trophy className="w-8 h-8"/>
                            </div>
                            <div className="flex-1 p-6 rounded-2xl bg-gradient-to-r from-amber-900/20 to-transparent border border-amber-500/30 flex items-center gap-4">
                                <div className="text-amber-400">
                                    <h3 className="font-bold text-lg">الجائزة النهائية</h3>
                                    <p className="text-sm">شارة {activePath.rewardBadge} الموثقة + أولوية التوظيف</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
