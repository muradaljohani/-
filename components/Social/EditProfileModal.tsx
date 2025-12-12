
import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Save, Loader2, Link as LinkIcon, MapPin, Youtube, Phone, GraduationCap, Cpu, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadImage } from '../../src/services/storageService';
import { PhoneVerifyModal } from './PhoneVerifyModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Comprehensive List of Country Codes
const COUNTRY_CODES = [
    // GCC & Arab World
    { code: '+966', country: 'السعودية', flag: '🇸🇦' },
    { code: '+971', country: 'الإمارات', flag: '🇦🇪' },
    { code: '+965', country: 'الكويت', flag: '🇰🇼' },
    { code: '+974', country: 'قطر', flag: '🇶🇦' },
    { code: '+968', country: 'عمان', flag: '🇴🇲' },
    { code: '+973', country: 'البحرين', flag: '🇧🇭' },
    { code: '+20', country: 'مصر', flag: '🇪🇬' },
    { code: '+964', country: 'العراق', flag: '🇮🇶' },
    { code: '+962', country: 'الأردن', flag: '🇯🇴' },
    { code: '+961', country: 'لبنان', flag: '🇱🇧' },
    { code: '+970', country: 'فلسطين', flag: '🇵🇸' },
    { code: '+963', country: 'سوريا', flag: '🇸🇾' },
    { code: '+967', country: 'اليمن', flag: '🇾🇪' },
    { code: '+218', country: 'ليبيا', flag: '🇱🇾' },
    { code: '+249', country: 'السودان', flag: '🇸🇩' },
    { code: '+212', country: 'المغرب', flag: '🇲🇦' },
    { code: '+216', country: 'تونس', flag: '🇹🇳' },
    { code: '+213', country: 'الجزائر', flag: '🇩🇿' },
    { code: '+222', country: 'موريتانيا', flag: '🇲🇷' },
    { code: '+252', country: 'الصومال', flag: '🇸🇴' },
    { code: '+253', country: 'جيبوتي', flag: '🇩🇯' },
    { code: '+269', country: 'جزر القمر', flag: '🇰🇲' },

    // North America
    { code: '+1', country: 'أمريكا/كندا', flag: '🇺🇸/🇨🇦' },

    // Europe
    { code: '+44', country: 'المملكة المتحدة', flag: '🇬🇧' },
    { code: '+49', country: 'ألمانيا', flag: '🇩🇪' },
    { code: '+33', country: 'فرنسا', flag: '🇫🇷' },
    { code: '+39', country: 'إيطاليا', flag: '🇮🇹' },
    { code: '+34', country: 'إسبانيا', flag: '🇪🇸' },
    { code: '+31', country: 'هولندا', flag: '🇳🇱' },
    { code: '+32', country: 'بلجيكا', flag: '🇧🇪' },
    { code: '+41', country: 'سويسرا', flag: '🇨🇭' },
    { code: '+46', country: 'السويد', flag: '🇸🇪' },
    { code: '+47', country: 'النرويج', flag: '🇳🇴' },
    { code: '+45', country: 'الدانمارك', flag: '🇩🇰' },
    { code: '+353', country: 'أيرلندا', flag: '🇮🇪' },
    { code: '+7', country: 'روسيا', flag: '🇷🇺' },
    { code: '+380', country: 'أوكرانيا', flag: '🇺🇦' },
    { code: '+90', country: 'تركيا', flag: '🇹🇷' },
    { code: '+30', country: 'اليونان', flag: '🇬🇷' },

    // Asia
    { code: '+91', country: 'الهند', flag: '🇮🇳' },
    { code: '+92', country: 'باكستان', flag: '🇵🇰' },
    { code: '+880', country: 'بنغلاديش', flag: '🇧🇩' },
    { code: '+94', country: 'سريلانكا', flag: '🇱🇰' },
    { code: '+63', country: 'الفلبين', flag: '🇵🇭' },
    { code: '+62', country: 'إندونيسيا', flag: '🇮🇩' },
    { code: '+60', country: 'ماليزيا', flag: '🇲🇾' },
    { code: '+65', country: 'سنغافورة', flag: '🇸🇬' },
    { code: '+66', country: 'تايلاند', flag: '🇹🇭' },
    { code: '+84', country: 'فيتنام', flag: '🇻🇳' },
    { code: '+86', country: 'الصين', flag: '🇨🇳' },
    { code: '+81', country: 'اليابان', flag: '🇯🇵' },
    { code: '+82', country: 'كوريا الجنوبية', flag: '🇰🇷' },

    // Oceania
    { code: '+61', country: 'أستراليا', flag: '🇦🇺' },
    { code: '+64', country: 'نيوزيلندا', flag: '🇳🇿' },

    // South America & Africa (Others)
    { code: '+55', country: 'البرازيل', flag: '🇧🇷' },
    { code: '+54', country: 'الأرجنتين', flag: '🇦🇷' },
    { code: '+27', country: 'جنوب أفريقيا', flag: '🇿🇦' },
    { code: '+234', country: 'نيجيريا', flag: '🇳🇬' },
    { code: '+251', country: 'إثيوبيا', flag: '🇪🇹' },
];

