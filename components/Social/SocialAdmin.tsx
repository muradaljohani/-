
import React, { useState } from 'react';
import { 
    Users, DollarSign, ShieldAlert, Check, 
    Crown, Lock, Unlock, Megaphone, Search, BarChart3, Activity
} from 'lucide-react';
import { adminLogs } from '../../dummyData';

export const SocialAdmin: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'broadcast'>('overview');
    const [broadcastMsg, setBroadcastMsg] = useState('');
    
    // Mock Users for Management
    const [users, setUsers] = useState([
        { id: 'u1', name: 'Ahmed', handle: '@ahmed', status: 'active', isGold: false, verified: false },
        { id: 'u2', name: 'Spam Bot', handle: '@bot99', status: 'banned', isGold: false, verified: false },
        { id: 'u3', name: 'Sarah Tech', handle: '@sarah', status: 'active', isGold: true, verified: true },
        { id: 'u4', name: 'Khalid', handle: '@khalid', status: 'active', isGold: false, verified: false },
    ]);

    const toggleStatus = (id: string) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u));
    };

    const toggleGold = (id: string) => {
        setUsers(users.map(u => u.id === id ? { ...u, isGold: !u.isGold } : u));
    };

    const toggleVerify = (id: string) => {
        setUsers(users.map(u => u.id === id ? { ...u, verified: !u.verified } : u));
    };

    const sendBroadcast = () => {
        if (!broadcastMsg) return;
        alert(`BROADCAST SENT TO ${users.length} USERS: ${broadcastMsg}`);
        setBroadcastMsg('');
    };

    return (
        <div className="flex-1 bg-slate-950 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-red-500 flex items-center gap-2">
                        <ShieldAlert className="w-8 h-8"/> GOD MODE
                    </h2>
                    <p className="text-slate-400 text-xs font-mono">SYSTEM ADMINISTRATOR ACCESS GRANTED</p>
                </div>
                <div className="flex bg-slate-900 rounded-lg p-1">
                    {['overview', 'users', 'broadcast'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 rounded-md text-sm font-bold capitalize ${activeTab === tab ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-green-500/20 rounded-xl"><DollarSign className="w-6 h-6 text-green-500"/></div>
                                <span className="text-xs text-green-500 font-bold">+12%</span>
                            </div>
                            <h3 className="text-3xl font-black text-white">45,200 <span className="text-sm font-normal text-slate-500">SAR</span></h3>
                            <p className="text-xs text-slate-400 uppercase font-bold mt-1">Total Revenue</p>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-500/20 rounded-xl"><Users className="w-6 h-6 text-blue-500"/></div>
                                <span className="text-xs text-blue-500 font-bold">+850</span>
                            </div>
                            <h3 className="text-3xl font-black text-white">12,405</h3>
                            <p className="text-xs text-slate-400 uppercase font-bold mt-1">Active Users</p>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-purple-500/20 rounded-xl"><Activity className="w-6 h-6 text-purple-500"/></div>
                                <span className="text-xs text-purple-500 font-bold">99.9%</span>
                            </div>
                            <h3 className="text-3xl font-black text-white">45ms</h3>
                            <p className="text-xs text-slate-400 uppercase font-bold mt-1">Server Latency</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5"/> Live Traffic</h3>
                        <div className="h-48 flex items-end justify-between gap-1">
                            {[40, 65, 30, 80, 55, 90, 45, 70, 20, 85, 60, 75, 50, 95, 40, 60, 80, 50, 70, 90].map((h, i) => (
                                <div key={i} className="w-full bg-red-900/20 rounded-t hover:bg-red-500 transition-colors group relative" style={{height: `${h}%`}}>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-white text-black text-xs font-bold px-2 py-1 rounded">
                                        {h * 10}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                        <h3 className="font-bold text-white mb-4">System Logs</h3>
                        <div className="space-y-2">
                            {adminLogs.map(log => (
                                <div key={log.id} className="flex justify-between text-xs p-2 bg-slate-950 rounded border border-slate-800">
                                    <span className="font-mono text-blue-400">[{log.time}]</span>
                                    <span className="text-white font-bold">{log.action}</span>
                                    <span className="text-slate-400">{log.target}</span>
                                    <span className="text-slate-500">by {log.admin}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="space-y-4 animate-fade-in-up">
                    <div className="relative">
                        <input className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 pl-10 text-white outline-none focus:border-red-500" placeholder="Search user ID, email..."/>
                        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500"/>
                    </div>

                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-950 text-slate-500 font-bold uppercase text-xs">
                                <tr>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Badges</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-800/50">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{u.name}</div>
                                            <div className="text-xs text-slate-500">{u.handle}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            {u.isGold && <Crown className="w-4 h-4 text-amber-400 fill-amber-400"/>}
                                            {u.verified && <Check className="w-4 h-4 text-blue-500 bg-white rounded-full p-0.5"/>}
                                        </td>
                                        <td className="p-4 text-right space-x-2 space-x-reverse">
                                            <button onClick={() => toggleGold(u.id)} className={`p-2 rounded hover:bg-slate-700 ${u.isGold ? 'text-amber-400' : 'text-slate-500'}`} title="Toggle Gold"><Crown className="w-4 h-4"/></button>
                                            <button onClick={() => toggleVerify(u.id)} className={`p-2 rounded hover:bg-slate-700 ${u.verified ? 'text-blue-400' : 'text-slate-500'}`} title="Toggle Verified"><Check className="w-4 h-4"/></button>
                                            <button onClick={() => toggleStatus(u.id)} className={`p-2 rounded hover:bg-slate-700 ${u.status === 'banned' ? 'text-green-500' : 'text-red-500'}`} title="Ban/Unban">
                                                {u.status === 'banned' ? <Unlock className="w-4 h-4"/> : <Lock className="w-4 h-4"/>}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'broadcast' && (
                <div className="max-w-xl mx-auto mt-10 text-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-500 animate-pulse">
                        <Megaphone className="w-10 h-10 text-red-500"/>
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">Global System Broadcast</h2>
                    <p className="text-slate-400 text-sm mb-8">Send a push notification and banner alert to ALL {users.length * 1250} active users instantly.</p>
                    
                    <textarea 
                        value={broadcastMsg}
                        onChange={(e) => setBroadcastMsg(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-red-500 h-32 resize-none mb-4 font-bold text-lg"
                        placeholder="TYPE ALERT MESSAGE HERE..."
                    />
                    
                    <button 
                        onClick={sendBroadcast}
                        disabled={!broadcastMsg}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Dispatch Alert
                    </button>
                </div>
            )}
        </div>
    );
};
