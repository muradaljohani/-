
import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, icon }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-white/5 p-4 border-b border-white/10 flex items-center justify-between">
           <div className="flex items-center gap-2">
             {icon}
             <h3 className="font-bold text-white">{title}</h3>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
             <X className="w-5 h-5" />
           </button>
        </div>
        <div className="p-6 text-gray-300 text-sm leading-relaxed">
          {children}
        </div>
        <div className="p-4 bg-black/20 border-t border-white/5 text-center">
           <button onClick={onClose} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors">
             إغلاق
           </button>
        </div>
      </div>
    </div>
  );
};

export const PrivacyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => (
  <BaseModal {...props} title="سياسة الخصوصية" icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}>
    <p>نحن نلتزم بحماية بيانات المستخدم. يتم استخدام رقم الجوال، البريد الإلكتروني، أو بيانات النفاذ الوطني فقط لأغراض إنشاء الحساب وتسجيل الدخول الآمن. لا يتم مشاركة أي بيانات مع أطراف خارجية إلا بموافقة المستخدم أو حسب النظام. جميع البيانات مشفرة ويتم التعامل معها بسرية تامة.</p>
  </BaseModal>
);

export const TermsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = (props) => (
  <BaseModal {...props} title="شروط الاستخدام" icon={<FileText className="w-5 h-5 text-blue-400" />}>
    <p>بتسجيلك في الموقع فإنك توافق على الالتزام بسياسات المنصة، وتقر بصحة بياناتك، وتوافق على استخدام خدمات الدخول المختلفة مثل النفاذ الوطني أو الحسابات الاجتماعية. يحق للموقع إدارة الحسابات، تعديل الخدمات، أو إيقاف استخدامها عند الحاجة.</p>
  </BaseModal>
);