export const EditProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isPhoneVerifyOpen, setIsPhoneVerifyOpen] = useState(false);

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
        isPhoneHidden: user.isPhoneHidden || false, // Assuming isPhoneHidden exists on User type or handled loosely
        educationBio: user.customFormFields?.educationBio || '',
        skillsBio: user.skills ? user.skills.join(', ') : ''
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // --- USERNAME VALIDATION LOGIC ---
    if (formData.displayName.toLowerCase().includes('murad')) {
         // Check if user is authorized (Admin or Bot)
         const authorizedIds = ['admin-fixed-id', 'murad-ai-bot-id', 'admin-murad-id'];
         if (!authorizedIds.includes(user.id)) {
             alert("عذراً، استخدام اسم 'Murad' في الاسم الظاهر محجوز للإدارة والنظام فقط.");
             setIsSaving(false);
             return;
         }
    }
    // ----------------------------------

    try {
      const skillsArray = formData.skillsBio.split(',').map(s => s.trim()).filter(Boolean);

      await updateProfile({
        name: formData.displayName,
        bio: formData.bio,
        address: formData.location,
        avatar: formData.photoURL,
        coverImage: formData.bannerURL,
        // Phone is updated via PhoneVerifyModal, but we persist the hidden flag here
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

              {/* Phone Number Section (STRICT SMS VERIFICATION) */}
              <div className="space-y-1">
                  <label className="text-slate-500 text-xs font-bold px-1 flex items-center gap-2">
                    <Phone className="w-3 h-3"/> رقم الجوال الموثق
                  </label>
                  <div className="flex gap-2 items-center">
                      <div className="flex-1 relative">
                          <input 
                              type="text"
                              value={formData.phoneNumber || 'غير مرتبط'}
                              disabled
                              className="w-full bg-[#16181c] border border-slate-700 rounded-md p-3 pl-10 text-white font-mono opacity-70 cursor-not-allowed"
                              dir="ltr"
                          />
                          {formData.phoneNumber && (
                              <div className="absolute left-3 top-3.5 flex items-center gap-1 text-emerald-500">
                                  <ShieldCheck className="w-4 h-4"/>
                              </div>
                          )}
                      </div>
                      <button 
                          type="button"
                          onClick={() => setIsPhoneVerifyOpen(true)}
                          className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-bold text-xs transition-colors whitespace-nowrap"
                      >
                          {formData.phoneNumber ? 'تغيير الرقم' : 'ربط رقم'}
                      </button>
                  </div>
                  
                  {/* Privacy Toggle */}
                  <div className="flex items-center gap-2 mt-2 px-1">
                      <button 
                          type="button" 
                          onClick={() => setFormData(prev => ({ ...prev, isPhoneHidden: !prev.isPhoneHidden }))}
                          className={`w-10 h-5 rounded-full relative transition-colors ${formData.isPhoneHidden ? 'bg-blue-600' : 'bg-slate-700'}`}
                      >
                          <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${formData.isPhoneHidden ? 'left-1' : 'right-1'}`}></div>
                      </button>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                          {formData.isPhoneHidden ? <EyeOff className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
                          إخفاء الرقم في الملف الشخصي
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
