
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Mic, X, Layout, Activity, Database, Minus, Square, Send, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Neural_Network } from '../services/NeuralNetwork';

// Define Window Type
interface OSWindow {
    id: string;
    title: string;
    content: React.ReactNode;
    x: number;
    y: number;
    w: number;
    h: number;
    zIndex: number;
    minimized: boolean;
}

export const MuradOS: React.FC = () => {
    const { isAdmin, user } = useAuth();
    const [windows, setWindows] = useState<OSWindow[]>([]);
    const [topZ, setTopZ] = useState(100);
    const [isListening, setIsListening] = useState(false);
    const [commandOutput, setCommandOutput] = useState('');
    const neuralNet = Neural_Network.getInstance();

    // SQL Terminal State
    const [sqlQuery, setSqlQuery] = useState('');
    const [sqlResults, setSqlResults] = useState<any[]>([]);

    if (!isAdmin) return null;

    // --- WINDOW MANAGEMENT ---
    const openWindow = (id: string, title: string, content: React.ReactNode) => {
        if (windows.find(w => w.id === id)) {
            // Restore if minimized
            setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: false, zIndex: topZ + 1 } : w));
            setTopZ(prev => prev + 1);
            return;
        }
        const newWin: OSWindow = {
            id, title, content,
            x: 100 + (windows.length * 30),
            y: 50 + (windows.length * 30),
            w: 600, h: 400,
            zIndex: topZ + 1,
            minimized: false
        };
        setWindows([...windows, newWin]);
        setTopZ(topZ + 1);
    };

    const closeWindow = (id: string) => {
        setWindows(prev => prev.filter(w => w.id !== id));
    };

    const bringToFront = (id: string) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: topZ + 1 } : w));
        setTopZ(prev => prev + 1);
    };

    // --- APPS CONTENT ---
    const AnalyticsApp = () => {
        const heatmap = neuralNet.getHeatmapData();
        return (
            <div className="p-4 bg-gray-900 text-green-400 font-mono h-full overflow-hidden">
                <h3 className="border-b border-green-800 pb-2 mb-4 flex items-center gap-2"><Activity className="w-4 h-4"/> Live Neural Feed</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black p-4 rounded border border-green-900">
                        <div className="text-xs text-gray-500">CLICKS RECORDED</div>
                        <div className="text-3xl font-bold">{heatmap.length}</div>
                    </div>
                    <div className="bg-black p-4 rounded border border-green-900">
                        <div className="text-xs text-gray-500">ACTIVE SESSIONS</div>
                        <div className="text-3xl font-bold">1</div>
                    </div>
                </div>
                <div className="mt-4 relative h-40 bg-gray-800 rounded border border-gray-700 overflow-hidden">
                    {/* Visualizing clicks as dots */}
                    {heatmap.slice(-20).map((p, i) => (
                        <div key={i} className="absolute w-2 h-2 bg-red-500 rounded-full opacity-50" style={{ left: p.x / 10, top: p.y / 10 }}></div>
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs">Mini-Map Visualization</div>
                </div>
            </div>
        );
    };

    const SQLTerminalApp = () => {
        const runQuery = () => {
            // Mock SQL Engine
            if (sqlQuery.toLowerCase().includes('select * from users')) {
                setSqlResults([
                    { id: 1, name: 'Murad', role: 'Admin' },
                    { id: 2, name: 'Guest', role: 'Student' }
                ]);
            } else {
                setSqlResults([{ status: 'Query Executed', time: '0.02ms' }]);
            }
        };

        return (
            <div className="flex flex-col h-full bg-[#1e1e1e] text-white font-mono text-sm">
                <div className="flex-1 p-2 overflow-auto">
                    {sqlResults.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-700 text-gray-400">
                                    {Object.keys(sqlResults[0]).map(k => <th key={k} className="p-2">{k}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {sqlResults.map((row, i) => (
                                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800">
                                        {Object.values(row).map((v: any, j) => <td key={j} className="p-2">{v}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <div className="text-gray-500 p-4">Ready for SQL commands...</div>}
                </div>
                <div className="p-2 bg-[#2d2d2d] border-t border-black flex gap-2">
                    <span className="text-green-500 font-bold">SQL&gt;</span>
                    <input 
                        className="bg-transparent outline-none flex-1 text-white" 
                        value={sqlQuery} 
                        onChange={e => setSqlQuery(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && runQuery()}
                        placeholder="SELECT * FROM users..."
                    />
                    <button onClick={runQuery}><Play className="w-4 h-4 text-green-500"/></button>
                </div>
            </div>
        );
    };

    // --- VOICE COMMAND ENGINE ---
    const toggleVoice = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Web Speech API not supported in this browser.");
            return;
        }
        if (isListening) {
            setIsListening(false);
            return;
        }

        setIsListening(true);
        // @ts-ignore
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US'; // English for commands
        recognition.onresult = (event: any) => {
            const command = event.results[0][0].transcript.toLowerCase();
            setCommandOutput(`Command: "${command}"`);
            
            if (command.includes('analytics') || command.includes('stats')) {
                openWindow('analytics', 'Neural Analytics', <AnalyticsApp />);
            } else if (command.includes('database') || command.includes('sql')) {
                openWindow('sql', 'Database Terminal', <SQLTerminalApp />);
            } else if (command.includes('close all')) {
                setWindows([]);
            }
            setIsListening(false);
        };
        recognition.start();
    };

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none font-sans">
            
            {/* 1. DESKTOP LAYER (Windows) */}
            {windows.map(win => (
                !win.minimized && (
                    <div 
                        key={win.id}
                        className="absolute bg-[#1e293b] border border-white/20 rounded-lg shadow-2xl pointer-events-auto flex flex-col overflow-hidden backdrop-blur-md bg-opacity-95"
                        style={{ 
                            left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.zIndex,
                            boxShadow: '0 0 40px rgba(0,0,0,0.5)'
                        }}
                        onMouseDown={() => bringToFront(win.id)}
                    >
                        {/* Title Bar */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-2 flex justify-between items-center cursor-move border-b border-white/10 select-none">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                                {win.id === 'sql' ? <Database className="w-3 h-3 text-blue-400"/> : <Activity className="w-3 h-3 text-green-400"/>}
                                {win.title}
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setWindows(ws => ws.map(w => w.id===win.id ? {...w, minimized: true} : w))} className="hover:text-white text-gray-500"><Minus className="w-3 h-3"/></button>
                                <button className="hover:text-white text-gray-500"><Square className="w-3 h-3"/></button>
                                <button onClick={() => closeWindow(win.id)} className="hover:text-red-500 text-gray-500"><X className="w-3 h-3"/></button>
                            </div>
                        </div>
                        {/* Content */}
                        <div className="flex-1 overflow-auto bg-black/50 relative">
                            {win.content}
                        </div>
                    </div>
                )
            ))}

            {/* 2. TASKBAR (Dock) */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 flex items-center gap-4 pointer-events-auto shadow-2xl scale-100 hover:scale-105 transition-transform">
                <button 
                    onClick={() => openWindow('analytics', 'Neural Analytics', <AnalyticsApp />)}
                    className="p-3 bg-black/40 rounded-xl hover:bg-green-500/20 transition-all group relative"
                >
                    <Activity className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform"/>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Analytics</span>
                </button>
                <button 
                    onClick={() => openWindow('sql', 'Database Terminal', <SQLTerminalApp />)}
                    className="p-3 bg-black/40 rounded-xl hover:bg-blue-500/20 transition-all group relative"
                >
                    <Terminal className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform"/>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">SQL Editor</span>
                </button>
                
                <div className="w-px h-8 bg-white/10 mx-2"></div>

                <button 
                    onClick={toggleVoice}
                    className={`p-3 rounded-full transition-all border border-white/10 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-black/40 text-gray-300 hover:text-white'}`}
                >
                    <Mic className="w-6 h-6"/>
                </button>
            </div>

            {/* Voice Feedback Toast */}
            {commandOutput && (
                <div className="fixed top-20 right-1/2 translate-x-1/2 bg-black/80 text-white px-6 py-2 rounded-full border border-white/20 backdrop-blur font-mono text-sm animate-fade-in-up">
                    {commandOutput}
                </div>
            )}
        </div>
    );
};
