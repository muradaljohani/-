
import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Save, Loader2, Link as LinkIcon, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadImage } from '../../src/services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    photoURL: '',
    bannerURL: ''
  });

  // Refs for file inputs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Initialize with current user data
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        displayName: user.name || '',
        bio: user.bio || '',
        location: user.address || '',
        website: user.customFormFields?.website || '',
        photoURL: user.avatar || '',
        bannerURL: user.coverImage || ''
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({
        name: formData.displayName,
        bio: formData.bio,
        address: formData.location,
        avatar: formData.photoURL,
        coverImage: formData.bannerURL,
        customFormFields: {
            ...user.customFormFields,
            website: formData.website
        }
      });
      onClose();
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setIsSaving(true); // Block saving while uploading
          
          try {
              const path = `users/${user.id}/${type}_${Date.now()}`;
              const url = await uploadImage(file, path);
              
              setFormData(prev => ({
                  ...prev,
                  [type === 'avatar' ? 'photoURL' : 'bannerURL']: url
              }));
          } catch (err) {
              alert("فشل رفع الصورة");
          } finally {
              setIsSaving(false);
          }
      }
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up font-sans" dir="rtl">
      <div className="relative w-full max-w-lg bg-black border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-slate-900 rounded-full transition-colors text-slate-400 hover:text-white">
              <X className="w-5 h-5"/>
            </button>
            <h2 className="text-xl font-bold text-white">تعديل الملف الشخصي</h2>
          </div>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-6 py-1.5 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin"/>}
            <span>حفظ</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Images Section */}
          <div className="relative mb-16">
            {/* Banner */}
            <div className="h-32 w-full bg-slate-800 relative group cursor-pointer" onClick={() => bannerInputRef.current?.click()}>
              {formData.bannerURL ? (
                <img src={formData.bannerURL} className="w-full h-full object-cover opacity-80" alt="Banner" />
              ) : (
                <div className="w-full h-full bg-slate-800"></div>
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-100 transition-opacity">
                <div className="bg-black/50 p-2 rounded-full backdrop-blur-md hover:bg-black/70">
                    <Camera className="w-5 h-5 text-white opacity-90"/>
                </div>
              </div>
              <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')}/>
            </div>

            {/* Avatar */}
            <div className="absolute -bottom-10 right-4 p-1 bg-black rounded-full cursor-pointer group" onClick={() => avatarInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full bg-slate-900 relative overflow-hidden border-2 border-slate-800">
                 <img src={formData.photoURL || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-full h-full object-cover opacity-80"/>
                 <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-100 transition-opacity">
                    <div className="bg-black/50 p-2 rounded-full backdrop-blur-md hover:bg-black/70">
                        <Camera className="w-5 h-5 text-white opacity-90"/>
                    </div>
                 </div>
              </div>
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')}/>
            </div>
          </div>

          {/* Fields */}
          <div className="p-4 space-y-6">
            
            <div className="space-y-1">
              <label className="text-slate-500 text-xs font-bold px-1">الاسم</label>
              <input 
                type="text" 
                value={formData.displayName} 
                onChange={e => setFormData({...formData, displayName: e.target.value})}
                className="w-full bg-transparent border border-slate-700 rounded-md p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="الاسم الظاهر"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 text-xs font-bold px-1">النبذة التعريفية</label>
              <textarea 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-transparent border border-slate-700 rounded-md p-3 text-white focus:border-blue-500 focus:outline-none transition-colors h-24 resize-none"
                placeholder="اكتب نبذة عن نفسك..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 text-xs font-bold px-1">الموقع الجغرافي</label>
              <div className="relative">
                 <input 
                    type="text" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-transparent border border-slate-700 rounded-md p-3 pl-10 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="الرياض، المملكة العربية السعودية"
                />
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-500"/>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-500 text-xs font-bold px-1">الموقع الإلكتروني</label>
              <div className="relative">
                <input 
                    type="text" 
                    value={formData.website} 
                    onChange={e => setFormData({...formData, website: e.target.value})}
                    className="w-full bg-transparent border border-slate-700 rounded-md p-3 pl-10 text-blue-400 focus:border-blue-500 focus:outline-none transition-colors font-mono text-sm dir-ltr"
                    placeholder="https://example.com"
                />
                <LinkIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-500"/>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
