
import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
    const [isIOS, setIsIOS] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        // Simple iOS check
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIosDevice);
    }, []);

    // If running in standalone mode (already installed), hide
    if (window.matchMedia('(display-mode: standalone)').matches) return null;

    return (
        <>
            <button 
                onClick={() => setShowInstructions(true)}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold md:hidden"
            >
                <Smartphone className="w-5 h-5"/> تثبيت التطبيق
            </button>

            {showInstructions && (
                <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-end md:items-center justify-center p-4">
                    <div className="bg-[#1e293b] w-full max-w-sm rounded-2xl border border-white/10 p-6 animate-fade-in-up mb-4 md:mb-0">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl font-black text-white">M</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">تطبيق ميلاف</h3>
                                    <p className="text-xs text-gray-400">وصول أسرع، تجربة أفضل</p>
                                </div>
                            </div>
                            <button onClick={() => setShowInstructions(false)}><X className="w-5 h-5 text-gray-400"/></button>
                        </div>

                        {isIOS ? (
                            <div className="space-y-3 text-sm text-gray-300">
                                <p>لتثبيت التطبيق على الآيفون:</p>
                                <ol className="list-decimal list-inside space-y-2 text-xs text-gray-400">
                                    <li>اضغط على زر <span className="font-bold text-white">مشاركة (Share)</span> في الأسفل.</li>
                                    <li>اختر <span className="font-bold text-white">إضافة إلى الصفحة الرئيسية (Add to Home Screen)</span>.</li>
                                    <li>اضغط <span className="font-bold text-white">إضافة (Add)</span>.</li>
                                </ol>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-300">احصل على تجربة كاملة بملء الشاشة وإشعارات فورية.</p>
                                <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                    <Download className="w-4 h-4"/> تثبيت (Install)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
