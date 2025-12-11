
import React from 'react';
import { X, Calendar, MapPin, CheckCircle2, Crown, ShieldCheck, RefreshCw } from 'lucide-react';
import { User } from '../../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: any; // Using any for flexibility with post user object structure
}

export const VerificationSheet: React.FC<Props> = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    // Founder Logic
    const isFounder = user.handle === '@IpMurad' || user.uid === 'admin-fixed-id' || user.isAdmin;
    
    // Display Logic
    const displayName = isFounder ? "Murad Aljohani" : user.name;
    const displayHandle = user.handle || `@${user.username}`;
    const avatar = user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User";
    
    const joinDate = user.createdAt 
        ? new Date(user.createdAt.toDate ? user.createdAt.toDate() : user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : (isFounder ? 'March 2014' : 'Recently');

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div 
                className="w-full max-w-xs bg-black border border-[#2f3336] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 flex flex-col items-center text-center border-b border-[#2f3336] relative">
                    <button onClick={onClose} className="absolute top-4 left-4 text-white hover:bg-[#181818] p-1 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-black mb-3">
                        <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
                    </div>
                    
                    <h2 className="text-xl font-bold text-white flex items-center gap-1">
                        {displayName}
                        {isFounder ? (
                            <Crown className="w-5 h-5 text-[#ffd700] fill-[#ffd700]" />
                        ) : (
                            <CheckCircle2 className="w-5 h-5 text-[#1d9bf0] fill-[#1d9bf0]" />
                        )}
                    </h2>
                    <p className="text-[#71767b] text-sm">{displayHandle}</p>
                </div>

                {/* List Items */}
                <div className="p-4 space-y-5">
                    
                    {/* Join Date */}
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-[#71767b]" />
                        <div>
                            <p className="text-[#e7e9ea] text-sm font-bold">Joined {joinDate}</p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#71767b]" />
                        <div>
                            <p className="text-[#e7e9ea] text-sm font-bold">Saudi Arabia</p>
                        </div>
                    </div>

                    {/* Verification Status */}
                    {isFounder ? (
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5"><Crown className="w-5 h-5 text-[#ffd700] fill-[#ffd700]" /></div>
                            <div>
                                <p className="text-[#ffd700] text-sm font-bold">Official Founder Account</p>
                                <p className="text-[#71767b] text-xs leading-snug mt-0.5">
                                    Verified because this is the owner and founder of Milaf Community.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5"><CheckCircle2 className="w-5 h-5 text-[#1d9bf0] fill-[#1d9bf0]" /></div>
                            <div>
                                <p className="text-[#1d9bf0] text-sm font-bold">Verified Account</p>
                                <p className="text-[#71767b] text-xs leading-snug mt-0.5">
                                    This account is verified because it's subscribed to Milaf Premium.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Identity */}
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-[#71767b]" />
                        <div>
                            <p className="text-[#e7e9ea] text-sm font-bold">Identity Confirmed</p>
                        </div>
                    </div>

                    {/* Changes */}
                    <div className="flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-[#71767b]" />
                        <div>
                            <p className="text-[#e7e9ea] text-sm font-bold">0 Username Changes</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
