
import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Save, Loader2, Link as LinkIcon, MapPin, Youtube, Phone, GraduationCap, Cpu, ShieldCheck, Eye, EyeOff, CheckCircle2, Github, Mail, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadImage } from '../../src/services/storageService';
import { PhoneVerifyModal } from './PhoneVerifyModal';
import { linkAccount } from '../../src/services/authService';
import { auth } from '../../src/lib/firebase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// --- Custom Icons for Providers ---
const GoogleIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);

const YahooIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#fff"><path d="M12 12.5L8.5 4H5.5l5 9.5V20h3v-6.5l5-9.5h-3L12 12.5z"/></svg>
);

export const EditProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isPhoneVerifyOpen, setIsPhoneVerifyOpen] = useState(false);
  const [isLinking, setIsLinking] = useState<string | null>(null); // 'google', 'yahoo', 'github' or null

  // Form State
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    youtube: '',
    photoURL: '',
    bannerURL: '',
    phoneNumber: '',
    isPhoneHidden: false,
    educationBio: '',
    skillsBio: ''
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
        youtube: user.customFormFields?.youtube || '',
        photoURL: user.avatar || '',
        bannerURL: user.coverImage || '',
        phoneNumber: user.phone || '',
        isPhoneHidden: user.isPhoneHidden || false, 
        educationBio: user.customFormFields?.educationBio || '',
        skillsBio: user.skills ? user.skills.join(', ') : ''
      });
    }
  }, [user, isOpen]);

  // Determine Linked Accounts
  const firebaseUser = auth.currentUser;
  const providerData = firebaseUser?.providerData || [];
  
  const isGoogleLinked = providerData.some(p => p.providerId === 'google.com');
  const isGithubLinked = providerData.some(p => p.providerId === 'github.com');
  const isYahooLinked = providerData.some(p => p.providerId === 'yahoo.com');

  if (!isOpen || !user) return null;

  const handleLinkAccount = async (provider: 'google' | 'github' | 'yahoo') => {
      if (!firebaseUser) return;
      setIsLinking(provider);
      try {
          await linkAccount(firebaseUser, provider);
          alert(`تم ربط حساب ${provider} وتوثيقه بنجاح!`);
          // Note: State update will happen automatically via AuthContext listener or re-render
      } catch (e: any) {
          alert(e.message || "فشل الربط");
      } finally {
          setIsLinking(null);
      }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (formData.displayName.toLowerCase().includes('murad')) {
         const authorizedIds = ['admin-fixed-id', 'murad-ai-bot-id', 'admin-murad-id'];
         if (!authorizedIds.includes(user.id)) {
             alert("عذراً، استخدام اسم 'Murad' في الاسم الظاهر محجوز للإدارة والنظام فقط.");
             setIsSaving(false);
             return;
         }
    }

    try {
      const skillsArray = formData.skillsBio.split(',').map(s => s.trim()).filter(Boolean);

      await updateProfile({
        name: formData.displayName,
        bio: formData.bio,
        address: formData.location,
        avatar: formData.photoURL,
        coverImage: formData.bannerURL,
        isPhoneHidden: formData.isPhoneHidden, 
        skills: skillsArray,
        customFormFields: {
            ...user.customFormFields,
            website: formData.website,
            youtube: formData.youtube,
            educationBio: formData.educationBio
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
          setIsSaving(true);
          
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
    <>
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
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            
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

              {/* --- VERIFICATION SECTION (New & Existing) --- */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500"/> التوثيق والأمان
                  </h3>
                  
                  {/* Phone Verification */}
                  <div className="flex items-center justify-between bg-[#16181c] p-3 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-500">
                              <Phone className="w-4 h-4"/>
                          </div>
                          <div>
                              <div className="text-white text-xs font-bold">رقم الجوال</div>
                              <div className="text-gray-500 text-[10px] dir-ltr text-right">
                                  {formData.phoneNumber || 'غير مرتبط'}
                              </div>
                          </div>
                      </div>
                      <button 
                          type="button"
                          onClick={() => setIsPhoneVerifyOpen(true)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold transition-colors"
                      >
                          {formData.phoneNumber ? 'تغيير' : 'ربط'}
                      </button>
                  </div>

                  {/* Social Linking (New) */}
                  <div className="grid grid-cols-1 gap-2">
                      {/* Google */}
                      <div className="flex items-center justify-between bg-[#16181c] p-3 rounded-lg border border-slate-700">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-red-500/10 rounded-full">
                                  <GoogleIcon />
                              </div>
                              <div className="text-white text-xs font-bold">Google</div>
                          </div>
                          <button 
                              type="button"
                              onClick={() => !isGoogleLinked && handleLinkAccount('google')}
                              disabled={isGoogleLinked || isLinking === 'google'}
                              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1 ${isGoogleLinked ? 'text-emerald-400 cursor-default' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                          >
                              {isLinking === 'google' && <Loader2 className="w-3 h-3 animate-spin"/>}
                              {isGoogleLinked ? <><CheckCircle2 className="w-3 h-3"/> موثق</> : 'ربط وتوثيق'}
                          </button>
                      </div>

                      {/* Yahoo */}
                      <div className="flex items-center justify-between bg-[#16181c] p-3 rounded-lg border border-slate-700">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-500/20 rounded-full">
                                  <YahooIcon />
                              </div>
                              <div className="text-white text-xs font-bold">Yahoo</div>
                          </div>
                          <button 
                              type="button"
                              onClick={() => !isYahooLinked && handleLinkAccount('yahoo')}
                              disabled={isYahooLinked || isLinking === 'yahoo'}
                              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1 ${isYahooLinked ? 'text-emerald-400 cursor-default' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                          >
                              {isLinking === 'yahoo' && <Loader2 className="w-3 h-3 animate-spin"/>}
                              {isYahooLinked ? <><CheckCircle2 className="w-3 h-3"/> موثق</> : 'ربط وتوثيق'}
                          </button>
                      </div>

                      {/* GitHub */}
                      <div className="flex items-center justify-between bg-[#16181c] p-3 rounded-lg border border-slate-700">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-700/50 rounded-full text-white">
                                  <Github className="w-4 h-4"/>
                              </div>
                              <div className="text-white text-xs font-bold">GitHub</div>
                          </div>
                          <button 
                              type="button"
                              onClick={() => !isGithubLinked && handleLinkAccount('github')}
                              disabled={isGithubLinked || isLinking === 'github'}
                              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1 ${isGithubLinked ? 'text-emerald-400 cursor-default' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                          >
                              {isLinking === 'github' && <Loader2 className="w-3 h-3 animate-spin"/>}
                              {isGithubLinked ? <><CheckCircle2 className="w-3 h-3"/> موثق</> : 'ربط وتوثيق'}
                          </button>
                      </div>
                  </div>

                  {/* Privacy Toggle */}
                  <div className="flex items-center gap-2 mt-2 px-1 pt-2">
                      <button 
                          type="button" 
                          onClick={() => setFormData(prev => ({ ...prev, isPhoneHidden: !prev.isPhoneHidden }))}
                          className={`w-10 h-5 rounded-full relative transition-colors ${formData.isPhoneHidden ? 'bg-blue-600' : 'bg-slate-700'}`}
                      >
                          <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${formData.isPhoneHidden ? 'left-1' : 'right-1'}`}></div>
                      </button>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                          {formData.isPhoneHidden ? <EyeOff className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
                          إخفاء رقم الهاتف في الملف الشخصي
                      </span>
                  </div>
              </div>

              {/* Education Section */}
              <div className="space-y-1">
                  <label className="text-slate-500 text-xs font-bold px-1">التعليم (يظهر تحت رقم الهاتف)</label>
                  <div className="relative">
                      <input 
                          type="text" 
                          value={formData.educationBio} 
                          onChange={e => setFormData({...formData, educationBio: e.target.value})}
                          className="w-full bg-transparent border border-slate-700 rounded-md p-3 pl-10 text-white focus:border-blue-500 focus:outline-none transition-colors"
                          placeholder="مثال: بكالوريوس هندسة برمجيات - جامعة الملك سعود"
                      />
                      <GraduationCap className="absolute left-3 top-3.5 w-5 h-5 text-slate-500"/>
                  </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-1">
                  <label className="text-slate-500 text-xs font-bold px-1">المهارات (افصل بينها بفاصلة)</label>
                  <div className="relative">
                      <input 
                          type="text" 
                          value={formData.skillsBio} 
                          onChange={e => setFormData({...formData, skillsBio: e.target.value})}
                          className="w-full bg-transparent border border-slate-700 rounded-md p-3 pl-10 text-white focus:border-blue-500 focus:outline-none transition-colors"
                          placeholder="مثال: برمجة، تصميم، تسويق، إدارة"
                      />
                      <Cpu className="absolute left-3 top-3.5 w-5 h-5 text-slate-500"/>
                  </div>
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

              <div className="space-y-1">
                <label className="text-slate-500 text-xs font-bold px-1">قناة يوتيوب</label>
                <div className="relative">
                  <input 
                      type="text" 
                      value={formData.youtube} 
                      onChange={e => setFormData({...formData, youtube: e.target.value})}
                      className="w-full bg-transparent border border-slate-700 rounded-md p-3 pl-10 text-white focus:border-red-500 focus:outline-none transition-colors font-mono text-sm dir-ltr"
                      placeholder="https://youtube.com/@channel"
                  />
                  <Youtube className="absolute left-3 top-3.5 w-5 h-5 text-red-500 opacity-70"/>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <PhoneVerifyModal isOpen={isPhoneVerifyOpen} onClose={() => setIsPhoneVerifyOpen(false)} />
    </>
  );
};
