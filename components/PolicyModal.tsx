
import React, { useState } from 'react';
import { X, Shield, FileText, Database, Server, AlertTriangle, Copyright, Gavel, Info, ChevronRight, Lock, UserCheck, Scale } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PolicyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('privacy');

  if (!isOpen) return null;

  const sections = [
    { id: 'privacy', title: 'أولاً: سياسة الخصوصية', icon: <Lock className="w-4 h-4" /> },
    { id: 'moderation', title: 'ثانياً: سياسة الاعتدال', icon: <Shield className="w-4 h-4" /> },
    { id: 'disclaimer', title: 'ثالثاً: إخلاء المسؤولية', icon: <Scale className="w-4 h-4" /> },
    { id: 'security', title: 'رابعاً: أمن المعلومات', icon: <Server className="w-4 h-4" /> },
    { id: 'contact', title: 'خامساً: الاتصال بنا', icon: <Info className="w-4 h-4" /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'privacy':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-white/10 pb-2">أولاً: سياسة الخصوصية (جمع البيانات ومعالجتها)</h3>
            
            <div className="space-y-4">
                <h4 className="font-bold text-white text-lg">1. البيانات التي نقوم بجمعها</h4>
                <p>لتقديم خدماتنا (التوظيف، التدريب، السوق الإلكتروني)، قد نطلب منك البيانات التالية:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 marker:text-blue-500 bg-white/5 p-4 rounded-xl">
                    <li><strong className="text-white">معلومات الهوية:</strong> الاسم الرباعي، رقم الهوية/الإقامة (للتحقق فقط)، الجنسية.</li>
                    <li><strong className="text-white">معلومات الاتصال:</strong> البريد الإلكتروني (الموثق عبر Google)، رقم الجوال.</li>
                    <li><strong className="text-white">البيانات المهنية:</strong> السيرة الذاتية، المؤهلات العلمية، شهادات الخبرة، والمهارات.</li>
                    <li><strong className="text-white">البيانات التقنية:</strong> عنوان البروتوكول (IP)، نوع الجهاز، وتفاصيل الدخول (لأغراض الأمان).</li>
                </ul>
            </div>

            <div className="space-y-4">
                <h4 className="font-bold text-white text-lg">2. الغرض من جمع البيانات</h4>
                <p>نستخدم بياناتك للأغراض المشروعة التالية:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 marker:text-emerald-500">
                    <li>ربط الباحثين عن عمل بالفرص الوظيفية المناسبة.</li>
                    <li>إصدار شهادات التدريب المعتمدة وتوثيق الحضور.</li>
                    <li>التحقق من هوية المستخدمين لمنع الاحتيال والوظائف الوهمية.</li>
                    <li>تحسين تجربة المستخدم داخل المنصة.</li>
                </ul>
            </div>

            <div className="space-y-4">
                <h4 className="font-bold text-white text-lg">3. مشاركة البيانات</h4>
                <p className="bg-red-900/20 p-3 rounded-lg border border-red-500/20 text-red-200">
                    نحن نتعهد بعدم بيع بياناتك لأي طرف ثالث. تتم مشاركة بياناتك فقط في الحالات التالية:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>مع أصحاب العمل المسجلين لدينا عند تقديمك بطلب توظيف (بمحض إرادتك).</li>
                    <li>مع الجهات الحكومية والأمنية في المملكة العربية السعودية إذا طُلب ذلك بموجب أمر رسمي.</li>
                </ul>
            </div>

             <div className="space-y-4">
                <h4 className="font-bold text-white text-lg">4. حقوقك (وفق النظام السعودي)</h4>
                <p>لك الحق في:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>الاطلاع على بياناتك المخزنة لدينا.</li>
                    <li>طلب تصحيح أي بيانات خاطئة.</li>
                    <li>طلب حذف حسابك وبياناتك نهائياً من سجلاتنا (ما لم يكن الاحتفاظ بها مطلوباً لأغراض قانونية).</li>
                </ul>
            </div>
          </div>
        );
      case 'moderation':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-white/10 pb-2">ثانياً: سياسة الاعتدال والمحتوى</h3>
            <p>تهدف منصة ميلاف لخلق بيئة مهنية آمنة وموثوقة. لذا، يخضع جميع المستخدمين للشروط التالية:</p>

            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl space-y-3">
                <h4 className="font-bold text-red-400 text-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> 1. المحتوى المحظور</h4>
                <p className="text-sm">يمنع منعاً باتاً نشر أو تداول أي مما يلي، ويعرض الحساب للحظر الفوري والمساءلة القانونية:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm marker:text-red-500">
                    <li>الإعلانات الوظيفية الوهمية أو المضللة.</li>
                    <li>أي محتوى يخالف الشريعة الإسلامية أو الأنظمة والآداب العامة في السعودية.</li>
                    <li>خطاب الكراهية، العنصرية، أو التمييز المناطقي والقبلي.</li>
                    <li>الروابط الخارجية المشبوهة، الفيروسات، أو محاولات الاختراق.</li>
                    <li>استخدام المنصة لأغراض التسول الإلكتروني أو الترويج لخدمات غير قانونية.</li>
                </ul>
            </div>

            <div className="space-y-3">
                <h4 className="font-bold text-white text-lg">2. الرقابة والإشراف</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>تحتفظ إدارة "مجموعة ميلاف مراد" بالحق الكامل في مراقبة المحتوى المنشور.</li>
                    <li>يحق للإدارة حذف أي إعلان وظيفي أو تعليق أو ملف شخصي ينتهك السياسات دون إنذار مسبق.</li>
                    <li>في حال وجود شكوى على مستخدم، يتم تعليق الحساب مؤقتاً لحين التحقق.</li>
                </ul>
            </div>
          </div>
        );
      case 'disclaimer':
         return (
            <div className="space-y-6 animate-fade-in-up">
               <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-white/10 pb-2">ثالثاً: إخلاء المسؤولية</h3>
               
               <div className="grid gap-4">
                   <div className="bg-white/5 p-4 rounded-xl">
                       <strong className="text-amber-400 block mb-2">دقة المعلومات</strong>
                       <p className="text-sm text-gray-300">تبذل المنصة قصارى جهدها للتحقق من صحة الوظائف والدورات، لكننا لا نتحمل المسؤولية القانونية عن دقة البيانات المدخلة من قبل الشركات أو الأفراد.</p>
                   </div>
                   
                   <div className="bg-white/5 p-4 rounded-xl">
                       <strong className="text-amber-400 block mb-2">العلاقة التعاقدية</strong>
                       <p className="text-sm text-gray-300">دور المنصة هو "وسيط تقني" يربط الطرفين. أي اتفاق أو عقد عمل يتم بين (الباحث عن عمل) و (صاحب العمل) هو مسؤولية الطرفين وحدهما، ولا تعتبر المنصة طرفاً في هذا العقد ولا تتحمل تبعاته المالية أو القانونية.</p>
                   </div>

                   <div className="bg-white/5 p-4 rounded-xl">
                       <strong className="text-amber-400 block mb-2">الروابط الخارجية</strong>
                       <p className="text-sm text-gray-300">قد تحتوي المنصة على روابط لمواقع أخرى؛ نحن غير مسؤولين عن ممارسات الخصوصية أو محتوى تلك المواقع.</p>
                   </div>
               </div>
            </div>
         );
      case 'security':
          return (
              <div className="space-y-6 animate-fade-in-up">
                  <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-white/10 pb-2">رابعاً: أمن المعلومات</h3>
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-blue-900/20 rounded-2xl border border-blue-500/20">
                      <Shield className="w-16 h-16 text-emerald-400 mb-4"/>
                      <p className="text-gray-300 leading-relaxed max-w-lg">
                        نحن نطبق معايير أمان عالية (بما في ذلك التشفير وبروتوكولات الأمان العالمية SSL/TLS) لحماية بياناتك من الوصول غير المصرح به. ومع ذلك، ننوه بأن أمن البيانات عبر الإنترنت لا يمكن ضمانه بنسبة 100%، وتقع على عاتق المستخدم مسؤولية الحفاظ على سرية كلمة المرور الخاصة به.
                      </p>
                  </div>
              </div>
          );
      case 'contact':
          return (
             <div className="space-y-6 animate-fade-in-up">
                <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-white/10 pb-2">خامساً: الاتصال بنا</h3>
                <p className="text-gray-300">إذا كان لديك أي استفسار حول سياسة الخصوصية، أو رغبت في الإبلاغ عن انتهاك، يرجى التواصل مع فريق الدعم الفني والقانوني عبر:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/5 p-6 rounded-xl text-center border border-white/10">
                        <span className="block text-gray-500 text-sm mb-2">البريد الإلكتروني</span>
                        <a href="mailto:im_murad7@hotmail.com" className="text-blue-400 font-bold hover:text-white transition-colors">im_murad7@hotmail.com</a>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl text-center border border-white/10">
                         <span className="block text-gray-500 text-sm mb-2">الهاتف</span>
                         <a href="tel:0590113665" className="text-emerald-400 font-bold hover:text-white transition-colors">0590113665</a>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-black/30 rounded-xl text-center text-xs text-gray-500">
                    العنوان: المملكة العربية السعودية<br/>
                    جميع الحقوق محفوظة © 2025 لمجموعة ميلاف مراد لتقنية المعلومات
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
      <div className="relative w-full max-w-5xl bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-fade-in-up font-sans" dir="rtl">
        
        {/* Sidebar */}
        <div className="w-full md:w-72 bg-black/20 border-b md:border-b-0 md:border-l border-white/10 flex flex-col shrink-0">
           <div className="p-6 border-b border-white/10">
              <h2 className="font-bold text-white flex items-center gap-2">
                 <Shield className="text-emerald-400 w-5 h-5" />
                 السياسات والشروط
              </h2>
              <p className="text-[10px] text-gray-500 mt-1">تاريخ آخر تحديث: 8 ديسمبر 2025</p>
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
                    {activeSection === section.id && <ChevronRight className="w-4 h-4 rtl:rotate-180" />}
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
