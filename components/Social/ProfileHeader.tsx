
import React, { useState } from 'react';
import { MapPin, Link as LinkIcon, Calendar, CheckCircle2, Youtube } from 'lucide-react';
import { User } from '../../types';
import { EditProfileModal } from './EditProfileModal';

interface Props {
  user: User;
  isOwnProfile: boolean;
}

export const ProfileHeader: React.FC<Props> = ({ user, isOwnProfile }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const website = user.customFormFields?.website || user.businessProfile?.website;
  const youtube = user.customFormFields?.youtube;
  const joinDate = user.joinDate ? new Date(user.joinDate).toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' }) : 'يناير 2025';

  return (
    <>
      <div className="relative border-b border-slate-800 pb-4">
        
        {/* Banner */}
        <div className="h-48 bg-slate-900 w-full relative overflow-hidden">
          {user.coverImage ? (
            <img src={user.coverImage} className="w-full h-full object-cover" alt="Banner" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-900 to-slate-900"></div>
          )}
        </div>

        <div className="px-4 relative">
          
          {/* Avatar & Action Button */}
          <div className="flex justify-between items-start -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-black bg-slate-900 overflow-hidden relative">
              <img src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-full h-full object-cover" alt="Avatar"/>
            </div>
            
            <div className="mt-20">
              {isOwnProfile ? (
                <button 
                  onClick={() => setIsEditOpen(true)}
                  className="px-4 py-1.5 rounded-full border border-slate-600 text-white font-bold text-sm hover:bg-slate-900 transition-colors"
                >
                  تعديل الملف الشخصي
                </button>
              ) : (
                <button className="px-6 py-1.5 rounded-full bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors">
                  متابعة
                </button>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="mb-4">
            <h1 className="text-xl font-black text-white flex items-center gap-1.5">
              {user.name}
              {user.isIdentityVerified && <CheckCircle2 className="w-4 h-4 text-blue-500 fill-current" />}
            </h1>
            <p className="text-slate-500 text-sm font-mono" dir="ltr">@{user.username?.replace('@','') || user.id.slice(0,8)}</p>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-slate-300 text-sm mb-4 whitespace-pre-wrap leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Metadata Row */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-slate-500 text-sm mb-4">
            {user.address && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{user.address}</span>
              </div>
            )}
            {website && (
              <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate max-w-[200px]">
                  {website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {youtube && (
              <div className="flex items-center gap-1">
                <Youtube className="w-4 h-4 text-red-600" />
                <a href={youtube} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate max-w-[200px]">
                  YouTube
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>انضم في {joinDate}</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex gap-4 text-sm">
             <div className="flex gap-1 hover:underline cursor-pointer">
                 <span className="font-bold text-white">{user.following?.length || 0}</span>
                 <span className="text-slate-500">يتابع</span>
             </div>
             <div className="flex gap-1 hover:underline cursor-pointer">
                 <span className="font-bold text-white">{user.followers?.length || 0}</span>
                 <span className="text-slate-500">متابعون</span>
             </div>
          </div>

        </div>

        {/* Tabs */}
        <div className="flex mt-4 border-b border-slate-800">
           <button className="flex-1 py-3 text-sm font-bold text-white border-b-4 border-blue-500 hover:bg-slate-900 transition-colors">
              المنشورات
           </button>
           <button className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-white hover:bg-slate-900 transition-colors">
              الردود
           </button>
           <button className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-white hover:bg-slate-900 transition-colors">
              الوسائط
           </button>
           <button className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-white hover:bg-slate-900 transition-colors">
              الإعجابات
           </button>
        </div>
      </div>

      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </>
  );
};
