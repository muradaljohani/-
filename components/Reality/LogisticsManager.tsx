
import React, { useState } from 'react';
import { X, Truck, MapPin, Package, FileText, Printer, CheckCircle2 } from 'lucide-react';
import { RealityCore } from '../../services/Reality/RealityCore';
import { Shipment } from '../../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    senderCity?: string; // Optional default
    receiverCity?: string;
}

export const LogisticsManager: React.FC<Props> = ({ isOpen, onClose, senderCity = 'الرياض', receiverCity = '' }) => {
    const [step, setStep] = useState<'input' | 'label'>('input');
    const [fromCity, setFromCity] = useState(senderCity);
    const [toCity, setToCity] = useState(receiverCity);
    const [shipment, setShipment] = useState<Shipment | null>(null);

    const engine = RealityCore.getInstance();

    if (!isOpen) return null;

    const handleCreate = () => {
        if (!toCity) return alert("يرجى إدخال مدينة المستلم");
        const newShipment = engine.createShipment({
            senderId: 'user', // Mock
            receiverId: 'receiver', // Mock
            fromCity,
            toCity
        });
        setShipment(newShipment);
        setStep('label');
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in-up font-sans" dir="rtl">
            <div className="relative w-full max-w-md bg-[#0f172a] border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden">
                
                <div className="bg-[#1e293b] p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Truck className="w-5 h-5 text-amber-500"/>
                        ميلَاف إكسبرس
                    </h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400"/></button>
                </div>

                <div className="p-6">
                    {step === 'input' && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-xs mb-1 block">موقع الاستلام (البائع)</label>
                                <div className="flex items-center gap-2 bg-[#0f172a] p-3 rounded-xl border border-white/10">
                                    <MapPin className="w-4 h-4 text-blue-500"/>
                                    <input value={fromCity} onChange={e => setFromCity(e.target.value)} className="bg-transparent text-white w-full outline-none"/>
                                </div>
                            </div>
                            <div>
                                <label className="text-gray-400 text-xs mb-1 block">موقع التسليم (المشتري)</label>
                                <div className="flex items-center gap-2 bg-[#0f172a] p-3 rounded-xl border border-white/10">
                                    <MapPin className="w-4 h-4 text-emerald-500"/>
                                    <input value={toCity} onChange={e => setToCity(e.target.value)} placeholder="المدينة..." className="bg-transparent text-white w-full outline-none"/>
                                </div>
                            </div>
                            
                            {toCity && (
                                <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl flex justify-between items-center">
                                    <span className="text-gray-300 text-sm">تكلفة الشحن المقدرة</span>
                                    <span className="text-xl font-bold text-white">{engine.calculateShipping(fromCity, toCity)} ريال</span>
                                </div>
                            )}

                            <button onClick={handleCreate} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all">
                                <Package className="w-4 h-4"/> إصدار بوليصة الشحن
                            </button>
                        </div>
                    )}

                    {step === 'label' && shipment && (
                        <div className="bg-white p-6 rounded-xl text-black">
                            {/* Shipping Label UI */}
                            <div className="border-2 border-black p-4 mb-4">
                                <div className="flex justify-between border-b-2 border-black pb-4 mb-4">
                                    <div className="font-black text-2xl tracking-widest">MELAF</div>
                                    <div className="font-mono font-bold text-lg">{shipment.trackingNumber}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                                    <div>
                                        <span className="block font-bold text-xs uppercase text-gray-500">FROM:</span>
                                        <div className="font-bold">{shipment.fromCity}</div>
                                    </div>
                                    <div>
                                        <span className="block font-bold text-xs uppercase text-gray-500">TO:</span>
                                        <div className="font-bold">{shipment.toCity}</div>
                                    </div>
                                </div>
                                <div className="flex justify-center py-4 border-t-2 border-black border-dashed">
                                    <img src={shipment.labelUrl} className="w-24 h-24" alt="QR"/>
                                </div>
                                <div className="text-center text-xs font-bold mt-2">SCAN TO TRACK</div>
                            </div>

                            <button onClick={() => window.print()} className="w-full bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800">
                                <Printer className="w-4 h-4"/> طباعة الملصق
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
