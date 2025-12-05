import React, { useState } from 'react';
import { X, Shield, FileText, Database, Server, AlertTriangle, Copyright, Gavel, Info, ChevronRight, Lock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PolicyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('privacy');

  if (!isOpen) return null;

  const sections = [
    { id: 'privacy', title: 'سياسة الخصوصية', icon: <Lock className="w-4 h-4" /> },
    { id: 'terms', title: 'شروط الاستخدام', icon: <FileText className="w-4 h-4" /> },
    { id: 'cookies', title: 'سياسة الكوكيز', icon: <Database className="w-4 h-4" /> },
    { id: 'data', title: 'جمع البيانات', icon: <Server className="w-4 h-4" /> },
    { id: 'security', title: 'الأمن السيبراني', icon: <Shield className="w-4 h-4" /> },
    { id: 'usage', title: 'الاستخدام المقبول', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'ip', title: 'الملكية الفكرية', icon: <Copyright className="w-4 h-4" /> },
    { id: 'legal', title: 'المسؤولية القانونية', icon: <Gavel className="w-4 h-4" /> },
    { id: 'about', title: 'من نحن', icon: <Info className="w-4 h-4" /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'privacy':
        return (
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="text-xl font-bold text-blue-400 mb-4">سياسة الخصوصية</h3>
            <p>يوضح موقع مِلاف مُراد البيانات التي يتم جمعها عند تسجيل المستخدم أو تفاعله:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 marker:text-blue-500">
              <li>الاسم الكامل، البريد الإلكتروني، ورقم الجوال.</li>
              <li>بيانات تسجيل الدخول عبر النفاذ الوطني أو Google أو Apple أو Twitter أو Facebook.</li>
              <li>تفاعلاتك مع أدوات الذكاء الاصطناعي.</li>
              <li>بيانات الاستخدام (IP، المتصفح، الوقت).</li>
            </ul>
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-200">تستخدم البيانات لأغراض: التحقق من الهوية، تحسين التجربة، وتأمين الحسابات. لا نشارك البيانات مع أطراف ثالثة دون إذن.</p>
            </div>
          </div>
        );
      case 'terms':
        return (
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="text-xl font-bold text-blue-400 mb-4">شروط الاستخدام</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300 marker:text-blue-500">
              <li>يجب استخدام الموقع لأغراض مشروعة فقط.</li>
              <li>يمنع إنشاء حسابات وهمية أو انتحال شخصيات.</li>
              <li>أي تسجيل دخول عبر خدمات خارجية يجب أن يكون رسمياً وموثقاً.</li>
              <li>عدم استخدام أدوات الذكاء الاصطناعي بشكل يسبب ضررًا للآخرين.</li>
              <li>يحق للموقع تعديل الشروط، تعليق الحسابات، أو حذف البيانات عند مخالفة الأنظمة.</li>
            </ul>
          </div>
        );
      case 'cookies':
         return (
            <div className="space-y-4 animate-fade-in-up">
               <h3 className="text-xl font-bold text-blue-400 mb-4">سياسة الكوكيز</h3>
               <p>نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربتك:</p>
               <ul className="list-disc list-inside space-y-2 text-gray-300 marker:text-blue-500">
                  <li>حفظ حالة تسجيل الدخول لتجنب الدخول المتكرر.</li>
                  <li>تحسين سرعة وأداء الموقع.</li>
                  <li>تخصيص التجربة وحفظ التفضيلات.</li>
               </ul>
               <p className="text-sm text-gray-400 mt-2">يُسمح للمستخدم بتعطيل الكوكيز من المتصفح، ولكن بعض الخصائص قد لا تعمل بشكل صحيح.</p>
            </div>
         );
      case 'data':
          return (
              <div className="space-y-4 animate-fade-in-up">
                  <h3 className="text-xl font-bold text-blue-400 mb-4">سياسة جمع البيانات</h3>
                  <p>نحن نلتزم بالشفافية الكاملة:</p>
                  <p>يجمع الموقع البيانات فقط للأغراض الضرورية لتشغيل أنظمة الموقع ونماذج الذكاء الاصطناعي. لا يتم جمع أي بيانات إضافية دون حاجة فعلية أو دون موافقة صريحة من المستخدم.</p>
              </div>
          );
      case 'security':
          return (
             <div className="space-y-4 animate-fade-in-up">
                <h3 className="text-xl font-bold text-blue-400 mb-4">الأمن السيبراني</h3>
                <p>نطبق أعلى معايير الأمان العالمية لحماية بياناتك:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 marker:text-blue-500">
                   <li>تشفير كامل للاتصالات باستخدام بروتوكول (HTTPS).</li>
                   <li>عدم تخزين كلمات المرور بنص واضح (Hashing).</li>
                   <li>استخدام مزودي الهوية الرسميين للتحقق (نفاذ – Google – Apple).</li>
                   <li>مراقبة مستمرة للأنشطة المشبوهة وحماية ضد محاولات الاختراق.</li>
                </ul>
             </div>
          );
      case 'usage':
          return (
              <div className="space-y-4 animate-fade-in-up">
                  <h3 className="text-xl font-bold text-blue-400 mb-4">سياسة الاستخدام المقبول (AUP)</h3>
                  <p>يمنع منعاً باتاً داخل الموقع:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 marker:text-red-500">
                      <li>الإضرار بالمنصة أو محاولة تعطيل الخدمات.</li>
                      <li>إرسال رسائل مزعجة (Spam) أو محتوى ضار.</li>
                      <li>استخدام الذكاء الاصطناعي لأغراض غير أخلاقية.</li>
                      <li>محاولة التحايل على أنظمة تسجيل الدخول.</li>
                  </ul>
              </div>
          );
      case 'ip':
          return (
              <div className="space-y-4 animate-fade-in-up">
                  <h3 className="text-xl font-bold text-blue-400 mb-4">الملكية الفكرية</h3>
                  <p>جميع الحقوق محفوظة لموقع مِلاف مُراد:</p>
                  <p>جميع النصوص، التصميمات، المحتوى، الأدوات، الخدمات، الخوارزميات، وأي مواد يقدمها الموقع هي ملك حصري لشركة مراد الجهني لتقنية المعلومات.</p>
                  <p className="text-red-400">لا يجوز نسخها أو إعادة نشرها أو استخدامها لأغراض تجارية دون إذن كتابي مسبق.</p>
              </div>
          );
      case 'legal':
          return (
              <div className="space-y-4 animate-fade-in-up">
                  <h3 className="text-xl font-bold text-blue-400 mb-4">المسؤولية القانونية</h3>
                  <p>إخلاء مسؤولية:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 marker:text-blue-500">
                      <li>لا يتحمل الموقع مسؤولية سوء استخدام المستخدمين للخدمات.</li>
                      <li>لا نتحمل مسؤولية أي محتوى يتم إضافته من قبل طرف ثالث.</li>
                      <li>لسنا مسؤولين عن الأخطاء التقنية الناتجة عن مزودي الدخول الخارجي (مثل توقف خدمات نفاذ).</li>
                  </ul>
              </div>
          );
      case 'about':
          return (
              <div className="space-y-4 animate-fade-in-up">
                  <h3 className="text-xl font-bold text-blue-400 mb-4">من نحن</h3>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <p className="text-lg font-medium text-white mb-4">مِلاف مُراد منصة عربية متخصصة في الذكاء الاصطناعي والبحث الذكي.</p>
                      <p className="text-gray-300 leading-relaxed">
                          نهدف لتقديم محتوى ذكي، خدمات تحليل، ونظم تعلم آلي تساعد المستخدم في الوصول إلى المعلومات بطرق حديثة ودقيقة. تم تطوير المنصة بواسطة <span className="text-blue-400 font-bold">مراد الجهني</span>.
                      </p>
                      <div className="mt-6 border-t border-white/10 pt-4">
                          <p className="font-bold text-emerald-400 mb-1">رؤيتنا:</p>
                          <p>أن نكون أكبر مرجع عربي موثوق في الذكاء الاصطناعي وتطبيقاته الذكية.</p>
                      </div>
                  </div>
              </div>
          );
      default:
        return <div className="text-gray-400">حدد قسماً لعرض التفاصيل.</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] animate-fade-in-up">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-black/20 border-b md:border-b-0 md:border-l border-white/10 flex flex-col">
           <div className="p-5 border-b border-white/10">
              <h2 className="font-bold text-white flex items-center gap-2">
                 <Shield className="text-emerald-400 w-5 h-5" />
                 سياسات مِلاف مُراد
              </h2>
           </div>
           <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
              {sections.map(section => (
                 <button
                   key={section.id}
                   onClick={() => setActiveSection(section.id)}
                   className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all ${
                      activeSection === section.id 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                   }`}
                 >
                    <div className="flex items-center gap-3">
                       {section.icon}
                       {section.title}
                    </div>
                    {activeSection === section.id && <ChevronRight className="w-4 h-4" />}
                 </button>
              ))}
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col bg-white/5 relative">
           {/* Close Button Mobile */}
           <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-black/20 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white md:hidden z-10">
                 <X className="w-5 h-5" />
           </button>

           <div className="hidden md:flex items-center justify-end p-4 border-b border-white/5">
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                 <X className="w-5 h-5" />
              </button>
           </div>

           <div className="flex-1 overflow-y-auto p-6 md:p-10 text-gray-300 leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
              {renderContent()}
           </div>
           
           <div className="p-4 bg-black/20 border-t border-white/5 text-center text-[10px] text-gray-500">
              © 2025 شركة مراد الجهني لتقنية المعلومات. جميع الحقوق محفوظة.
           </div>
        </div>

      </div>
    </div>
  );
};