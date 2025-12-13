
import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Loader2, Phone, ShieldCheck, CheckCircle2, Github, Unlink, Link as ChainIcon, GraduationCap, Cpu, Plus, Trash2, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadImage } from '../../src/services/storageService';
import { PhoneVerifyModal } from './PhoneVerifyModal';
import { db, doc, updateDoc, auth } from '../../src/lib/firebase';
import { linkWithPopup, unlink, GoogleAuthProvider, GithubAuthProvider, OAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { Education, Experience } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// --- Custom Icons ---
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);
const YahooIcon = () => (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="#6001d2"><path d="M12 12.5L8.5 4H5.5l5 9.5V20h3v-6.5l5-9.5h-3L12 12.5z" fill="white"/></svg>);
const MicrosoftIcon = () => (<svg className="w-5 h-5" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>);

export const EditProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isPhoneVerifyOpen, setIsPhoneVerifyOpen] = useState(false);
  const [linkingState, setLinkingState] = useState<string | null>(null); 
  const [activeTab, setActiveTab] = useState<'basic' | 'professional' | 'social'>('basic');
  
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  const [privacy, setPrivacy] = useState({
      showPhone: false, showEmail: true, showGoogle: true, showGithub: true, showYahoo: true, showMicrosoft: true
  });

  const [formData, setFormData] = useState({
    displayName: '', bio: '', location: '', website: '', youtube: '', photoURL: '', bannerURL: '', phoneNumber: '', educationBio: '', skillsBio: ''
  });

  // New Structured Data
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [skillsTags, setSkillsTags] = useState<string[]>([]);

  // Temp inputs for adding new entries
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', year: '' });
  const [newExp, setNewExp] = useState({ company: '', position: '', duration: '' });
  const [newSkill, setNewSkill] = useState('');

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
        skillsBio: '' // Deprecated in favor of array
      });
      setPrivacy({
          showPhone: user.privacy?.showPhone ?? false,
          showEmail: user.privacy?.showEmail ?? true,
          showGoogle: user.privacy?.showGoogle ?? true,
          showGithub: user.privacy?.showGithub ?? true,
          showYahoo: user.privacy?.showYahoo ?? true,
          showMicrosoft: user.privacy?.showMicrosoft ?? true,
      });
      
      // Initialize Structured Data
      setEducationList(user.education || []);
      setExperienceList(user.experience || []);
      setSkillsTags(user.skills || []);

      setCurrentUser(auth.currentUser);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  // --- Helpers for Auth Linking ---
  const getProvider = (providerId: string) => {
      switch (providerId) {
          case 'google.com': return new GoogleAuthProvider();
          case 'github.com': return new GithubAuthProvider();
          case 'yahoo.com': return new OAuthProvider('yahoo.com');
          case 'microsoft.com': 
              const mp = new OAuthProvider('microsoft.com'); 
              mp.setCustomParameters({ prompt: "select_account" });
              return mp;
          case 'facebook.com': return new FacebookAuthProvider();
          default: throw new Error("Unknown provider");
      }
  };

  const handleLink = async (providerId: string) => {
    setLinkingState(providerId);
    const activeUser = auth.currentUser;
    if (!activeUser) {
        alert("انتهت جلسة تسجيل الدخول. يرجى تحديث الصفحة وإعادة الدخول.");
        setLinkingState(null);
        return;
    }

    try {
       const provider = getProvider(providerId);
       await linkWithPopup(activeUser, provider);
       await activeUser.reload();
       
       const userRef = doc(db, 'users', user.id);
       const updates: any = {};
       const linkedProviders = activeUser.providerData.map(p => p.providerId) || [];
       updates['linkedProviders'] = linkedProviders;
       
       if (providerId === 'github.com') updates.isGithubVerified = true;
       if (providerId === 'yahoo.com') updates.isYahooVerified = true;
       if (providerId === 'google.com') updates.isGoogleVerified = true;
       if (providerId === 'microsoft.com') updates.isMicrosoftVerified = true;
       
       await updateDoc(userRef, updates);
       setCurrentUser(auth.currentUser);
       window.location.reload(); 
     } catch (error: any) {
       console.error("Linking Error:", error);
       if (error.code !== 'auth/popup-closed-by-user') {
          alert("فشل الربط: " + error.message);
       }
     } finally {
       setLinkingState(null);
     }
  };

  const handleUnlink = async (providerId: string) => {
    const activeUser = auth.currentUser;
    if (!activeUser) return;
    if (!window.confirm("هل أنت متأكد من إلغاء الربط؟")) return;

    setLinkingState(providerId);
    try {
        await unlink(activeUser, providerId);
        await activeUser.reload();
        
        const userRef = doc(db, 'users', user.id);
        const updates: any = {};
        if (providerId === 'github.com') updates.isGithubVerified = false;
        if (providerId === 'yahoo.com') updates.isYahooVerified = false;
        if (providerId === 'google.com') updates.isGoogleVerified = false;
        if (providerId === 'microsoft.com') updates.isMicrosoftVerified = false;
        const linkedProviders = activeUser.providerData.map(p => p.providerId);
        updates['linkedProviders'] = linkedProviders;

        await updateDoc(userRef, updates);
        updateProfile(updates);
        setCurrentUser(auth.currentUser);
        window.location.reload();
    } catch (e: any) {
        alert("فشل إلغاء الربط: " + e.message);
    } finally {
        setLinkingState(null);
    }
  };

  const isProviderLinked = (pId: string) => currentUser?.providerData.some(pd => pd.providerId === pId);
  const getProviderEmail = (pId: string) => currentUser?.providerData.find(pd => pd.providerId === pId)?.email;
  const providers = [
      { id: 'google.com', name: 'Google', icon: <GoogleIcon />, color: 'bg-red-500/10' },
      { id: 'github.com', name: 'GitHub', icon: <Github className="w-5 h-5 text-white"/>, color: 'bg-gray-700/50' },
      { id: 'microsoft.com', name: 'Microsoft', icon: <MicrosoftIcon />, color: 'bg-blue-500/10' },
      { id: 'yahoo.com', name: 'Yahoo', icon: <YahooIcon />, color: 'bg-purple-500/20' },
  ];

  // --- Logic for Lists ---
  const addEducation = () => {
      if (!newEdu.institution || !newEdu.degree) return;
      setEducationList([...educationList, { ...newEdu, id: Date.now().toString() }]);
      setNewEdu({ institution: '', degree: '', year: '' });
  };
  const removeEducation = (id: string) => setEducationList(educationList.filter(e => e.id !== id));

  const addExperience = () => {
      if (!newExp.company || !newExp.position) return;
      setExperienceList([...experienceList, { ...newExp, id: Date.now().toString() }]);
      setNewExp({ company: '', position: '', duration: '' });
  };
  const removeExperience = (id: string) => setExperienceList(experienceList.filter(e => e.id !== id));

  const addSkill = () => {
      if (!newSkill || skillsTags.includes(newSkill)) return;
      setSkillsTags([...skillsTags, newSkill]);
      setNewSkill('');
  };
  const removeSkill = (skill: string) => setSkillsTags(skillsTags.filter(s => s !== skill));

  // --- Save Handler ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updates = {
        name: formData.displayName,
        bio: formData.bio,
        address: formData.location,
        avatar: formData.photoURL,
        coverImage: formData.bannerURL,
        isPhoneHidden: !privacy.showPhone,
        privacy: privacy, 
        skills: skillsTags,
        education: educationList,
        experience: experienceList,
        customFormFields: {
            ...user.customFormFields,
            website: formData.website,
            youtube: formData.youtube,
            educationBio: formData.educationBio // Legacy support
        }
      };
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, updates);
      await updateProfile(updates);
      onClose();
    } catch (error) {
      console.error(error);
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
              setFormData(prev => ({ ...prev, [type === 'avatar' ? 'photoURL' : 'bannerURL']: url }));
          } catch (err) { console.error(err); } finally { setIsSaving(false); }
      }
  };

  return (
    <>
      <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up font-sans" dir="rtl">
        <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-[#1e293b]">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"><X className="w-6 h-6"/></button>
              <h2 className="text-xl font-bold text-white">تعديل الملف</h2>
            </div>
            <button onClick={handleSave} disabled={isSaving} className="px-8 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin"/>}
              <span>حفظ</span>
            </button>
          </div>
          
          <div className="flex border-b border-slate-700 bg-[#161b22] px-4">
              <button onClick={() => setActiveTab('basic')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'basic' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>الأساسية</button>
              <button onClick={() => setActiveTab('professional')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'professional' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>المهنية</button>
              <button onClick={() => setActiveTab('social')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'social' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>الربط والأمان</button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#0b1120]">
            
            {activeTab === 'basic' && (
                <>
                {/* Banner & Avatar */}
                <div className="relative mb-20">
                  <div className="h-40 w-full bg-slate-800 relative group cursor-pointer" onClick={() => bannerInputRef.current?.click()}>
                    {formData.bannerURL ? <img src={formData.bannerURL} className="w-full h-full object-cover opacity-80" /> : <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Camera className="w-8 h-8 text-slate-600"/></div>}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="w-6 h-6 text-white"/></div>
                    <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')}/>
                  </div>
                  <div className="absolute -bottom-14 right-6 p-1.5 bg-[#0b1120] rounded-full cursor-pointer group" onClick={() => avatarInputRef.current?.click()}>
                    <div className="w-28 h-28 rounded-full bg-slate-800 relative overflow-hidden border-2 border-slate-700">
                       <img src={formData.photoURL || "https://api.dicebear.com/7.x/initials/svg?seed=User"} className="w-full h-full object-cover"/>
                       <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="w-6 h-6 text-white"/></div>
                    </div>
                    <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')}/>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <label className="text-slate-400 text-xs font-bold px-1">الاسم</label>
                      <input type="text" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 text-xs font-bold px-1">النبذة</label>
                      <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none h-24 resize-none"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 text-xs font-bold px-1">الموقع</label>
                      <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none" placeholder="المدينة، الدولة"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 text-xs font-bold px-1">الموقع الإلكتروني</label>
                      <input type="text" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full bg-[#1e293b] border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none" placeholder="https://..."/>
                    </div>
                </div>
                </>
            )}

            {activeTab === 'professional' && (
                <div className="p-6 space-y-8">
                    
                    {/* Education */}
                    <div>
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-purple-400"/> التعليم</h3>
                        <div className="space-y-3 mb-4">
                            {educationList.map(edu => (
                                <div key={edu.id} className="bg-[#1e293b] p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                                    <div>
                                        <div className="text-white font-bold text-sm">{edu.institution}</div>
                                        <div className="text-gray-400 text-xs">{edu.degree} {edu.year ? `(${edu.year})` : ''}</div>
                                    </div>
                                    <button onClick={() => removeEducation(edu.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4"/></button>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <input value={newEdu.institution} onChange={e => setNewEdu({...newEdu, institution: e.target.value})} placeholder="الجامعة / المعهد" className="bg-[#1e293b] border border-slate-700 rounded-lg p-2 text-xs text-white col-span-1" />
                            <input value={newEdu.degree} onChange={e => setNewEdu({...newEdu, degree: e.target.value})} placeholder="الدرجة العلمية" className="bg-[#1e293b] border border-slate-700 rounded-lg p-2 text-xs text-white col-span-1" />
                            <div className="flex gap-2 col-span-1">
                                <input value={newEdu.year} onChange={e => setNewEdu({...newEdu, year: e.target.value})} placeholder="السنة" className="bg-[#1e293b] border border-slate-700 rounded-lg p-2 text-xs text-white w-full" />
                                <button onClick={addEducation} className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 flex items-center justify-center"><Plus className="w-4 h-4"/></button>
                            </div>
                        </div>
                    </div>

                    {/* Experience */}
                    <div>
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-400"/> الخبرة العملية</h3>
                        <div className="space-y-3 mb-4">
                            {experienceList.map(exp => (
                                <div key={exp.id} className="bg-[#1e293b] p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                                    <div>
                                        <div className="text-white font-bold text-sm">{exp.position}</div>
                                        <div className="text-gray-400 text-xs">{exp.company} • {exp.duration}</div>
                                    </div>
                                    <button onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4"/></button>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <input value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} placeholder="الشركة / الجهة" className="bg-[#1e293b] border border-slate-700 rounded-lg p-2 text-xs text-white col-span-1" />
                            <input value={newExp.position} onChange={e => setNewExp({...newExp, position: e.target.value})} placeholder="المسمى الوظيفي" className="bg-[#1e293b] border border-slate-700 rounded-lg p-2 text-xs text-white col-span-1" />
                            <div className="flex gap-2 col-span-1">
                                <input value={newExp.duration} onChange={e => setNewExp({...newExp, duration: e.target.value})} placeholder="المدة" className="bg-[#1e293b] border border-slate-700 rounded-lg p-2 text-xs text-white w-full" />
                                <button onClick={addExperience} className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 flex items-center justify-center"><Plus className="w-4 h-4"/></button>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Cpu className="w-5 h-5 text-emerald-400"/> المهارات</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {skillsTags.map(skill => (
                                <span key={skill} className="bg-[#1e293b] border border-slate-700 text-gray-300 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} className="hover:text-red-400"><X className="w-3 h-3"/></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input 
                                value={newSkill} 
                                onChange={e => setNewSkill(e.target.value)} 
                                onKeyDown={e => e.key === 'Enter' && addSkill()}
                                placeholder="إضافة مهارة (اضغط Enter)" 
                                className="flex-1 bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-blue-500"
                            />
                            <button onClick={addSkill} className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 font-bold text-sm">إضافة</button>
                        </div>
                    </div>

                </div>
            )}

            {activeTab === 'social' && (
                <div className="p-6 space-y-6">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500"/> ربط الحسابات (التوثيق)</h3>
                    <p className="text-xs text-gray-500 mb-4">اربط حساباتك لتوثيق ملفك وزيادة ثقة الزوار.</p>
                    <div className="grid grid-cols-1 gap-3">
                      {providers.map(p => {
                          const linked = isProviderLinked(p.id);
                          const isProcessing = linkingState === p.id;
                          const email = getProviderEmail(p.id);

                          return (
                            <div key={p.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${linked ? 'bg-[#161b22] border-emerald-500/30' : 'bg-[#1e293b] border-slate-700'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${p.color}`}>{p.icon}</div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-sm flex items-center gap-2">{p.name} {linked && <CheckCircle2 className="w-3 h-3 text-emerald-500 fill-current"/>}</span>
                                        <span className="text-[11px] text-gray-500 font-mono">{linked ? (email || 'موثق') : 'غير مرتبط'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {linked ? (
                                        <button type="button" onClick={() => handleUnlink(p.id)} disabled={isProcessing} className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors" title="إلغاء الربط">
                                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Unlink className="w-4 h-4"/>}
                                        </button>
                                    ) : (
                                        <button type="button" onClick={() => handleLink(p.id)} disabled={isProcessing} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                                            {isProcessing ? <Loader2 className="w-3 h-3 animate-spin"/> : <ChainIcon className="w-3 h-3"/>} ربط
                                        </button>
                                    )}
                                </div>
                            </div>
                          );
                      })}
                    </div>
                    
                    {/* Phone */}
                    <div className="flex items-center justify-between bg-[#161b22] p-4 rounded-xl border border-slate-700 mt-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg"><Phone className="w-5 h-5 text-emerald-500"/></div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm">رقم الهاتف</span>
                                <span className="text-[11px] text-gray-500 font-mono">{formData.phoneNumber || 'غير مرتبط'}</span>
                            </div>
                        </div>
                        {!formData.phoneNumber && (
                            <button onClick={() => setIsPhoneVerifyOpen(true)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-500">ربط</button>
                        )}
                    </div>
                </div>
            )}

          </div>
        </div>
      </div>
      <PhoneVerifyModal isOpen={isPhoneVerifyOpen} onClose={() => setIsPhoneVerifyOpen(false)} />
    </>
  );
};
