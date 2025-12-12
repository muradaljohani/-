
import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Save, Loader2, Link as LinkIcon, MapPin, Youtube, Phone, GraduationCap, Cpu, ShieldCheck, Eye, EyeOff, CheckCircle2, Github, Unlink, Link as ChainIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadImage } from '../../src/services/storageService';
import { PhoneVerifyModal } from './PhoneVerifyModal';
import { linkProvider, unlinkProvider } from '../../src/services/authService';
import { auth, db, doc, updateDoc } from '../../src/lib/firebase';
import { User } from 'firebase/auth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// --- Custom Icons for Providers ---
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);

const YahooIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#fff"><path d="M12 12.5L8.5 4H5.5l5 9.5V20h3v-6.5l5-9.5h-3L12 12.5z"/></svg>
);

const MicrosoftIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#fff"/></svg>
);

export const EditProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isPhoneVerifyOpen, setIsPhoneVerifyOpen] = useState(false);
  const [linkingState, setLinkingState] = useState<string | null>(null); 
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  // Privacy State (Local state before saving)
  const [privacy, setPrivacy] = useState({
      showPhone: false,
      showEmail: true,
      showGoogle: true,
      showGithub: true,
      showYahoo: true,
      showMicrosoft: true
  });

  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    youtube: '',
    photoURL: '',
    bannerURL: '',
    phoneNumber: '',
    educationBio: '',
    skillsBio: ''
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

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
        educationBio: user.customFormFields?.educationBio || '',
        skillsBio: user.skills ? user.skills.join(', ') : ''
      });
      
      // Initialize Privacy Settings
      setPrivacy({
          showPhone: user.privacy?.showPhone ?? false,
          showEmail: user.privacy?.showEmail ?? true,
          showGoogle: user.privacy?.showGoogle ?? true,
          showGithub: user.privacy?.showGithub ?? true,
          showYahoo: user.privacy?.showYahoo ?? true,
          showMicrosoft: user.privacy?.showMicrosoft ?? true,
      });

      setCurrentUser(auth.currentUser);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  // --- SOCIAL LINKING HANDLERS ---
  
  const handleLink = async (providerId: string) => {
    setLinkingState(providerId);

    // Get freshest user object directly from Auth SDK
    const activeUser = auth.currentUser;

    if (!activeUser) {
        alert("يرجى تسجيل الدخول أولاً لتتمكن من ربط الحساب.");
        setLinkingState(null);
        return;
    }

    try {
        // Explicitly pass the active Firebase user object to prevent null errors
        const updatedUser = await linkProvider(activeUser, providerId);
        
        setCurrentUser(updatedUser); 
        
        // --- REAL FIRESTORE UPDATE ---
        const userRef = doc(db, 'users', user.id);
        const providerData = updatedUser.providerData.find(p => p.providerId === providerId);
        
        // Prepare updates
        const updates: any = {};
        const linkedProviders = updatedUser.providerData.map(p => p.providerId);
        
        updates['linkedProviders'] = linkedProviders;
        
        // Also verify the specific flag for compatibility
        if (providerId === 'github.com') updates.isGithubVerified = true;
        if (providerId === 'yahoo.com') updates.isYahooVerified = true;
        if (providerId === 'google.com') updates.isGoogleVerified = true;
        if (providerId === 'microsoft.com') updates.isMicrosoftVerified = true;
        
        // Store email if available (for privacy display)
        if (providerData?.email) {
            updates[`providerEmails.${providerId}`] = providerData.email;
        }

        // Update Firestore
        await updateDoc(userRef, updates);
        
        // Update Local Context
        updateProfile(updates);

        alert("تم ربط الحساب بنجاح ✅");
    } catch (e: any) {
        console.error(e);
        alert(e.message || "فشل الربط");
    } finally {
        setLinkingState(null);
    }
  };

  const handleUnlink = async (providerId: string) => {
    if (!auth.currentUser) return;

    if (auth.currentUser.providerData && auth.currentUser.providerData.length === 1) {
        alert("لا يمكن إلغاء ربط وسيلة الدخول الوحيدة.");
        return;
    }

    if (!window.confirm("هل أنت متأكد من إلغاء ربط هذا الحساب؟")) return;

    setLinkingState(providerId);
    try {
        const updatedUser = await unlinkProvider(providerId);
        setCurrentUser(updatedUser);

        const userRef = doc(db, 'users', user.id);
        const updates: any = {};
        
        // Update flags
        if (providerId === 'github.com') updates.isGithubVerified = false;
        if (providerId === 'yahoo.com') updates.isYahooVerified = false;
        if (providerId === 'google.com') updates.isGoogleVerified = false;
        if (providerId === 'microsoft.com') updates.isMicrosoftVerified = false;

        // Update list
        const linkedProviders = updatedUser.providerData.map(p => p.providerId);
        updates['linkedProviders'] = linkedProviders;
        
        await updateDoc(userRef, updates);
        updateProfile(updates);

        alert("تم إلغاء الربط بنجاح.");
    } catch (e: any) {
        alert(e.message || "فشل إلغاء الربط");
    } finally {
        setLinkingState(null);
    }
  };

  const togglePrivacySetting = (key: keyof typeof privacy) => {
      setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const providers = [
      { id: 'google.com', name: 'Google', icon: <GoogleIcon />, color: 'bg-red-500/10', privacyKey: 'showGoogle' },
      { id: 'github.com', name: 'GitHub', icon: <Github className="w-5 h-5 text-white"/>, color: 'bg-gray-700/50', privacyKey: 'showGithub' },
      { id: 'microsoft.com', name: 'Microsoft', icon: <MicrosoftIcon />, color: 'bg-blue-500/10', privacyKey: 'showMicrosoft' },
      { id: 'yahoo.com', name: 'Yahoo', icon: <YahooIcon />, color: 'bg-purple-500/20', privacyKey: 'showYahoo' },
  ];

  const getProviderInfo = (pId: string) => {
      return currentUser?.providerData.find(pd => pd.providerId === pId);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const skillsArray = formData.skillsBio.split(',').map(s => s.trim()).filter(Boolean);

      // Save Profile Data AND Privacy Settings
      const updates = {
        name: formData.displayName,
        bio: formData.bio,
        address: formData.location,
        avatar: formData.photoURL,
        coverImage: formData.bannerURL,
        isPhoneHidden: !privacy.showPhone, // Map privacy setting to legacy flag if needed
        privacy: privacy, // Save full privacy object
        skills: skillsArray,
        customFormFields: {
            ...user.customFormFields,
            website: formData.website,
            youtube: formData.youtube,
            educationBio: formData.educationBio
        }
      };

      // Update Firestore
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, updates);

      // Update Context
      await updateProfile(updates);
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
             console.error(err);
          } finally {
              setIsSaving(false);
          }
      }
  };

  return (
    <>
      <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up font-sans" dir="rtl">
        <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-[#1e293b]">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
                <X className="w-6 h-6"/>
              </button>
              <h2 className="text-xl font-bold text-white">تعديل الملف والخصوصية</h2>
            </div>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="px-8 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin"/>}
              <span>حفظ التغييرات</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#0b1120]">
            
            {/* Images Section */}
            <div className="relative mb-20">
              <div className="h-40 w-full bg-slate-800 relative group cursor-pointer" onClick={() => bannerInputRef.current?.click()}>
                {formData.bannerURL ? (
                  <img src={formData.bannerURL} className="w-full h-full object-cover opacity-80" alt="Banner" />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-slate-600"/>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/50 p-3 rounded-full backdrop-blur-md">
                      <Camera className="w-6 h-6 text-white"/>
                  </div>
                </div>
                <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')}/>
              </div>

              <div className="absolute -bottom-14 right-6 p-1.5 bg-[#0b1120] rounded-full cursor-pointer group" onClick={() => avatarInputRef.current?.click()}>
                <div className="w-28 h-28 rounded-full bg-slate-800 relative overflow-hidden border-2 border-slate-700">
                   <img src={formData.photoURL || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-full h-full object-cover"/>
                   <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white"/>
                   </div>
                </div>
                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')}/>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-8">
              
              {/* Basic Info */}
              <div className="space-y-4">
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">المعلومات الأساسية</h3>
                  <div className="space-y-1">
                    <label className="text-slate-400 text-xs font-bold px-1">الاسم الظاهر</label>
                    <input 
                      type="text" 
                      value={formData.displayName} 
                      onChange={e => setFormData({...formData, displayName: e.target.value})}
                      className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 text-xs font-bold px-1">النبذة التعريفية</label>
                    <textarea 
                      value={formData.bio} 
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                      className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 focus:outline-none transition-colors h-24 resize-none"
                      placeholder="اكتب نبذة عن نفسك..."
                    />
                  </div>
                  
                   <div className="space-y-1">
                    <label className="text-slate-400 text-xs font-bold px-1">الموقع الجغرافي</label>
                    <div className="relative">
                       <input 
                          type="text" 
                          value={formData.location} 
                          onChange={e => setFormData({...formData, location: e.target.value})}
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 pl-10 text-white focus:border-blue-500 focus:outline-none transition-colors"
                          placeholder="الرياض، المملكة العربية السعودية"
                      />
                      <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-500"/>
                    </div>
                  </div>
              </div>

              {/* Linked Accounts & Privacy */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-500"/> الحسابات المرتبطة والخصوصية
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                      اربط حساباتك لتوثيق الهوية. يمكنك إخفاء البريد الإلكتروني مع الحفاظ على علامة التوثيق ظاهرة في ملفك.
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                      {providers.map(p => {
                          const providerInfo = getProviderInfo(p.id);
                          const linked = !!providerInfo;
                          const isProcessing = linkingState === p.id;
                          const isVisible = privacy[p.privacyKey as keyof typeof privacy];

                          return (
                            <div key={p.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${linked ? 'bg-[#161b22] border-emerald-500/30' : 'bg-[#1e293b] border-slate-700'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${p.color}`}>
                                        {p.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-sm flex items-center gap-2">
                                            {p.name}
                                            {linked && <CheckCircle2 className="w-3 h-3 text-emerald-500 fill-current"/>}
                                        </span>
                                        <span className="text-[11px] text-gray-500 font-mono">
                                            {linked ? (providerInfo?.email || 'Linked') : 'Not Linked'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    {linked ? (
                                        <>
                                            {/* Privacy Toggle */}
                                            <div className="flex items-center gap-2 mr-2" title={isVisible ? "البريد ظاهر في الملف" : "البريد مخفي (تظهر علامة التوثيق فقط)"}>
                                                <button 
                                                    type="button" 
                                                    onClick={() => togglePrivacySetting(p.privacyKey as any)}
                                                    className={`w-10 h-5 rounded-full relative transition-colors ${isVisible ? 'bg-blue-600' : 'bg-slate-600'}`}
                                                >
                                                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${isVisible ? 'left-1' : 'right-1'}`}></div>
                                                </button>
                                                <span className="text-[10px] text-gray-400 w-8 text-center">{isVisible ? 'ظاهر' : 'مخفي'}</span>
                                            </div>

                                            {/* Unlink */}
                                            <button 
                                                type="button"
                                                onClick={() => handleUnlink(p.id)}
                                                disabled={isProcessing}
                                                className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                                                title="إلغاء الربط"
                                            >
                                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Unlink className="w-4 h-4"/>}
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            type="button"
                                            onClick={() => handleLink(p.id)}
                                            disabled={isProcessing}
                                            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
                                        >
                                            {isProcessing ? <Loader2 className="w-3 h-3 animate-spin"/> : <ChainIcon className="w-3 h-3"/>}
                                            ربط الآن
                                        </button>
                                    )}
                                </div>
                            </div>
                          );
                      })}
                  </div>

                  {/* Phone Privacy */}
                  <div className="flex items-center justify-between bg-[#161b22] p-4 rounded-xl border border-slate-700 mt-2">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 rounded-lg">
                              <Phone className="w-5 h-5 text-emerald-500"/>
                          </div>
                          <div className="flex flex-col">
                              <span className="text-white font-bold text-sm">رقم الهاتف</span>
                              <span className="text-[11px] text-gray-500 font-mono">{formData.phoneNumber || 'غير مرتبط'}</span>
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                          {formData.phoneNumber ? (
                              <div className="flex items-center gap-2" title="إظهار الرقم في الملف العام">
                                  <button 
                                      type="button" 
                                      onClick={() => togglePrivacySetting('showPhone')}
                                      className={`w-10 h-5 rounded-full relative transition-colors ${privacy.showPhone ? 'bg-blue-600' : 'bg-slate-600'}`}
                                  >
                                      <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${privacy.showPhone ? 'left-1' : 'right-1'}`}></div>
                                  </button>
                                  <span className="text-[10px] text-gray-400">{privacy.showPhone ? 'ظاهر' : 'مخفي'}</span>
                              </div>
                          ) : (
                              <button 
                                  type="button"
                                  onClick={() => setIsPhoneVerifyOpen(true)}
                                  className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-500 transition-colors"
                              >
                                  ربط الهاتف
                              </button>
                          )}
                      </div>
                  </div>
              </div>

              {/* Education & Skills */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">التعليم والمهارات</h3>
                  
                  <div className="space-y-1">
                      <label className="text-slate-400 text-xs font-bold px-1">التعليم</label>
                      <div className="relative">
                          <input 
                              type="text" 
                              value={formData.educationBio} 
                              onChange={e => setFormData({...formData, educationBio: e.target.value})}
                              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 pl-10 text-white focus:border-blue-500 focus:outline-none transition-colors"
                              placeholder="مثال: بكالوريوس هندسة برمجيات - جامعة الملك سعود"
                          />
                          <GraduationCap className="absolute left-3 top-3.5 w-5 h-5 text-slate-500"/>
                      </div>
                  </div>

                  <div className="space-y-1">
                      <label className="text-slate-400 text-xs font-bold px-1">المهارات (افصل بينها بفاصلة)</label>
                      <div className="relative">
                          <input 
                              type="text" 
                              value={formData.skillsBio} 
                              onChange={e => setFormData({...formData, skillsBio: e.target.value})}
                              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 pl-10 text-white focus:border-blue-500 focus:outline-none transition-colors"
                              placeholder="مثال: برمجة، تصميم، تسويق، إدارة"
                          />
                          <Cpu className="absolute left-3 top-3.5 w-5 h-5 text-slate-500"/>
                      </div>
                  </div>
              </div>

              {/* Links */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                  <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">الروابط الخارجية</h3>
                  
                  <div className="space-y-1">
                    <label className="text-slate-400 text-xs font-bold px-1">الموقع الإلكتروني</label>
                    <div className="relative">
                      <input 
                          type="text" 
                          value={formData.website} 
                          onChange={e => setFormData({...formData, website: e.target.value})}
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 pl-10 text-blue-400 focus:border-blue-500 focus:outline-none transition-colors font-mono text-sm dir-ltr"
                          placeholder="https://example.com"
                      />
                      <LinkIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-500"/>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 text-xs font-bold px-1">قناة يوتيوب</label>
                    <div className="relative">
                      <input 
                          type="text" 
                          value={formData.youtube} 
                          onChange={e => setFormData({...formData, youtube: e.target.value})}
                          className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 pl-10 text-white focus:border-red-500 focus:outline-none transition-colors font-mono text-sm dir-ltr"
                          placeholder="https://youtube.com/@channel"
                      />
                      <Youtube className="absolute left-3 top-3.5 w-5 h-5 text-red-500 opacity-70"/>
                    </div>
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
