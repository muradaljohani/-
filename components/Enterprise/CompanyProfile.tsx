
import React from 'react';
import { MapPin, Clock, Globe, ShieldCheck, Star } from 'lucide-react';
import { BusinessProfile } from '../../types';

interface Props {
    profile: BusinessProfile;
}

export const CompanyProfile: React.FC<Props> = ({ profile }) => {
    return (
        <div className="bg-gray-50 min-h-screen font-sans" dir="rtl">
            {/* Hero Cover */}
            <div className="h-64 md:h-80 bg-gray-900 relative overflow-hidden">
                {profile.coverVideoUrl ? (
                    <video src={profile.coverVideoUrl} autoPlay loop muted className="w-full h-full object-cover opacity-60"/>
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-900 to-slate-900"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 right-0 p-8 flex items-end gap-6 max-w-7xl mx-auto w-full">
                    <div className="w-32 h-32 bg-white p-2 rounded-2xl shadow-xl">
                        <img src={profile.logoUrl} className="w-full h-full object-contain rounded-xl"/>
                    </div>
                    <div className="text-white pb-2">
                        <h1 className="text-3xl font-black flex items-center gap-2">
                            {profile.companyName} 
                            {profile.verified && <ShieldCheck className="w-6 h-6 text-blue-400"/>}
                        </h1>
                        <p className="text-gray-300">{profile.industry}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">عن الشركة</h2>
                        <p className="text-gray-600 leading-relaxed">{profile.description}</p>
                    </div>

                    {/* Inventory or Jobs Section would be injected here */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center text-gray-400">
                        [مساحة عرض المنتجات / الوظائف]
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center gap-3 text-gray-700">
                            <MapPin className="w-5 h-5 text-blue-500"/>
                            <div>
                                <span className="block font-bold text-sm">الموقع</span>
                                <span className="text-xs text-gray-500">{profile.location.city} - {profile.location.address}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <Clock className="w-5 h-5 text-amber-500"/>
                            <div>
                                <span className="block font-bold text-sm">ساعات العمل</span>
                                <span className="text-xs text-gray-500">{profile.workingHours}</span>
                            </div>
                        </div>
                        {profile.website && (
                            <div className="flex items-center gap-3 text-gray-700">
                                <Globe className="w-5 h-5 text-purple-500"/>
                                <a href={profile.website} target="_blank" className="text-sm hover:text-blue-600 truncate">{profile.website}</a>
                            </div>
                        )}
                    </div>

                    {/* Map Placeholder */}
                    <div className="bg-gray-200 h-48 rounded-2xl relative overflow-hidden flex items-center justify-center text-gray-500 text-sm font-bold">
                        GOOGLE MAPS API
                    </div>
                </div>
            </div>
        </div>
    );
};
